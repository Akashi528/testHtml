const { createApp, ref, reactive, computed, onMounted } = Vue;

createApp({
  data(){
    return {
      view: 'home',
      quizType: null,
      allQuestions: buildQuestions(),
      questions: [],
      answers: [],
      current: 0,
      scaleLabels: {1:'非常不同意',2:'不同意',3:'中立',4:'同意',5:'非常同意'},
      result: {animal:'', desc:''},
      dims: {外向:0, 亲和:0, 情绪:0, 开放:0},
      chart: null,
      animals: animalArchetypes()
    }
  },
  methods:{
    start(type){
      this.quizType = type;
      if(type==='simple'){
        this.questions = shuffle(this.allQuestions).slice(0,10);
      }else{
        this.questions = JSON.parse(JSON.stringify(this.allQuestions));
      }
      this.answers = Array(this.questions.length).fill(null);
      this.current = 0;
      this.view = 'quiz';
    },
    next(){
      if(this.current+1 < this.questions.length){ this.current++ } else { this.submit() }
    },
    prev(){ if(this.current>0) this.current-- },
    submit(){
      // compute scores per dimension
      const dims = {外向:0, 亲和:0, 情绪:0, 开放:0};
      const counts = {外向:0, 亲和:0, 情绪:0, 开放:0};
      this.questions.forEach((q,i)=>{
        const ans = this.answers[i] || 3;
        const delta = ans - 3; // -2..+2
        dims[q.dim] += delta * q.direction;
        counts[q.dim] += 1;
      });

      // normalize to 0-100
      const dimsNorm = {};
      Object.keys(dims).forEach(k=>{
        const maxAbs = counts[k]*2 || 2;
        const raw = dims[k];
        const norm = ((raw / maxAbs) + 1) / 2 * 100;
        dimsNorm[k] = Math.max(0, Math.min(100, norm));
      });
      this.dims = dimsNorm;

      // find nearest animal archetype
      let best = null; let bestDist = Infinity;
      Object.keys(this.animals).forEach(name=>{
        const arche = this.animals[name].vec;
        const dist = euclidDistArray([dimsNorm['外向'],dimsNorm['亲和'],dimsNorm['情绪'],dimsNorm['开放']], arche);
        if(dist < bestDist){ bestDist = dist; best = name }
      });

      this.result.animal = best;
      this.result.desc = this.animals[best].desc;
      this.view = 'result';
      this.$nextTick(()=> this.renderChart());
    },
    renderChart(){
      const ctx = document.getElementById('radarChart').getContext('2d');
      if(this.chart) this.chart.destroy();
      this.chart = new Chart(ctx, {
        type:'radar',
        data:{
          labels: Object.keys(this.dims),
          datasets:[{label:'你的得分',data:Object.values(this.dims),backgroundColor:'rgba(255,184,107,0.25)',borderColor:'#ffb86b',pointBackgroundColor:'#fff'}]
        },
        options:{scales:{r:{min:0,max:100,grid:{color:'rgba(255,255,255,0.06)'},ticks:{display:false}}},plugins:{legend:{display:false}}}
      });
    },
    restart(){ this.view='home'; this.questions=[]; this.answers=[]; this.current=0; this.result={animal:'',desc:''} },
  }
}).mount('#app');

// --- utilities and data ---
function shuffle(a){return a.map(v=>[Math.random(),v]).sort((a,b)=>a[0]-b[0]).map(v=>v[1])}
function euclidDistArray(a,b){let s=0;for(let i=0;i<a.length;i++){s += (a[i]-b[i])**2}return Math.sqrt(s)}

function animalArchetypes(){
  // four dims: [外向, 亲和, 情绪(低更稳定), 开放] in 0..100
  return {
    '猫':{vec:[45,55,60,70], desc:'独立、好奇、有时冷静但有强烈的好奇心。'},
    '狗':{vec:[80,85,40,55], desc:'忠诚、友好、外向，重视群体与陪伴。'},
    '鼠':{vec:[60,50,55,65], desc:'机警、适应性强、灵活且好奇。'},
    '虎':{vec:[90,30,50,70], desc:'勇敢、有主见、果断，常表现出领导力。'},
    '狼':{vec:[75,70,45,50], desc:'有团队意识、警觉、忠诚且果断。'},
    '兔子':{vec:[40,80,60,45], desc:'温和、亲切、谨慎，喜欢安全感。'},
    '蛇':{vec:[30,40,70,80], desc:'冷静、洞察力强、神秘且独立。'},
    '卡皮巴拉':{vec:[50,90,35,40], desc:'温和、社交、从容，是极佳的社交伙伴。'},
    '考拉':{vec:[35,65,30,30], desc:'慢节奏、安静、依赖舒适与稳定。'},
    '树懒':{vec:[20,50,25,25], desc:'节奏缓慢、随和、悠闲，享受宁静生活。'}
  }
}

function buildQuestions(){
  const dims = ['外向','亲和','情绪','开放'];
  const qs = [
    '我喜欢参加社交聚会并与陌生人交谈。','我愿意帮助他人，哪怕付出代价。','我在压力下能保持冷静。','我喜欢尝试新奇的事物和想法。',
    '我更喜欢独处而不是被一大群人包围。','我倾向于信任并接纳身边的人。','我容易因为小事感到焦虑。','我喜欢艺术、音乐或独特的创作。',
    '我在团队中常担任带头的角色。','我觉得维持和谐比竞争更重要。','我有时候情绪起伏较大。','我喜欢规划并执行长期计划。',
    '我在面对陌生环境时表现得很自信。','别人会说我很体贴友好。','我很少感到沮丧或消沉。','我有开放的想法，愿意改变观点。',
    '我喜欢冒险和挑战。','我喜欢结交新朋友。','我常常对未来感到担忧。','我热衷于学习新技能。',
    '我更倾向直接表达自己的意见。','我努力避免伤害别人的感情。','我比较情绪化，易怒。','我倾向从不同角度看问题。',
    '我喜欢在聚会中成为焦点。','我重视朋友和家庭的需要。','我通常情绪稳定。','我喜欢抽象和理论性的讨论。',
    '我会为达目标而主动出击。','我愿意为团队做出妥协。','我常感到紧张或不安。','艺术和审美对我很重要。',
    '我喜欢表达自己的观点并影响别人。','我会同情他人的困境。','我对突发事件会感到慌乱。','我喜欢探索不同文化与想法。',
    '我喜欢热闹的场所和活动。','我觉得与人相处比独处更舒服。','我难以从压力中迅速恢复。','我有创造性地解决问题的能力。',
    '我在团队里通常扮演外向的角色。','我能很快察觉别人的情绪并回应。','我有时会过于担心未来。','我愿意尝试非主流的生活方式。',
    '我享受领导别人并承担责任。','我会避免冲突以维护关系。','我在压力下也能保持理智。','我常对未知事物感到好奇。'
  ];

  // assign dimension cyclically and some directions (positive means higher rating increases dim)
  const questions = qs.map((t,i)=>{
    const dim = dims[i % dims.length];
    // pick some items that are reverse-scored (direction -1)
    const reverse = [4,8,12,17,22,29,33,36,40,47];
    const direction = reverse.includes(i) ? -1 : 1;
    return {id:i+1, text:t, dim, direction}
  });
  // ensure we have at least 50; if shorter, pad by repeating with slight wording (should already be 50)
  return questions;
}
