/* Chat da página do Ary (Fase 8, D-006/D-022/D-039).
 * Página → POST na Function URL do iniciar-chat (freio + StartChatContact) → amazon-connect-chatjs.
 * Funções puras no topo (testadas com node --test); casca de tela embaixo (provada pelo Playwright).
 * Texto do servidor entra SEMPRE por textContent (nunca innerHTML): sem XSS por mensagem. */
(function (raiz) {
  "use strict";

  var IDIOMAS = ["en", "pt", "es"];
  var LIMITE_MENSAGENS = 30;   // por conversa (CHECKLIST, limites aprovados)
  var MAX_CARACTERES = 500;
  var TIPOS_TEXTO = ["text/plain", "text/markdown"];
  var TIPO_DIGITANDO = "application/vnd.amazonaws.connect.event.typing";
  var TIPO_ENTROU = "application/vnd.amazonaws.connect.event.participant.joined";
  var LINK = /(https:\/\/[^\s<>"']+|(?:www\.)?(?:linkedin\.com|github\.com)\/[^\s<>"']*)/g;

  var TEXTOS = {
    en: {
      abrir: "Chat with Jarvis", titulo: "Jarvis", subtitulo: "Ary's virtual assistant",
      intro: "Hi! I'm Jarvis, an AI assistant. I can tell you about Ary's work, connect you to him or take a message.",
      aviso: "AI assistant. Please don't share sensitive data.",
      comecar: "Start chat", conectando: "Connecting…", fechar: "Close", encerrar: "End chat",
      placeholder: "Type your message", enviar: "Send", digitando: "Jarvis is typing…",
      indisponivel: "The chat is not available right now. You can find Ary on LinkedIn: linkedin.com/in/aryribeiro",
      encerrada: "Chat ended.", nova: "New chat", entrou: "Ary joined the chat.",
      limite: "Message limit for this chat reached.", erroEnvio: "Message not sent. Please try again."
    },
    pt: {
      abrir: "Conversar com o Jarvis", titulo: "Jarvis", subtitulo: "Assistente virtual do Ary",
      intro: "Olá! Eu sou o Jarvis, um assistente de IA. Posso falar do trabalho do Ary, chamar o Ary ou anotar um recado.",
      aviso: "Assistente de IA. Não compartilhe dados sensíveis.",
      comecar: "Começar conversa", conectando: "Conectando…", fechar: "Fechar", encerrar: "Encerrar conversa",
      placeholder: "Digite sua mensagem", enviar: "Enviar", digitando: "Jarvis está digitando…",
      indisponivel: "O chat não está disponível agora. Você encontra o Ary no LinkedIn: linkedin.com/in/aryribeiro",
      encerrada: "Conversa encerrada.", nova: "Nova conversa", entrou: "O Ary entrou na conversa.",
      limite: "Limite de mensagens desta conversa atingido.", erroEnvio: "Mensagem não enviada. Tente de novo."
    },
    es: {
      abrir: "Chatear con Jarvis", titulo: "Jarvis", subtitulo: "Asistente virtual de Ary",
      intro: "¡Hola! Soy Jarvis, un asistente de IA. Puedo contarte sobre el trabajo de Ary, conectarte con él o tomar un mensaje.",
      aviso: "Asistente de IA. No compartas datos sensibles.",
      comecar: "Iniciar chat", conectando: "Conectando…", fechar: "Cerrar", encerrar: "Terminar chat",
      placeholder: "Escribe tu mensaje", enviar: "Enviar", digitando: "Jarvis está escribiendo…",
      indisponivel: "El chat no está disponible ahora. Puedes encontrar a Ary en LinkedIn: linkedin.com/in/aryribeiro",
      encerrada: "Chat terminado.", nova: "Nuevo chat", entrou: "Ary se unió al chat.",
      limite: "Se alcanzó el límite de mensajes de este chat.", erroEnvio: "Mensaje no enviado. Inténtalo de nuevo."
    }
  };

  function idiomaValido(i) { return IDIOMAS.indexOf(i) >= 0 ? i : "en"; }

  /** Item do Participant Service (websocket ou transcrição) → balão {id, lado, texto} ou null. */
  function normalizar(item) {
    if (!item || item.Type !== "MESSAGE" || !item.Id) return null;
    if (TIPOS_TEXTO.indexOf(item.ContentType) < 0) return null;
    var texto = String(item.Content || "").trim();
    if (!texto) return null;
    return { id: item.Id, lado: item.ParticipantRole === "CUSTOMER" ? "eu" : "eles", texto: texto };
  }

  function digitando(item) {
    return !!item && item.ContentType === TIPO_DIGITANDO && item.ParticipantRole !== "CUSTOMER";
  }

  function entrouAtendente(item) {
    return !!item && item.ContentType === TIPO_ENTROU && item.ParticipantRole === "AGENT";
  }

  /** Texto → pedaços; links só https (ou linkedin.com/github.com sem esquema, que ganham https). */
  function pedacos(texto) {
    var saida = [], ultimo = 0, m;
    texto = String(texto || "");
    LINK.lastIndex = 0;
    while ((m = LINK.exec(texto)) !== null) {
      var bruto = m[0].replace(/[.,;:!?)]+$/, "");
      if (m.index > ultimo) saida.push({ texto: texto.slice(ultimo, m.index) });
      saida.push({ texto: bruto, href: /^https:\/\//.test(bruto) ? bruto : "https://" + bruto });
      ultimo = m.index + bruto.length;
      LINK.lastIndex = ultimo;
    }
    if (ultimo < texto.length) saida.push({ texto: texto.slice(ultimo) });
    return saida;
  }

  /** Resposta do iniciar-chat → detalhes do chat, ou null (= "indisponível"; D-035: 429 do disjuntor). */
  function detalhesChat(status, corpo) {
    if (status !== 200 || !corpo || !corpo.contactId || !corpo.participantId || !corpo.participantToken) return null;
    return { contactId: corpo.contactId, participantId: corpo.participantId, participantToken: corpo.participantToken };
  }

  function podeEnviar(texto, enviadas) {
    var t = String(texto || "").trim();
    return t.length > 0 && t.length <= MAX_CARACTERES && enviadas < LIMITE_MENSAGENS;
  }

  var api = {
    IDIOMAS: IDIOMAS, TEXTOS: TEXTOS, LIMITE_MENSAGENS: LIMITE_MENSAGENS, MAX_CARACTERES: MAX_CARACTERES,
    idiomaValido: idiomaValido, normalizar: normalizar, digitando: digitando, entrouAtendente: entrouAtendente,
    pedacos: pedacos, detalhesChat: detalhesChat, podeEnviar: podeEnviar
  };

  if (typeof module !== "undefined" && module.exports) { module.exports = api; return; }

  // ------------------------------------------------------------------ casca de tela (navegador)
  function el(tag, classe, texto) {
    var n = document.createElement(tag);
    if (classe) n.className = classe;
    if (texto != null) n.textContent = texto;
    return n;
  }

  function preencher(no, texto) {
    pedacos(texto).forEach(function (p) {
      if (!p.href) { no.appendChild(document.createTextNode(p.texto)); return; }
      var a = el("a", null, p.texto);
      a.href = p.href; a.target = "_blank"; a.rel = "noopener noreferrer";
      no.appendChild(a);
    });
  }

  function montar(opcoes) {
    var cfg = raiz.CHAT_ARY_CONFIG;
    var idioma = idiomaValido(opcoes && opcoes.idioma);
    var estado = { sessao: null, enviadas: 0, ativo: false, iniciando: false, baloes: {} };

    var lancador = el("button", "chat-ary-lancador");
    lancador.type = "button";
    var NS = "http://www.w3.org/2000/svg", svg = document.createElementNS(NS, "svg"), traco = document.createElementNS(NS, "path");
    svg.setAttribute("viewBox", "0 0 24 24"); svg.setAttribute("aria-hidden", "true"); svg.setAttribute("focusable", "false");
    traco.setAttribute("d", "M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z");
    svg.appendChild(traco); lancador.appendChild(svg);

    var painel = el("section", "chat-ary-painel");
    painel.hidden = true;
    painel.setAttribute("role", "dialog");
    var topo = el("header", "chat-ary-topo");
    var marca = el("div", "chat-ary-marca");
    var titulo = el("strong"), subtitulo = el("span");
    marca.appendChild(titulo); marca.appendChild(subtitulo);
    var bEncerrar = el("button", "chat-ary-encerrar"); bEncerrar.type = "button"; bEncerrar.hidden = true;
    var bFechar = el("button", "chat-ary-fechar", "×"); bFechar.type = "button";
    topo.appendChild(marca); topo.appendChild(bEncerrar); topo.appendChild(bFechar);

    var lista = el("div", "chat-ary-lista");
    lista.setAttribute("role", "log"); lista.setAttribute("aria-live", "polite");
    var status = el("p", "chat-ary-status"); status.setAttribute("aria-live", "polite");
    var rapidos = el("div", "chat-ary-rapidos"); rapidos.hidden = true;
    var bComecar = el("button", "chat-ary-comecar"); bComecar.type = "button";

    var form = el("form", "chat-ary-form"); form.hidden = true;
    var entrada = el("input"); entrada.type = "text"; entrada.maxLength = MAX_CARACTERES; entrada.autocomplete = "off";
    var bEnviar = el("button", "chat-ary-enviar"); bEnviar.type = "submit";
    form.appendChild(entrada); form.appendChild(bEnviar);
    var aviso = el("p", "chat-ary-rodape");

    [topo, lista, status, rapidos, bComecar, form, aviso].forEach(function (n) { painel.appendChild(n); });
    document.body.appendChild(painel);
    document.body.appendChild(lancador);

    function t() { return TEXTOS[idioma]; }

    function aplicarTextos() {
      lancador.setAttribute("aria-label", t().abrir);
      painel.setAttribute("aria-label", t().titulo + " - " + t().subtitulo);
      titulo.textContent = t().titulo; subtitulo.textContent = t().subtitulo;
      bEncerrar.textContent = t().encerrar; bFechar.setAttribute("aria-label", t().fechar);
      entrada.placeholder = t().placeholder; entrada.setAttribute("aria-label", t().placeholder);
      bEnviar.textContent = t().enviar; aviso.textContent = t().aviso;
      bComecar.textContent = estado.terminou ? t().nova : t().comecar;
      rapidos.textContent = "";
      var b = (cfg && cfg.botoes && cfg.botoes[idioma]) || {};
      ["sobre", "falar", "recado"].forEach(function (chave) {
        if (!b[chave]) return;
        var botao = el("button", "chat-ary-rapido", b[chave]); botao.type = "button";
        botao.addEventListener("click", function () { enviar(b[chave]); });
        rapidos.appendChild(botao);
      });
    }

    function balao(id, lado, texto) {
      var existente = id && estado.baloes[id];
      if (existente) { existente.textContent = ""; preencher(existente, texto); return; }  // streaming/duplicata
      var b = el("div", "chat-ary-balao chat-ary-" + lado);
      preencher(b, texto);
      if (id) estado.baloes[id] = b;
      lista.appendChild(b);
      lista.scrollTop = lista.scrollHeight;
    }

    function receber(item) {
      if (digitando(item)) { status.textContent = t().digitando; return; }
      if (entrouAtendente(item)) { balao("evt-" + (item.Id || Date.now()), "aviso", t().entrou); return; }
      var m = normalizar(item);
      if (!m) return;
      if (m.lado === "eles") status.textContent = "";
      balao(m.id, m.lado, m.texto);
      if (m.lado === "eles" && estado.enviadas === 0) rapidos.hidden = false;
    }

    function terminar(textoAviso) {
      estado.ativo = false; estado.iniciando = false; estado.sessao = null; estado.terminou = true;
      form.hidden = true; rapidos.hidden = true; bEncerrar.hidden = true;
      status.textContent = "";
      bComecar.textContent = t().nova; bComecar.hidden = false; bComecar.disabled = false;
      if (textoAviso) balao(null, "aviso", textoAviso);  // depois do botão: a lista já encolheu, a rolagem acerta
    }

    function indisponivel() { terminar(t().indisponivel); }

    async function comecar() {
      if (estado.ativo || estado.iniciando) return;
      estado.iniciando = true; estado.enviadas = 0; estado.baloes = {}; estado.terminou = false;
      lista.textContent = ""; bComecar.disabled = true; status.textContent = t().conectando;
      var detalhes = null;
      try {
        var r = await fetch(cfg.endpoint, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idioma: idioma })
        });
        var corpo = null;
        try { corpo = await r.json(); } catch (e) { corpo = null; }
        detalhes = detalhesChat(r.status, corpo);
      } catch (e) { detalhes = null; }
      if (!detalhes || !raiz.connect || !raiz.connect.ChatSession) { indisponivel(); return; }
      try {
        raiz.connect.ChatSession.setGlobalConfig({ loggerConfig: { useDefaultLogger: false }, region: cfg.regiao });
        var sessao = raiz.connect.ChatSession.create({
          chatDetails: detalhes, options: { region: cfg.regiao }, type: "CUSTOMER", disableCSM: true
        });
        sessao.onMessage(function (ev) { receber(ev && ev.data); });
        sessao.onTyping(function (ev) { receber(ev && ev.data); });
        sessao.onEnded(function () { terminar(t().encerrada); });
        var r2 = await sessao.connect();
        if (r2 && r2.connectSuccess === false) throw new Error("connect");
        estado.sessao = sessao; estado.ativo = true; estado.iniciando = false;
        bComecar.hidden = true; form.hidden = false; bEncerrar.hidden = false; status.textContent = "";
        entrada.focus();
        var tr = await sessao.getTranscript({ scanDirection: "BACKWARD", sortOrder: "ASCENDING", maxResults: 15 });
        ((tr && tr.data && tr.data.Transcript) || []).forEach(receber);
      } catch (e) { indisponivel(); }
    }

    async function enviar(texto) {
      if (!estado.ativo || !estado.sessao) return;
      if (estado.enviadas >= LIMITE_MENSAGENS) { balao(null, "aviso", t().limite); return; }
      if (!podeEnviar(texto, estado.enviadas)) return;
      estado.enviadas += 1; rapidos.hidden = true; entrada.value = "";
      try {
        await estado.sessao.sendMessage({ contentType: "text/plain", message: String(texto).trim() });
      } catch (e) { estado.enviadas -= 1; balao(null, "aviso", t().erroEnvio); }
      if (estado.enviadas >= LIMITE_MENSAGENS) { form.hidden = true; balao(null, "aviso", t().limite); }
    }

    function abrir() {
      painel.hidden = false; lancador.setAttribute("aria-expanded", "true");
      if (!lista.childNodes.length && !estado.ativo) balao(null, "eles", t().intro);
      (estado.ativo ? entrada : bComecar).focus();
    }
    function fechar() { painel.hidden = true; lancador.setAttribute("aria-expanded", "false"); lancador.focus(); }

    lancador.addEventListener("click", function () { painel.hidden ? abrir() : fechar(); });
    bFechar.addEventListener("click", fechar);
    painel.addEventListener("keydown", function (e) { if (e.key === "Escape") fechar(); });
    bComecar.addEventListener("click", comecar);
    bEncerrar.addEventListener("click", function () {
      if (estado.sessao) { try { estado.sessao.disconnectParticipant(); } catch (e) { /* já encerrado */ } }
      terminar(t().encerrada);
    });
    form.addEventListener("submit", function (e) { e.preventDefault(); enviar(entrada.value); });

    aplicarTextos();
    return {
      idioma: function (novo) {
        idioma = idiomaValido(novo);
        aplicarTextos();
        if (!estado.ativo && !estado.terminou) { lista.textContent = ""; if (!painel.hidden) balao(null, "eles", t().intro); }
      },
      abrir: abrir, fechar: fechar
    };
  }

  api.montar = montar;
  raiz.ChatAry = api;
})(typeof window !== "undefined" ? window : globalThis);
