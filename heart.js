(function(){
  const form = document.getElementById('quizForm');
  const resultSec = document.getElementById('result');
  const summary = document.getElementById('summary');
  const advice = document.getElementById('advice');
  const printBtn = document.getElementById('printBtn');
  const copyBtn = document.getElementById('copyBtn');
  const resetBtn = document.getElementById('resetBtn');

  function classify(score){
    if(score <= 20) return '良好';
    if(score <= 30) return '轻度问题';
    if(score <= 45) return '中度困扰';
    return '重度问题或高风险';
  }

  function getAdvice(score, highRisk){
    if(highRisk){
      return `紧急建议：你的回答显示存在自伤/自杀相关想法或高风险。请立即与可信任的人在场并联系当地紧急服务或心理危机干预热线。若在中国大陆，去最近医院急诊或拨打当地心理援助热线；在海外请拨打当地紧急电话。\n\n专业建议：尽快与心理健康专业人员联系，说明你的紧急情况，必要时安排面对面评估与干预。`;
    }
    if(score <= 20){
      return `你的心理健康总体良好。继续保持：规律作息、适度运动、保持社交与兴趣。建议每周做一次情绪记录以早期发现变化。`;
    }
    if(score <= 30){
      return `存在轻度情绪或压力问题。可先尝试自助方法：睡眠卫生、放松训练（深呼吸、渐进性肌肉放松）、认知记录（记录负面思维并找证据反驳）。若两周无改善，考虑咨询心理师。`;
    }
    if(score <= 45){
      return `中度困扰，情绪或功能已受到影响。建议尽快预约心理咨询或到正规机构评估，采用心理治疗（如认知行为疗法）或在必要时辅以药物治疗。加强社会支持与每天的小目标（行为激活）。`;
    }
    return `分数处于高风险区。建议立即联系心理/精神科专业人员或当地紧急服务，并向身边可信的人寻求陪伴与帮助。专业干预通常包括危机处理、评估及持续治疗。`;
  }

  function collectAnswers(){
    const answers = {};
    for(let i=1;i<=20;i++){
      const el = form.elements['q'+i];
      if(!el) return {error:`找不到第 ${i} 题`};
      const val = Array.from(el).find(r=>r.checked);
      if(!val) return {error:`请回答第 ${i} 题`};
      answers['q'+i] = parseInt(val.value,10);
    }
    return {answers};
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    const collected = collectAnswers();
    if(collected.error){
      alert(collected.error);
      return;
    }
    const answers = collected.answers;
    let total = 0;
    for(let i=1;i<=20;i++) total += answers['q'+i];

    const highRisk = (answers['q18'] >= 2) || (answers['q18'] === 3);
    const level = classify(total);
    summary.textContent = `得分：${total} 分 — 评估：${level}`;

    // 生成详细建议文本
    const adv = getAdvice(total, highRisk);
    const detail = document.createElement('div');
    detail.innerHTML = adv.replace(/\n/g,'<br>');

    advice.innerHTML = '';
    advice.appendChild(detail);

    // 显示紧急提示的视觉强调
    if(highRisk){
      resultSec.style.border = '2px solid rgba(239,68,68,0.12)';
      resultSec.scrollIntoView({behavior:'smooth'});
    } else {
      resultSec.style.border = '';
      resultSec.scrollIntoView({behavior:'smooth'});
    }

    resultSec.hidden = false;
  });

  printBtn.addEventListener('click', function(){ window.print(); });

  copyBtn.addEventListener('click', function(){
    const text = summary.textContent + '\n' + advice.innerText;
    navigator.clipboard && navigator.clipboard.writeText(text).then(()=>{
      alert('结果已复制到剪贴板');
    }).catch(()=>{ alert('复制失败，请手动复制'); });
  });

  resetBtn.addEventListener('click', function(){
    form.reset();
    resultSec.hidden = true;
    summary.textContent = '';
    advice.textContent = '';
  });
})();
