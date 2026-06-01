const mongoose = require('mongoose');

// Schema que define a estrutura de uma conversa no banco
const conversaSchema = new mongoose.Schema({

  // Array com todas as mensagens trocadas na conversa
  // Cada mensagem tem um papel (user ou assistant) e o conteúdo
  mensagens: [
    {
      role: { type: String, enum: ['user', 'assistant'], required: true },
      content: { type: String, required: true }
    }
  ],

  // Avaliação deixada pelo cliente ao encerrar (opcional)
  avaliacao: {
    emoji: { type: String, default: null },
    label: { type: String, default: null }
  },

  // Data de início da conversa
  iniciadoEm: { type: Date, default: Date.now },

  // Data de encerramento da conversa
  encerradoEm: { type: Date, default: null }

});

const Conversa = mongoose.model('Conversa', conversaSchema);

module.exports = Conversa;