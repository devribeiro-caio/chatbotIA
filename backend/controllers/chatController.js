// Importa o serviço que faz a comunicação com a API da Groq
const { enviarMensagem } = require('../services/groqService');

// Função principal que processa as mensagens recebidas do frontend
async function processarMensagem(req, res) {
  try {
    const { historico } = req.body;

    if (!historico || historico.length === 0) {
      return res.status(400).json({ error: 'Histórico de mensagens é obrigatório.' });
    }

    // Envia o histórico para o serviço da Groq e aguarda a resposta
    const resultado = await enviarMensagem(historico);

    // Se o resultado já vier parseado como objeto, usa direto
    // Se vier como string, tenta parsear
    let resposta;
    if (typeof resultado === 'object') {
      resposta = resultado;
    } else {
      try {
        const limpo = resultado.replace(/```json|```/g, '').trim();
        resposta = JSON.parse(limpo);
      } catch {
        // Se não conseguir parsear, retorna texto puro sem cards
        resposta = { texto: resultado, cards: [] };
      }
    }

    // Loga no console para debug — mostra o que o bot retornou
    console.log('Resposta do bot:', JSON.stringify(resposta, null, 2));

    res.json({ resposta });

  } catch (error) {
    console.error('Erro ao processar mensagem:', error.message);
    res.status(500).json({ error: 'Erro interno ao processar a mensagem.' });
  }
}

module.exports = { processarMensagem };