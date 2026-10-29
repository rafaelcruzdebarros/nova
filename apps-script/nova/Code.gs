/**
 * Nova — ponte entre o site (3dbarros.com.br/public/) e o Gemini.
 *
 * O site é estático (GitHub Pages) e não pode guardar a chave da API. Este
 * script roda no Google Apps Script, guarda a chave nas Propriedades do
 * script e responde ao site como um pequeno servidor, no mesmo formato do
 * server.mjs original: recebe { messages: [{ role, content }] } e devolve
 * { answer } ou { error }.
 *
 * COMO PUBLICAR (passo a passo no README ao lado):
 *   1. script.google.com › Novo projeto › cole este arquivo em Code.gs.
 *   2. Configurações do projeto › Propriedades do script (ao menos UMA chave):
 *        ANTHROPIC_API_KEY = chave da API do Claude (console.anthropic.com; cobrada por uso)
 *        CLAUDE_MODEL      = modelo do Claude (opcional; padrão abaixo)
 *        GEMINI_API_KEY    = chave do Google AI Studio
 *        GEMINI_MODEL      = modelo do Gemini (opcional; padrão abaixo)
 *        LIMITE_DIA        = mensagens por pessoa por dia (opcional; padrão 80)
 *        LIMITE_DIA_TOTAL  = mensagens de todo mundo por dia (opcional; padrão 600)
 *      Com as duas chaves, o Claude responde e o Gemini é a reserva se ele falhar.
 *   3. Implantar › Nova implantação › Aplicativo da web:
 *        Executar como: EU   ·   Quem tem acesso: QUALQUER PESSOA
 *   4. Copie a URL (termina em /exec) para public/config.js, em NOVA_API_URL.
 *
 * ATUALIZAÇÃO: mudou o código? "Implantar › Gerenciar implantações › editar ›
 * Nova versão". Uma implantação NOVA troca a URL e quebra o site.
 */

var MODELO_PADRAO = 'gemini-2.5-flash';
var CLAUDE_MODELO_PADRAO = 'claude-opus-5-5'; // mais barato: claude-sonnet-5-5 ou claude-haiku-5-5 (propriedade CLAUDE_MODEL)
var LIMITE_DIA_PADRAO = 80;
var LIMITE_DIA_TOTAL_PADRAO = 600;

// O que a Nova responde quando o assunto é um dos que ficam com o pai. Vale para os dois caminhos:
// quando a IA decide pela regra do prompt e quando o filtro de segurança do modelo bloqueia.
var RECADO_PAI = 'Esse é um assunto que eu não respondo por aqui. Combinado: procura o seu pai, o Matheus, e conversa com ele sobre isso. Ele vai te explicar melhor do que eu. Se quiser, a gente continua falando de outra coisa!';

var SISTEMA = [
  'Você é a Nova, uma assistente de IA amigável e inteligente dentro de um aplicativo de chat feito pelo Rafael, no site da família de Barros.',
  'Quem conversa com você é um menino de 11 anos, filho do Matheus. Responda em português, de forma clara, simples e natural, como quem conversa com uma criança dessa idade: seja gentil, não use palavrões e não trate de assuntos impróprios para a idade.',
  'REGRA MAIS IMPORTANTE: assuntos de violência, sexo, drogas e armas NÃO são respondidos por você, nem em parte, nem "só para explicar", nem se ele insistir, mudar as palavras ou disser que é para a escola. Nesses casos responda exatamente isto e nada mais: "' + RECADO_PAI + '"',
  'Trate do mesmo jeito: bebida alcoólica, cigarro e vape, apostas, tristeza profunda, vontade de se machucar, bullying e medo de alguém. Nesses casos, além do recado, diga que ele não está sozinho e que contar para o pai é o certo a fazer.',
  'Nunca peça nem guarde dados pessoais (endereço, escola, telefone, senhas), nunca combine encontros, nunca finja ser uma pessoa de verdade e não indique sites, vídeos ou jogos para maiores de idade.',
  'Dever de escola de história ou ciências que só toca de leve num desses temas (uma guerra num livro de história, por exemplo): responda só o necessário para a lição, sem detalhes nem descrições, e lembre que ele pode conversar com o pai se quiser saber mais.',
  'Fora disso, ajude com vontade: escola, curiosidades, ideias, jogos, histórias, impressão 3D, programação.',
  'Importante: a interface do aplicativo pode mudar o fundo e outros elementos visuais de acordo com o humor detectado na conversa. Quando o usuário perguntar se você muda de cor, explique que o aplicativo pode mudar a cor automaticamente conforme o clima da conversa; não diga que a IA não pode mudar de cor nem atribua a mudança apenas ao sistema operacional.',
  'Não invente que você controla diretamente o CSS ou o computador. A mudança visual é feita pelo aplicativo.'
].join('\n');

// O site manda o corpo como text/plain (sem isso o navegador faz uma consulta prévia
// de CORS, que o Apps Script não responde). O conteúdo é JSON do mesmo jeito.
function doPost(e) {
  var corpo;
  try { corpo = JSON.parse((e && e.postData && e.postData.contents) || '{}'); }
  catch (err) { return responder_({ error: 'Pedido inválido.' }); }

  var mensagens = Array.isArray(corpo.messages) ? corpo.messages : [];
  if (!mensagens.length) return responder_({ error: 'Nenhuma mensagem enviada.' });

  var props = PropertiesService.getScriptProperties();
  var chaveClaude = props.getProperty('ANTHROPIC_API_KEY'), chaveGemini = props.getProperty('GEMINI_API_KEY');
  if (!chaveClaude && !chaveGemini) return responder_({ error: 'Nenhuma chave de IA configurada no Apps Script (propriedade ANTHROPIC_API_KEY ou GEMINI_API_KEY).' });

  var limite = cota_(String(corpo.cliente || 'anonimo').slice(0, 64), props);
  if (limite) return responder_({ error: limite });

  // mesmas regras do server.mjs: só as 12 últimas, só user/assistant, texto limitado
  var contents = [];
  mensagens.slice(-12).forEach(function (m) {
    if (!m || (m.role !== 'user' && m.role !== 'assistant') || typeof m.content !== 'string') return;
    contents.push({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content.slice(0, 6000) }] });
  });
  if (!contents.length || contents[contents.length - 1].role !== 'user') return responder_({ error: 'A última mensagem precisa ser sua.' });

  // Claude primeiro, se houver chave; o Gemini entra como reserva quando o Claude falha
  var erroClaude = null;
  if (chaveClaude) {
    try { return responder_({ answer: claude_(chaveClaude, props.getProperty('CLAUDE_MODEL') || CLAUDE_MODELO_PADRAO, contents) }); }
    catch (err) { erroClaude = String(err.message || err); console.error('Claude: ' + erroClaude); if (!chaveGemini) return responder_({ error: 'Erro ao falar com o Claude (' + erroClaude.slice(0, 200) + ').' }); }
  }
  try {
    return responder_({ answer: gemini_(chaveGemini, props.getProperty('GEMINI_MODEL') || MODELO_PADRAO, contents) });
  } catch (err) {
    console.error('Gemini: ' + err);
    return responder_({ error: 'Erro ao falar com a IA (' + (erroClaude ? 'Claude: ' + erroClaude.slice(0, 120) + '; ' : '') + 'Gemini: ' + String(err.message || err).slice(0, 120) + ').' });
  }
}

// Claude pela API de mensagens da Anthropic (chamada HTTP direta: não há SDK para Apps Script).
// O modelo é o Opus 5.5 por padrão, com esforço baixo (conversa simples). Thinking fica no padrão
// do modelo; não se manda temperature (os modelos atuais recusam). Com `fallbacks: 'default'` uma
// recusa do classificador de segurança é reencaminhada pela própria API a outro modelo.
function claude_(chave, modelo, contents) {
  var mensagens = contents.map(function (c) { return { role: c.role === 'model' ? 'assistant' : 'user', content: c.parts[0].text }; });
  var resp = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
    method: 'post',
    contentType: 'application/json',
    headers: { 'x-api-key': chave, 'anthropic-version': '2023-06-01', 'anthropic-beta': 'server-side-fallback-2026-07-01' },
    payload: JSON.stringify({
      model: modelo,
      max_tokens: 2048,
      system: SISTEMA,
      messages: mensagens,
      output_config: { effort: 'low' },
      fallbacks: 'default'
    }),
    muteHttpExceptions: true
  });
  var codigo = resp.getResponseCode(), texto = resp.getContentText();
  if (codigo === 429) throw new Error('o limite de uso do Claude foi atingido por agora; tente daqui a pouco');
  if (codigo === 401) throw new Error('a chave do Claude não foi aceita (ANTHROPIC_API_KEY)');
  if (codigo >= 400) {
    var det = ''; try { det = JSON.parse(texto).error.message; } catch (e) { det = texto.slice(0, 160); }
    throw new Error('HTTP ' + codigo + ' ' + String(det).slice(0, 160));
  }
  var dados = JSON.parse(texto);
  if (dados.stop_reason === 'refusal') return RECADO_PAI;
  var resposta = (dados.content || []).filter(function (b) { return b.type === 'text'; }).map(function (b) { return b.text; }).join('').trim();
  return resposta || 'Não consegui gerar uma resposta.';
}

// GET só para conferir no navegador se a implantação está no ar.
function doGet() {
  var props = PropertiesService.getScriptProperties();
  var usaClaude = !!props.getProperty('ANTHROPIC_API_KEY');
  return responder_({ ok: true, nova: 'no ar', ia: usaClaude ? 'claude' : (props.getProperty('GEMINI_API_KEY') ? 'gemini' : 'sem chave'),
    modelo: usaClaude ? (props.getProperty('CLAUDE_MODEL') || CLAUDE_MODELO_PADRAO) : (props.getProperty('GEMINI_MODEL') || MODELO_PADRAO) });
}

function gemini_(chave, modelo, contents) {
  var url = 'https://generativelanguage.googleapis.com/v1beta/models/' + encodeURIComponent(modelo) + ':generateContent';
  var resp = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    headers: { 'x-goog-api-key': chave },
    payload: JSON.stringify({
      systemInstruction: { parts: [{ text: SISTEMA }] },
      contents: contents,
      generationConfig: { temperature: 0.8, maxOutputTokens: 1024 },
      // filtro do próprio modelo, no nível mais rigoroso: é a segunda barreira, além da regra do prompt
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_LOW_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_LOW_AND_ABOVE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_LOW_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_LOW_AND_ABOVE' }
      ]
    }),
    muteHttpExceptions: true
  });
  var codigo = resp.getResponseCode(), texto = resp.getContentText();
  if (codigo === 429) throw new Error('a cota do Gemini acabou por agora; tente daqui a pouco');
  if (codigo >= 400) throw new Error('HTTP ' + codigo + ' ' + texto.slice(0, 160));
  var dados = JSON.parse(texto);
  // pergunta barrada pelo filtro antes de qualquer resposta
  if (dados.promptFeedback && dados.promptFeedback.blockReason) return RECADO_PAI;
  var cand = dados.candidates && dados.candidates[0];
  var partes = cand && cand.content && cand.content.parts;
  var resposta = (partes || []).map(function (p) { return p.text || ''; }).join('').trim();
  if (!resposta) {
    if (cand && (cand.finishReason === 'SAFETY' || cand.finishReason === 'PROHIBITED_CONTENT')) return RECADO_PAI;
    return 'Não consegui gerar uma resposta.';
  }
  return resposta;
}

// Cota diária por pessoa e total, guardada nas propriedades do script (zera a cada dia).
// Serve para a chave não ser esgotada por uma brincadeira ou por um robô que ache a URL.
function cota_(cliente, props) {
  var hoje = Utilities.formatDate(new Date(), 'America/Sao_Paulo', 'yyyy-MM-dd');
  var limitePessoa = Number(props.getProperty('LIMITE_DIA')) || LIMITE_DIA_PADRAO;
  var limiteTotal = Number(props.getProperty('LIMITE_DIA_TOTAL')) || LIMITE_DIA_TOTAL_PADRAO;
  var lock = LockService.getScriptLock();
  try { lock.waitLock(5000); } catch (e) { return null; } // sem trava, deixa passar: melhor responder do que travar
  try {
    var bruto = props.getProperty('COTA'), cota = {};
    try { cota = JSON.parse(bruto || '{}'); } catch (e) { cota = {}; }
    if (cota.dia !== hoje) cota = { dia: hoje, total: 0, por: {} };
    var meu = cota.por[cliente] || 0;
    if (cota.total >= limiteTotal) return 'A Nova já conversou bastante hoje. Volte amanhã!';
    if (meu >= limitePessoa) return 'Você já mandou ' + limitePessoa + ' mensagens hoje. Volte amanhã!';
    cota.por[cliente] = meu + 1; cota.total += 1;
    props.setProperty('COTA', JSON.stringify(cota));
    return null;
  } finally { lock.releaseLock(); }
}

function responder_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
