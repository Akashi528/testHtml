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
function smallSpark(){ if(!confettiCtx) return; const x = confettiCanvas.width/2; const y = confettiCanvas.height/2; confettiCtx.save(); confettiCtx.fillStyle = 'rgba(255,120,160,0.9)'; for(let i=0;i<8;i++){ const r = 6+Math.random()*8; confettiCtx.beginPath(); confettiCtx.arc(x + (Math.random()-0.5)*40, y + (Math.random()-0.5)*40, r, 0, Math.PI*2); confettiCtx.fill(); } confettiCtx.restore(); setTimeout(()=>{ if(confettiCtx) confettiCtx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height) }, 300);
}

function bigConfetti(){ if(!confettiCtx) return; const pieces = []; for(let i=0;i<150;i++){ pieces.push({x:confettiCanvas.width/2, y:confettiCanvas.height/2, vx:(Math.random()-0.5)*8, vy:(Math.random()-4)*6, color:`hsl(${Math.random()*360}deg 80% 60%)`, r:2+Math.random()*4}); }
  let t = 0; const id = setInterval(()=>{ t++; confettiCtx.fillStyle='rgba(255,255,255,0.04)'; confettiCtx.fillRect(0,0,confettiCanvas.width,confettiCanvas.height); for(const p of pieces){ p.x += p.vx; p.y += p.vy; p.vy += 0.18; confettiCtx.fillStyle = p.color; confettiCtx.fillRect(p.x,p.y,p.r,p.r); } if(t>150){ clearInterval(id); confettiCtx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height); } }, 16);
}

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
