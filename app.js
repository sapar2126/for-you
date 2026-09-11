/* =========================================================
   For You 💕 — Romantic Galaxy Edition (Fixed)
   ========================================================= */
'use strict';

const $  = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

/* ---------------- state ---------------- */
const state = {
  step: 1,
  answers: { when:null, time:null, where:null, bring:null, then:null },
  dodges: 0,
  saved: false,
};

const TOTAL_STEPS = 8;

/* ---------------- option data ---------------- */
const OPTIONS = {
  when: [
    { icon:'📅', title:'Today',     sub:'no time like now' },
    { icon:'🌙', title:'Tomorrow',  sub:'sleep on it first' },
    { icon:'⭐', title:'Saturday',  sub:'the classic' },
    { icon:'🌤️', title:'Sunday',    sub:'lazy but lovely' },
    { icon:'💼', title:'Monday',    sub:'bold move' },
    { icon:'🎲', title:'Surprise me', sub:'you choose' },
  ],
  time: [
    { icon:'🌅', title:'Morning',   sub:'10:30 · soft start' },
    { icon:'☀️', title:'Afternoon', sub:'15:00 · golden light' },
    { icon:'🌆', title:'Evening',   sub:'19:00 · perfect hour' },
    { icon:'🌃', title:'Night',     sub:'21:30 · under the stars' },
  ],
  where: [
    { icon:'☕', title:'Coffee',     sub:'the good little place' },
    { icon:'🕯️', title:'Dinner',    sub:'somewhere with candles' },
    { icon:'🎬', title:'Movie night',sub:'you pick, I\u2019ll allow it' },
    { icon:'🌳', title:'A long walk',sub:'until it gets cold' },
  ],
  bring: [
    { icon:'💐', title:'Flowers',        sub:'obviously' },
    { icon:'🧁', title:'Something sweet',sub:'for the walk after' },
    { icon:'🎧', title:'A playlist',     sub:'made this morning' },
    { icon:'🫶', title:'Just you',       sub:'bold, but fair' },
  ],
  then: [
    { icon:'🍰', title:'Dessert',      sub:'obviously, again' },
    { icon:'✨', title:'Stargazing',   sub:'if it stays clear' },
    { icon:'🚗', title:'A drive',      sub:'windows down' },
    { icon:'🏠', title:'Not going home',sub:'not yet, anyway' },
  ],
};

const STEP_IDS = { 2:'when', 3:'time', 4:'where', 5:'bring', 6:'then' };

/* ---------------- step navigation ---------------- */
function spawnTransitionHearts(){
  const wrap = document.createElement('div');
  wrap.className = 'transition-hearts';
  const hearts = ['💕','💗','💖','💓','💞','✨','🌸'];
  for(let i=0; i<14; i++){
    const s = document.createElement('span');
    s.textContent = hearts[Math.floor(Math.random()*hearts.length)];
    const angle = (Math.PI * 2 * i) / 14;
    const dist = 80 + Math.random()*140;
    s.style.setProperty('--tx', Math.cos(angle)*dist + 'px');
    s.style.setProperty('--ty', Math.sin(angle)*dist + 'px');
    s.style.setProperty('--rot', (Math.random()*80 - 40) + 'deg');
    s.style.left = '50%';
    s.style.top = '45%';
    s.style.animationDelay = (Math.random()*0.12) + 's';
    s.style.fontSize = (1.1 + Math.random()*1.1) + 'rem';
    wrap.appendChild(s);
  }
  document.body.appendChild(wrap);
  setTimeout(()=> wrap.remove(), 1100);
}

function goToStep(n){
  const cur = $(`.step[data-step="${state.step}"]`);
  const nxt = $(`.step[data-step="${n}"]`);
  if(!nxt) return;

  // Creative transition: hearts burst + page leaves
  spawnTransitionHearts();
  cur.classList.add('is-leaving');

  setTimeout(()=>{
    cur.classList.remove('is-active','is-leaving');
    nxt.classList.add('is-active');
    window.scrollTo({top:0, behavior:'smooth'});
  }, 420);

  state.step = n;
  updateChrome();

  if(n === 7) buildTicket();
  if(n === 8) buildCalendar();
}

function updateChrome(){
  const pct = ((state.step - 1) / (TOTAL_STEPS - 1)) * 100;
  $('#progress-fill').style.width = pct + '%';
  $('#progress-label').textContent =
    state.step <= 6 ? `Step ${state.step} of 6`
    : state.step === 7 ? 'Your date pass 💌'
    : 'Saved to calendar ✅';
  $('#back-btn').classList.toggle('show', state.step > 1 && state.step < 7);
}

$('#back-btn').addEventListener('click', ()=>{
  if(state.step > 1 && state.step < 7) goToStep(state.step - 1);
  else if(state.step === 8) goToStep(7);
});

/* ---------------- build option grids ---------------- */
function buildGrid(key){
  const grid = $('#grid-' + key);
  if(!grid) return;
  grid.innerHTML = '';
  OPTIONS[key].forEach((opt, i)=>{
    const card = document.createElement('button');
    card.className = 'opt-card';
    card.innerHTML = `
      <span class="opt-icon">${opt.icon}</span>
      <span class="opt-title">${opt.title}</span>
      <span class="opt-sub">${opt.sub}</span>`;
    card.addEventListener('mousemove', e=>{
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
    card.addEventListener('click', ()=>{
      $$(`#grid-${key} .opt-card`).forEach(c=>c.classList.remove('picked'));
      card.classList.add('picked');
      state.answers[key] = opt;
      setTimeout(()=> goToStep(state.step + 1), 520);
    });
    grid.appendChild(card);
  });
}
Object.keys(OPTIONS).forEach(buildGrid);

/* ---------------- the infamous NO button ---------------- */
const noBtn   = $('#btn-no');
const yesBtn  = $('#btn-yes');
const counter = $('#dodge-counter');
const taunts = [
  'Nope. Try again. 😌',
  'The button is scared of you now.',
  'It literally cannot be caught.',
  'Just press Yes, it\u2019s easier. 💅',
  'You\u2019re persistent. I like that. But no.',
  'The universe says no to your no.',
  'At this point the Yes button is huge.',
  'Resistance is futile. 🌹',
];

function dodge(){
  state.dodges++;
  const pad = 24;
  const bw = noBtn.offsetWidth, bh = noBtn.offsetHeight;
  const maxX = window.innerWidth  - bw - pad*2;
  const maxY = window.innerHeight - bh - pad*2;
  const x = pad + Math.random() * Math.max(maxX, 1);
  const y = pad + Math.random() * Math.max(maxY, 1);

  noBtn.style.position = 'fixed';
  noBtn.style.left = x + 'px';
  noBtn.style.top  = y + 'px';
  noBtn.style.zIndex = 30;
  noBtn.style.transition = 'left .28s cubic-bezier(.22,1,.36,1), top .28s cubic-bezier(.22,1,.36,1)';

  const scale = Math.min(1 + state.dodges * .09, 1.9);
  yesBtn.style.transform = `scale(${scale})`;
  yesBtn.style.boxShadow = `0 ${10+state.dodges*2}px ${34+state.dodges*4}px rgba(255,94,138,${Math.min(.45+state.dodges*.04,.8)})`;

  counter.textContent = taunts[Math.min(state.dodges-1, taunts.length-1)]
    + `  (dodges: ${state.dodges})`;
  counter.classList.add('show');

  if(state.dodges === 5)  noBtn.textContent = 'No?';
  if(state.dodges === 10) noBtn.textContent = 'pls stop';
  if(state.dodges === 15) noBtn.textContent = '😭';
  if(state.dodges === 20){ noBtn.textContent = 'okay I give up'; noBtn.style.opacity=.4; }
}

if(noBtn){
  noBtn.addEventListener('pointerenter', dodge);
  noBtn.addEventListener('touchstart', e=>{ e.preventDefault(); dodge(); }, {passive:false});
  noBtn.addEventListener('click', e=>{ e.preventDefault(); dodge(); });
}

/* ---------------- YES! ---------------- */
if(yesBtn){
  yesBtn.addEventListener('click', ()=>{
    startMusic(); // ensure music starts
    burstConfetti();
    // YAAAS flash
    const yay = document.createElement('div');
    yay.textContent = 'YAAAS! 🎉';
    yay.style.cssText = `position:fixed;left:50%;top:38%;transform:translate(-50%,-50%) scale(0);
      font-family:'Great Vibes',cursive;font-size:clamp(3rem,12vw,5.5rem);z-index:60;
      background:linear-gradient(120deg,#fff,#ffb3c8,#ff5e8a);-webkit-background-clip:text;
      background-clip:text;color:transparent;pointer-events:none;
      filter:drop-shadow(0 6px 30px rgba(255,94,138,.6));`;
    document.body.appendChild(yay);
    yay.animate([
      {transform:'translate(-50%,-50%) scale(0) rotate(-8deg)', opacity:0},
      {transform:'translate(-50%,-50%) scale(1.15) rotate(2deg)', opacity:1, offset:.6},
      {transform:'translate(-50%,-50%) scale(1) rotate(0deg)', opacity:1},
    ], {duration:900, easing:'cubic-bezier(.22,1,.36,1)', fill:'forwards'});
    setTimeout(()=> yay.remove(), 1400);
    setTimeout(()=> goToStep(2), 900);
  });
}

/* ---------------- ticket ---------------- */
function buildTicket(){
  const a = state.answers;
  $('#t-when').textContent  = a.when  ? a.when.title  : '—';
  $('#t-time').textContent  = a.time  ? `${a.time.title} · ${a.time.sub.split('· ')[1] || ''}` : '—';
  $('#t-where').textContent = a.where ? a.where.title : '—';
  $('#t-bring').textContent = a.bring ? a.bring.title : '—';
  $('#t-then').textContent  = a.then  ? a.then.title  : '—';
  $('#ticket-no').textContent = 'No. ' + String(Math.floor(1000 + Math.random()*9000));
  $('#stamp').classList.remove('show');
  const calBtn = $('#btn-calendar');
  if(calBtn){
    calBtn.classList.remove('saved');
    calBtn.textContent = 'Add to calendar';
  }
  startCountdown();
}

let cdTimer = null;
function startCountdown(){
  clearInterval(cdTimer);
  const target = new Date();
  target.setDate(target.getDate() + 2);
  target.setHours(19, 0, 0, 0);
  const tick = ()=>{
    const diff = target - Date.now();
    if(diff <= 0){ $('#countdown').innerHTML = 'It\u2019s time! 💘'; clearInterval(cdTimer); return; }
    const d = Math.floor(diff / 864e5);
    const h = Math.floor(diff / 36e5) % 24;
    const m = Math.floor(diff / 6e4) % 60;
    const s = Math.floor(diff / 1e3) % 60;
    $('#countdown').innerHTML = `Starts in <b>${d}D ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}</b>`;
  };
  tick();
  cdTimer = setInterval(tick, 1000);
}

/* ---------------- calendar & save ---------------- */
function resolveDate(){
  const a = state.answers.when ? state.answers.when.title : 'Saturday';
  const now = new Date();
  const d = new Date(now);
  if(a === 'Today'){ /* keep */ }
  else if(a === 'Tomorrow') d.setDate(d.getDate() + 1);
  else if(a === 'Saturday') d.setDate(d.getDate() + ((6 - now.getDay() + 7) % 7 || 7));
  else if(a === 'Sunday') d.setDate(d.getDate() + ((0 - now.getDay() + 7) % 7 || 7));
  else if(a === 'Monday') d.setDate(d.getDate() + ((1 - now.getDay() + 7) % 7 || 7));
  else d.setDate(d.getDate() + 3);
  d.setHours(19,0,0,0);
  return d;
}

function buildCalendar(){
  const d = resolveDate();
  const y = d.getFullYear(), m = d.getMonth();
  $('#cal-month').textContent = d.toLocaleDateString('en-US', { month:'long', year:'numeric' });
  const firstDow = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m+1, 0).getDate();
  const grid = $('#calendar-grid');
  grid.innerHTML = '';
  ['S','M','T','W','T','F','S'].forEach(dow=>{
    const el = document.createElement('div');
    el.className = 'cal-dow'; el.textContent = dow;
    grid.appendChild(el);
  });
  for(let i=0;i<firstDow;i++){
    const el = document.createElement('div');
    el.className = 'cal-day empty';
    grid.appendChild(el);
  }
  for(let day=1; day<=daysInMonth; day++){
    const el = document.createElement('div');
    el.className = 'cal-day'; el.textContent = day;
    if(day === d.getDate()) el.classList.add('marked');
    grid.appendChild(el);
  }
  const nice = d.toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' });
  $('#cal-msg').innerHTML = `It\u2019s in. <b>${nice}, 7:00 pm</b>.<br/>I\u2019ll be counting down with you.`;
}

$('#btn-calendar')?.addEventListener('click', ()=> goToStep(8));

$('#btn-confirm')?.addEventListener('click', ()=>{
  state.saved = true;
  $('#stamp')?.classList.add('show');
  const btn = $('#btn-calendar');
  if(btn){
    btn.classList.add('saved');
    btn.innerHTML = '✓ In your calendar';
  }
  showToast('Saved — see you then 💘');
  burstConfetti();
  setTimeout(()=> goToStep(7), 900);
});

/* ---------------- share ---------------- */
$('#btn-share')?.addEventListener('click', async ()=>{
  const a = state.answers;
  const text = `💌 DATE PASS 💌\n`
    + `WHEN: ${a.when?.title}\nTIME: ${a.time?.title}\n`
    + `WHERE: ${a.where?.title}\nBRING: ${a.bring?.title}\n`
    + `THEN: ${a.then?.title}\n— sent with 💘`;
  try{
    if(navigator.share){
      await navigator.share({ title:'It\u2019s a date! 💘', text });
      showToast('Shared! 💌');
    }else{
      await navigator.clipboard.writeText(text);
      showToast('Copied to clipboard — send it to them 💌');
    }
  }catch(e){ /* cancelled */ }
});

function showToast(msg){
  const t = $('#toast');
  if(!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(()=> t.classList.remove('show'), 3200);
}

/* ---------------- floating hearts bg ---------------- */
const hCanvas = $('#hearts-canvas');
const hCtx = hCanvas ? hCanvas.getContext('2d') : null;
let hearts = [];
function resizeHearts(){
  if(!hCanvas) return;
  hCanvas.width = innerWidth; hCanvas.height = innerHeight;
}
if(hCanvas){
  resizeHearts();
  addEventListener('resize', resizeHearts);
}

function spawnHeart(){
  hearts.push({
    x: Math.random()*innerWidth,
    y: innerHeight + 20,
    s: 8 + Math.random()*16,
    vy: .3 + Math.random()*.7,
    vx: (Math.random()-.5)*.4,
    rot: Math.random()*Math.PI*2,
    vr: (Math.random()-.5)*.02,
    alpha: .12 + Math.random()*.25,
    hue: 335 + Math.random()*15,
  });
}
if(hCanvas){
  for(let i=0;i<26;i++){ spawnHeart(); hearts[hearts.length-1].y = Math.random()*innerHeight; }

  function drawHeart(ctx, x, y, s, rot, color, alpha){
    ctx.save();
    ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s/16, s/16);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, 5);
    ctx.bezierCurveTo(-8, -3, -4, -10, 0, -5);
    ctx.bezierCurveTo(4, -10, 8, -3, 0, 5);
    ctx.fill();
    ctx.restore();
  }

  (function loopHearts(){
    hCtx.clearRect(0,0,hCanvas.width,hCanvas.height);
    hearts.forEach(h=>{
      h.y -= h.vy; h.x += h.vx; h.rot += h.vr;
      drawHeart(hCtx, h.x, h.y, h.s, h.rot, `hsl(${h.hue} 90% 70%)`, h.alpha);
    });
    hearts = hearts.filter(h=> h.y > -40);
    if(hearts.length < 26 && Math.random() < .08) spawnHeart();
    requestAnimationFrame(loopHearts);
  })();
}

/* ---------------- mini hearts above bears ---------------- */
const miniWrap = $('#mini-hearts');
if(miniWrap){
  setInterval(()=>{
    if(state.step !== 1 || document.hidden) return;
    const h = document.createElement('span');
    h.className = 'mini-heart';
    h.textContent = ['💕','💗','💖','💝'][Math.floor(Math.random()*4)];
    h.style.left = (35 + Math.random()*30) + '%';
    miniWrap.appendChild(h);
    setTimeout(()=> h.remove(), 3600);
  }, 900);
}

/* ---------------- confetti ---------------- */
const cCanvas = $('#confetti-canvas');
const cCtx = cCanvas ? cCanvas.getContext('2d') : null;
function resizeConfetti(){ if(cCanvas){ cCanvas.width = innerWidth; cCanvas.height = innerHeight; } }
if(cCanvas){
  resizeConfetti();
  addEventListener('resize', resizeConfetti);
}

let confetti = [];
function burstConfetti(){
  if(!cCanvas) return;
  const colors = ['#ff5e8a','#ff8fb0','#ffb3c8','#ffd6e4','#ffffff','#ffe9a8'];
  for(let i=0;i<140;i++){
    confetti.push({
      x: innerWidth/2 + (Math.random()-.5)*120,
      y: innerHeight*.35,
      vx: (Math.random()-.5)*14,
      vy: -6 - Math.random()*9,
      s: 5 + Math.random()*7,
      rot: Math.random()*Math.PI*2,
      vr: (Math.random()-.5)*.3,
      color: colors[Math.floor(Math.random()*colors.length)],
      life: 1,
    });
  }
}
if(cCanvas){
  (function loopConfetti(){
    cCtx.clearRect(0,0,cCanvas.width,cCanvas.height);
    confetti.forEach(p=>{
      p.vy += .32; p.x += p.vx; p.y += p.vy;
      p.vx *= .99; p.rot += p.vr; p.life -= .006;
      cCtx.save();
      cCtx.translate(p.x, p.y); cCtx.rotate(p.rot);
      cCtx.globalAlpha = Math.max(p.life, 0);
      cCtx.fillStyle = p.color;
      cCtx.fillRect(-p.s/2, -p.s/2, p.s, p.s*.6);
      cCtx.restore();
    });
    confetti = confetti.filter(p=> p.life > 0 && p.y < innerHeight + 40);
    requestAnimationFrame(loopConfetti);
  })();
}

/* ---------------- galaxy stars ---------------- */
const sCanvas = document.getElementById('stars-canvas');
const sCtx = sCanvas ? sCanvas.getContext('2d') : null;
let stars = [];

function resizeStars(){
  if(!sCanvas) return;
  sCanvas.width = innerWidth;
  sCanvas.height = innerHeight;
  stars = [];
  const count = Math.min(220, Math.floor(innerWidth * innerHeight / 7000));
  for(let i=0;i<count;i++){
    stars.push({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      r: Math.random() * 1.3 + 0.3,
      alpha: Math.random() * 0.65 + 0.2,
      twinkle: Math.random() * Math.PI * 2,
      speed: 0.012 + Math.random() * 0.02
    });
  }
}
if(sCanvas){
  resizeStars();
  addEventListener('resize', resizeStars);
  (function loopStars(){
    sCtx.clearRect(0,0,sCanvas.width,sCanvas.height);
    stars.forEach(s=>{
      s.twinkle += s.speed;
      const a = s.alpha * (0.45 + 0.55 * Math.sin(s.twinkle));
      sCtx.beginPath();
      sCtx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      sCtx.fillStyle = `rgba(255,220,240,${a})`;
      sCtx.fill();
    });
    requestAnimationFrame(loopStars);
  })();
}

/* ---------------- romantic music (auto) ---------------- */
const music = document.getElementById('bg-music');
let musicStarted = false;

function startMusic(){
  if(!music) return;
  if(musicStarted && !music.paused) return;
  music.volume = 0.32;
  const p = music.play();
  if(p !== undefined){
    p.then(()=>{ musicStarted = true; console.log('Music playing'); }).catch(e=>{
      console.log('Autoplay blocked, waiting for interaction');
    });
  }
}

// Try as early and often as possible
document.addEventListener('DOMContentLoaded', ()=>{
  startMusic();
  setTimeout(startMusic, 300);
  setTimeout(startMusic, 800);
  setTimeout(startMusic, 1600);
});

// Any interaction starts/resumes music
['click','touchstart','keydown','pointerdown','mousemove'].forEach(ev=>{
  document.addEventListener(ev, startMusic, {passive:true});
});


/* ---------------- floating gold sparkles ---------------- */
(function(){
  const wrap = document.createElement('div');
  wrap.className = 'floating-gold';
  document.body.appendChild(wrap);
  const symbols = ['✦','✧','★','✵','✴','✨'];
  function spawn(){
    if(document.hidden) return;
    const el = document.createElement('i');
    el.textContent = symbols[Math.floor(Math.random()*symbols.length)];
    el.style.left = Math.random()*100 + '%';
    el.style.fontSize = (0.55 + Math.random()*0.9) + 'rem';
    el.style.animationDuration = (7 + Math.random()*9) + 's';
    el.style.animationDelay = Math.random()*2 + 's';
    wrap.appendChild(el);
    setTimeout(()=> el.remove(), 16000);
  }
  for(let i=0;i<8;i++) setTimeout(spawn, i*400);
  setInterval(spawn, 900);
})();

/* ---------------- init ---------------- */
updateChrome();
