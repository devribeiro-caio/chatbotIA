const mongoose = require('mongoose');

// Schema que define as estatísticas gerais do chatbot
const estatisticaSchema = new mongoose.Schema({

  // Total de conversas iniciadas
  totalConversas: { type: Number, default: 0 },

  // Total de avaliações recebidas
  totalAvaliacoes: { type: Number, default: 0 },

  // Contagem por tipo de avaliação
  avaliacoesPorLabel: {
    Ruim:    { type: Number, default: 0 },
    Regular: { type: Number, default: 0 },
    Bom:     { type: Number, default: 0 },
    Otimo:   { type: Number, default: 0 }
  },

  // Produtos mais perguntados pelos clientes
  produtosMaisPerguntados: [
    {
      nome:  { type: String },
      total: { type: Number, default: 0 }
    }
  ],

  // Data da última atualização das estatísticas
  atualizadoEm: { type: Date, default: Date.now }

});

const Estatistica = mongoose.model('Estatistica', estatisticaSchema);

module.exports = Estatistica;