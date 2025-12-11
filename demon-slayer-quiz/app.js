/*
  前端测评主脚本（无后端）
  - 使用哈希路由：#/question/1 形式来实现“一题一页”的感觉
  - 两套题库：simpleQuestions (20) 与 fullQuestions (60)
  - 每题 4 个选项，对应给定柱的编号（0-9）以累加分数
  - 结束时输出分数最高的柱（若并列，则从并列中随机选择）
  - 图片为 assets/images/pillar_1.svg ... pillar_10.svg，用户可替换
*/

// 柱信息（10 位：9 位柱 + 头柱 炭治郎）
const PILLARS = [
  { id:0, key:'water', name:'水柱 — 富冈义勇', short:'冷静、沉稳、重视正义', desc:'擅长沉着应对与精确的水之呼吸。你重视规则、冷静且富有责任感。'},
  { id:1, key:'flame', name:'火柱 — 煉獄杏寿郎', short:'热血、正义感强、温暖他人', desc:'行动与热情驱动你，你愿为他人挺身而出，有强烈的道德与牺牲精神。'},
  { id:2, key:'wind', name:'风柱 — 不死川实弥', nameCN:'风柱 — 不死川实弥', short:'冲动、力量型、直率', desc:'直来直去，重视实力与结果。你不怕冲突，做事果断而有力。'},
  { id:3, key:'sound', name:'音柱 — 宇髄天元', short:'华丽、社交能力强、策略', desc:'爱美与善于布局，行动多面向，擅长在复杂环境中带领队伍。'},
  { id:4, key:'love', name:'恋柱 — 甘露寺蜜璃', short:'热情、感性、重视他人', desc:'以情感为驱动，亲切而富有感染力，常用温暖与关怀影响他人。'},
  { id:5, key:'insect', name:'虫柱 — 胡蝶しのぶ', short:'细致、智谋、擅长知识与毒理', desc:'你用知识与策略解决问题，擅长用巧思化解强敌，理性中含有温柔。'},
  { id:6, key:'stone', name:'岩柱 — 悲鸣嶼行冥', short:'稳重、守护型、力量与慈悲', desc:'像磐石一般可靠，具备强烈守护欲与深厚信念，是团队的支柱。'},
  { id:7, key:'mist', name:'霞/雾柱 — 時透无一郎/悔改', short:'沉静、技术型、天赋异禀', desc:'你以技巧见长，天赋与专注使你在关键时刻展现惊人实力。'},
  { id:8, key:'serpent', name:'蛇柱 — 伊黑小芭内', short:'冷静、严谨、有原则', desc:'对规则与纪律有较高要求，表现冷静但内心有强烈忠诚与责任。'},
  { id:9, key:'tanjiro', name:'头柱 — 灶门炭治郎', short:'温柔、有同情心、坚韧', desc:'以同情与坚定闻名，你善良、富有牺牲精神，能以温柔化解敌意并带来团结。'}
];

// 为简单实现，fullQuestions 包含 60 题；simpleQuestions 为前 20 题（将 full 的前 20 使用）
// 每题结构：{id, text, choices: [{text, gives:[pillarIndex,...]} ...] }
// 给分逻辑：每次选项会给对应 pillar 累加 1 分；结果为分数最高者。

const fullQuestions = [
  // 我将生成 60 道题，覆盖性格、战斗偏好、价值观、决断风格、团队角色等
  {id:1, text:'当队友遇到危险，你首先的反应是？', choices:[
    {text:'立刻冲上前拯救（宁愿牺牲）', gives:[1,9]},
    {text:'评估形势后选择最佳切入点', gives:[0,6]},
    {text:'用策略或暗算来化解危险', gives:[5,8]},
    {text:'召集更多人或靠团队合作解决', gives:[3,4]}
  ]},
  {id:2, text:'你更看重哪种力量？', choices:[
    {text:'坚不可摧的体魄', gives:[6,2]},
    {text:'灵巧与速度', gives:[7,0]},
    {text:'技巧与毒性/智谋', gives:[5,8]},
    {text:'热情与鼓舞他人的力量', gives:[1,4]}
  ]},
  {id:3, text:'如果要你带队，你会如何领导？', choices:[
    {text:'用身先士卒、以行动感召', gives:[1,6]},
    {text:'制定明确规则并严格执行', gives:[8,2]},
    {text:'用个人魅力与理解凝聚团队', gives:[4,9]},
    {text:'堆栈资源和战略布局', gives:[3,5]}
  ]},
  {id:4, text:'你在危险情境下的决策速度是？', choices:[
    {text:'快速、果断', gives:[2,1]},
    {text:'慢而稳，优先安全', gives:[6,0]},
    {text:'依赖直觉与感觉', gives:[7,4]},
    {text:'先观察再行动，寻找对策', gives:[5,3]}
  ]},
  {id:5, text:'你更喜欢的战斗风格是？', choices:[
    {text:'猛烈近战，正面硬刚', gives:[6,2]},
    {text:'优雅且富有表演性的招式', gives:[3,4]},
    {text:'柔中带刚，技战术优先', gives:[0,7]},
    {text:'速度与技巧的精确打击', gives:[5,8]}
  ]},
  {id:6, text:'面对敌人，你希望采取的策略是？', choices:[
    {text:'正面迎击，尽快结束', gives:[1,6]},
    {text:'引诱与陷阱', gives:[5,3]},
    {text:'计算并寻找破绽', gives:[8,0]},
    {text:'用同理心试图感化（若可能）', gives:[9,4]}
  ]},
  {id:7, text:'你如何看待牺牲自我拯救他人？', choices:[
    {text:'义不容辞，值得为他人付出', gives:[1,9]},
    {text:'视情况而定，但不轻易牺牲', gives:[0,6]},
    {text:'不赞成盲目牺牲，倾向策略化解', gives:[5,8]},
    {text:'牺牲可接受，如果能带来更大胜利', gives:[3,2]}
  ]},
  {id:8, text:'你的沟通方式通常是？', choices:[
    {text:'直率强势', gives:[2,8]},
    {text:'温和有同理心', gives:[9,4]},
    {text:'简洁冷静', gives:[0,6]},
    {text:'夸张与魅力型', gives:[3,1]}
  ]},
  {id:9, text:'你最在意队友的哪项品质？', choices:[
    {text:'勇气與忠诚', gives:[1,6]},
    {text:'技巧與执行力', gives:[7,0]},
    {text:'纪律与可靠', gives:[8,5]},
    {text:'团结与温情', gives:[4,9]}
  ]},
  {id:10, text:'当训练遇到瓶颈，你会怎么做？', choices:[
    {text:'加倍训练，靠意志突破', gives:[6,1]},
    {text:'寻找老师或新的方法', gives:[0,5]},
    {text:'休息并从不同角度思考', gives:[7,4]},
    {text:'研究对手并针对性练习', gives:[8,3]}
  ]},
  {id:11, text:'你更讨厌哪种敌人？', choices:[
    {text:'冷酷无情，残忍的敌人', gives:[9,5]},
    {text:'虚伪且策略多端的敌人', gives:[3,8]},
    {text:'傲慢但强大的敌人', gives:[6,2]},
    {text:'看似弱小却危险的敌人', gives:[0,7]}
  ]},
  {id:12, text:'你在团队中常担任的角色是？', choices:[
    {text:'冲锋的领头者', gives:[1,6]},
    {text:'策士/后方支援', gives:[5,3]},
    {text:'纪律与秩序维护者', gives:[8,0]},
    {text:'情绪支持与凝聚力担当', gives:[4,9]}
  ]},
  {id:13, text:'你对力量的看法是？', choices:[
    {text:'力量即正义，应被用于守护', gives:[6,1]},
    {text:'力量需要智慧与技巧引导', gives:[5,0]},
    {text:'力量是规则之上的威慑', gives:[8,2]},
    {text:'力量应被用于保护他人并传递温暖', gives:[9,4]}
  ]},
  {id:14, text:'面对不合理的命令你会？', choices:[
    {text:'直接反抗，按正义行事', gives:[1,2]},
    {text:'私下寻找合适方式改变', gives:[5,8]},
    {text:'遵守但同时保留应对方案', gives:[0,6]},
    {text:'用沟通争取理解与共识', gives:[4,9]}
  ]},
  {id:15, text:'你觉得到达目标更重要的是什么？', choices:[
    {text:'过程中的恪守与荣耀', gives:[6,1]},
    {text:'结果与效率', gives:[2,8]},
    {text:'保护同行者的安全', gives:[9,4]},
    {text:'用创意与策略取得胜利', gives:[3,5]}
  ]},
  {id:16, text:'你偏好的作战环境？', choices:[
    {text:'开阔的正面决斗场', gives:[6,1]},
    {text:'需要潜行与埋伏的环境', gives:[5,8]},
    {text:'变化无常、需即兴发挥', gives:[3,2]},
    {text:'讲究节奏与水面/雾气等自然要素', gives:[0,7]}
  ]},
  {id:17, text:'你处理冲突的首选方式是？', choices:[
    {text:'以力量压制', gives:[6,2]},
    {text:'以智慧巧妙化解', gives:[5,8]},
    {text:'以情感沟通为主', gives:[9,4]},
    {text:'临场表演或策略转移注意力', gives:[3,1]}
  ]},
  {id:18, text:'你在休息时更喜欢做什么？', choices:[
    {text:'锻炼或体能修炼', gives:[6,2]},
    {text:'读书研究技巧', gives:[5,0]},
    {text:'与伙伴闲聊，互相安抚', gives:[4,9]},
    {text:'沉浸在华丽的表演或装扮中', gives:[3,1]}
  ]},
  {id:19, text:'你认同下列哪种品质最重要？', choices:[
    {text:'坚忍与守护', gives:[6,9]},
    {text:'热情与鼓舞人心', gives:[1,4]},
    {text:'策略与智慧', gives:[5,8]},
    {text:'直觉与速度', gives:[7,0]}
  ]},
  {id:20, text:'面对不可能完成的任务时你会？', choices:[
    {text:'凭毅力硬着头皮上', gives:[1,6]},
    {text:'寻找替代方案或曲线救国', gives:[5,3]},
    {text:'冷静撤退并保存实力', gives:[0,8]},
    {text:'依靠团队和盟友共同完成', gives:[4,9]}
  ]},
  // 21-60：继续追加题目以覆盖更多场景
  {id:21, text:'遇到可疑线索时你通常？', choices:[
    {text:'立即追查到底', gives:[0,5]},
    {text:'暗中观察并布置陷阱', gives:[3,8]},
    {text:'将线索交给队友分工', gives:[4,9]},
    {text:'以力量摧毁威胁', gives:[6,2]}
  ]},
  {id:22, text:'你更容易被哪种事打动？', choices:[
    {text:'他人的牺牲与善良', gives:[9,1]},
    {text:'冷静的智慧与计划', gives:[5,0]},
    {text:'正义与力量的表现', gives:[6,2]},
    {text:'华丽与仪式感', gives:[3,4]}
  ]},
  {id:23, text:'你会怎样准备一次任务？', choices:[
    {text:'详尽计划与分配', gives:[0,5]},
    {text:'带上最强的武器冲上去', gives:[6,1]},
    {text:'安排掩护与后路', gives:[8,3]},
    {text:'照顾团队情绪与补给', gives:[4,9]}
  ]},
  {id:24, text:'当你感到迷茫时，你会？', choices:[
    {text:'寻找目标并重新立誓', gives:[1,6]},
    {text:'沉默反思并调整策略', gives:[0,7]},
    {text:'咨询朋友或导师', gives:[4,9]},
    {text:'以研究与试验找到方向', gives:[5,8]}
  ]},
  {id:25, text:'战斗中你最看重什么？', choices:[
    {text:'效率与速战速决', gives:[2,6]},
    {text:'机会与漂亮的招式', gives:[3,4]},
    {text:'不露痕迹的技巧', gives:[5,7]},
    {text:'守护与团队安全', gives:[9,0]}
  ]},
  {id:26, text:'你更倾向于怎样与敌人交战？', choices:[
    {text:'正面硬碰硬', gives:[6,1]},
    {text:'以诡计与陷阱取胜', gives:[5,8]},
    {text:'利用地形与环境', gives:[0,7]},
    {text:'先分化敌人再逐个击破', gives:[3,2]}
  ]},
  {id:27, text:'你认为好领导的关键是？', choices:[
    {text:'以身作则', gives:[1,6]},
    {text:'能用智慧处理复杂问题', gives:[5,0]},
    {text:'能鼓舞人心', gives:[4,3]},
    {text:'坚守原则与纪律', gives:[8,2]}
  ]},
  {id:28, text:'你更容易与哪类人产生共鸣？', choices:[
    {text:'坚韧不拔的人', gives:[6,1]},
    {text:'理性聪慧的人', gives:[5,0]},
    {text:'感性、有同情心的人', gives:[9,4]},
    {text:'讲究风格与仪式的人', gives:[3,7]}
  ]},
  {id:29, text:'你觉得战斗的意义是什么？', choices:[
    {text:'保护弱者', gives:[9,6]},
    {text:'证明自己的价值', gives:[2,1]},
    {text:'实现大义与规则', gives:[8,0]},
    {text:'以艺术或技巧表达自我', gives:[3,4]}
  ]},
  {id:30, text:'在危机中你更信任谁？', choices:[
    {text:'最强壮的人', gives:[6,2]},
    {text:'最聪明的人', gives:[5,0]},
    {text:'最能团结大家的人', gives:[4,9]},
    {text:'最会变化与适应的人', gives:[3,7]}
  ]},
  {id:31, text:'你处理失败的方式是？', choices:[
    {text:'立刻反思然后冲上去弥补', gives:[1,6]},
    {text:'冷静分析原因，改进方法', gives:[5,0]},
    {text:'靠朋友安慰并慢慢恢复', gives:[9,4]},
    {text:'短暂放下，再用全新方式重来', gives:[3,7]}
  ]},
  {id:32, text:'你觉得最可怕的事是什么？', choices:[
    {text:'伤害无辜', gives:[9,6]},
    {text:'失去自由与选择', gives:[8,2]},
    {text:'被孤立与误解', gives:[4,0]},
    {text:'无法证明自己的价值', gives:[1,3]}
  ]},
  {id:33, text:'你在战斗中更在意哪项数据？', choices:[
    {text:'输出与力量', gives:[6,2]},
    {text:'命中与速度', gives:[7,0]},
    {text:'对手弱点与限制', gives:[5,8]},
    {text:'如何鼓舞队友士气', gives:[4,1]}
  ]},
  {id:34, text:'你偏好的团队分配方式是？', choices:[
    {text:'各司其职，强项补强', gives:[0,5]},
    {text:'由能力者带头冲锋', gives:[6,1]},
    {text:'由魅力者调动大家', gives:[3,4]},
    {text:'规则与纪律优先', gives:[8,2]}
  ]},
  {id:35, text:'你更希望别人如何记住你？', choices:[
    {text:'坚不可摧的存在', gives:[6,9]},
    {text:'智慧与冷静的战士', gives:[5,0]},
    {text:'魅力与光彩照人的人', gives:[3,1]},
    {text:'温柔且值得依赖', gives:[4,9]}
  ]},
  {id:36, text:'夜间巡逻你偏好什么方式？', choices:[
    {text:'悄无声息的侦查', gives:[5,8]},
    {text:'高声示警并震慑', gives:[3,6]},
    {text:'小心翼翼但有备而行', gives:[0,7]},
    {text:'集结更多人以保证安全', gives:[4,9]}
  ]},
  {id:37, text:'你在训练中最注重什么？', choices:[
    {text:'体能与耐力', gives:[6,2]},
    {text:'技能连贯性', gives:[7,0]},
    {text:'策略与知识', gives:[5,8]},
    {text:'团队协作演练', gives:[4,3]}
  ]},
  {id:38, text:'你遇到不愿合作的人会？', choices:[
    {text:'强势施压', gives:[2,6]},
    {text:'尝试用情感拉拢', gives:[9,4]},
    {text:'用利害关系或协议约束', gives:[8,0]},
    {text:'设计诱导他们配合的情境', gives:[3,5]}
  ]},
  {id:39, text:'你更喜欢哪种成长方式？', choices:[
    {text:'靠经历与磨砺自然成长', gives:[1,6]},
    {text:'系统学习与刻意训练', gives:[5,0]},
    {text:'在实战中快速进步', gives:[2,7]},
    {text:'通过与人互动获得成长', gives:[4,9]}
  ]},
  {id:40, text:'你觉得最重要的战斗素质是？', choices:[
    {text:'同理心與堅定的信念', gives:[9,6]},
    {text:'技巧與智慧', gives:[5,0]},
    {text:'速度與直觉', gives:[7,2]},
    {text:'领导力與鼓舞人心', gives:[1,3]}
  ]},
  {id:41, text:'当你听到紧急信号，你会？', choices:[
    {text:'立刻冲向事发点', gives:[1,6]},
    {text:'先了解情况再决定', gives:[0,5]},
    {text:'组织人力分配', gives:[3,8]},
    {text:'带着同情心先救出弱者', gives:[9,4]}
  ]},
  {id:42, text:'你容易被哪类故事影响？', choices:[
    {text:'英雄牺牲的悲壮故事', gives:[1,6]},
    {text:'智者以计取胜的故事', gives:[5,0]},
    {text:'关于真爱與温情的故事', gives:[4,9]},
    {text:'关于技巧与速度的传说', gives:[7,2]}
  ]},
  {id:43, text:'你怎么看待敌人的过去？', choices:[
    {text:'可能影响他们行为，应尝试了解', gives:[9,5]},
    {text:'不重要，只有现在的行为决定对待', gives:[2,8]},
    {text:'利用对方过去寻找弱点', gives:[0,3]},
    {text:'试图用同理心唤醒对方', gives:[4,1]}
  ]},
  {id:44, text:'你最讨厌的指责是？', choices:[
    {text:'说你冷酷无情', gives:[9,5]},
    {text:'说你莽撞鲁莽', gives:[0,2]},
    {text:'说你不合群或太自我', gives:[3,8]},
    {text:'说你没有原则', gives:[6,4]}
  ]},
  {id:45, text:'你更偏好什么样的同伴？', choices:[
    {text:'能牺牲且可靠的人', gives:[6,1]},
    {text:'聪明且低调的人', gives:[5,0]},
    {text:'快乐且能带动氛围的人', gives:[4,3]},
    {text:'秩序严明、遵守纪律的人', gives:[8,2]}
  ]},
  {id:46, text:'如果必须做一个艰难选择，你会？', choices:[
    {text:'以原则为先绝不妥协', gives:[8,6]},
    {text:'考虑最大多数人的利益', gives:[9,4]},
    {text:'用创新方法尽量两全其美', gives:[3,5]},
    {text:'以速度与效率为主要考量', gives:[2,0]}
  ]},
  {id:47, text:'你认为荣耀更来自于？', choices:[
    {text:'牺牲与守护', gives:[6,1]},
    {text:'智慧的胜利', gives:[5,8]},
    {text:'风格與表現', gives:[3,4]},
    {text:'坚持与温柔', gives:[9,0]}
  ]},
  {id:48, text:'任务失败后你倾向于？', choices:[
    {text:'自责并立刻改进', gives:[1,6]},
    {text:'复盘并调整策略', gives:[5,0]},
    {text:'安抚团队并重整旗鼓', gives:[4,9]},
    {text:'寻找责任并重新分配', gives:[8,3]}
  ]},
  {id:49, text:'你最欣赏下列哪种战斗瞬间？', choices:[
    {text:'为保护重要之人冲上去的瞬间', gives:[9,1]},
    {text:'出奇制胜的一击', gives:[5,3]},
    {text:'力压群雄的霸气一击', gives:[6,2]},
    {text:'潇洒华丽的演出招式', gives:[4,7]}
  ]},
  {id:50, text:'你在危急中最信赖什么？', choices:[
    {text:'直觉与感觉', gives:[7,2]},
    {text:'队友的支持', gives:[4,9]},
    {text:'事先准备的方案', gives:[0,5]},
    {text:'强大的力量压制', gives:[6,1]}
  ]},
  {id:51, text:'你对于规矩的态度？', choices:[
    {text:'规矩很重要，要严格遵守', gives:[8,0]},
    {text:'规矩可以适度灵活处理', gives:[5,3]},
    {text:'规矩无所谓，效果优先', gives:[2,6]},
    {text:'以情为先，有时需要破规矩', gives:[9,4]}
  ]},
  {id:52, text:'你如何描述自己的战斗节奏？', choices:[
    {text:'稳重扎实', gives:[6,0]},
    {text:'快速如风', gives:[7,2]},
    {text:'有策略的节奏控制', gives:[5,8]},
    {text:'高昂热烈', gives:[1,3]}
  ]},
  {id:53, text:'你更容易因为哪件事愤怒？', choices:[
    {text:'残酷伤害弱者', gives:[9,6]},
    {text:'被欺骗与背叛', gives:[8,5]},
    {text:'被看轻或嘲讽', gives:[2,1]},
    {text:'被打断或破坏美感', gives:[3,4]}
  ]},
  {id:54, text:'你在战斗之外最注重什么？', choices:[
    {text:'信念與道德', gives:[9,6]},
    {text:'知识與技巧', gives:[5,0]},
    {text:'风格與美感', gives:[3,4]},
    {text:'体能與训练', gives:[2,7]}
  ]},
  {id:55, text:'你面对未知时通常？', choices:[
    {text:'勇敢尝试并接受失败', gives:[1,6]},
    {text:'小心探索并收集信息', gives:[5,0]},
    {text:'用直觉去判断并行动', gives:[7,3]},
    {text:'动员团队共同应对', gives:[4,9]}
  ]},
  {id:56, text:'你认同哪种教学方式？', choices:[
    {text:'严格教导以习惯成自然', gives:[8,6]},
    {text:'引导式教学与示范', gives:[0,5]},
    {text:'以身作则的示范带动', gives:[1,4]},
    {text:'自由且鼓励创造', gives:[3,7]}
  ]},
  {id:57, text:'你最反感哪类行为？', choices:[
    {text:'懦弱与逃避', gives:[6,2]},
    {text:'虚伪與欺骗', gives:[8,5]},
    {text:'冷漠不顾他人', gives:[9,4]},
    {text:'无美感与粗鲁', gives:[3,1]}
  ]},
  {id:58, text:'你的战斗目标通常是？', choices:[
    {text:'消灭威胁，保人民安全', gives:[6,9]},
    {text:'巧取胜利并保全实力', gives:[5,0]},
    {text:'以风格震慑对手', gives:[3,4]},
    {text:'快速决胜', gives:[2,7]}
  ]},
  {id:59, text:'你处理秘密或情报的态度是？', choices:[
    {text:'保密并谨慎运用', gives:[5,8]},
    {text:'共享以便协同', gives:[4,0]},
    {text:'只在必要时共享', gives:[3,2]},
    {text:'由最高指挥决定', gives:[6,1]}
  ]},
  {id:60, text:'最终你更希望达成的是什么？', choices:[
    {text:'守护大家的幸福与温暖', gives:[9,4]},
    {text:'完成高尚的事业与名誉', gives:[6,1]},
    {text:'成为技艺最精湛的那个人', gives:[5,0]},
    {text:'以魅力与风彩被人记住', gives:[3,7]}
  ]}
];

// 简易版：前 20 题
const simpleQuestions = fullQuestions.slice(0,20);

// 应用状态
let state = {
  mode: 'simple', // 'simple' 或 'full'
  questions: simpleQuestions,
  answers: {}, // id -> choiceIndex
  scores: Array(PILLARS.length).fill(0)
};

// DOM
const homeEl = document.getElementById('home');
const questionEl = document.getElementById('question');
const resultEl = document.getElementById('result');
const qIndexEl = document.getElementById('q-index');
const qTotalEl = document.getElementById('q-total');
const qTextEl = document.getElementById('q-text');
const choicesEl = document.getElementById('choices');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const backHomeBtn = document.getElementById('back-home');
const startSimpleBtn = document.getElementById('start-simple');
const startFullBtn = document.getElementById('start-full');
const resultImg = document.getElementById('result-img');
const resultName = document.getElementById('result-name');
const resultDesc = document.getElementById('result-desc');
const retakeBtn = document.getElementById('retake');
const shareBtn = document.getElementById('share');

// 启动
function init(){
  // 绑定事件
  startSimpleBtn.addEventListener('click', ()=>start('simple'));
  startFullBtn.addEventListener('click', ()=>start('full'));
  prevBtn.addEventListener('click', goPrev);
  nextBtn.addEventListener('click', goNext);
  backHomeBtn.addEventListener('click', ()=>{location.hash='';showSection('home')});
  retakeBtn.addEventListener('click', ()=>{location.hash='';resetState();showSection('home')});
  shareBtn.addEventListener('click', copyResult);

  window.addEventListener('hashchange', onHashChange);
  // 显示主页或路由
  onHashChange();
}

function start(mode){
  state.mode = mode;
  state.questions = mode==='simple'? simpleQuestions : fullQuestions;
  state.answers = {}; state.scores = Array(PILLARS.length).fill(0);
  // 转到第1题
  location.hash = `#/question/1`;
}

function onHashChange(){
  const hash = location.hash || '';
  if(!hash || hash==='#' || hash==='#/'){
    showSection('home');
    return;
  }
  const qMatch = hash.match(/#\/question\/(\d+)/);
  if(qMatch){
    const idx = parseInt(qMatch[1],10);
    showQuestion(idx);
    return;
  }
  const resMatch = hash.match(/#\/result/);
  if(resMatch){
    showResult();
    return;
  }
  // default to home
  showSection('home');
}

function showSection(name){
  homeEl.classList.toggle('hidden', name!=='home');
  questionEl.classList.toggle('hidden', name!=='question');
  resultEl.classList.toggle('hidden', name!=='result');
}

function showQuestion(index){
  const total = state.questions.length;
  if(index<1 || index>total){
    // 如果超出范围且 index>total 则去结果
    if(index>total) { computeResult(); location.hash='#/result'; return; }
    location.hash = '#/question/1'; return;
  }
  showSection('question');
  qIndexEl.textContent = index;
  qTotalEl.textContent = total;
  const q = state.questions[index-1];
  qTextEl.textContent = q.text;
  // 渲染选项
  choicesEl.innerHTML = '';
  q.choices.forEach((c, ci)=>{
    const btn = document.createElement('div');
    btn.className = 'choice';
    btn.tabIndex = 0;
    btn.textContent = c.text;
    if(state.answers[q.id]===ci) btn.classList.add('selected');
    btn.addEventListener('click', ()=>selectChoice(q.id,ci));
    btn.addEventListener('keydown',(e)=>{ if(e.key==='Enter') selectChoice(q.id,ci); });
    choicesEl.appendChild(btn);
  });
  // 控制按钮状态
  prevBtn.disabled = (index===1);
  nextBtn.textContent = (index===total)? '查看结果' : '下一题';
}

function selectChoice(qid, ci){
  state.answers[qid] = ci;
  // 标记选项
  const childs = Array.from(choicesEl.children);
  childs.forEach((c, idx)=> c.classList.toggle('selected', idx===ci));
}

function goPrev(){
  const current = parseInt(qIndexEl.textContent,10);
  if(current>1){ location.hash = `#/question/${current-1}`; }
}

function goNext(){
  const current = parseInt(qIndexEl.textContent,10);
  // 如果当前题没有选项，提醒并阻止
  const q = state.questions[current-1];
  if(typeof state.answers[q.id] === 'undefined'){
    alert('请先选择一个答案再继续。');
    return;
  }
  const total = state.questions.length;
  if(current<total){ location.hash = `#/question/${current+1}`; }
  else { computeResult(); location.hash = '#/result'; }
}

function computeResult(){
  // 清零
  state.scores = Array(PILLARS.length).fill(0);
  // 遍历已做题目
  state.questions.forEach(q=>{
    const ai = state.answers[q.id];
    if(typeof ai === 'undefined') return;
    const choice = q.choices[ai];
    if(choice && choice.gives){
      choice.gives.forEach(pid=>{
        if(typeof state.scores[pid] === 'number') state.scores[pid] += 1;
      });
    }
  });
}

function showResult(){
  showSection('result');
  // 计算分数（若尚未计算）
  if(state.scores.every(s=>s===0)) computeResult();
  // 找最高分
  const max = Math.max(...state.scores);
  // 并列处理
  const topIds = state.scores.map((s,i)=> s===max? i : -1).filter(i=>i!==-1);
  const chosen = topIds[Math.floor(Math.random()*topIds.length)];
  const pillar = PILLARS[chosen] || PILLARS[0];
  resultName.textContent = pillar.name;
  resultDesc.textContent = pillar.desc || pillar.short || '';
  // 图片路径模板：assets/images/pillar_{index+1}.svg
  resultImg.src = `assets/images/pillar_${chosen+1}.jpg`;
  resultImg.alt = pillar.name;
}

function resetState(){
  state = {mode:'simple',questions:simpleQuestions,answers:{},scores:Array(PILLARS.length).fill(0)};
}

function copyResult(){
  const text = `${resultName.textContent}\n${resultDesc.textContent}`;
  navigator.clipboard?.writeText(text).then(()=>alert('已复制结果描述，可粘贴分享。'), ()=>alert('复制失败，请手动复制。'));
}

// 初始化
init();
