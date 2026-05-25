// Cria o HTML do widget do chat dinamicamente no body da página
function criarWidget() {
  const widget = document.createElement('div');
  widget.id = 'formis-chat-widget';
  widget.innerHTML = `
    <!-- Janela do chat (começa escondida) -->
    <div id="formis-chat-box">

      <!-- Cabeçalho do chat -->
      <div id="formis-chat-header">
        <div>
          <span>FormisBot</span>
          <small>Assistente Virtual Formis</small>
        </div>
        <button id="formis-chat-home" title="Ir para a página inicial">← Início</button>
      </div>

      <!-- Área onde as mensagens aparecem -->
      <div id="formis-chat-messages"></div>

      <!-- Área de input para o usuário digitar -->
      <div id="formis-chat-input-area">
        <input id="formis-chat-input" type="text" placeholder="Digite sua mensagem..." />
        <button id="formis-chat-send">➤</button>
      </div>

    </div>

    <!-- Botão flutuante que abre/fecha o chat -->
    <button id="formis-chat-toggle">💬</button>
  `;
  document.body.appendChild(widget);
}

// Histórico da conversa
let historico = [];

// Restaura o chat para a tela inicial do bot
function resetarParaInicio() {
  const container = document.querySelector('#formis-chat-messages');
  if (!container) return;
  container.innerHTML = '';
  historico = [];
  adicionarMensagem('Olá! Sou o FormisBot, estou aqui para te ajudar! Como posso te ajudar hoje?', 'bot');
}

// Adiciona uma mensagem de texto na tela do chat
function adicionarMensagem(texto, tipo) {
  const container = document.querySelector('#formis-chat-messages');
  const msg = document.createElement('div');
  msg.className = `msg ${tipo}`;
  msg.textContent = texto;
  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
  return msg;
}

// Renderiza os cards clicáveis dentro do chat
function adicionarCards(cards) {
  const container = document.querySelector('#formis-chat-messages');

  // Cria o container dos cards
  const cardsWrapper = document.createElement('div');
  cardsWrapper.className = 'cards-wrapper';

  cards.forEach(card => {
    const cardEl = document.createElement('div');
    cardEl.className = 'chat-card';
    cardEl.innerHTML = `
      <span class="card-icone">${card.icone}</span>
      <span class="card-titulo">${card.titulo}</span>
      <span class="card-subtitulo">${card.subtitulo}</span>
    `;

    // Ao clicar no card, envia o título como mensagem do usuário
    cardEl.addEventListener('click', () => {
      // Remove os cards após o clique para não poluir o chat
      cardsWrapper.remove();

      // Simula o usuário digitando e enviando o nome do card
      enviarMensagemTexto(`Me fale mais sobre ${card.titulo}`);
    });

    cardsWrapper.appendChild(cardEl);
  });

  container.appendChild(cardsWrapper);
  container.scrollTop = container.scrollHeight;
}

// Função que processa e envia uma mensagem de texto para o backend
async function enviarMensagemTexto(texto) {
  adicionarMensagem(texto, 'user');
  historico.push({ role: 'user', content: texto });
  const digitando = adicionarMensagem('FormisBot está digitando...', 'digitando');

  try {
    const resposta = await fetch('http://localhost:3002/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ historico })
    });

    if (!resposta.ok) {
      const mensagemErro = await resposta.text();
      throw new Error(`Erro ${resposta.status}: ${mensagemErro}`);
    }

    const dados = await resposta.json();
    digitando.remove();

    // Pega o objeto resposta ou o próprio body quando já estiver no formato esperado
    const resultado = dados.resposta || dados;

    // Tenta extrair JSON válido quando o modelo retorna texto extra junto com o objeto
    function extrairJSON(texto) {
      if (typeof texto !== 'string') return null;
      const limpo = texto.replace(/```json|```/g, '').trim();
      try {
        return JSON.parse(limpo);
      } catch {
        const match = limpo.match(/(\{[\s\S]*\})|(\[[\s\S]*\])/);
        if (match) {
          try {
            return JSON.parse(match[0]);
          } catch {}
        }
        const trecho = limpo.match(/"texto"\s*:\s*"[\s\S]*"\s*(,\s*"cards"\s*:\s*\[[\s\S]*\])?/);
        if (trecho) {
          try {
            return JSON.parse(`{${trecho[0]}}`);
          } catch {}
        }
      }
      return null;
    }

    // Extrai o texto e os cards corretamente
    let textoBot = '';
    let cards = [];
    let source = resultado;

    if (typeof resultado === 'string') {
      const parsed = extrairJSON(resultado);
      if (parsed) {
        source = parsed;
      }
    }

    if (typeof source === 'object' && source !== null) {
      if (Array.isArray(source)) {
        cards = source;
        textoBot = 'Veja os produtos abaixo:';
      } else if ('texto' in source || 'cards' in source) {
        textoBot = typeof source.texto === 'string' && source.texto.trim().length
          ? source.texto
          : source.cards && source.cards.length
            ? 'Veja os cards abaixo:'
            : '';
        cards = source.cards || [];
      } else if ('icone' in source && 'titulo' in source) {
        cards = [source];
        textoBot = 'Veja o produto abaixo:';
      } else {
        textoBot = '';
      }
    } else if (typeof source === 'string') {
      textoBot = source;
    }

    // Se ainda tiver JSON cru no texto, limpa antes de exibir
    if (typeof textoBot === 'string' && textoBot.match(/"texto"\s*:\s*"/)) {
      const parsed = extrairJSON(textoBot);
      if (parsed && typeof parsed.texto === 'string') {
        textoBot = parsed.texto;
        cards = parsed.cards || cards;
      }
    }

    // Exibe só o texto limpo
    adicionarMensagem(textoBot, 'bot');

    // Exibe os cards se existirem
    if (cards.length > 0) {
      adicionarCards(cards);
    }

    // Salva no histórico só o texto limpo
    historico.push({ role: 'assistant', content: textoBot });

  } catch (error) {
    digitando.remove();
    adicionarMensagem('Erro ao conectar. Tente novamente.', 'bot');
  }
}

// Função chamada ao clicar no botão enviar ou pressionar Enter
async function enviarMensagem() {
  const input = document.querySelector('#formis-chat-input');
  const texto = input.value.trim();
  if (!texto) return;
  input.value = '';
  await enviarMensagemTexto(texto);
}

// Inicializa o widget quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
  criarWidget();

  // Abre/fecha o chat
  document.querySelector('#formis-chat-toggle').addEventListener('click', () => {
    const box = document.querySelector('#formis-chat-box');
    const aberto = box.style.display === 'flex';
    box.style.display = aberto ? 'none' : 'flex';

    // Mensagem de boas vindas na primeira abertura
    if (!aberto && historico.length === 0) {
      adicionarMensagem('Olá! Sou o FormisBot, estou aqui para te ajudar! Como posso te ajudar hoje?', 'bot');
    }
  });

  document.querySelector('#formis-chat-home').addEventListener('click', () => {
    resetarParaInicio();
  });

  // Botão enviar
  document.querySelector('#formis-chat-send').addEventListener('click', enviarMensagem);

  // Enter para enviar
  document.querySelector('#formis-chat-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') enviarMensagem();
  });
});