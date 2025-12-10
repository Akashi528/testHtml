// app.js - 性压抑自评交互逻辑
const questions = [
  "我在公开场合很少或不会谈论性或与性有关的话题。",
  "当想到性相关内容时，我会感到尴尬或不自在。",
  "即使内心有好奇，我也不愿意在伴侣面前表达。",
  "我会避免看带有轻度性感的影视或艺术作品。",
  "关于自己的性取向或喜好，我愿意与他人分享的很少。",
  "我在青春期时对性好奇但没有办法表达出来。",
  "我常常否认自己对某些异性/同性产生过兴趣。",
  "与伴侣亲近时我会控制自己的身体反应。",
  "我担心暴露真实的性偏好会被取笑或排斥。",
  "我倾向于把与性有关的话题视为羞耻的事。",
  "我很少主动接触有关性健康的知识或资源。",
  "我曾因道德或社会眼光而压抑自己的欲望。",
  "我在与他人建立亲密关系时会退缩。",
  "我会觉得谈论爱与性的界线难以讨论。",
  "我避免在恋爱中主动表达想要更亲密的需求。",
  "当他人谈到性感装扮时，我会感到不自在。",
  "我对身体的自然性感征兆感到羞耻。",
  "我在恋爱关系中更愿意扮演被动的一方以免暴露真实想法。",
  "我会隐藏自己在独处时的性幻想或想法。",
  "我认为表现出性欲会让自己显得廉价。",
  "我很少主动寻求性教育或咨询的帮助。",
  "我会避免与朋友讨论两性或性经历。",
  "我担心自己的某些欲望不被社会接受。",
  "我曾因为羞耻感拒绝过自我探索。",
  "我会本能地避开可能引起性兴奋的画面或情境。",
  "我常觉得控制性欲是一种责任。",
  "我在暗示喜好时更喜欢使用模糊或含蓄的表达。",
  "我会避免穿着可能显得有魅力的服饰。",
  "即使兴趣存在，我也少谈及有关性的书籍或艺术。",
  "我会因为害怕被评判而隐藏自己的亲密史。",
  "我倾向于把性需求看作次要或不重要的事情。",
  "我在关系中不愿意讨论节奏或偏好。",
  "我对自己身体的性感部分有回避或否认情绪。",
  "我会在亲密时刻刻意降低自己的情绪反应。",
  "我会因为文化或家庭价值观而压抑性表达。",
  "我不喜欢被别人评论我的吸引力或性感程度。",
  "我很少表达被吸引时的明显暗示。",
  "我会让自己显得对恋爱里的身体接触不那么热衷。",
  "我避免观看包含暧昧或轻度挑逗的内容。",
  "我在恋爱中的需求更偏向情感层面而非身体。",
  "我会对自己的某些欲望感到道德上的不安。",
  "我会以保持体面为由压抑自己的欲望。",
  "当被问及性喜好时，我通常回避或轻描淡写。",
  "我不愿意让伴侣看到我的脆弱或好奇心。",
  "在两性话题上，我倾向于使用保守的说法。",
  "我会觉得公开恋爱中的某些举动是应当避免的。",
  "我在亲密关系中容易退缩并保持距离。",
  "我有时会因为内疚而压抑自己的想象。",
  "我会因为担心影响形象而避免某些亲密互动。",
  "我在公共场合会刻意保持力所能及的端庄。",
  "我觉得表达性欲会让人觉得我不够成熟。",
  "我不常阅读或关注与性健康有关的内容。",
  "我曾为压抑欲望而感到长期沮丧或焦虑。",
  "我在恋爱中难以直接提出亲密需求。",
  "我对性感幽默或双关语感到不舒服。",
  "我对自己的身体曲线或魅力感到害羞。",
  "我倾向于压抑突如其来的情感与欲望。",
  "我在与伴侣的沟通中避免谈论幻想或渴望。",
  "我不想让他人知道我偶尔的亲密想法。",
  "我会在心里批判自己的某些冲动。",
  "我经常把性的需要归类为私密到不能谈。",
  "我会认为性表达应当严格控制在特定情境。",
  "我在伴侣面前会较少展示热情或直接的吸引。",
  "我担心提及性会引发尴尬场面。",
  "我会避免那些让我回忆起性冲动的歌曲或图像。",
  "我觉得自己在这方面的好奇心不被允许。",
  "我在关系里更多从理性而非感性出发。",
  "我因压抑而产生过睡眠或情绪问题。",
  "我在沟通亲密边界时感到不自在。",
  "我害怕因表达吸引力而失去尊重。",
  "即使独处时，我也避免有过于亲密的想法。",
  "我会把有关性的好奇隐藏成对艺术或美学的兴趣。",
  "我很少尝试与伴侣共同探索新的亲密方式。",
  "我会觉得向他人求助关于性的事是羞耻的。",
  "我在亲密关系中的表达常常显得被动或冷静。",
  "我曾因压抑欲望而影响过日常生活的专注。"
];

// 状态
let current = 0;
const answers = new Array(questions.length).fill(null);

// DOM
const qIndex = document.getElementById('q-index');
const questionText = document.getElementById('question-text');
const barFill = document.getElementById('bar-fill');
const choices = document.querySelectorAll('.choice');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const resultPage = document.getElementById('result-page');
const questionPage = document.getElementById('question-page');
const resultSummary = document.getElementById('result-summary');
const resultAdvice = document.getElementById('result-advice');
const retakeBtn = document.getElementById('retake');
const downloadBtn = document.getElementById('download');

function render(){
  qIndex.textContent = (current+1) + '';
  questionText.textContent = questions[current];
  barFill.style.width = ((current)/ (questions.length-1))*100 + '%';
  // 高亮已选
  choices.forEach(c=>{
    c.classList.remove('selected');
    const v = Number(c.dataset.value);
    if(answers[current] === v){ c.classList.add('selected'); }
  });
  prevBtn.disabled = current === 0;
  nextBtn.textContent = current === questions.length-1 ? '提交' : '下一题';
}

choices.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const val = Number(btn.dataset.value);
    answers[current]=val;
    // 动画微交互
    btn.classList.add('selected');
    setTimeout(()=>btn.classList.remove('selected'),160);
    // 自动前进（可改）
    if(current < questions.length-1){
      current++;
      render();
    } else {
      showResult();
    }
  });
});

prevBtn.addEventListener('click', ()=>{ if(current>0){current--;render();}});
nextBtn.addEventListener('click', ()=>{
  if(current < questions.length-1){ current++; render(); }
  else { showResult(); }
});

function showResult(){
  // 若有未答题，提示并跳到第一道未答题
  const missing = answers.findIndex(a=>a===null);
  if(missing !== -1){
    current = missing;
    render();
    alert('您还有未作答的题目。已跳转到未答题。');
    return;
  }

  const total = answers.reduce((s,v)=>s+v,0);
  // 评分解释（0~320）
  let level = '';
  if(total <= 80){ level = '低度压抑：对性的抑制较少，表达较为自然。'; }
  else if(total <= 160){ level = '中度压抑：偶有压抑或回避倾向，适当的自我觉察与沟通可帮助改善。'; }
  else if(total <= 240){ level = '显著压抑：存在较明显的压抑或否认，可能影响亲密关系与情绪。建议寻求专业帮助或进行自我探索练习。'; }
  else { level = '高度压抑：长期压抑可能影响日常功能或情绪稳定，建议尽早与心理/咨询专业人士沟通。'; }

  questionPage.classList.add('hidden');
  resultPage.classList.remove('hidden');
  resultSummary.innerHTML = `<strong>得分：</strong>${total} / ${questions.length*4}<br><em>${level}</em>`;
  resultAdvice.innerHTML = `建议：<ul><li>接纳自己的好奇与感受，避免自责。</li><li>尝试安全的自我教育（性健康、界限与沟通技巧）。li><li>在关系中以诚实但温和的方式表达需求，逐步尝试沟通。</li><li>如情绪困扰明显，考虑向专业心理咨询师求助。</li></ul>`;
}

retakeBtn.addEventListener('click', ()=>{
  answers.fill(null);
  current=0;
  resultPage.classList.add('hidden');
  questionPage.classList.remove('hidden');
  render();
});

downloadBtn.addEventListener('click', ()=>{
  const payload = {date:new Date().toISOString(), score:answers.reduce((s,v)=>s+v,0), answers};
  const blob = new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download='sex-suppression-result.json'; a.click(); URL.revokeObjectURL(url);
});

// 初始化
render();
