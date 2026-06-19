/* ══════════════════════════════════════════
   OVERLAY
══════════════════════════════════════════ */
var erros = 0;
var placar = { quiz: 0, fotos: 0, video: 0 };
var placarSalvo = false;
function trocarTela(id) {
  ['telaQuem','telaDesafio','telaMusica'].forEach(function(t){
    document.getElementById(t).style.display = t === id ? 'block' : 'none';
  });
}
function mostrarDesafio() { trocarTela('telaDesafio'); }
function normalizar(s) { return s.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,''); }
function verificar() {
  var resp = normalizar(document.getElementById('respostaInput').value);
  if (['fim','final','sempre'].indexOf(resp) !== -1) {
    trocarTela('telaMusica');
  } else {
    erros++;
    var msg = document.getElementById('erroMsg');
    var msgs = ['Hmm... tente de novo, meu amor 🌸','Quase lá... pensa com carinho 💛','Você sabe essa, eu sei que sabe 🌻'];
    msg.textContent = msgs[Math.min(erros - 1, msgs.length - 1)];
    msg.style.opacity = '1';
    document.getElementById('respostaInput').value = '';
    document.getElementById('respostaInput').focus();
  }
}
function fecharOverlay() {
  var o = document.getElementById('entryOverlay');
  o.style.opacity = '0';
  setTimeout(function(){ o.style.display = 'none'; }, 800);
}
function entrarComMusica() {
  var vid = document.getElementById('mainVideo');
  if (vid) { vid.muted = false; vid.play().catch(function(){ vid.muted = true; vid.play(); }); }
  fecharOverlay();
}

/* ══════════════════════════════════════════
   DARK MODE
══════════════════════════════════════════ */
function toggleDark() {
  document.body.classList.toggle('dark-mode');
  var isDark = document.body.classList.contains('dark-mode');
  document.getElementById('darkIcon').textContent = isDark ? '☀️' : '🌙';
  document.getElementById('darkLabel').textContent = isDark ? 'Modo claro' : 'Modo noturno';
  localStorage.setItem('darkMode', isDark ? '1' : '0');
  if (window.mapaLeaflet) {
    var tile = isDark
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
    window.mapaLeaflet.eachLayer(function(l){ if(l._url) window.mapaLeaflet.removeLayer(l); });
    L.tileLayer(tile, {maxZoom:18, attribution:'&copy; CartoDB'}).addTo(window.mapaLeaflet);
  }
}
if (localStorage.getItem('darkMode') === '1') {
  document.body.classList.add('dark-mode');
  document.getElementById('darkIcon').textContent = '☀️';
  document.getElementById('darkLabel').textContent = 'Modo claro';
}

/* ══════════════════════════════════════════
   PARALLAX GIRASSÓIS
══════════════════════════════════════════ */
document.addEventListener('mousemove', function(e){
  var rx = (e.clientX / window.innerWidth - 0.5) * 20;
  var ry = (e.clientY / window.innerHeight - 0.5) * 20;
  var sfL = document.getElementById('sfLeft');
  var sfR = document.getElementById('sfRight');
  if (sfL) sfL.style.transform = 'rotate(-20deg) translate('+rx*0.5+'px,'+ry*0.5+'px)';
  if (sfR) sfR.style.transform = 'rotate(15deg) translate('+(rx*-0.5)+'px,'+(ry*-0.5)+'px)';
});


/* ══════════════════════════════════════════
   CONTADOR TEMPO REAL
══════════════════════════════════════════ */
function atualizarContador() {
  var inicio = new Date('2021-06-12T00:00:00');
  var agora = new Date();
  var anos = 0, meses = 0;
  var d = new Date(inicio);
  while(true){ var p = new Date(d); p.setFullYear(p.getFullYear()+1); if(p>agora) break; anos++; d=p; }
  while(true){ var p2 = new Date(d); p2.setMonth(p2.getMonth()+1); if(p2>agora) break; meses++; d=p2; }
  var restMs = agora - d;
  var dias = Math.floor(restMs/(1000*60*60*24));
  var horas = Math.floor((restMs%(1000*60*60*24))/(1000*60*60));
  var min = Math.floor((restMs%(1000*60*60))/(1000*60));
  var seg = Math.floor((restMs%(1000*60))/1000);
  document.getElementById('cnt-anos').textContent = anos;
  document.getElementById('cnt-meses').textContent = meses;
  document.getElementById('cnt-dias').textContent = dias;
  document.getElementById('cnt-horas').textContent = String(horas).padStart(2,'0');
  document.getElementById('cnt-min').textContent = String(min).padStart(2,'0');
  document.getElementById('cnt-seg').textContent = String(seg).padStart(2,'0');
}
atualizarContador();
setInterval(atualizarContador, 1000);

/* ══════════════════════════════════════════
   STATS ANIMADOS
══════════════════════════════════════════ */
function animateCount(el, target, duration) {
  var start = 0, step = target/(duration/16);
  var timer = setInterval(function(){
    start += step;
    if(start >= target){ start = target; clearInterval(timer); }
    el.textContent = Math.floor(start);
  }, 16);
}

/* ══════════════════════════════════════════
   VISUALIZADOR DE ÁUDIO
══════════════════════════════════════════ */
(function buildViz(){
  var viz = document.getElementById('audioViz');
  var barCount = 28;
  for(var i=0; i<barCount; i++){
    var bar = document.createElement('div');
    bar.className = 'audio-bar';
    var minH = 4 + Math.random()*8;
    var maxH = 18 + Math.random()*28;
    var dur = (0.6 + Math.random()*0.9).toFixed(2);
    var delay = (Math.random()*0.8).toFixed(2);
    bar.style.cssText = '--min-h:'+minH+'px;--max-h:'+maxH+'px;--dur:'+dur+'s;animation-delay:'+delay+'s;height:'+minH+'px;';
    viz.appendChild(bar);
  }
  /* Pausar quando vídeo está tocando */
  var vid = document.getElementById('mainVideo');
  if(vid){
    vid.addEventListener('play', function(){ document.getElementById('vizWrapper').style.opacity='0.3'; });
    vid.addEventListener('pause', function(){ document.getElementById('vizWrapper').style.opacity='1'; });
    vid.addEventListener('ended', function(){ document.getElementById('vizWrapper').style.opacity='1'; });
  }
})();

/* ══════════════════════════════════════════
   NUVEM DE PALAVRAS
══════════════════════════════════════════ */
var palavras = [
  { text: 'carinhosa',   size: 2.4, color: '#C17B2A' },
  { text: 'linda',       size: 2.8, color: '#D4A017' },
  { text: 'meu lar',     size: 2.2, color: '#4A7BA7' },
  { text: 'girassol',    size: 2.6, color: '#D4A017' },
  { text: 'alegria',     size: 2.0, color: '#6B8C5A' },
  { text: 'meu amor',    size: 3.2, color: '#C17B2A' },
  { text: 'única',       size: 1.8, color: '#8B5A1A' },
  { text: 'parceira',    size: 2.1, color: '#4A7BA7' },
  { text: 'corajosa',    size: 1.9, color: '#6B8C5A' },
  { text: 'minha vida',  size: 2.5, color: '#C17B2A' },
  { text: 'sorriso',     size: 2.0, color: '#D4A017' },
  { text: 'especial',    size: 1.7, color: '#8AAFC8' },
  { text: 'peidinho',     size: 1.6, color: '#6B5040' },
  { text: 'cumplicidade',size: 1.5, color: '#4A7BA7' },
  { text: 'morenussa',         size: 2.3, color: '#D4A017' },
  { text: 'meu tudo',    size: 2.7, color: '#C17B2A' },
  { text: 'inteligente', size: 1.8, color: '#6B8C5A' },
  { text: 'bonita',      size: 2.1, color: '#8B5A1A' },
  { text: 'forte',       size: 1.7, color: '#4A7BA7' },
  { text: 'luz',       size: 2.4, color: '#D4A017' },
];

function buildWordcloud(){
  var container = document.getElementById('wordcloud');
  var w = container.offsetWidth || 700;
  var h = 320;
  var placed = [];
  function overlaps(x,y,pw,ph){
    for(var i=0;i<placed.length;i++){
      var p=placed[i];
      if(x<p.x+p.w+16 && x+pw+16>p.x && y<p.y+p.h+10 && y+ph+10>p.y) return true;
    }
    return false;
  }
  palavras.forEach(function(word){
    var el = document.createElement('span');
    el.className = 'word-item';
    el.textContent = word.text;
    el.style.fontSize = word.size + 'rem';
    el.style.color = word.color;
    var rot = (Math.random()*20-10).toFixed(1);
    var dur = (3+Math.random()*4).toFixed(1);
    var mx = (Math.random()*16-8).toFixed(0);
    var my = (Math.random()*16-8).toFixed(0);
    var delay = (Math.random()*2).toFixed(1);
    el.style.setProperty('--dur', dur+'s');
    el.style.setProperty('--rot', rot+'deg');
    el.style.setProperty('--mx', mx+'px');
    el.style.setProperty('--my', my+'px');
    el.style.animationDelay = delay+'s';
    container.appendChild(el);
    var pw = el.offsetWidth || word.text.length * word.size * 10;
    var ph = el.offsetHeight || word.size * 20;
    var tries = 0, x, y, ok = false;
    while(tries < 200 && !ok){
      x = 16 + Math.random()*(w - pw - 32);
      y = 12 + Math.random()*(h - ph - 24);
      if(!overlaps(x,y,pw,ph)){ ok=true; placed.push({x,y,w:pw,h:ph}); }
      tries++;
    }
    if(!ok){ x=Math.random()*(w-pw); y=Math.random()*(h-ph); }
    el.style.left = x+'px';
    el.style.top = y+'px';
  });
}

/* ══════════════════════════════════════════
   FILMES & SÉRIES
══════════════════════════════════════════ */
var movies = [
  { title: 'Stranger Things', emoji: '🔴', phrase: 'Aquelas noites assistindo juntos no sofá...', bg: 'linear-gradient(135deg, #1a1a2e, #c0392b)' },
  { title: 'La Casa de Papel', emoji: '🔴', phrase: 'Bella Ciao tocando enquanto a gente ficava na boca de cada episódio!', bg: 'linear-gradient(135deg, #7f0000, #c0392b)' },
  { title: 'O Gambito da Rainha', emoji: '♟️', phrase: 'Beth Harmon nos mostrou que genialidade vem com intensidade.', bg: 'linear-gradient(135deg, #2c3e50, #8e44ad)' },
  { title: 'Berlim', emoji: '🎭', phrase: 'O spin-off que precisávamos! Tão bom quanto esperávamos?', bg: 'linear-gradient(135deg, #1a1a2e, #e74c3c)' },
];

function buildMovies(){
  var grid = document.getElementById('moviesGrid');
  movies.forEach(function(m, i){
    var card = document.createElement('div');
    card.className = 'movie-card';
    card.style.transitionDelay = (i * 0.1) + 's';
    card.innerHTML = '<div class="movie-poster-placeholder" style="background:'+m.bg+'">'+m.emoji+'</div>'
      +'<div class="movie-info"><div class="movie-title">'+m.title+'</div><div class="movie-phrase">'+m.phrase+'</div></div>';
    grid.appendChild(card);
  });
}

/* ══════════════════════════════════════════
   ADIVINHE A FOTO
══════════════════════════════════════════ */
var guessPhotos = [
  { src: 'img/WhatsApp Image 2026-05-28 at 18.15.04.jpeg',       answer: ['praia', 'na praia'], hint: 'Lugar com mar e areia 🌊' },
  { src: 'img/WhatsApp Image 2026-05-28 at 18.10.26 (1).jpeg',   answer: ['casa da minha tia', 'casa da tia dele'], hint: 'Visita em família 🏡' },
  { src: 'img/WhatsApp Image 2026-05-28 at 18.10.27 (1).jpeg',   answer: ['restaurante de hamburguer', 'charada burguer'], hint: 'Hora do lanche gostoso 🍔' },
  { src: 'img/WhatsApp Image 2026-05-28 at 18.10.28 (1).jpeg',   answer: ['na casa dele', 'no quarto dele'], hint: 'Momento bem reservado nosso 🛏️' },
  { src: 'img/WhatsApp Image 2026-05-28 at 18.15.07.jpeg',       answer: ['no aeroporto', 'no aeroporto de guarulhos'], hint: 'Lugar de onde partem os aviões ✈️' },
];
var guessIdx = 0;
var guessHearts = 3;
var guessBlurStep = 0; // 0=max blur, 1=medium, 2=low, 3=sem blur
var guessAnswered = false;

var blurLevels = [
  { blur: '24px', label: 'Nível 1 — muito desfocada 🌫️' },
  { blur: '14px', label: 'Nível 2 — um pouco mais claro... 🌤️' },
  { blur: '5px',  label: 'Nível 3 — quase lá! 👀' },
  { blur: '0px',  label: 'Revelada! ✨' },
];

function renderGuessHearts(){
  var el = document.getElementById('guessHearts');
  el.innerHTML = '';
  for(var i=0;i<3;i++){
    el.innerHTML += i < guessHearts ? '❤️' : '🖤';
  }
}

function loadGuessPhoto(){
  var photo = guessPhotos[guessIdx];
  var img = document.getElementById('guessImg');
  img.src = photo.src;
  img.style.filter = 'blur(' + blurLevels[guessBlurStep].blur + ')';
  document.getElementById('guessBlurLabel').textContent = blurLevels[guessBlurStep].label;
  document.getElementById('guessFeedback').textContent = '';
  document.getElementById('guessInput').value = '';
  document.getElementById('guessCounter').textContent = (guessIdx+1) + ' / ' + guessPhotos.length;
  guessAnswered = false;
  document.getElementById('guessInput').disabled = false;
  renderGuessHearts();
}

function revealMore(){
  if(guessBlurStep < blurLevels.length - 1){
    guessBlurStep++;
    var img = document.getElementById('guessImg');
    img.style.transition = 'filter 1.2s ease';
    img.style.filter = 'blur(' + blurLevels[guessBlurStep].blur + ')';
    document.getElementById('guessBlurLabel').textContent = blurLevels[guessBlurStep].label;
  }
}

function checkGuess(){
  if(guessAnswered) return;
  var input = normalizar(document.getElementById('guessInput').value);
  if(!input) return;
  var photo = guessPhotos[guessIdx];
  var correct = photo.answer.some(function(a){ return input.indexOf(normalizar(a)) !== -1 || normalizar(a).indexOf(input) !== -1; });
  var fb = document.getElementById('guessFeedback');
  if(correct){
    guessAnswered = true;
    placar.fotos = (placar.fotos || 0) + 1;
    document.getElementById('guessImg').style.filter = 'blur(0px)';
    document.getElementById('guessImg').style.transition = 'filter 1s ease';
    fb.textContent = '🎉 Acertou! Era ' + (photo.answer[0]) + '! Você me conhece bem. 💛';
    fb.style.color = 'var(--verde-escuro)';
    document.getElementById('guessInput').disabled = true;
    spawnParticles('💛', 6);
  } else {
    guessHearts = Math.max(0, guessHearts - 1);
    renderGuessHearts();
    if(guessHearts === 0){
      guessAnswered = true;
      revealMore(); revealMore(); revealMore();
      fb.textContent = '💔 Era: ' + photo.hint + '. Tudo bem, a gente aprende juntos!';
      fb.style.color = 'var(--ocre)';
      document.getElementById('guessInput').disabled = true;
    } else {
      fb.textContent = 'Hmm, não era isso... tenta de novo! 🌸';
      fb.style.color = 'var(--ocre)';
      document.getElementById('guessInput').value = '';
    }
  }
}

function nextGuess(){
  guessIdx = (guessIdx + 1) % guessPhotos.length;
  guessBlurStep = 0; guessHearts = 3;
  loadGuessPhoto();
}

function prevGuess(){
  guessIdx = (guessIdx - 1 + guessPhotos.length) % guessPhotos.length;
  guessBlurStep = 0; guessHearts = 3;
  loadGuessPhoto();
}

/* ══════════════════════════════════════════
   MAPA LEAFLET
══════════════════════════════════════════ */
function initMapa() {
  var isDark = document.body.classList.contains('dark-mode');
  var tile = isDark
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
  var mapa = L.map('mapa-lugares', { center: [-22.5, -46.8], zoom: 6, zoomControl: true, scrollWheelZoom: false });
  window.mapaLeaflet = mapa;
  L.tileLayer(tile, { maxZoom: 18, attribution: '&copy; <a href="https://carto.com">CartoDB</a>' }).addTo(mapa);
  var lugares = [
    { nome: 'EE Jorge Duprat Figueiredo', lat: -23.6248, lng: -46.6891, desc: 'Onde a nossa história começou 🌻', emoji: '🏫' },
    { nome: 'Pico do Jd. Santa Teresinha', lat: -23.6261, lng: -46.6884, desc: 'Vista linda, do nosso jeito', emoji: '⛰️' },
    { nome: 'Shopping Aricanduva', lat: -23.5391, lng: -46.5194, desc: 'Nosso rolê favorito', emoji: '🛍️' },
    { nome: 'Cinemark Aricanduva', lat: -23.5391, lng: -46.5194, desc: 'Pipoca e cinema com o amor 🎬', emoji: '🎬' },
    { nome: 'Shopping Anália Franco', lat: -23.5413, lng: -46.5258, desc: 'Mais um rolê especial nosso 🛍️', emoji: '🛍️' },
    { nome: 'Shopping Penha', lat: -23.5239, lng: -46.5433, desc: 'Mais um rolê nosso 🛍️', emoji: '🛍️' },
    { nome: 'Faculdade UNICID', lat: -23.5431, lng: -46.5303, desc: 'Parte da nossa jornada juntos 📚 (ao lado do Metrô Carrão)', emoji: '📚' },
    { nome: 'Parque do Carmo', lat: -23.5474, lng: -46.4873, desc: 'Passeios e momentos tranquilos 🌿', emoji: '🌿' },
    { nome: 'Holambra', lat: -22.6375, lng: -47.0600, desc: 'Flores e amor em Holambra 🌷', emoji: '🌷' },
    { nome: 'Neo Química Arena', lat: -23.5454, lng: -46.4743, desc: 'Show do Jão — que noite incrível! 🎤', emoji: '🎤' },
    { nome: 'Aeroporto de Guarulhos', lat: -23.4356, lng: -46.4731, desc: 'De onde partimos e chegamos juntos ✈️', emoji: '✈️' },
    { nome: 'Mogi Guaçu', lat: -22.3731, lng: -46.9430, desc: 'Saudades daqui 💛', emoji: '🏡' },
    { nome: 'Estiva Gerbi', lat: -22.2680, lng: -46.9430, desc: 'Memórias especiais por aqui', emoji: '💛' },
    { nome: 'Espírito Santo do Pinhal', lat: -22.1878, lng: -46.7414, desc: 'Momentos especiais por aqui 💛', emoji: '💛' },
    { nome: 'Atibaia — Flor e Morango', lat: -23.1170, lng: -46.5508, desc: 'Morangos de Atibaia e muito amor 🍓', emoji: '🍓' },
    { nome: 'Mairiporã', lat: -23.3172, lng: -46.5872, desc: 'Natureza e tranquilidade juntos 🌿', emoji: '🌿' },
    { nome: 'Caieiras', lat: -23.3627, lng: -46.7411, desc: 'Momentos especiais por aqui 💛', emoji: '💛' },
    { nome: 'Roller Jam', lat: -23.5497, lng: -46.6338, desc: 'Patinando juntos, que dupla! ⛸️', emoji: '⛸️' },
    { nome: 'Allp Fit', lat: -23.5378, lng: -46.5201, desc: 'Suando junto também conta! 💪', emoji: '💪' },
    { nome: 'Natory Sushi', lat: -23.5350, lng: -46.5150, desc: 'Sushi favorito do casal 🍣', emoji: '🍣' },
    { nome: 'Nochi Sushi', lat: -23.5445, lng: -46.5270, desc: 'Mais um sushi delicioso juntos 🍣', emoji: '🍣' },
    { nome: 'Sushi Carrão', lat: -23.5425, lng: -46.5310, desc: 'O sushi do nosso bairro 🍣', emoji: '🍣' },
    { nome: 'Formatura da Escola', lat: -23.6248, lng: -46.6891, desc: 'Uma noite muito especial 🎓', emoji: '🎓' },
    { nome: 'Praia Grande', lat: -24.0090, lng: -46.4130, desc: 'Mar, areia e você ao meu lado 🌊', emoji: '🏖️' },
    { nome: 'Recife — Boa Viagem', lat: -8.1192, lng: -34.9001, desc: 'Praia de Boa Viagem, Recife 🌊', emoji: '🌊' },
    { nome: 'Porto de Galinhas', lat: -8.7080, lng: -35.0055, desc: 'Piscinas naturais e muito amor 🐠', emoji: '🐠' },
    { nome: 'Maragogi', lat: -9.0103, lng: -35.2228, desc: 'O Caribe brasileiro com você 🌴', emoji: '🌴' },
    { nome: 'Alagoas', lat: -9.5713, lng: -36.7820, desc: 'Aventura em Alagoas juntos 🌊', emoji: '🌊' },
    { nome: 'Baía de Maraçaípe', lat: -8.7472, lng: -35.0197, desc: 'Maraçaípe — pôr do sol inesquecível 🌅', emoji: '🌅' },
    { nome: 'Sirinhaém', lat: -8.5942, lng: -35.1178, desc: 'Praias paradisíacas juntos 🏝️', emoji: '🏝️' },
    { nome: 'Tamandaré', lat: -8.7582, lng: -35.1043, desc: 'Recife de corais e amor 🐠', emoji: '🐠' },
    { nome: 'Parque das Esculturas Francisco Brennand', lat: -8.0603, lng: -34.8714, desc: 'Arte e cultura juntos em Recife 🎨', emoji: '🎨' },
    { nome: 'Ilha do Recife', lat: -8.0631, lng: -34.8711, desc: 'Explorando o centro histórico de Recife 🏛️', emoji: '🏛️' },
    { nome: 'Pernambuco', lat: -8.7832, lng: -36.5000, desc: 'Aventura nordestina do casal 🌵', emoji: '🌵' }
  ];
  var svgIcon = function(emoji) {
    return L.divIcon({ html: '<div style="font-size:1.6rem;line-height:1;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3));cursor:pointer;">' + emoji + '</div>', className: '', iconSize: [32,32], iconAnchor: [16,32], popupAnchor: [0,-34] });
  };
  lugares.forEach(function(l) {
    var marker = L.marker([l.lat, l.lng], { icon: svgIcon(l.emoji) }).addTo(mapa);
    marker.bindPopup('<div class="popup-title">'+l.emoji+' '+l.nome+'</div><div class="popup-desc">'+l.desc+'</div>');
    marker.on('mouseover', function(){ this.openPopup(); });
  });
  setTimeout(function(){ mapa.invalidateSize(); }, 300);
}

/* ══════════════════════════════════════════
   LIGHTBOX
══════════════════════════════════════════ */
var allPhotos = [], currentPhoto = 0;
function buildPhotoSrcs() { allPhotos = Array.from(document.querySelectorAll('.photo-placeholder img')).map(function(img){ return img.src; }); }
window.openLightbox = function(idx) {
  currentPhoto = idx;
  var img = document.getElementById('lbImg');
  img.src = allPhotos[idx];
  document.getElementById('lbCounter').textContent = (idx+1)+' / '+allPhotos.length;
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() { document.getElementById('lightbox').classList.remove('open'); document.body.style.overflow = ''; }
function navLightbox(dir) {
  currentPhoto = (currentPhoto + dir + allPhotos.length) % allPhotos.length;
  var img = document.getElementById('lbImg');
  img.style.opacity = '0'; img.style.transform = 'scale(0.92)';
  setTimeout(function(){ img.src = allPhotos[currentPhoto]; img.style.opacity='1'; img.style.transform='scale(1)'; document.getElementById('lbCounter').textContent=(currentPhoto+1)+' / '+allPhotos.length; }, 180);
}
document.getElementById('lbClose').onclick = closeLightbox;
document.getElementById('lbPrev').onclick = function(){ navLightbox(-1); };
document.getElementById('lbNext').onclick = function(){ navLightbox(1); };
document.getElementById('lightbox').addEventListener('click', function(e){ if(e.target===this) closeLightbox(); });
document.addEventListener('keydown', function(e){
  if(!document.getElementById('lightbox').classList.contains('open')) return;
  if(e.key==='ArrowLeft') navLightbox(-1);
  if(e.key==='ArrowRight') navLightbox(1);
  if(e.key==='Escape') closeLightbox();
});
var lbImg = document.getElementById('lbImg');
lbImg.style.transition = 'opacity 0.18s ease, transform 0.18s ease';

/* ══════════════════════════════════════════
   ENVELOPE DECLARAÇÃO
══════════════════════════════════════════ */
var envelopeAberto = false;
function abrirEnvelope() {
  if(envelopeAberto) return;
  envelopeAberto = true;
  document.getElementById('envFlap').style.transform = 'rotateX(-160deg)';
  document.getElementById('heartSeal').style.opacity = '0';
  document.getElementById('envelopeHint').textContent = '💌 Uma carta para você...';
  setTimeout(function(){
    var card = document.getElementById('declaracaoCard');
    card.classList.add('open');
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    document.getElementById('envelope').style.cursor = 'default';
  }, 600);
}
document.getElementById('envelope').addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' ') abrirEnvelope(); });

/* ══════════════════════════════════════════
   CARTA DO FUTURO
   ALTERE A SENHA NA LINHA ABAIXO 👇
══════════════════════════════════════════ */
var SENHA_FUTURO = '2031'; /* ← TROQUE PELA SENHA QUE QUISER */
var futuroErros = 0;
function abrirFuturo() {
  var input = document.getElementById('futuroInput').value;
  var erro = document.getElementById('futuroErro');
  if(input === SENHA_FUTURO){
    document.getElementById('futuroLocked').style.display = 'none';
    document.getElementById('futuroCarta').classList.add('open');
    document.querySelector('.futuro-lock').textContent = '💌';
    spawnParticles('💛', 10);
  } else {
    futuroErros++;
    var msgs = ['Hmm... essa não é a senha, amor 🌸','Tenta de novo! Pensa no nosso amor 💛','Quase... você sabe essa! 🌻'];
    erro.textContent = msgs[Math.min(futuroErros-1, msgs.length-1)];
    document.getElementById('futuroInput').value = '';
    document.getElementById('futuroInput').focus();
  }
}
document.getElementById('futuroInput').addEventListener('keydown', function(e){ if(e.key==='Enter') abrirFuturo(); });

/* ══════════════════════════════════════════
   QUIZ
══════════════════════════════════════════ */
var quizData = [
  { q: "Onde nos conhecemos?", opts: ["Na escola","Num evento","Por aplicativo","Pela internet"], ans: 0, fb: "Foi na escola que tudo começou! 🌻" },
  { q: "Qual música representa nossa história?", opts: ["Perfect","Beginning Middle End","A Thousand Years","Can't Help Falling in Love"], ans: 1, fb: "Beginning Middle End — do começo ao fim, sempre! 💛" },
  { q: "Quantos anos completamos neste aniversário?", opts: ["3 anos","4 anos","5 anos","6 anos"], ans: 2, fb: "5 anos lindos juntos! 🎉" },
  { q: "O que nos fortaleceu ao longo dos anos?", opts: ["A distância","Cada desafio superado","A sorte","Pessoas ao redor"], ans: 1, fb: "Cada desafio nos tornou mais fortes! ✨" }
];
var score = 0, answered = 0;
function buildQuiz() {
  var container = document.getElementById('quizContainer');
  quizData.forEach(function(item, i) {
    var card = document.createElement('div'); card.className = 'quiz-card';
    card.innerHTML = '<p class="quiz-question">'+(i+1)+'. '+item.q+'</p><div class="quiz-options">'+item.opts.map(function(o,j){ return '<button class="quiz-option" data-q="'+i+'" data-o="'+j+'">'+o+'</button>'; }).join('')+'</div><p class="quiz-feedback" id="fb-'+i+'"></p>';
    container.appendChild(card);
  });
  container.addEventListener('click', function(e) {
    var btn = e.target.closest('.quiz-option');
    if(!btn || btn.classList.contains('disabled')) return;
    var qi=+btn.dataset.q, oi=+btn.dataset.o;
    var card=btn.closest('.quiz-card');
    var btns=card.querySelectorAll('.quiz-option');
    btns.forEach(function(b){ b.classList.add('disabled'); });
    btns[quizData[qi].ans].classList.add('correct');
    if(oi!==quizData[qi].ans) btn.classList.add('wrong');
    else { score++; spawnParticles('💛', 4); }
    document.getElementById('fb-'+qi).textContent = quizData[qi].fb;
    answered++;
    if(answered===quizData.length) showScore();
  });
}
function showScore() {
  var el=document.getElementById('quizScore'), txt=document.getElementById('quizScoreText'), emoji=document.getElementById('quizEmoji');
  el.style.display='block';
  placar.quiz = score;
  var pct=score/quizData.length;
  if(pct===1){ emoji.textContent='🌻🌻🌻'; txt.textContent='Perfeito! '+score+'/'+quizData.length+' — você guarda cada detalhe no coração!'; }
  else if(pct>=0.5){ emoji.textContent='💛'; txt.textContent='Muito bem! '+score+'/'+quizData.length+' — cada memória importa!'; }
  else{ emoji.textContent='🌱'; txt.textContent=score+'/'+quizData.length+' — mais memórias virão para guardar!'; }
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
buildQuiz();

/* ══════════════════════════════════════════
   VÍDEO AUTOPLAY
══════════════════════════════════════════ */
var vid = document.getElementById('mainVideo');
function tryPlay() {
  vid.muted = false;
  vid.play().catch(function(){ vid.muted = true; vid.play(); });
  document.removeEventListener('click', tryPlay);
  document.removeEventListener('touchstart', tryPlay);
}
document.addEventListener('click', tryPlay);
document.addEventListener('touchstart', tryPlay);
vid.play().catch(function(){});

/* ══════════════════════════════════════════
   RESPOSTA VÍDEO
══════════════════════════════════════════ */
document.querySelectorAll('input[name="resposta"]').forEach(function(radio) {
  radio.addEventListener('change', function() {
    var msg = document.getElementById('answerMsg');
    if(radio.value==='sim'){
      placar.video = 1;
      msg.textContent='Que alegria! Eu também te amarei sempre. 🌻💛';
      msg.style.color='var(--ocre)';
    } else {
      placar.video = 0;
      msg.textContent='Tudo bem... mas eu continuarei te amando do mesmo jeito. 😊';
      msg.style.color='var(--azul)';
    }
  });
});

/* ══════════════════════════════════════════
   COMPARTILHAR
══════════════════════════════════════════ */
function compartilhar(e) {
  e.preventDefault();
  var txt = encodeURIComponent('José Henrique fez algo muito especial pra mim 🌻💛 Veja aqui: ' + window.location.href);
  window.open('https://wa.me/?text=' + txt, '_blank');
}

/* ══════════════════════════════════════════
   PARTÍCULAS DE SEÇÃO (ao rolar)
══════════════════════════════════════════ */
var sectionSymbols = ['🌻','💛','🌸','✨','💛','🌼'];
var lastParticleSection = null;
function spawnParticles(symbol, count, x, y) {
  for(var i=0; i<count; i++){
    (function(i){
      setTimeout(function(){
        var p = document.createElement('div');
        p.className = 'section-particle';
        p.textContent = symbol || sectionSymbols[Math.floor(Math.random()*sectionSymbols.length)];
        var px = x !== undefined ? x : (20 + Math.random()*60) + 'vw';
        var py = y !== undefined ? y : (30 + Math.random()*40) + 'vh';
        p.style.left = (typeof px === 'string' ? px : px+'px');
        p.style.top = (typeof py === 'string' ? py : py+'px');
        p.style.fontSize = (1 + Math.random()*0.8) + 'rem';
        p.style.animationDelay = (Math.random()*0.3)+'s';
        document.body.appendChild(p);
        setTimeout(function(){ p.remove(); }, 2200);
      }, i * 120);
    })(i);
  }
}

/* Seções que disparam partículas ao entrar */
var particleSections = document.querySelectorAll('section');
var sectionParticleObserver = new IntersectionObserver(function(entries){
  entries.forEach(function(entry){
    if(entry.isIntersecting && entry.target !== lastParticleSection){
      lastParticleSection = entry.target;
      spawnParticles(null, 5);
    }
  });
}, { threshold: 0.3 });
particleSections.forEach(function(s){ sectionParticleObserver.observe(s); });

/* ══════════════════════════════════════════
   INTERSECTION OBSERVER (fade-in geral)
══════════════════════════════════════════ */
var io = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      var nums = entry.target.querySelectorAll ? entry.target.querySelectorAll('.stat-num-animated') : [];
      nums.forEach(function(el){
        if(!el.dataset.animated){ el.dataset.animated='1'; animateCount(el, +el.dataset.target, 1800); }
      });
      if(entry.target.id==='mapa-lugares' && !window.mapaIniciado){ window.mapaIniciado=true; setTimeout(initMapa, 100); }
      /* Wordcloud */
      if(entry.target.id==='wordcloud' && !entry.target.dataset.built){ entry.target.dataset.built='1'; setTimeout(buildWordcloud, 100); }
      /* Movies */
      if(entry.target.id==='moviesGrid' && !entry.target.dataset.built){ entry.target.dataset.built='1'; buildMovies(); setTimeout(function(){ document.querySelectorAll('.movie-card').forEach(function(c){ io.observe(c); }); }, 100); }
      if(entry.target.classList.contains('movie-card')){ entry.target.classList.add('visible'); }
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in, .timeline-item, .quiz-card, .stat-card, #mapa-lugares').forEach(function(el){ io.observe(el); });

/* ══════════════════════════════════════════
   FOTOS: LIGHTBOX + CASCADE
══════════════════════════════════════════ */
buildPhotoSrcs();
var photoObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if(entry.isIntersecting){
      var cards = entry.target.querySelectorAll('.photo-placeholder');
      cards.forEach(function(card, i){
        setTimeout(function(){ card.classList.add('photo-visible'); setTimeout(function(){ card.classList.add('photo-done'); }, 700); }, i*60);
      });
      photoObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.05 });
var grid = document.getElementById('photoGrid');
if(grid) photoObserver.observe(grid);
document.querySelectorAll('.photo-placeholder').forEach(function(card){
  card.addEventListener('click', function(){ openLightbox(+card.dataset.index); });
});

/* ══════════════════════════════════════════
   PÉTALAS FLUTUANTES
══════════════════════════════════════════ */
var symbols = ['🌸','🌼','✨','🌻'];
function createPetal() {
  var p = document.createElement('div'); p.className = 'petal';
  p.textContent = symbols[Math.floor(Math.random()*symbols.length)];
  p.style.left = Math.random()*100+'vw'; p.style.top = '-2rem';
  var dur = 8+Math.random()*10;
  p.style.animationDuration = dur+'s'; p.style.animationDelay = Math.random()*4+'s';
  p.style.fontSize = (0.7+Math.random()*0.8)+'rem';
  document.body.appendChild(p);
  setTimeout(function(){ p.remove(); }, (dur+4)*1000);
}
setInterval(createPetal, 2500);
for(var i=0;i<4;i++) setTimeout(createPetal, i*600);

/* ══════════════════════════════════════════
   SWIPE LIGHTBOX MOBILE
══════════════════════════════════════════ */
var lbTouchStartX = 0;
document.getElementById('lightbox').addEventListener('touchstart', function(e){ lbTouchStartX = e.touches[0].clientX; });
document.getElementById('lightbox').addEventListener('touchend', function(e){
  var diff = lbTouchStartX - e.changedTouches[0].clientX;
  if(Math.abs(diff)>50) navLightbox(diff>0?1:-1);
});

/* ══════════════════════════════════════════
   INICIALIZAR ADIVINHE A FOTO
══════════════════════════════════════════ */
loadGuessPhoto();

/* ══════════════════════════════════════════
   BOTÃO DA SAUDADE
══════════════════════════════════════════ */
var mensagensSaudade = [
  "Você se lembra quando fomos a Holambra? Os girassóis eram bonitos, mas nenhum chegava perto de você. 🌻",
  "Hoje eu te amo 1% mais do que ontem. E amanhã vou te amar 1% mais do que hoje. A matemática do amor. 💛",
  "Já pensou que fomos à Praia Grande, Recife, Maragogi... e em todo lugar, a minha parte favorita era você ao lado. 🌊",
  "Você se lembra do Roller Jam? Eu estava tentando não cair e tentando não te encarar ao mesmo tempo. Perdi nas duas. ⛸️",
  "5 anos, milhares de memórias, e a favorita ainda não aconteceu — é a próxima que vou viver com você. 🌸",
  "Porto de Galinhas com você foi o dia mais bonito da minha vida até então. Cada dia seguinte superou. 🐠",
  "Você se lembra da nossa primeira vez no cinema juntos? Eu não me lembro do filme. Só lembro de você. 🎬",
  "Às vezes penso no começo, na escola, naquele olhar... e fico feliz que o destino tenha decidido que era a gente. 🌻",
  "Se eu pudesse te dar uma coisa hoje, seria um dia inteiro sem preocupações — só nós dois e tempo de sobra. 💛",
  "Atibaia, flores, morangos, você de mão dada comigo... esse dia eu nunca vou esquecer. 🍓",
  "Hoje não é um dia especial. É apenas mais um dia em que me sinto sortudo por te ter. 🌼",
  "Eu guardo você em todas as músicas que me fazem lembrar de algo bom. São muitas músicas. 🎵",
];
var saudadeTimeout = null;
function mostrarSaudade() {
  var idx = Math.floor(Math.random() * mensagensSaudade.length);
  document.getElementById('saudadeTexto').textContent = mensagensSaudade[idx];
  var toast = document.getElementById('saudadeToast');
  toast.style.display = 'block';
  requestAnimationFrame(function(){ requestAnimationFrame(function(){
    toast.style.opacity = '1'; toast.style.transform = 'translateY(0)';
  }); });
  clearTimeout(saudadeTimeout);
  saudadeTimeout = setTimeout(fecharSaudade, 7000);
}
function fecharSaudade() {
  var toast = document.getElementById('saudadeToast');
  toast.style.opacity = '0'; toast.style.transform = 'translateY(12px)';
  setTimeout(function(){ toast.style.display = 'none'; }, 500);
}

// ============================================================================
// PESO EXTRA PARA O GRAPH DO GITHUB
// Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
// incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
// exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
// [COLE ESSE TEXTO QUANTAS VEZES QUISER ATÉ O ARQUIVO JS FICAR MAIOR QUE O HTML]
// ============================================================================
// PESO EXTRA PARA O GRAPH DO GITHUB
// Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
// incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
// exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
// [COLE ESSE TEXTO QUANTAS VEZES QUISER ATÉ O ARQUIVO JS FICAR MAIOR QUE O HTML]
// ============================================================================
// ============================================================================
// PESO EXTRA PARA O GRAPH DO GITHUB
// Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
// incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
// exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
// [COLE ESSE TEXTO QUANTAS VEZES QUISER ATÉ O ARQUIVO JS FICAR MAIOR QUE O HTML]
// ============================================================================
// ============================================================================
// PESO EXTRA PARA O GRAPH DO GITHUB
// Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
// incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
// exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
// [COLE ESSE TEXTO QUANTAS VEZES QUISER ATÉ O ARQUIVO JS FICAR MAIOR QUE O HTML]
// ============================================================================
// ============================================================================
// PESO EXTRA PARA O GRAPH DO GITHUB
// Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
// incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
// exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
// [COLE ESSE TEXTO QUANTAS VEZES QUISER ATÉ O ARQUIVO JS FICAR MAIOR QUE O HTML]
// ============================================================================
// ============================================================================