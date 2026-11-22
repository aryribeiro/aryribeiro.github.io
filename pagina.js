/*! (c) 2026 Ary Ribeiro. All rights reserved. Proprietary, not open source: copying, modification or redistribution is prohibited. LICENSE: https://github.com/aryribeiro/aryribeiro.github.io/blob/main/LICENSE */
/* Página trilíngue do Ary (Fase 9). Conteúdo + troca de idioma + chat da Fase 8.
 * Dados no topo (testados com node --test tests/pagina.test.js); casca de tela embaixo.
 * Regra D-023: nada sobre vaga/emprego. Textos entram por textContent. */
(function (raiz) {
  "use strict";

  var IDIOMAS = ["en", "pt", "es"];
  var CHAVE_IDIOMA = "ary-idioma";
  // Número de PRODUÇÃO (D-044/D-052: Retain), conferido no SSM /portfolio-connect/numero/endereco em 22/11.
  var TELEFONE = { tel: "tel:+13465837844", texto: "+1 346 583 7844" };

  var TEXTOS = {
    en: {
      tituloPagina: "Ary Ribeiro · AWS Solutions Architect",
      descricao: "Ary Ribeiro, AWS Solutions Architect specialized in Amazon Connect. Talk to his AI assistant by chat or phone.",
      pular: "Skip to content", idioma: "Language",
      cargo: "AWS Solutions Architect",
      resumo: "I design and build cloud solutions on AWS, with a focus on Amazon Connect: AI-powered contact centers with voice and chat, built as code and with cost under control.",
      local: "Espírito Santo, Brazil · 20+ years in IT · 8 AWS certifications",
      ctaChat: "Chat with Jarvis", ctaLigar: "Call", ctaEmail: "Email",
      ligarNota: "US number. Jarvis answers in English, Portuguese or Spanish.",
      tituloCerts: "AWS certifications", notaCerts: "Click a badge to verify it on Credly.",
      tituloProjeto: "This page is a live project",
      projeto1: "The chat and the phone line on this page are an Amazon Connect contact center that I built 100% with AWS CloudFormation.",
      projeto2: "Jarvis, the AI assistant, speaks English, Portuguese and Spanish. When I'm available, it transfers the conversation to me; otherwise it takes a message and I reply on WhatsApp.",
      projeto3: "Real-time cost guardrails and an automatic budget circuit breaker keep the whole thing within a few dollars a month.",
      tituloApps: "Some apps and games I built", abrir: "Open",
      tipo_app: "Web app", tipo_jogo: "Game", tipo_extensao: "Firefox extension", tipo_portal: "News portal",
      tituloPrivacidade: "Privacy",
      privacidade: "Jarvis is an AI assistant. Calls are not recorded. The text of the conversation (chat messages and what you say to Jarvis) stays in the service's technical logs for up to 14 days and is then deleted automatically. If you leave a message, your name, WhatsApp number and reason are sent to Ary by email, so he can reply. Please don't share sensitive data.",
      rodape: "Ary Ribeiro"
    },
    pt: {
      tituloPagina: "Ary Ribeiro · AWS Solutions Architect",
      descricao: "Ary Ribeiro, AWS Solutions Architect especialista em Amazon Connect. Fale com o assistente de IA dele por chat ou telefone.",
      pular: "Pular para o conteúdo", idioma: "Idioma",
      cargo: "AWS Solutions Architect",
      resumo: "Projeto e construo soluções em nuvem na AWS, com foco em Amazon Connect: contact centers com IA, voz e chat, feitos como código e com o custo sob controle.",
      local: "Espírito Santo, Brasil · mais de 20 anos em TI · 8 certificações AWS",
      ctaChat: "Conversar com o Jarvis", ctaLigar: "Ligar", ctaEmail: "E-mail",
      ligarNota: "Número dos EUA. O Jarvis atende em inglês, português ou espanhol.",
      tituloCerts: "Certificações AWS", notaCerts: "Clique num badge para conferir na Credly.",
      tituloProjeto: "Esta página é um projeto no ar",
      projeto1: "O chat e o telefone desta página são uma central de atendimento no Amazon Connect que eu construí 100% com AWS CloudFormation.",
      projeto2: "O Jarvis, assistente de IA, fala inglês, português e espanhol. Quando estou disponível, ele passa a conversa para mim; senão, anota um recado e eu respondo pelo WhatsApp.",
      projeto3: "Freios de custo em tempo real e um disjuntor automático de orçamento mantêm tudo em poucos dólares por mês.",
      tituloApps: "Alguns apps e jogos que criei", abrir: "Abrir",
      tipo_app: "Web app", tipo_jogo: "Jogo", tipo_extensao: "Extensão do Firefox", tipo_portal: "Portal de notícias",
      tituloPrivacidade: "Privacidade",
      privacidade: "O Jarvis é um assistente de IA. As ligações não são gravadas. O texto da conversa (mensagens do chat e o que você diz ao Jarvis) fica nos registros técnicos do serviço por até 14 dias e depois é apagado automaticamente. Se você deixar um recado, o seu nome, o seu WhatsApp e o motivo vão para o Ary por e-mail, para ele responder. Não compartilhe dados sensíveis.",
      rodape: "Ary Ribeiro"
    },
    es: {
      tituloPagina: "Ary Ribeiro · AWS Solutions Architect",
      descricao: "Ary Ribeiro, AWS Solutions Architect especializado en Amazon Connect. Habla con su asistente de IA por chat o teléfono.",
      pular: "Ir al contenido", idioma: "Idioma",
      cargo: "AWS Solutions Architect",
      resumo: "Diseño y construyo soluciones en la nube en AWS, con foco en Amazon Connect: contact centers con IA, voz y chat, hechos como código y con el costo bajo control.",
      local: "Espírito Santo, Brasil · más de 20 años en TI · 8 certificaciones de AWS",
      ctaChat: "Chatear con Jarvis", ctaLigar: "Llamar", ctaEmail: "Correo",
      ligarNota: "Número de EE. UU. Jarvis atiende en inglés, portugués o español.",
      tituloCerts: "Certificaciones de AWS", notaCerts: "Haz clic en un badge para verificarlo en Credly.",
      tituloProjeto: "Esta página es un proyecto en vivo",
      projeto1: "El chat y el teléfono de esta página son un contact center en Amazon Connect que construí 100% con AWS CloudFormation.",
      projeto2: "Jarvis, el asistente de IA, habla inglés, portugués y español. Cuando estoy disponible, me pasa la conversación; si no, toma un mensaje y respondo por WhatsApp.",
      projeto3: "Frenos de costo en tiempo real y un disyuntor automático de presupuesto mantienen todo en pocos dólares al mes.",
      tituloApps: "Algunas apps y juegos que creé", abrir: "Abrir",
      tipo_app: "Web app", tipo_jogo: "Juego", tipo_extensao: "Extensión de Firefox", tipo_portal: "Portal de noticias",
      tituloPrivacidade: "Privacidad",
      privacidade: "Jarvis es un asistente de IA. Las llamadas no se graban. El texto de la conversación (mensajes del chat y lo que le dices a Jarvis) queda en los registros técnicos del servicio hasta 14 días y luego se borra automáticamente. Si dejas un mensaje, tu nombre, tu WhatsApp y el motivo se envían a Ary por correo, para que te responda. No compartas datos sensibles.",
      rodape: "Ary Ribeiro"
    }
  };

  // Ordem = a do Ary (21/11). Descrição tirada do texto publicado por cada app (não do nome).
  var APPS = [
    { nome: "AtlasDocs", tipo: "app", url: "https://atlasdocs.io/", desc: {
      en: "PDF tools that run 100% in the browser: merge, split, rotate, compress and watermark. Files never leave your device.",
      pt: "Ferramentas de PDF 100% no navegador: mesclar, dividir, girar, comprimir e marca d'água. Os arquivos não saem do seu aparelho.",
      es: "Herramientas de PDF 100% en el navegador: unir, dividir, girar, comprimir y marca de agua. Los archivos no salen de tu equipo." } },
    { nome: "Direto Notícias", tipo: "portal", url: "https://diretonoticias.com.br/", desc: {
      en: "News portal from Guarapari, Espírito Santo and Brazil. Now an AI automation project, with its own exclusive WordPress plugins built for this kind of industry.",
      pt: "Portal de notícias de Guarapari, do Espírito Santo e do Brasil. Agora é um projeto de Automação com IA, com plugins WordPress próprios e exclusivos, voltados para esse tipo de indústria.",
      es: "Portal de noticias de Guarapari, Espírito Santo y Brasil. Ahora es un proyecto de automatización con IA, con plugins de WordPress propios y exclusivos para este tipo de industria." } },
    { nome: "Meet App!", tipo: "app", url: "https://meet2026.vercel.app/", desc: {
      en: "Private video and voice calls between two people, straight from one device to the other.",
      pt: "Chamadas de vídeo e voz entre duas pessoas, direto de um aparelho ao outro, com privacidade.",
      es: "Videollamadas y llamadas de voz privadas entre dos personas, directo de un equipo al otro." } },
    { nome: "Alarme Google Agenda 2026", tipo: "app",
      url: "https://www.linkedin.com/posts/aryribeiro_alarmegoogleagenda2026-googlecalendar-vercel-ugcPost-7481020636274851840-GLHx/", desc: {
      en: "A real alarm for Google Calendar meetings, with secure Google sign-in, so you are never late again.",
      pt: "Um alarme de verdade para as reuniões do Google Agenda, com login seguro do Google, para não chegar atrasado.",
      es: "Una alarma de verdad para las reuniones de Google Calendar, con inicio de sesión seguro de Google." } },
    { nome: "Ribeiro Draw!", tipo: "app", url: "https://ribeiro-draw.vercel.app/", desc: {
      en: "Collaborative whiteboard with 1,000 icons, 810 of them official AWS architecture icons. Opens and saves draw.io files.",
      pt: "Quadro colaborativo com 1.000 ícones, 810 deles oficiais de arquitetura AWS. Abre e salva arquivos do draw.io.",
      es: "Pizarra colaborativa con 1.000 íconos, 810 de ellos oficiales de arquitectura AWS. Abre y guarda archivos de draw.io." } },
    { nome: "Transcritor de Aba", tipo: "extensao",
      url: "https://www.linkedin.com/posts/aryribeiro_ia-mozillafirefox-inteligaeanciaartificial-share-7517235189354528769-vyq2/", desc: {
      en: "Firefox extension signed by Mozilla that turns a tab's audio into text with AI, in 3 languages. Free, no ads.",
      pt: "Extensão do Firefox assinada pela Mozilla que transforma o áudio da aba em texto com IA, em 3 idiomas. Grátis, sem propaganda.",
      es: "Extensión de Firefox firmada por Mozilla que convierte el audio de la pestaña en texto con IA, en 3 idiomas. Gratis." } },
    { nome: "Spider", tipo: "jogo", url: "https://spider2026.vercel.app/", desc: {
      en: "3D game: swing through the city with a cable launcher and stop the Saboteur at the top of the Central Tower.",
      pt: "Jogo 3D: atravesse a cidade com um lançador de cabo e detenha o Sabotador no topo da Torre Central.",
      es: "Juego 3D: recorre la ciudad con un lanzador de cable y detén al Saboteador en la cima de la Torre Central." } },
    { nome: "AWS Tetris Pro", tipo: "jogo", url: "https://tetris2026.vercel.app/", desc: {
      en: "Modern Tetris with 235 official AWS services and a Top 20 leaderboard.",
      pt: "Tetris moderno com 235 serviços oficiais da AWS e ranking Top 20.",
      es: "Tetris moderno con 235 servicios oficiales de AWS y ranking Top 20." } },
    { nome: "Professora Carolina", tipo: "app",
      url: "https://www.linkedin.com/posts/aryribeiro_ia-professoracarolina-aws-ugcPost-7441479396969967616-MpV2/", desc: {
      en: "Conversational AI English teacher, with the Amazon Nova 2 Sonic model and the Carolina voice.",
      pt: "Professora de inglês com IA conversacional, com o modelo Amazon Nova 2 Sonic e a voz Carolina.",
      es: "Profesora de inglés con IA conversacional, con el modelo Amazon Nova 2 Sonic y la voz Carolina." } },
    { nome: "WebNamp!", tipo: "app", url: "https://webnamp.vercel.app/", desc: {
      en: "Music player in the browser, with a classic look: add your songs and build a playlist.",
      pt: "Player de música no navegador, com visual clássico: adicione suas músicas e monte a playlist.",
      es: "Reproductor de música en el navegador, con estilo clásico: agrega tus canciones y arma tu playlist." } },
    { nome: "Mario Teaches Typing", tipo: "app", url: "https://mario-digitacao.vercel.app/", desc: {
      en: "Free web app that teaches typing in a gamified environment.",
      pt: "Web app gratuito para ensino de digitação em ambiente gamificado.",
      es: "Web app gratuita para aprender mecanografía en un entorno gamificado." } },
    { nome: "River Shaw", tipo: "jogo", url: "https://river-shaw.vercel.app/", desc: {
      en: "A remake of the Atari classic River Raid, in tribute to Carol Shaw, the game's creator.",
      pt: "Fork/remake do clássico River Raid do Atari, em homenagem a Carol Shaw, criadora do game.",
      es: "Remake del clásico River Raid de Atari, en homenaje a Carol Shaw, creadora del juego." } }
  ];

  // As 8 AWS Certified (Credly pública, conferidas 21/11). Nomes oficiais em inglês em todos os idiomas.
  var CERTS = [
    ["Solutions Architect – Professional", "sap", "4a2352a8-b00a-4a50-a31e-5e20103e4db6"],
    ["Generative AI Developer – Professional", "aip", "382dff99-3dcf-4682-bd23-150c2065a969"],
    ["Security – Specialty", "scs", "bf45d21f-7051-495d-91d4-2c3c19f724ac"],
    ["Solutions Architect – Associate", "saa", "830efd3e-716f-4407-89b7-806d4d41e05a"],
    ["Developer – Associate", "dva", "c65e6639-7b30-491a-b1c4-c456ab5d2e3f"],
    ["Data Engineer – Associate", "dea", "ead048f1-de5b-4656-9454-0795c79bcfe8"],
    ["AI Practitioner", "aif", "8546570b-ed9d-40c9-8a5d-4cb3f8bf4702"],
    ["Cloud Practitioner", "clf", "def8ea0f-ed91-45e7-a80a-3ea3d6c181bd"]
  ].map(function (c) {
    return { nome: "AWS Certified " + c[0], img: "img/badges/" + c[1] + ".webp",
             credly: "https://www.credly.com/badges/" + c[2] };
  });

  // E-mail montado só no clique (robô que lê o HTML não acha o endereço inteiro).
  var EMAIL_PARTES = ["moc.liamg", "orieb", "iryra"];
  function montarEmail() {
    var r = function (s) { return s.split("").reverse().join(""); };
    return r(EMAIL_PARTES[2]) + r(EMAIL_PARTES[1]) + "@" + r(EMAIL_PARTES[0]);
  }

  function idiomaInicial(salvo, navegador) {
    if (IDIOMAS.indexOf(salvo) >= 0) return salvo;
    var base = String(navegador || "").slice(0, 2).toLowerCase();
    return IDIOMAS.indexOf(base) >= 0 ? base : "en";
  }

  var api = { IDIOMAS: IDIOMAS, TEXTOS: TEXTOS, APPS: APPS, CERTS: CERTS, TELEFONE: TELEFONE,
              idiomaInicial: idiomaInicial, montarEmail: montarEmail };
  if (typeof module !== "undefined" && module.exports) { module.exports = api; return; }

  // ------------------------------------------------------------------ casca de tela
  var idioma = "en", chat = null;

  function el(tag, classe, texto) {
    var n = document.createElement(tag);
    if (classe) n.className = classe;
    if (texto != null) n.textContent = texto;
    return n;
  }

  function lerSalvo() { try { return localStorage.getItem(CHAVE_IDIOMA); } catch (e) { return null; } }
  function salvar(i) { try { localStorage.setItem(CHAVE_IDIOMA, i); } catch (e) { /* modo privado */ } }

  function desenharCerts() {
    var lista = document.getElementById("certs");
    CERTS.forEach(function (c) {
      var li = el("li"), a = el("a", "cert"), img = el("img"), nome = el("span", null, c.nome);
      a.href = c.credly; a.target = "_blank"; a.rel = "noopener noreferrer";
      img.src = c.img; img.alt = ""; img.width = 96; img.height = 96; img.loading = "lazy"; img.decoding = "async";
      a.appendChild(img); a.appendChild(nome); li.appendChild(a); lista.appendChild(li);
    });
  }

  function desenharApps() {
    var lista = document.getElementById("apps");
    lista.textContent = "";
    APPS.forEach(function (app) {
      var li = el("li", "card"), tipo = el("span", "card-tipo", TEXTOS[idioma]["tipo_" + app.tipo]);
      var h = el("h3", null, app.nome), p = el("p", null, app.desc[idioma]);
      var a = el("a", "card-link", TEXTOS[idioma].abrir);
      a.href = app.url; a.target = "_blank"; a.rel = "noopener noreferrer";
      a.setAttribute("aria-label", TEXTOS[idioma].abrir + ": " + app.nome);
      [tipo, h, p, a].forEach(function (n) { li.appendChild(n); });
      lista.appendChild(li);
    });
  }

  function aplicarIdioma(novo) {
    idioma = idiomaInicial(novo, "en");
    var t = TEXTOS[idioma];
    document.documentElement.lang = idioma === "pt" ? "pt-BR" : idioma === "es" ? "es-419" : "en";
    document.title = t.tituloPagina;
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", t.descricao);
    document.querySelectorAll("[data-t]").forEach(function (n) { n.textContent = t[n.getAttribute("data-t")]; });
    document.querySelectorAll("[data-t-aria]").forEach(function (n) { n.setAttribute("aria-label", t[n.getAttribute("data-t-aria")]); });
    document.querySelectorAll("[data-idioma]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-idioma") === idioma));
    });
    desenharApps();
    if (chat) chat.idioma(idioma);
  }

  function iniciar() {
    var tel = document.getElementById("ligar");
    tel.href = TELEFONE.tel;
    document.getElementById("numero").textContent = TELEFONE.texto;
    document.getElementById("email").addEventListener("click", function (e) {
      e.preventDefault();
      location.href = "mailto:" + montarEmail();
    });
    desenharCerts();
    idioma = idiomaInicial(lerSalvo(), navigator.language);
    if (raiz.ChatAry && raiz.CHAT_ARY_CONFIG) chat = raiz.ChatAry.montar({ idioma: idioma });
    document.getElementById("abrir-chat").addEventListener("click", function () { if (chat) chat.abrir(); });
    document.querySelectorAll("[data-idioma]").forEach(function (b) {
      b.addEventListener("click", function () { salvar(b.getAttribute("data-idioma")); aplicarIdioma(b.getAttribute("data-idioma")); });
    });
    aplicarIdioma(idioma);
    document.getElementById("ano").textContent = String(new Date().getFullYear());
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})(typeof window !== "undefined" ? window : globalThis);
