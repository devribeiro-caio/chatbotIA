# FormisBot

Chatbot web simples para a Formis Instrumentos de Medição.

O projeto inclui um frontend em HTML/CSS/JavaScript e um backend em Node.js/Express que se comunica com a API da Groq para gerar respostas de chat.

## Estrutura do projeto

- `backend/`
  - `server.js` - servidor Express principal
  - `routes/chatRoutes.js` - rota da API de chat
  - `controllers/chatController.js` - lógica de processamento de mensagens
  - `services/groqService.js` - integração com a API Groq
- `frontend/`
  - `index.html` - página de teste do chatbot
  - `chatbot.css` - estilos do widget de chat
  - `chatbot.js` - lógica do widget e integração com o backend
- `package.json` - dependências e configuração do Node.js
- `package-lock.json` - trava de dependências
- `.gitignore` - arquivos ignorados pelo Git

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/devribeiro-caio/chatbotIA.git
   cd chatbotIA
   ```

2. Instale as dependências do backend:
   ```bash
   npm install
   ```

3. Crie um arquivo `.env` na raiz do projeto com a chave da Groq API:
   ```env
   GROQ_API_KEY=suachaveaqui
   PORT=3002
   ```

## Como rodar

1. Inicie o backend:
   ```bash
   npm start
   ```

2. Abra o arquivo `frontend/index.html` no navegador ou sirva a pasta `frontend/` com um servidor estático.

3. No chat, use o botão bolha para abrir o assistente e começar a conversar.

## Exemplos de perguntas

- "Quais bafômetros vocês têm?"
- "Me fale sobre os detectores de gás FOR-CL2 e FOR-CO2."
- "Como funciona o kit Safe Ergonomia?"
- "Quais acessórios para amostragem vocês recomendam?"
- "Como posso calibrar meu detector de gás?"

## Deploy

### Deploy local

- O backend roda em `http://localhost:3002` por padrão.
- Use um servidor estático para o frontend, como `Live Server` do VS Code ou `npx serve frontend`.
- Se o frontend for servido de outro host, atualize a URL de API em `frontend/chatbot.js`.

### Deploy em produção

- Você pode hospedar o backend em serviços como Vercel, Render, Railway ou Heroku.
- O frontend pode ser hospedado como site estático, mas lembre-se de apontar a URL do backend no `fetch`.
- Configure a variável de ambiente `GROQ_API_KEY` no serviço de hospedagem que executar o backend.

## Observações

- O frontend faz requests para `http://localhost:3002/api/chat`.
- Se quiser usar em outro host/porta, atualize a URL no `frontend/chatbot.js`.
- O projeto depende de `node_modules/`, que não está versionado.
