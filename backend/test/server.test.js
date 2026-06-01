const test = require('node:test');
const assert = require('node:assert');
const { app, startServer } = require('../server');
const Conversa = require('../models/conversa');
const Avaliacao = require('../models/avaliacao');

let server;

test.before(async () => {
  server = await startServer();
});

test.after(async () => {
  if (server) server.close();
});

test('o endpoint /api/chat responde com 200 e JSON válido', async () => {
  const response = await fetch(`http://127.0.0.1:${server.address().port}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      historico: [
        { role: 'user', content: 'Olá!' }
      ]
    })
  });

  assert.strictEqual(response.status, 200);
  const data = await response.json();
  assert.ok(data.resposta);
  assert.ok(data.conversaId);
  console.log('Resposta do bot:', JSON.stringify(data.resposta, null, 2));
  console.log('Conversa ID:', data.conversaId);

  // Verifica se a conversa foi salva no MongoDB
  const conversaSalva = await Conversa.findById(data.conversaId);
  assert.ok(conversaSalva);
  assert.strictEqual(conversaSalva.mensagens.length, 1);
  assert.strictEqual(conversaSalva.mensagens[0].role, 'user');
});

test('o endpoint /api/chat/avaliar salva avaliação no MongoDB', async () => {
  // Primeiro, criar uma conversa
  const responseChat = await fetch(`http://127.0.0.1:${server.address().port}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      historico: [
        { role: 'user', content: 'Teste avaliação' }
      ]
    })
  });

  const dataChat = await responseChat.json();
  const conversaId = dataChat.conversaId;

  // Depois, enviar avaliação
  const responseAvaliacao = await fetch(`http://127.0.0.1:${server.address().port}/api/chat/avaliar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      emoji: '😊',
      label: 'Bom',
      conversaId: conversaId
    })
  });

  assert.strictEqual(responseAvaliacao.status, 200);
  const dataAvaliacao = await responseAvaliacao.json();
  assert.ok(dataAvaliacao.sucesso);
  assert.ok(dataAvaliacao.avaliacaoId);

  // Verifica se a avaliação foi salva
  const avaliacaoSalva = await Avaliacao.findById(dataAvaliacao.avaliacaoId);
  assert.ok(avaliacaoSalva);
  assert.strictEqual(avaliacaoSalva.emoji, '😊');
  assert.strictEqual(avaliacaoSalva.label, 'Bom');

  // Verifica se a conversa foi atualizada com a avaliação
  const conversaAtualizada = await Conversa.findById(conversaId);
  assert.strictEqual(conversaAtualizada.avaliacao.emoji, '😊');
  assert.strictEqual(conversaAtualizada.avaliacao.label, 'Bom');
  assert.ok(conversaAtualizada.encerradoEm);

  console.log('Avaliação salva com sucesso!');
});
