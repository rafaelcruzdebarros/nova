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
 *   2. Configurações do projeto › Propriedades do script:
 *        GEMINI_API_KEY  = a chave do Google AI Studio (obrigatória)
 *        GEMINI_MODEL    = nome do modelo (opcional; padrão abaixo)
 *        LIMITE_DIA      = mensagens por pessoa por dia (opcional; padrão 80)
 *        LIMITE_DIA_TOTAL= mensagens de todo mundo por dia (opcional; padrão 600)
 *   3. Implantar › Nova implantação › Aplicativo da web:
 *        Executar como: EU   ·   Quem tem acesso: QUALQUER PESSOA
 *   4. Copie a URL (termina em /exec) para public/config.js, em NOVA_API_URL.
 *
 * ATUALIZAÇÃO: mudou o código? "Implantar › Gerenciar implantações › editar ›
 * Nova versão". Uma implantação NOVA troca a URL e quebra o site.
 */

var MODELO_PADRAO = 'gemini-2.5-flash';
var LIMITE_DIA_PADRAO = 80;
var LIMITE_DIA_TOTAL_PADRAO = 600;

var SISTEMA = [
  'Você é a Nova, uma assistente de IA amigável e inteligente dentro de um aplicativo de chat feito pelo Rafael, no site da família de Barros.',
  'Responda em português, de forma clara, útil e natural. Você conversa com crianças e adolescentes: seja gentil, não use palavrões e não trate de assuntos impróprios para a idade.',
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
  var chave = props.getProperty('GEMINI_API_KEY');
  if (!chave) return responder_({ error: 'A chave da API não foi configurada no Apps Script (propriedade GEMINI_API_KEY).' });

  var limite = cota_(String(corpo.cliente || 'anonimo').slice(0, 64), props);
  if (limite) return responder_({ error: limite });

  // mesmas regras do server.mjs: só as 12 últimas, só user/assistant, texto limitado
  var contents = [];
  mensagens.slice(-12).forEach(function (m) {
    if (!m || (m.role !== 'user' && m.role !== 'assistant') || typeof m.content !== 'string') return;
    contents.push({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content.slice(0, 6000) }] });
  });
  if (!contents.length || contents[contents.length - 1].role !== 'user') return responder_({ error: 'A última mensagem precisa ser sua.' });

  var modelo = props.getProperty('GEMINI_MODEL') || MODELO_PADRAO;
  try {
    return responder_({ answer: gemini_(chave, modelo, contents) });
  } catch (err) {
    console.error('Gemini: ' + err);
    return responder_({ error: 'Erro ao falar com a IA (' + String(err.message || err).slice(0, 200) + ').' });
  }
}

// GET só para conferir no navegador se a implantação está no ar.
function doGet() {
  return responder_({ ok: true, nova: 'no ar', modelo: PropertiesService.getScriptProperties().getProperty('GEMINI_MODEL') || MODELO_PADRAO });
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
      generationConfig: { temperature: 0.8, maxOutputTokens: 1024 }
    }),
    muteHttpExceptions: true
  });
  var codigo = resp.getResponseCode(), texto = resp.getContentText();
  if (codigo === 429) throw new Error('a cota do Gemini acabou por agora; tente daqui a pouco');
  if (codigo >= 400) throw new Error('HTTP ' + codigo + ' ' + texto.slice(0, 160));
  var dados = JSON.parse(texto);
  var cand = dados.candidates && dados.candidates[0];
  var partes = cand && cand.content && cand.content.parts;
  var resposta = (partes || []).map(function (p) { return p.text || ''; }).join('').trim();
  if (!resposta) {
    if (cand && cand.finishReason === 'SAFETY') return 'Prefiro não responder isso. Vamos falar de outra coisa?';
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
