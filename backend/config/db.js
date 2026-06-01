// Importa o mongoose para conectar ao MongoDB
const mongoose = require('mongoose');

// Função que conecta ao banco de dados MongoDB Atlas
async function conectarBanco() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Atlas conectado!');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error.message);
    process.exit(1);
  }
}

// Exporta a função para ser usada no server.js
module.exports = conectarBanco;
