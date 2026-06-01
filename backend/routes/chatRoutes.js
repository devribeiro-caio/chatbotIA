// Importa o route do express para definir as rodas da aplicação 
const router = require('express').Router();

// Importa o controller que processa as mensagens do chat 
const { processarMensagem, salvarAvaliacao } = require('../controllers/chatController');

// Define a rota POST /api/chat
// É chamada toda vez que o usuário envia uma mensagem no chat do frontend
// POST porque estamos enviando dados (o histórico da conversa) no corpo da requisição
router.post('/', processarMensagem);

// Define a rota POST /api/chat/avaliar
// É chamada quando o usuário submete a avaliação ao encerrar a conversa
router.post('/avaliar', salvarAvaliacao);

//Exporta o router para ser registrado no server.js
module.exports = router;
