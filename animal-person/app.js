// 50道题库
const allQuestions = [
  // 外向相关（1-13）
  { dim: '外向', text: '我喜欢在社交聚会中成为关注的焦点', reverse: false },
  { dim: '外向', text: '我很乐意在大众面前发表意见', reverse: false },
  { dim: '外向', text: '我认识很多人，朋友圈很广', reverse: false },
  { dim: '外向', text: '我喜欢参加各种社交活动', reverse: false },
  { dim: '外向', text: '我在陌生人面前感到舒适自在', reverse: false },
  { dim: '外向', text: '我是一个话多的人', reverse: false },
  { dim: '外向', text: '我喜欢忙碌充实的生活', reverse: false },
  { dim: '外向', text: '我喜欢冒险和刺激的经历', reverse: false },
  { dim: '外向', text: '我很少感到无聊', reverse: false },
  { dim: '外向', text: '我更喜欢在人群中而不是独处', reverse: false },
  { dim: '外向', text: '我是班级/公司中比较活跃的那个人', reverse: false },
  { dim: '外向', text: '我喜欢做令人兴奋和惊险的事情', reverse: false },
  { dim: '外向', text: '我倾向于在人群中说话很多', reverse: false },

  // 亲和相关（14-26）
  { dim: '亲和', text: '我很关心别人的感受', reverse: false },
  { dim: '亲和', text: '我喜欢帮助有困难的人', reverse: false },
  { dim: '亲和', text: '我相信人的本性是善良的', reverse: false },
  { dim: '亲和', text: '我认为维持和谐比赢得争论更重要', reverse: false },
  { dim: '亲和', text: '我对别人的困境感到同情', reverse: false },
  { dim: '亲和', text: '我容易被别人的情绪所影响', reverse: false },
  { dim: '亲和', text: '我是个善良温和的人', reverse: false },
  { dim: '亲和', text: '我更倾向于合作而不是竞争', reverse: false },
  { dim: '亲和', text: '我很容易信任别人', reverse: false },
  { dim: '亲和', text: '我不喜欢与人发生冲突', reverse: false },
  { dim: '亲和', text: '我时常为他人着想', reverse: false },
  { dim: '亲和', text: '我愿意为了维护友谊而做出妥协', reverse: false },
  { dim: '亲和', text: '我觉得帮助别人比什么都令我开心', reverse: false },

  // 情绪稳定相关（27-39）反向计分
  { dim: '情绪', text: '我经常感到焦虑或紧张', reverse: true },
  { dim: '情绪', text: '我的心情波动较大', reverse: true },
  { dim: '情绪', text: '我容易因小事而感到沮丧', reverse: true },
  { dim: '情绪', text: '我常常感到压力很大', reverse: true },
  { dim: '情绪', text: '我在压力下容易崩溃', reverse: true },
  { dim: '情绪', text: '我很容易感到害怕或不安', reverse: true },
  { dim: '情绪', text: '我经常为未来担忧', reverse: true },
  { dim: '情绪', text: '我容易发怒', reverse: true },
  { dim: '情绪', text: '我的情绪很容易受到外界影响', reverse: true },
  { dim: '情绪', text: '我经常感到沮丧或悲伤', reverse: true },
  { dim: '情绪', text: '我在遭遇失败时很难恢复', reverse: true },
  { dim: '情绪', text: '我经常感到无力感', reverse: true },
  { dim: '情绪', text: '我很容易陷入自我批评', reverse: true },

  // 开放相关（40-50）
  { dim: '开放', text: '我喜欢尝试新的事物和想法', reverse: false },
  { dim: '开放', text: '我对艺术、音乐和文学很感兴趣', reverse: false },
  { dim: '开放', text: '我喜欢从不同的角度看问题', reverse: false },
  { dim: '开放', text: '我富有想象力和创意', reverse: false },
  { dim: '开放', text: '我喜欢学习新的技能和知识', reverse: false },
  { dim: '开放', text: '我对哲学和抽象的话题感兴趣', reverse: false },
  { dim: '开放', text: '我喜欢非传统的生活方式', reverse: false },
  { dim: '开放', text: '我愿意改变自己的观点以获得新信息', reverse: false },
  { dim: '开放', text: '我对不同的文化和传统很感兴趣', reverse: false },
  { dim: '开放', text: '我喜欢在工作中有创意的自由度', reverse: false },
  { dim: '开放', text: '我常想到别人没想过的想法', reverse: false },
];

// 动物原型及emoji
const animals = {
  '猫': {
    emoji: '🐱',
    vec: [45, 55, 60, 70],
    desc: '独立、好奇、优雅。你像猫一样自信而神秘，喜欢按照自己的节奏生活，对新奇的事物充满好奇心。'
  },
  '狗': {
    emoji: '🐶',
    vec: [80, 85, 40, 55],
    desc: '忠诚、友好、热情。你像狗一样热心肠，重视友谊和陪伴，总是充满正能量，容易与他人建立深厚的联系。'
  },
  '鼠': {
    emoji: '🐭',
    vec: [60, 50, 55, 65],
    desc: '聪慧、敏锐、灵活。你像鼠一样机灵聪慧，适应能力强，具有敏锐的直觉和快速的反应能力。'
  },
  '虎': {
    emoji: '🐯',
    vec: [90, 30, 50, 70],
    desc: '勇敢、自信、有决断力。你像虎一样强大而自信，天生的领导者，行动果断，追求卓越。'
  },
  '狼': {
    emoji: '🐺',
    vec: [75, 70, 45, 50],
    desc: '团队意识强、聪慧、忠诚。你像狼一样既独立又有团队精神，既警觉又值得信赖。'
  },
  '兔子': {
    emoji: '🐰',
    vec: [40, 80, 60, 45],
    desc: '温和、敏感、亲切。你像兔子一样温柔体贴，虽然有些谨慎，但内心温暖，很容易被信任。'
  },
  '蛇': {
    emoji: '🐍',
    vec: [30, 40, 70, 80],
    desc: '神秘、洞察力强、冷静。你像蛇一样深思熟虑，观察力敏锐，具有丰富的内心世界。'
  },
  '卡皮巴拉': {
    emoji: '🦫',
    vec: [50, 90, 35, 40],
    desc: '温和、社交、从容。你像卡皮巴拉一样悠闲放松，具有独特的魅力，是天生的社交高手。'
  },
  '考拉': {
    emoji: '🐨',
    vec: [35, 65, 30, 30],
    desc: '温和、依赖、内敛。你像考拉一样喜欢安定的生活，需要有安全感和舒适的环境。'
  },
  '树懒': {
    emoji: '🦥',
    vec: [20, 50, 25, 25],
    desc: '悠闲、随和、平和。你像树懒一样淡定从容，不急不躁，享受慢节奏的生活。'
  }
};

// 全局状态
let currentQuestions = [];
let answers = {};
let currentIndex = 0;
let quizType = null;

// DOM 元素
const homeSection = document.getElementById('home');
const quizSection = document.getElementById('quiz');
const resultSection = document.getElementById('result');

const simpleBtn = document.getElementById('simpleBtn');
const fullBtn = document.getElementById('fullBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const restartBtn = document.getElementById('restartBtn');
const homeBtn = document.getElementById('homeBtn');

const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const questionTitle = document.getElementById('questionTitle');
const questionText = document.getElementById('questionText');
const answersContainer = document.getElementById('answersContainer');

const animalEmoji = document.getElementById('animalEmoji');
const animalName = document.getElementById('animalName');
const animalDesc = document.getElementById('animalDesc');
const scoresContainer = document.getElementById('scoresContainer');

// 初始化事件监听
simpleBtn.addEventListener('click', () => startQuiz('simple'));
fullBtn.addEventListener('click', () => startQuiz('full'));
prevBtn.addEventListener('click', () => navigateQuestion(-1));
nextBtn.addEventListener('click', () => navigateQuestion(1));
restartBtn.addEventListener('click', () => goHome());
homeBtn.addEventListener('click', () => goHome());

// 开始测评
function startQuiz(type) {
  quizType = type;
  const shuffled = shuffleArray([...allQuestions]);
  currentQuestions = type === 'simple' ? shuffled.slice(0, 10) : shuffled;
  answers = {};
  currentIndex = 0;
  
  switchSection('quiz');
  renderQuestion();
}

// 渲染当前题目
function renderQuestion() {
  if (currentIndex >= currentQuestions.length) {
    submitQuiz();
    return;
  }

  const q = currentQuestions[currentIndex];
  
  // 更新进度
  const progress = ((currentIndex + 1) / currentQuestions.length) * 100;
  progressFill.style.width = progress + '%';
  progressText.textContent = `第 ${currentIndex + 1} / ${currentQuestions.length} 题`;
  
  // 更新题目
  questionTitle.textContent = `题目 ${currentIndex + 1}`;
  questionText.textContent = q.text;
  
  // 渲染选项
  answersContainer.innerHTML = '';
  const options = [
    { value: 1, label: '非常不同意' },
    { value: 2, label: '不同意' },
    { value: 3, label: '中立' },
    { value: 4, label: '同意' },
    { value: 5, label: '非常同意' }
  ];
  
  options.forEach(opt => {
    const label = document.createElement('label');
    label.className = 'answer-option';
    if (answers[currentIndex] === opt.value) {
      label.classList.add('selected');
    }
    
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = `q${currentIndex}`;
    input.value = opt.value;
    input.checked = answers[currentIndex] === opt.value;
    
    input.addEventListener('change', (e) => {
      answers[currentIndex] = parseInt(e.target.value);
      document.querySelectorAll('.answer-option').forEach(l => l.classList.remove('selected'));
      label.classList.add('selected');
      updateNavButtons();
    });
    
    const span = document.createElement('span');
    span.textContent = opt.label;
    
    label.appendChild(input);
    label.appendChild(span);
    answersContainer.appendChild(label);
  });
  
  updateNavButtons();
}

// 更新导航按钮状态
function updateNavButtons() {
  prevBtn.disabled = currentIndex === 0;
  
  if (currentIndex === currentQuestions.length - 1) {
    nextBtn.textContent = '提交 ✓';
    nextBtn.disabled = !answers.hasOwnProperty(currentIndex);
  } else {
    nextBtn.textContent = '下一题 →';
    nextBtn.disabled = !answers.hasOwnProperty(currentIndex);
  }
}

// 导航题目
function navigateQuestion(direction) {
  if (direction === 1 && currentIndex === currentQuestions.length - 1 && answers.hasOwnProperty(currentIndex)) {
    submitQuiz();
  } else if (direction === 1 && answers.hasOwnProperty(currentIndex)) {
    currentIndex++;
    renderQuestion();
  } else if (direction === -1 && currentIndex > 0) {
    currentIndex--;
    renderQuestion();
  }
}

// 提交测评
function submitQuiz() {
  // 计算各维度得分
  const scores = { '外向': 0, '亲和': 0, '情绪': 0, '开放': 0 };
  const counts = { '外向': 0, '亲和': 0, '情绪': 0, '开放': 0 };
  
  currentQuestions.forEach((q, i) => {
    const answer = answers[i] || 3;
    let value = answer - 3; // -2 到 2
    
    if (q.reverse) {
      value = -value; // 反向计分
    }
    
    scores[q.dim] += value;
    counts[q.dim]++;
  });
  
  // 标准化得分到 0-100
  const normalizedScores = {};
  Object.keys(scores).forEach(dim => {
    const maxPossible = counts[dim] * 2;
    const normalized = ((scores[dim] / maxPossible + 1) / 2) * 100;
    normalizedScores[dim] = Math.max(0, Math.min(100, normalized));
  });
  
  // 找到最匹配的动物
  const userVec = [normalizedScores['外向'], normalizedScores['亲和'], normalizedScores['情绪'], normalizedScores['开放']];
  let bestAnimal = null;
  let bestDistance = Infinity;
  
  Object.keys(animals).forEach(name => {
    const distance = euclideanDistance(userVec, animals[name].vec);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestAnimal = name;
    }
  });
  
  // 显示结果
  showResult(bestAnimal, normalizedScores);
}

// 欧几里得距离
function euclideanDistance(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += (a[i] - b[i]) ** 2;
  }
  return Math.sqrt(sum);
}

// 显示结果
function showResult(animalName, scores) {
  const animal = animals[animalName];
  
  animalEmoji.textContent = animal.emoji;
  animalName.textContent = animalName;
  animalDesc.textContent = animal.desc;
  
  // 渲染得分卡片
  scoresContainer.innerHTML = '';
  Object.keys(scores).forEach(dim => {
    const card = document.createElement('div');
    card.className = 'score-card';
    card.innerHTML = `
      <div class="score-label">${dim}</div>
      <div class="score-value">${Math.round(scores[dim])}</div>
    `;
    scoresContainer.appendChild(card);
  });
  
  // 绘制雷达图
  drawRadarChart(scores);
  
  switchSection('result');
}

// 绘制雷达图
function drawRadarChart(scores) {
  const ctx = document.getElementById('radarChart').getContext('2d');
  
  // 销毁旧图表
  if (window.radarChartInstance) {
    window.radarChartInstance.destroy();
  }
  
  window.radarChartInstance = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['外向', '亲和', '情绪', '开放'],
      datasets: [{
        label: '你的评分',
        data: [scores['外向'], scores['亲和'], scores['情绪'], scores['开放']],
        borderColor: '#ff6b9d',
        backgroundColor: 'rgba(255, 107, 157, 0.2)',
        pointBackgroundColor: '#ff6b9d',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#ff6b9d',
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        r: {
          beginAtZero: true,
          min: 0,
          max: 100,
          ticks: {
            stepSize: 25,
            font: {
              size: 12
            },
            color: '#b0b8c1'
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          pointLabels: {
            font: {
              size: 14
            },
            color: '#ffffff'
          }
        }
      },
      plugins: {
        legend: {
          labels: {
            color: '#ffffff',
            font: {
              size: 12
            }
          }
        }
      }
    }
  });
}

// 切换section
function switchSection(name) {
  homeSection.classList.remove('active');
  quizSection.classList.remove('active');
  resultSection.classList.remove('active');
  
  if (name === 'home') homeSection.classList.add('active');
  else if (name === 'quiz') quizSection.classList.add('active');
  else if (name === 'result') resultSection.classList.add('active');
}

// 回到首页
function goHome() {
  currentQuestions = [];
  answers = {};
  currentIndex = 0;
  quizType = null;
  switchSection('home');
}

// 打乱数组
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// 页面加载
document.addEventListener('DOMContentLoaded', () => {
  switchSection('home');
});
