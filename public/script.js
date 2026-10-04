const chat = document.querySelector('#chat');
const form = document.querySelector('#form');
const input = document.querySelector('#input');
const clearBtn = document.querySelector('#clear');
const micBtn = document.querySelector('#mic');
const micQuick = document.querySelector('#micQuick');
const speakBtn = document.querySelector('#speak');
const status = document.querySelector('#status');
const welcome = document.querySelector('#welcome');
const suggestions = document.querySelector('#suggestions');
const historyEl = document.querySelector('#history');
const newChatBtn = document.querySelector('#newChat');
const voiceSelect = document.querySelector('#voiceSelect');
const themeBtn = document.querySelector('#themeBtn');
const menuBtn = document.querySelector('#menuBtn');
const sidebar = document.querySelector('#sidebar');
const memoryBtn = document.querySelector('#memoryBtn');
const toast = document.querySelector('#toast');
const botMood = document.querySelector('#botMood');
const sideMood = document.querySelector('#sideMood');

const STORAGE_KEY = 'novaChatV2';
const HISTORY_KEY = 'novaHistoryV2';
let messages = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
let history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
const CURRENT_KEY = 'novaCurrentIdV2';
let currentId = Number(localStorage.getItem(CURRENT_KEY)) || null;
// Migração: conversas antigas só tinham o título. A conversa aberta por último ainda está salva, então reanexa.
(function migrate(){
  if (!messages.length) return;
  const first = messages.find(m => m.role === 'user');
  const t = first ? first.content.slice(0, 32) : '';
  let item = history.find(h => h.id === currentId) || history.find(h => !h.messages && h.title === t);
  if (item) { item.messages = messages.slice(-40); currentId = item.id; localStorage.setItem(CURRENT_KEY, String(currentId)); localStorage.setItem(HISTORY_KEY, JSON.stringify(history)); }
})();
let lastAnswer = '';

// Detecta o humor da conversa localmente e muda o visual da interface.
// A Nova não "sente" emoções: o aplicativo interpreta o texto e aplica um tema visual.
const MOOD_RULES = {
  happy: ['feliz','felicidade','alegre','alegria','animado','animada','empolgado','empolgada','otimo','otima','maravilhoso','maravilhosa','adorei','amei','risada','parabens','comemorar','comemorando','vitoria','sucesso','divertido','divertida','incrivel','show de bola','consegui','passei','contente','radiante','que bom','estou bem','to bem','tudo bem comigo'],
  sad: ['triste','tristeza','chorar','chorei','chorando','choro','saudade','saudades','solidao','sozinho','sozinha','perdi','perda','luto','desanimado','desanimada','decepcionado','decepcionada','deprimido','deprimida','depressao','pessimo','pessima','terrivel','magoado','magoada','chateado','chateada','para baixo','sem vontade'],
  angry: ['raiva','odio','irritado','irritada','irritacao','irritante','furioso','furiosa','bravo','brava','absurdo','injustica','nao aguento','odeio','idiota','droga','estressado','estressada','revoltado','revoltada','cansei','saco cheio','que merda'],
  calm: ['calma','calmo','tranquilo','tranquila','relaxar','relaxado','relaxada','relaxante','paz','sereno','serena','respirar','respiracao','descanso','descansar','sossegado','sossegada','meditar','meditacao'],
  love: ['amor','amo','apaixonado','apaixonada','paixao','carinho','carinhosa','carinhoso','romantico','romantica','beijo','beijos','coracao','te amo','adoro voce','namorado','namorada','crush'],
  worried: ['medo','preocupado','preocupada','preocupacao','ansioso','ansiosa','ansiedade','nervoso','nervosa','estresse','stress','receio','socorro','assustado','assustada','aflito','aflita','pânico','panico','inseguro','insegura','com medo']
};
// Padrões extras (risadas etc.)
const MOOD_PATTERNS = {
  happy: [/k{3,}/, /(ha){2,}/, /(rs){2,}/, /:\)|:d|😀|😄|😊|😂|🥳|🎉/],
  sad: [/:\(|😢|😭|😞|💔/],
  angry: [/😡|🤬|😠/],
  love: [/😍|❤|💕|😘|🥰/],
  worried: [/😰|😨|😟|😬/]
};

function normalizeText(text) {
  return String(text).toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
// Casa palavra INTEIRA (evita "mal" dentro de "normal" ou "amo" dentro de "gramofone").
const WORD_REGEX_CACHE = {};
function wordRegex(word) {
  const w = normalizeText(word).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return WORD_REGEX_CACHE[w] || (WORD_REGEX_CACHE[w] = new RegExp('(^|[^a-z0-9])' + w + '([^a-z0-9]|$)'));
}

function scoreText(text) {
  const norm = normalizeText(text);
  const raw = String(text).toLocaleLowerCase('pt-BR');
  const scores = {};
  for (const mood of Object.keys(MOOD_RULES)) {
    let s = 0;
    for (const word of MOOD_RULES[mood]) if (wordRegex(word).test(norm)) s++;
    for (const re of (MOOD_PATTERNS[mood] || [])) if (re.test(raw) || re.test(norm)) s++;
    scores[mood] = s;
  }
  return scores;
}

// Só as mensagens do USUÁRIO contam (as respostas da Nova têm palavras como "ajudar" que
// distorciam o resultado). A mensagem mais recente pesa mais.
// `extraText` permite detectar também o que está sendo digitado, antes de enviar.
function detectMood(extraText = '') {
  const userTexts = messages.filter(m => m.role === 'user').slice(-5).map(m => m.content || '');
  if (extraText.trim()) userTexts.push(extraText);
  const totals = Object.fromEntries(Object.keys(MOOD_RULES).map(k => [k, 0]));
  const lastSeen = Object.fromEntries(Object.keys(MOOD_RULES).map(k => [k, -1]));
  userTexts.forEach((text, i) => {
    const weight = i === userTexts.length - 1 ? 3 : i === userTexts.length - 2 ? 2 : 1;
    const s = scoreText(text);
    for (const mood of Object.keys(s)) {
      if (s[mood] > 0) { totals[mood] += s[mood] * weight; lastSeen[mood] = i; }
    }
  });
  let best = 'neutral', bestScore = 0, bestSeen = -1;
  for (const mood of Object.keys(totals)) {
    if (totals[mood] > bestScore || (totals[mood] === bestScore && totals[mood] > 0 && lastSeen[mood] > bestSeen)) {
      best = mood; bestScore = totals[mood]; bestSeen = lastSeen[mood];
    }
  }
  return bestScore > 0 ? best : 'neutral';
}

const BOT_TEXT = { happy:'Nova está feliz 😊', sad:'Nova está triste 💙', angry:'Nova está nervosa 😤', love:'Nova está encantada 💗', calm:'Nova está calma 🌿', worried:'Nova está preocupada 💜', neutral:'Nova' };
function applyMood(extraText = '') {
  const mood = detectMood(extraText);
  document.body.dataset.mood = mood;
  document.documentElement.style.setProperty('--mood', mood);
  const label = BOT_TEXT[mood] || 'Nova';
  if (botMood) botMood.textContent = label;
  if (sideMood) sideMood.textContent = label;
}

// Detecção local de erros comuns em português. O navegador também mantém o spellcheck nativo.
const COMMON_TYPOS = [
  /\bvoce\b/i, /\bvoces\b/i, /\bestouo\b/i, /\bnao\b/i, /\btambem\b/i,
  /\bporquee\b/i, /\bporqeu\b/i, /\bquandoo\b/i, /\bqueroo\b/i, /\bqeu\b/i,
  /\bqueer\b/i, /\bcomom\b/i, /\bparaa\b/i, /\bmuitoos\b/i, /\bmaismais\b/i,
  /\bagente\s+(vamos|vai|fomos|iremos)\b/i, /\bmenas\b/i, /\bseje\b/i, /\besteje\b/i,
  /\bconcerteza\b/i, /\bderrepente\b/i, /\bapartir\b/i, /\bporisso\b/i
];
function hasPossibleSpellingError(text) {
  return COMMON_TYPOS.some(re => re.test(text));
}
function checkSpelling() {
  const hasError = hasPossibleSpellingError(input.value);
  input.classList.toggle('spelling-error', hasError);
  input.setAttribute('aria-invalid', hasError ? 'true' : 'false');
  if (hasError) {
    status.textContent = '🔴 Possível erro de ortografia.';
  } else if (status.textContent === '🔴 Possível erro de ortografia.') {
    status.textContent = 'Pronto para conversar.';
  }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-40)));
  upsertCurrent();
  saveHistory();
}
function saveHistory() { localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 30))); }
function upsertCurrent() {
  if (!messages.some(m => m.role === 'user')) return;
  if (!currentId) currentId = Date.now();
  localStorage.setItem(CURRENT_KEY, String(currentId));
  const existing = history.find(h => h.id === currentId);
  const item = { id: currentId, title: existing ? existing.title : titleFromMessages(), date: existing ? existing.date : dateLabel(), messages: messages.slice(-40) };
  history = [item, ...history.filter(h => h.id !== currentId)];
}
function showToast(text) { toast.textContent = text; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 1800); }
function dateLabel(date = new Date()) { return date.toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit' }); }
function titleFromMessages() {
  const first = messages.find(m => m.role === 'user');
  return first ? first.content.slice(0, 32) : 'Nova conversa';
}
function addToHistory() {
  upsertCurrent();
  saveHistory(); renderHistory();
}
function renderHistory() {
  historyEl.innerHTML = '';
  if (!history.length) {
    historyEl.innerHTML = '<div style="padding:10px;color:#8a98ad;font-size:13px">Suas conversas aparecerão aqui.</div>';
    return;
  }
  history.slice(0, 12).forEach(item => {
    const btn = document.createElement('button');
    btn.className = 'history-item';
    btn.innerHTML = `<span>◯</span><span class="title"></span><time>${item.date}</time>`;
    btn.querySelector('.title').textContent = item.title;
    if (item.id === currentId) btn.classList.add('active');
    btn.addEventListener('click', () => {
      if (!item.messages || !item.messages.length) { showToast('Esta conversa antiga não tem as mensagens salvas.'); return; }
      messages = item.messages.slice();
      currentId = item.id;
      localStorage.setItem(CURRENT_KEY, String(currentId));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      lastAnswer = '';
      render(); renderHistory();
      status.textContent = 'Conversa aberta.';
      sidebar.classList.remove('open');
      window.scrollTo(0, document.body.scrollHeight);
    });
    historyEl.appendChild(btn);
  });
}
function addBubble(text, role) {
  const row = document.createElement('div');
  row.className = `msg ${role === 'user' ? 'user' : 'bot'}`;
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.textContent = text;
  row.appendChild(bubble);
  chat.appendChild(row);
  chat.scrollTop = chat.scrollHeight;
}
function render() {
  chat.innerHTML = '';
  applyMood();
  const has = messages.length > 0;
  chat.classList.toggle('has-messages', has);
  document.body.classList.toggle('chatting', has);
  welcome.style.display = has ? 'none' : '';
  suggestions.style.display = has ? 'none' : '';
  if (!has) return;
  messages.forEach(m => addBubble(m.content, m.role));
  const last = [...messages].reverse().find(m => m.role === 'assistant');
  if (last) lastAnswer = last.content;
}
async function send(text) {
  if (!text.trim()) return;
  messages.push({ role:'user', content:text.trim() });
  addToHistory();
  render();
  input.value = '';
  input.classList.remove('spelling-error');
  input.setAttribute('aria-invalid', 'false');
  status.textContent = '🧠 Pensando...';
  try {
    const response = await fetch('/api/chat', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ messages }) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Erro desconhecido.');
    const answer = data.answer || 'Não consegui gerar uma resposta.';
    messages.push({ role:'assistant', content:answer });
    lastAnswer = answer;
    save(); render();
    status.textContent = 'Pronto para a próxima.';
  } catch (err) {
    messages.pop(); render();
    addBubble('⚠️ ' + err.message, 'assistant');
    status.textContent = 'Erro na conexão.';
  }
}
form.addEventListener('submit', e => { e.preventDefault(); send(input.value); });
input.addEventListener('input', () => { checkSpelling(); applyMood(input.value); });
input.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); } });
newChatBtn.addEventListener('click', () => { messages=[]; currentId=null; localStorage.removeItem(CURRENT_KEY); renderHistory(); lastAnswer=''; localStorage.removeItem(STORAGE_KEY); render(); status.textContent='Nova conversa pronta.'; input.focus(); sidebar.classList.remove('open'); });
clearBtn.addEventListener('click', () => { messages=[]; history=[]; currentId=null; localStorage.removeItem(CURRENT_KEY); lastAnswer=''; localStorage.removeItem(STORAGE_KEY); localStorage.removeItem(HISTORY_KEY); renderHistory(); render(); status.textContent='Memória apagada.'; showToast('Conversas apagadas.'); });
document.querySelectorAll('.suggestion').forEach(btn => btn.addEventListener('click', () => send(btn.dataset.prompt)));
speakBtn.addEventListener('click', () => speakLast());
function speakLast() {
  if (!lastAnswer) { showToast('Ainda não há resposta para ler.'); return; }
  if (!('speechSynthesis' in window)) { status.textContent='Seu navegador não oferece leitura de voz.'; return; }
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(lastAnswer);
  u.lang = 'pt-BR';
  const selected = voiceSelect.value;
  const voice = speechSynthesis.getVoices().find(v => v.name === selected);
  if (voice) u.voice = voice;
  speechSynthesis.speak(u);
}
function loadVoices() {
  if (!('speechSynthesis' in window)) return;
  const voices = speechSynthesis.getVoices().filter(v => /pt-BR|pt_BR|Portuguese/i.test(v.lang + v.name));
  const unique = [...new Map(voices.map(v => [v.name, v])).values()];
  voiceSelect.innerHTML = '<option value="">Voz padrão</option>';
  unique.forEach(v => { const o=document.createElement('option'); o.value=v.name; o.textContent=v.name; voiceSelect.appendChild(o); });
}
if ('speechSynthesis' in window) { loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; }
const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
function startMic() {
  if (!Recognition) { showToast('Seu navegador não oferece reconhecimento de voz.'); return; }
  status.textContent='🎤 Pode falar...';
  const recognition = new Recognition();
  recognition.lang='pt-BR'; recognition.interimResults=false; recognition.continuous=false;
  recognition.onresult=e=>{ input.value=e.results[0][0].transcript; checkSpelling(); if (!input.classList.contains('spelling-error')) status.textContent='Voz reconhecida. Clique em enviar.'; input.focus(); };
  recognition.onerror=()=>{ status.textContent='Não consegui ouvir. Tente novamente.'; };
  recognition.start();
}
micBtn.addEventListener('click', startMic); micQuick.addEventListener('click', startMic);
themeBtn.addEventListener('click', () => { document.body.classList.toggle('dark'); localStorage.setItem('novaDark', document.body.classList.contains('dark') ? '1':'0'); });
if (localStorage.getItem('novaDark') === '1') document.body.classList.add('dark');
menuBtn.addEventListener('click', () => sidebar.classList.toggle('open'));
document.querySelector('#settingsBtn').addEventListener('click', () => showToast('Configurações: voz, tema e memória já estão disponíveis na tela.'));
document.querySelector('#historyBtn').addEventListener('click', () => historyEl.scrollIntoView({behavior:'smooth'}));
memoryBtn.addEventListener('click', () => showToast('Memória do navegador: ativa'));
renderHistory(); render();
