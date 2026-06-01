const mongoose = require('mongoose');

// Schema que define a estrutura de uma avaliação no banco
const avaliacaoSchema = new mongoose.Schema({

  // Emoji escolhido pelo cliente (😞😐😊😄)
  emoji: { type: String, required: true },

  // Label da avaliação (Ruim, Regular, Bom, Ótimo)
  label: { type: String, required: true },

  // Data e hora da avaliação — preenchida automaticamente
  criadoEm: { type: Date, default: Date.now }

});

const Avaliacao = mongoose.model('Avaliacao', avaliacaoSchema);

module.exports = Avaliacao;