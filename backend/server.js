// Importa o Express, framework que gerencia as rotas e requisições HTTP
const express = require('express');

// Importa o CORS para permitir que o frontend possa acessar o backend de domínios diferentes 
const cors = require('cors');

// Importa o path para trabalhar com caminhos de arquivos 
const path = require('path');

// Importa o dontev para carregar as variáveis de ambiente do arquivo .env
require('dotenv').config();

// Importa as rotas do chat 
const chatRoutes = require('./routes/chatRoutes');

// Cria aplicação Express
const app = express();

// Habilita o CORS para aceitar requisições do site da Formis
app.use(cors());

// Habilita o Express a atender JSON no corpo das requisições
app.use(express.json());

// Registra as rotas do chat sob o prefixo /api/chat
app.use('/api/chat', chatRoutes);

// Define a porta do servidor e exibe uma mensagem no console  quando estiver rodando 
const PORT = process.env.PORT || 3002;

// Inicia o servidor e exibe uma mensagem no console quando estiver rodando
app.listen(PORT, () => {
    console.log(` Servidor rodando na porta ${PORT}`);
})
