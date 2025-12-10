// 轻量级游戏逻辑：问答 + 迷你捕心
const questions = [
  {text: '周末你们更想做什么？', choices:[{t:'宅在家看电影',v:8},{t:'出去短途旅行',v:10},{t:'和朋友聚会',v:4},{t:'各自活动',v:1}]},
  {text: '如果争吵，你们通常？', choices:[{t:'先冷静再沟通',v:9},{t:'马上解决',v:8},{t:'沉默很久',v:3},{t:'求助朋友',v:2}]},
  {text: '你们的约会频率是？', choices:[{t:'每周一次',v:9},{t:'几周一次',v:6},{t:'偶尔',v:3},{t:'几乎没有',v:1}]},
  {text: '你喜欢对方的哪一点？', choices:[{t:'细心',v:9},{t:'幽默',v:8},{t:'自由',v:5},{t:'神秘',v:4}]},
  {text: '假期你们更偏向？', choices:[{t:'浪漫二人世界',v:10},{t:'结伴出游',v:7},{t:'各自安排',v:2},{t:'宅家休息',v:6}]},
  {text: '重要决定如何做？', choices:[{t:'共同讨论',v:10},{t:'一方主导',v:5},{t:'随缘',v:3},{t:'先拖延',v:1}]}
];

// DOM
const startBtn = document.getElementById('startBtn');
const howBtn = document.getElementById('howBtn');
const intro = document.getElementById('intro');
const questionCard = document.getElementById('questionCard');
const qText = document.getElementById('qText');
const choicesWrap = document.getElementById('choices');
const currentEl = document.getElementById('current');
const totalEl = document.getElementById('total');
const resultCard = document.getElementById('resultCard');
const scoreText = document.getElementById('scoreText');
const resultTitle = document.getElementById('resultTitle');
const resultMsg = document.getElementById('resultMsg');
const retryBtn = document.getElementById('retryBtn');
const shareBtn = document.getElementById('shareBtn');
const miniGame = document.getElementById('miniGame');
const playMiniBtn = document.getElementById('playMiniBtn');
const gameArea = document.getElementById('gameArea');

let state = { idx:0, score:0, miniBonus:0 };

totalEl.textContent = questions.length;

startBtn.addEventListener('click', ()=>{
  intro.classList.add('hidden');
  miniGame.classList.remove('hidden');
  questionCard.classList.remove('hidden');
  state.idx = 0; state.score = 0; state.miniBonus = 0;
  showQuestion();
});
howBtn.addEventListener('click', ()=>{
  alert('玩法：依次回答 6 个趣味问题，每题会获得不同分值；答题完成后可进行 8 秒的“捕心”挑战，捕到的小心心会为你们增加额外甜蜜分数。最终会给出甜蜜分数与等级。祝你们甜甜蜜蜜～');
});

function showQuestion(){
  const q = questions[state.idx];
  currentEl.textContent = state.idx+1;
  qText.textContent = q.text;
  choicesWrap.innerHTML = '';
  q.choices.forEach((c,i)=>{
    const btn = document.createElement('button');
    btn.className = 'choice btn';
    btn.textContent = c.t;
    btn.addEventListener('click', ()=>selectChoice(c.v, btn));
    choicesWrap.appendChild(btn);
  });
}

function selectChoice(value, btn){
  // 简单交互反馈
  btn.style.transform = 'scale(0.98)';
  setTimeout(()=>{btn.style.transform='';},160);
  state.score += value;
  state.idx++;
  if(state.idx < questions.length){
    showQuestion();
  }else{
    // 展示迷你游戏区，等待用户进行挑战
    questionCard.classList.add('hidden');
    miniGame.classList.remove('hidden');
    // 显示结果会在 mini game 完成或直接跳过时
  }
}

retryBtn.addEventListener('click', ()=>{
  resultCard.classList.add('hidden');
  intro.classList.remove('hidden');
  miniGame.classList.add('hidden');
});

shareBtn.addEventListener('click', ()=>{
  const text = `我们刚做了《情侣速配》测试，甜蜜度：${scoreText.textContent}！来一测？`;
  navigator.clipboard?.writeText(text).then(()=>{
    shareBtn.textContent = '已复制';
    setTimeout(()=>shareBtn.textContent='复制分享文案',2000);
  }).catch(()=>alert('复制失败，请手动复制：\n'+text));
});

// Mini game: spawn hearts randomly, 8s timer
let miniInterval, miniTimer;
playMiniBtn.addEventListener('click', ()=>{
  playMiniBtn.disabled = true;
  gameArea.innerHTML = '';
  let timeLeft = 8;
  state.miniBonus = 0;
  miniTimer = setInterval(()=>{
    timeLeft--;
    if(timeLeft<=0){
      clearInterval(miniTimer);
      clearInterval(miniInterval);
      endMiniGame();
    }
  },1000);
  miniInterval = setInterval(spawnHeart, 650);
});

function spawnHeart(){
  const h = document.createElement('div');
  h.className = 'heart';
  const areaW = gameArea.clientWidth, areaH = gameArea.clientHeight;
  const size = 34 + Math.random()*28; // 34-62
  h.style.width = size+'px'; h.style.height = size+'px';
  const x = Math.random()*(areaW - size);
  h.style.left = x+'px';
  h.style.top = '-60px';
  gameArea.appendChild(h);
  // fall animation
  const duration = 3500 + Math.random()*2000;
  h.animate([{transform:'translateY(0)'},{transform:`translateY(${areaH + 80}px)`}],{duration:duration, easing:'linear'});
  // remove after duration
  const removeT = setTimeout(()=>{ if(h.parentElement) h.remove(); }, duration+120);
  h.addEventListener('click', ()=>{
    state.miniBonus += Math.round(5 + Math.random()*8);
    // small pop
    const pop = document.createElement('div');
    pop.textContent = '+❤';
    pop.style.position='absolute'; pop.style.left=h.style.left; pop.style.top=h.style.top; pop.style.color='var(--accent)'; pop.style.fontWeight='800';
    gameArea.appendChild(pop);
    setTimeout(()=>pop.remove(),600);
    // remove heart and cleanup
    h.remove(); clearTimeout(removeT);
  });
}

function endMiniGame(){
  playMiniBtn.disabled = false;
  // 计算最终分数（normalize）
  const maxPossible = questions.length * 10 + 80; // approximate
  const raw = state.score + state.miniBonus;
  let percent = Math.round((raw / maxPossible) * 100);
  percent = Math.min(100, Math.max(6, percent));
  showResult(percent);
}

function showResult(percent){
  scoreText.textContent = percent + '%';
  // 圆环动画
  const circle = document.querySelector('.result-circle');
  circle.style.background = `conic-gradient(var(--accent) 0% ${percent}%, #f0f0f0 ${percent}% 100%)`;
  // 标题和消息
  if(percent >= 85){ resultTitle.textContent = '超级甜蜜 🌟'; resultMsg.textContent = '你们的默契指数非常高，继续保持这份温柔与沟通。' }
  else if(percent >= 65){ resultTitle.textContent = '甜蜜满分 💕'; resultMsg.textContent = '你们很合拍，偶尔制造惊喜会更好。' }
  else if(percent >= 40){ resultTitle.textContent = '有点小磕绊 💌'; resultMsg.textContent = '沟通和陪伴会显著提升你们的亲密度。' }
  else{ resultTitle.textContent = '需要加油 😅'; resultMsg.textContent = '别担心，从一起做一件小事开始，慢慢培养默契。' }

  // 展示结果区
  miniGame.classList.add('hidden');
  resultCard.classList.remove('hidden');
  // 小型 confetti hearts
  confettiHearts(percent);
}

function confettiHearts(score){
  const count = 8 + Math.floor(score/12);
  for(let i=0;i<count;i++){ setTimeout(()=>{
    const c = document.createElement('div');
    c.className='heart';
    c.style.width='22px'; c.style.height='22px';
    c.style.left = (40 + Math.random()*60) + '%';
    c.style.top = '60%';
    c.style.opacity = 0.95;
    document.body.appendChild(c);
    c.animate([{transform:'translateY(0) scale(0.8)',opacity:1},{transform:'translateY(-260px) scale(1.1)',opacity:0}],{duration:1600+Math.random()*700, easing:'cubic-bezier(.2,.6,.2,1)'});
    setTimeout(()=>c.remove(),2200);
  }, i*120)}
}

// quick resize handler to keep gameArea sized
window.addEventListener('resize', ()=>{});

// graceful: if user skips mini game (never played) allow direct result via timeout
setInterval(()=>{
  if(!intro.classList.contains('hidden') || questionCard.classList.contains('hidden')) return;
  // if user lingered on last question and didn't play mini game for 12s, auto-show result
  if(state.idx >= questions.length){
    // small guard
    if(!miniGame.classList.contains('hidden') && !resultCard.classList.contains('hidden')) return;
  }
},3000);
