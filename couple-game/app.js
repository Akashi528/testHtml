// Enhanced 情侣心跳小游戏 - 背景音乐、关卡、分数榜与视觉特效
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const scoreEl = document.getElementById('score');
const statusEl = document.getElementById('status');
const heartPath = document.getElementById('heartPath');
const pulseLayer = document.getElementById('pulseLayer');
const confettiCanvas = document.getElementById('confetti');
const levelSelect = document.getElementById('levelSelect');
const musicToggle = document.getElementById('musicToggle');
const leaderList = document.getElementById('leaderList');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const playerNameInput = document.getElementById('playerName');

let running = false;
let score = 0;
let lastTap = {side:null, time:0};
let beatWindow = 700; // ms acceptable window for sync
let baseBeat = 700; // target beat (ms)
let beatTolerance = 180; // allowed diff
let heartScale = 1;
let confettiCtx = null;

// levels config
const LEVELS = {
  easy: { base: 800, tol: 220, threshold: 60 },
  normal: { base: 700, tol: 180, threshold: 120 },
  hard: { base: 560, tol: 120, threshold: 220 }
};

// Audio (background ambient loop)
let audioCtx = null;
let musicGain = null;
let musicOsc = null;
let musicOn = true;

function vibrate(ms){ if(navigator.vibrate) navigator.vibrate(ms) }

function resizeCanvas(){ confettiCanvas.width = innerWidth; confettiCanvas.height = innerHeight; confettiCtx = confettiCanvas.getContext('2d'); }
window.addEventListener('resize', resizeCanvas); resizeCanvas();

function press(side){
  const now = Date.now();
  if(!running) return flashStatus('先点击开始');
  // compute interval since last tap for this side (or alternating)
  const dt = now - lastTap.time;
  // if previous tap exists and was the opposite side, consider as alternation
  const isAlternating = lastTap.side && lastTap.side !== side;

  // update lastTap
  lastTap = { side, time: now };

  // evaluate rhythm: we prefer consistent intervals ~ baseBeat
  if(!isAlternating){
    // same side twice - penalize small
    score = Math.max(0, score - 1);
    pulse(-1);
    vibrate(20);
    return updateUI();
  }

  // Good: alternating
  // If dt within tolerance -> reward
  const diff = Math.abs(dt - baseBeat);
  if(diff <= beatTolerance){
    score += Math.max(1, Math.floor((beatTolerance - diff) / 40));
    pulse(1 + (beatTolerance - diff)/200);
    smallSpark();
    vibrate(30);
    if(score % 50 === 0) bigConfetti();
    // level complete check
    const lv = levelSelect.value || 'normal';
    if(score >= LEVELS[lv].threshold){
      // celebrate and increase milestone
      bigConfetti();
      flashStatus('关卡达成！你们的心更靠近了 ❤');
      vibrate([80,40,80]);
      // increase threshold to make next milestone harder
      LEVELS[lv].threshold = Math.floor(LEVELS[lv].threshold * 1.6);
    }
  } else {
    // allow adaptive: if dt similar to prior dt, slightly reward
    score = Math.max(0, score - 2);
    pulse(0.6);
    vibrate(50);
  }
  updateUI();
}

function flashStatus(txt){ statusEl.textContent = txt; setTimeout(()=> statusEl.textContent = '保持心跳同步，即可提升亲密分数 ❤', 1600) }

function updateUI(){ scoreEl.textContent = score }

function pulse(scaleFactor){ heartScale = Math.min(2, Math.max(0.6, heartScale * scaleFactor)); heartPath.style.transform = `scale(${heartScale})`; heartPath.style.filter = `drop-shadow(0 10px rgba(255,77,121,${(heartScale-1)*0.6}))`;
  // animate back
  setTimeout(()=>{ heartScale = 1; heartPath.style.transform = 'scale(1)'; heartPath.style.filter = 'none' }, 350);
}

// small spark drawing near heart for positive feedback
// Optimized particle system (pool + requestAnimationFrame)
const PREFERS_REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let particlePool = [];
let activeParticles = [];
let particleAnimId = null;
let lastFrameTime = 0;
const DPR = Math.max(1, window.devicePixelRatio || 1);

function ensureCanvasScaled(){ // set backing store size for crisp rendering and performance
  const w = Math.max(1, Math.floor(innerWidth * DPR));
  const h = Math.max(1, Math.floor(innerHeight * DPR));
  if(confettiCanvas.width !== w || confettiCanvas.height !== h){
    confettiCanvas.width = w;
    confettiCanvas.height = h;
    confettiCanvas.style.width = innerWidth + 'px';
    confettiCanvas.style.height = innerHeight + 'px';
    confettiCtx = confettiCanvas.getContext('2d');
    confettiCtx.scale(DPR, DPR);
  }
}

function createParticle(x,y,opts={}){
  const p = particlePool.pop() || {};
  p.x = x; p.y = y; p.vx = (Math.random()*2-1) * (opts.spread||6); p.vy = (Math.random()*-4-1) * (opts.upward||6);
  p.size = (opts.size|| (2+Math.random()*4));
  p.life = opts.life || (60 + Math.random()*60);
  p.ttl = p.life;
  p.color = opts.color || `hsl(${Math.floor(Math.random()*360)} 80% 60%)`;
  p.rotate = Math.random()*Math.PI*2; p.spin = (Math.random()-0.5)*0.2;
  activeParticles.push(p);
}

function spawnParticles(x,y,count,opts){ if(PREFERS_REDUCED) count = Math.min(6, count); const concurrency = navigator.hardwareConcurrency || 4; const scale = Math.max(0.5, Math.min(1.5, concurrency/4)); const max = Math.floor(200 * scale); count = Math.min(count, max); for(let i=0;i<count;i++) createParticle(x + (Math.random()-0.5)*20, y + (Math.random()-0.5)*20, opts); startParticleLoop(); }

function startParticleLoop(){ if(particleAnimId) return; lastFrameTime = performance.now(); function frame(t){ lastFrameTime = t; // update
    // clear with slight fade for trailing effect
    confettiCtx.clearRect(0,0,confettiCanvas.width/DPR, confettiCanvas.height/DPR);
    for(let i=activeParticles.length-1;i>=0;i--){ const p = activeParticles[i]; p.x += p.vx; p.y += p.vy; p.vy += 0.15; p.vx *= 0.995; p.rotate += p.spin; p.ttl--; const alpha = Math.max(0, p.ttl / p.life);
      confettiCtx.save(); confettiCtx.globalAlpha = alpha; confettiCtx.translate(p.x, p.y); confettiCtx.rotate(p.rotate); confettiCtx.fillStyle = p.color; confettiCtx.fillRect(-p.size/2, -p.size/2, p.size, p.size); confettiCtx.restore();
      if(p.ttl <= 0 || p.y > (confettiCanvas.height/DPR)+80){ particlePool.push(p); activeParticles.splice(i,1); }
    }
    if(activeParticles.length>0){ particleAnimId = requestAnimationFrame(frame); } else { particleAnimId = null; }
  }
  particleAnimId = requestAnimationFrame(frame);
}

function smallSpark(){ if(!confettiCtx) return; ensureCanvasScaled(); const x = innerWidth/2; const y = innerHeight/2; spawnParticles(x,y,12,{size:4,life:30,spread:4,upward:3}); }

function bigConfetti(){ if(!confettiCtx) return; if(PREFERS_REDUCED) { smallSpark(); return; } ensureCanvasScaled(); const x = innerWidth/2; const y = innerHeight/2; const concurrency = navigator.hardwareConcurrency || 4; const base = 120; const count = Math.floor(base * Math.min(1.5, Math.max(0.5, concurrency/4))); spawnParticles(x,y,count,{size:3+Math.random()*4,life:100,spread:10,upward:8}); }


function startGame(){ if(running) return; running = true; score = 0; lastTap = {side:null,time:0}; const lv = levelSelect.value || 'normal'; baseBeat = LEVELS[lv].base; beatTolerance = LEVELS[lv].tol; updateUI(); statusEl.textContent = '游戏开始！尽量保持稳定且交替触碰。'; vibrate([60,20,60]); }
function resetGame(){ running = false; score = 0; lastTap = {side:null,time:0}; heartPath.style.transform='scale(1)'; statusEl.textContent = '已重置，点击开始。'; updateUI(); confettiCtx && confettiCtx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height); }

// Touch / click bindings
['touchstart','mousedown'].forEach(ev => {
  leftBtn.addEventListener(ev, e=>{ e.preventDefault(); press('left') });
  rightBtn.addEventListener(ev, e=>{ e.preventDefault(); press('right') });
});

startBtn.addEventListener('click', ()=> startGame());
resetBtn.addEventListener('click', ()=> resetGame());

// Prevent accidental scrolling while touching play areas
let touchActive = false;
document.addEventListener('touchmove', e=>{ if(e.target.closest('.player')) { e.preventDefault(); } }, { passive:false });

// level and music bindings
levelSelect.addEventListener('change', ()=>{
  const lv = levelSelect.value;
  const cfg = LEVELS[lv]; baseBeat = cfg.base; beatTolerance = cfg.tol; flashStatus(`已切换为：${lv}`);
});

musicToggle.addEventListener('click', ()=>{
  musicOn = !musicOn; musicToggle.textContent = `音乐：${musicOn? '开':'关'}`; if(musicOn) startMusic(); else stopMusic();
});

saveScoreBtn.addEventListener('click', ()=>{
  const name = (playerNameInput.value || '匿名').slice(0,20);
  saveScore(name, score);
  renderLeaderboard();
  flashStatus('分数已保存');
});

// Keyboard support for desktop testing
document.addEventListener('keydown', e=>{
  if(e.key === 'a') press('left');
  if(e.key === 'l') press('right');
  if(e.key === ' ') { e.preventDefault(); startGame(); }
});

// Initialize UI hints
statusEl.textContent = '保持心跳同步，即可提升亲密分数 ❤';

// initialize audio
function initAudio(){ try{ audioCtx = new (window.AudioContext || window.webkitAudioContext)(); musicGain = audioCtx.createGain(); musicGain.gain.value = 0.06; musicGain.connect(audioCtx.destination);
  // create gentle oscillator pair
  const osc1 = audioCtx.createOscillator(); osc1.type = 'sine'; osc1.frequency.value = 220; const osc2 = audioCtx.createOscillator(); osc2.type='sine'; osc2.frequency.value = 330; const mix = audioCtx.createGain(); mix.gain.value = 0.5; osc1.connect(mix); osc2.connect(mix);
  // slow LFO for filter
  const lfo = audioCtx.createOscillator(); lfo.type='sine'; lfo.frequency.value = 0.08; const lfoGain = audioCtx.createGain(); lfoGain.gain.value = 400; lfo.connect(lfoGain);
  const filter = audioCtx.createBiquadFilter(); filter.type='lowpass'; filter.frequency.value = 800;
  lfoGain.connect(filter.frequency);
  mix.connect(filter); filter.connect(musicGain);
  osc1.start(); osc2.start(); lfo.start();
  musicOsc = { osc1, osc2, lfo, filter, mix };
}catch(e){ console.warn('Audio init failed', e) }}

function startMusic(){ if(!audioCtx) initAudio(); try{ if(audioCtx.state === 'suspended') audioCtx.resume(); musicGain && (musicGain.gain.value = 0.06); }catch(e){}
}
function stopMusic(){ if(musicGain) musicGain.gain.value = 0; }

// leaderboard (localStorage)
function loadLeaderboard(){ try{ const raw = localStorage.getItem('couple-game-leaderboard'); return raw ? JSON.parse(raw) : []; }catch(e){ return []; } }
function saveLeaderboard(list){ localStorage.setItem('couple-game-leaderboard', JSON.stringify(list)); }
function saveScore(name, value){ const list = loadLeaderboard(); list.push({name,score:value,date:Date.now()}); list.sort((a,b)=>b.score-a.score); saveLeaderboard(list.slice(0,10)); }
function renderLeaderboard(){ const list = loadLeaderboard(); leaderList.innerHTML = ''; for(const item of list){ const li = document.createElement('li'); li.textContent = `${item.name} — ${item.score}`; leaderList.appendChild(li); } if(list.length===0){ leaderList.innerHTML = '<li>尚无记录</li>' } }

renderLeaderboard();

// start music by default
initAudio(); if(musicOn) startMusic();
