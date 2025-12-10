// 童年心理创伤测评 - 8 维度，80 题（简易20题）
// 维度：安全感、情绪调节、人际关系、自尊、信任、控制感、回避倾向、归属感

const DIMENSIONS = ['安全感','情绪调节','人际关系','自尊','信任','控制感','回避倾向','归属感'];

// 生成题目（示例题库）
const QUESTIONS = [
  // 1-10 安全感
  {dim:'安全感', text:'我在成长过程中常感觉自己得不到基本的安全保障。', rev:true},
  {dim:'安全感', text:'我常害怕家里的情况会突然变坏。', rev:true},
  {dim:'安全感', text:'我觉得小时候很少有人能够稳定照顾我。', rev:true},
  {dim:'安全感', text:'成长时家庭环境让我感到不安或恐惧。', rev:true},
  {dim:'安全感', text:'我小时候常缺乏基本的生活保障。', rev:true},
  {dim:'安全感', text:'我经常回忆起小时候害怕的情景。', rev:true},
  {dim:'安全感', text:'我小时候常被忽视或无人问津。', rev:true},
  {dim:'安全感', text:'我觉得自己小时候没有依靠的成年人。', rev:true},
  {dim:'安全感', text:'我小时候感到不被保护或支持。', rev:true},
  {dim:'安全感', text:'家庭氛围让我常感不安。', rev:true},
  // 11-20 情绪调节
  {dim:'情绪调节', text:'我小时候常被责骂，导致我很难控制情绪。', rev:true},
  {dim:'情绪调节', text:'我在童年时常感到情绪失控或极端反应。', rev:true},
  {dim:'情绪调节', text:'成长时没人教我如何健康表达情绪。', rev:true},
  {dim:'情绪调节', text:'我小时候常被批评情绪化，因此学会压抑感受。', rev:true},
  {dim:'情绪调节', text:'我小时候的经历让我现在情绪容易波动。', rev:true},
  {dim:'情绪调节', text:'我常因为过去经历而感到愤怒或悲伤。', rev:true},
  {dim:'情绪调节', text:'我小时候缺少可以倾诉情绪的人。', rev:true},
  {dim:'情绪调节', text:'童年经历使我对情绪反应感到困惑。', rev:true},
  {dim:'情绪调节', text:'我有时会因为过去的事而情绪失控。', rev:true},
  {dim:'情绪调节', text:'我小时候很少学到情绪调节的方法。', rev:true},
  // 21-30 人际关系
  {dim:'人际关系', text:'我小时候家人之间常有冲突，影响了我对亲密的信任。', rev:true},
  {dim:'人际关系', text:'我觉得自己在童年时期难以与同龄人建立稳定关系。', rev:true},
  {dim:'人际关系', text:'我小时候常被同伴排斥或欺负。', rev:true},
  {dim:'人际关系', text:'我小时候缺少情感上的依恋关系。', rev:true},
  {dim:'人际关系', text:'我很少感到有人真正理解我。', rev:true},
  {dim:'人际关系', text:'童年经验让我难以亲密地信任他人。', rev:true},
  {dim:'人际关系', text:'我在童年时常觉得孤单无援。', rev:true},
  {dim:'人际关系', text:'我很难表达自己对别人的需要。', rev:true},
  {dim:'人际关系', text:'我小时候缺少正面的社交示范。', rev:true},
  {dim:'人际关系', text:'童年经历使我在人际互动中感到紧张。', rev:true},
  // 31-40 自尊
  {dim:'自尊', text:'我小时候常被贬低或羞辱。', rev:true},
  {dim:'自尊', text:'别人经常批评我，使我觉得不够好。', rev:true},
  {dim:'自尊', text:'我小时候常被比较，总觉得不如别人。', rev:true},
  {dim:'自尊', text:'成长经历让我怀疑自己的价值。', rev:true},
  {dim:'自尊', text:'我经常感到自卑或羞愧。', rev:true},
  {dim:'自尊', text:'童年时的评价让我难以接纳自己。', rev:true},
  {dim:'自尊', text:'我小时候很少得到鼓励或肯定。', rev:true},
  {dim:'自尊', text:'我觉得自己不配被爱或被关心。', rev:true},
  {dim:'自尊', text:'童年经验影响了我对自我的看法。', rev:true},
  {dim:'自尊', text:'我常因为过去而怀疑自己的能力。', rev:true},
  // 41-50 信任
  {dim:'信任', text:'我小时候常见到承诺被打破，难以信任他人。', rev:true},
  {dim:'信任', text:'我不容易向人敞开心扉。', rev:true},
  {dim:'信任', text:'我怕被人背叛或抛弃。', rev:true},
  {dim:'信任', text:'我常怀疑别人对我的动机。', rev:true},
  {dim:'信任', text:'童年经历让我很难与人建立长期信任。', rev:true},
  {dim:'信任', text:'我倾向于隐瞒自己的真实想法，怕被利用。', rev:true},
  {dim:'信任', text:'我对亲近关系总有防备心理。', rev:true},
  {dim:'信任', text:'我不轻易依赖他人。', rev:true},
  {dim:'信任', text:'我常担心他人会伤害我。', rev:true},
  {dim:'信任', text:'过去的经历让我对亲密关系保持距感。', rev:true},
  // 51-60 控制感
  {dim:'控制感', text:'我童年时常感到生活失控，没有选择权。', rev:true},
  {dim:'控制感', text:'我曾被迫接受我不愿意的决定。', rev:true},
  {dim:'控制感', text:'我在成长过程中体验到权力不对等。', rev:true},
  {dim:'控制感', text:'我常觉得自己无法掌控环境变化。', rev:true},
  {dim:'控制感', text:'过去的经历让我害怕失去掌控。', rev:true},
  {dim:'控制感', text:'我小时候缺少对自己生活的选择权。', rev:true},
  {dim:'控制感', text:'我容易感觉被别人支配或控制。', rev:true},
  {dim:'控制感', text:'童年经历让我对权威感到恐惧或反感。', rev:true},
  {dim:'控制感', text:'我在决定重要事情时常犹豫不决。', rev:true},
  {dim:'控制感', text:'我害怕失去对重要关系的掌控。', rev:true},
  // 61-70 回避倾向
  {dim:'回避倾向', text:'我倾向于回避与创伤相关的话题或情绪。', rev:false},
  {dim:'回避倾向', text:'我会避免接近让我想起不愉快经历的人或地点。', rev:false},
  {dim:'回避倾向', text:'我常用工作或娱乐来逃避内心的痛苦。', rev:false},
  {dim:'回避倾向', text:'我很少回想童年经历，尽量不去想。', rev:false},
  {dim:'回避倾向', text:'我避免谈论过去的个人经历。', rev:false},
  {dim:'回避倾向', text:'我会通过麻醉性行为（如暴饮、过度游戏）来忘却不愉快', rev:false},
  {dim:'回避倾向', text:'我常选择保持距离而不是面对冲突。', rev:false},
  {dim:'回避倾向', text:'我很难直面自己的负面感受。', rev:false},
  {dim:'回避倾向', text:'我对心理帮助持回避态度，宁愿独自应对。', rev:false},
  {dim:'回避倾向', text:'我经常压抑不舒服的记忆以继续生活。', rev:false},
  // 71-80 归属感
  {dim:'归属感', text:'我小时候常觉得自己不被家庭接纳。', rev:true},
  {dim:'归属感', text:'我很少感到有属于自己的安全社群。', rev:true},
  {dim:'归属感', text:'我觉得自己在家中没有重要地位。', rev:true},
  {dim:'归属感', text:'我常感到被排斥或边缘化。', rev:true},
  {dim:'归属感', text:'童年时期使我对社群感到疏离。', rev:true},
  {dim:'归属感', text:'我难以感受到长期的归属感。', rev:true},
  {dim:'归属感', text:'我小时候常被家庭或群体忽视。', rev:true},
  {dim:'归属感', text:'我曾被明确告知我不属于某个群体。', rev:true},
  {dim:'归属感', text:'我在成长过程中常感到孤立。', rev:true},
  {dim:'归属感', text:'我小时候缺少被接纳的经历。', rev:true},
];

// DOM
const home = document.getElementById('home');
const quiz = document.getElementById('quiz');
const result = document.getElementById('result');
const simpleBtn = document.getElementById('simple');
const fullBtn = document.getElementById('full');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const retryBtn = document.getElementById('retry');
const homeBtn = document.getElementById('homeBtn');
const qtext = document.getElementById('qtext');
const qidx = document.getElementById('qidx');
const cur = document.getElementById('cur');
const total = document.getElementById('total');
const answersEl = document.getElementById('answers');
const levelText = document.getElementById('levelText');
const adviceEl = document.getElementById('advice');
const dimList = document.getElementById('dimList');

let currentSet = [];
let answers = [];
let idx = 0;
let chartInstance = null;

simpleBtn.addEventListener('click', ()=>start('simple'));
fullBtn.addEventListener('click', ()=>start('full'));
prevBtn.addEventListener('click', ()=>goto(idx-1));
nextBtn.addEventListener('click', ()=>{ if(idx===currentSet.length-1) submit(); else goto(idx+1); });
retryBtn?.addEventListener('click', ()=>start('full'));
homeBtn?.addEventListener('click', ()=>show('home'));

function start(type){
  answers = Array( type==='simple' ? 20 : 80 ).fill(null);
  currentSet = shuffle(QUESTIONS).slice(0, type==='simple'?20:80);
  idx = 0;
  total.textContent = currentSet.length;
  show('quiz');
  render();
}

function render(){
  cur.textContent = idx+1;
  qidx.textContent = idx+1;
  qtext.textContent = currentSet[idx].text;
  answersEl.innerHTML = '';
  const scale = [1,2,3,4,5];
  const labels = ['非常不同意','不同意','中立','同意','非常同意'];
  scale.forEach((v,i)=>{
    const lbl = document.createElement('label');
    lbl.className = 'choice';
    if(answers[idx]===v) lbl.classList.add('selected');
    const input = document.createElement('input');
    input.type='radio'; input.name='a'; input.value=v;
    input.checked = answers[idx]===v;
    input.addEventListener('change', ()=>{ answers[idx]=v; updateNav(); });
    const span = document.createElement('span'); span.className='scale'; span.textContent = v;
    const small = document.createElement('small'); small.className='scale-desc'; small.textContent = labels[i];
    lbl.appendChild(input); lbl.appendChild(span); lbl.appendChild(small);
    answersEl.appendChild(lbl);
  });
  updateNav();
}

function updateNav(){
  prevBtn.disabled = idx===0;
  nextBtn.disabled = answers[idx]==null;
  if(idx===currentSet.length-1) nextBtn.textContent='提交'; else nextBtn.textContent='下一题';
}

function goto(i){
  if(i<0) i=0; if(i>=currentSet.length) i=currentSet.length-1; idx=i; render();
}

function submit(){
  // 计算各维度得分
  const sums = {};
  const counts = {};
  DIMENSIONS.forEach(d=>{sums[d]=0;counts[d]=0});
  currentSet.forEach((q,i)=>{
    const ans = answers[i]||3; // default 中立
    let val = ans - 3; // -2..+2
    // 如果题目是反向（rev=true）则反向计分
    if(q.rev) val = -val;
    sums[q.dim] += val;
    counts[q.dim]++;
  });
  // 归一化到0-100（负为低，正为高）
  const norm = {};
  DIMENSIONS.forEach(d=>{
    const max = counts[d]*2 || 2;
    const v = sums[d];
    const n = ((v / max) + 1)/2 * 100; // map -max..+max -> 0..100
    norm[d] = Math.round(Math.max(0,Math.min(100,n)));
  });

  // 综合创伤强度指标：以安全感、情绪、自尊、信任、归属感 5 项的低分为主要指标
  const vulnerability = (100 - norm['安全感']) + (100 - norm['情绪调节']) + (100 - norm['自尊']) + (100 - norm['信任']) + (100 - norm['归属感']);
  const vulnAvg = vulnerability / 5; // 0..100 higher means more vulnerable
  let level = '';
  if(vulnAvg < 25) level = '低（轻微或无显著创伤）';
  else if(vulnAvg < 55) level = '中（中度创伤倾向）';
  else level = '高（较高创伤负担，建议专业支持）';

  // 建议：基于每个维度的分数给出简短建议
  const suggestions = generateSuggestions(norm);

  // 显示
  levelText.textContent = `你的童年创伤程度：${level}`;
  adviceEl.innerHTML = suggestions.overall + '<br><br>' + suggestions.byDim.join('<br>');

  // 展示维度卡片
  dimList.innerHTML = '';
  DIMENSIONS.forEach(d=>{
    const card = document.createElement('div'); card.className='dim-card';
    card.innerHTML = `<div class="dim-label">${d}</div><div class="dim-value">${norm[d]}</div>`;
    dimList.appendChild(card);
  });

  // 绘图
  drawRadar(norm);
  show('result');
}

function generateSuggestions(norm){
  const overall = '建议：如果你在测评中得出中高风险，建议寻求专业心理咨询或治疗；同时可尝试以下自助策略。';
  const byDim = [];
  DIMENSIONS.forEach(d=>{
    const v = norm[d];
    let tip = '';
    if(d==='安全感'){
      tip = v<50? '安全感偏低：尝试建立稳定的日常规律，寻找信任的支持网络，小步骤建立可控感。' : '安全感较好：保持稳定的支持与边界感。';
    }else if(d==='情绪调节'){
      tip = v<50? '情绪调节较弱：尝试情绪觉察练习、呼吸与正念练习，必要时寻求专业技能训练（如DBT）。' : '情绪调节良好：继续练习情绪识别与健康表达。';
    }else if(d==='人际关系'){
      tip = v<50? '人际关系受影响：逐步练习信任与表达需要，尝试小范围建立稳定关系或参与团体疗愈。' : '人际关系较好：维护并扩大健康的人际支持。';
    }else if(d==='自尊'){
      tip = v<50? '自尊较低：使用自我肯定练习、记录成就，考虑认知疗法重塑自我评价。' : '自尊较好：继续积累正向自我体验。';
    }else if(d==='信任'){
      tip = v<50? '信任困难：在安全环境下逐步练习暴露与建立小范围信任关系。' : '信任度较好：继续保持适度开放与界限。';
    }else if(d==='控制感'){
      tip = v<50? '控制感较弱：通过设定小目标与可控任务恢复自主感，练习决策小步骤。' : '控制感良好：保持计划与目标管理。';
    }else if(d==='回避倾向'){
      tip = v>60? '回避倾向较强：注意避免长期回避情绪，尝试在安全支持下逐步面对并处理记忆与情绪。' : '回避倾向较低：有利于正面处理经历，但注意节奏与情绪支持。';
    }else if(d==='归属感'){
      tip = v<50? '归属感较弱：可尝试加入支持性团体或兴趣小组，建立属于自己的社群感。' : '归属感良好：继续维护亲密与群体联系。';
    }
    byDim.push(`<strong>${d}:</strong> ${tip}`);
  });
  return {overall, byDim};
}

function drawRadar(norm){
  const ctx = document.getElementById('radar').getContext('2d');
  if(chartInstance) chartInstance.destroy();
  chartInstance = new Chart(ctx, {
    type:'radar',
    data:{
      labels: DIMENSIONS,
      datasets:[{label:'得分',data:DIMENSIONS.map(d=>norm[d]),backgroundColor:'rgba(255,138,101,0.25)',borderColor:'#ff8a65',pointBackgroundColor:'#fff'}]
    },
    options:{scales:{r:{min:0,max:100,ticks:{display:false},grid:{color:'rgba(255,255,255,0.06)'}}},plugins:{legend:{display:false}}}
  });
}

function show(name){
  home.classList.remove('active'); quiz.classList.remove('active'); result.classList.remove('active');
  if(name==='home') home.classList.add('active');
  if(name==='quiz') quiz.classList.add('active');
  if(name==='result') result.classList.add('active');
}

function shuffle(array){
  const a = array.slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]} return a;
}

// 初始化
document.addEventListener('DOMContentLoaded', ()=>{ show('home'); });
