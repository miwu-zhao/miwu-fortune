/**
 * miwu · 迷雾星盘
 * 三维运势解码系统 v2.0
 * 真正的MBTI × SBTI × 星座交叉分析
 */

// ═══════════════════════════════════════════════
// 数据定义
// ═══════════════════════════════════════════════

const ZODIAC_DATA = [
    { name: '白羊座', symbol: '♈', en: 'Aries', element: '火', mode: '开创' },
    { name: '金牛座', symbol: '♉', en: 'Taurus', element: '土', mode: '固定' },
    { name: '双子座', symbol: '♊', en: 'Gemini', element: '风', mode: '变动' },
    { name: '巨蟹座', symbol: '♋', en: 'Cancer', element: '水', mode: '开创' },
    { name: '狮子座', symbol: '♌', en: 'Leo', element: '火', mode: '固定' },
    { name: '处女座', symbol: '♍', en: 'Virgo', element: '土', mode: '变动' },
    { name: '天秤座', symbol: '♎', en: 'Libra', element: '风', mode: '开创' },
    { name: '天蝎座', symbol: '♏', en: 'Scorpio', element: '水', mode: '固定' },
    { name: '射手座', symbol: '♐', en: 'Sagittarius', element: '火', mode: '变动' },
    { name: '摩羯座', symbol: '♑', en: 'Capricorn', element: '土', mode: '开创' },
    { name: '水瓶座', symbol: '♒', en: 'Aquarius', element: '风', mode: '固定' },
    { name: '双鱼座', symbol: '♓', en: 'Pisces', element: '水', mode: '变动' }
];

const MBTI_TYPES = [
    { code: 'INTJ', name: '建筑师', role: '分析者', ei: 'I', sn: 'N', tf: 'T', jp: 'J' },
    { code: 'INTP', name: '逻辑学家', role: '分析者', ei: 'I', sn: 'N', tf: 'T', jp: 'P' },
    { code: 'ENTJ', name: '指挥官', role: '分析者', ei: 'E', sn: 'N', tf: 'T', jp: 'J' },
    { code: 'ENTP', name: '辩论家', role: '分析者', ei: 'E', sn: 'N', tf: 'T', jp: 'P' },
    { code: 'INFJ', name: '提倡者', role: '外交家', ei: 'I', sn: 'N', tf: 'F', jp: 'J' },
    { code: 'INFP', name: '调停者', role: '外交家', ei: 'I', sn: 'N', tf: 'F', jp: 'P' },
    { code: 'ENFJ', name: '主人公', role: '外交家', ei: 'E', sn: 'N', tf: 'F', jp: 'J' },
    { code: 'ENFP', name: '竞选者', role: '外交家', ei: 'E', sn: 'N', tf: 'F', jp: 'P' },
    { code: 'ISTJ', name: '物流师', role: '守护者', ei: 'I', sn: 'S', tf: 'T', jp: 'J' },
    { code: 'ISFJ', name: '守卫者', role: '守护者', ei: 'I', sn: 'S', tf: 'F', jp: 'J' },
    { code: 'ESTJ', name: '总经理', role: '守护者', ei: 'E', sn: 'S', tf: 'T', jp: 'J' },
    { code: 'ESFJ', name: '执政官', role: '守护者', ei: 'E', sn: 'S', tf: 'F', jp: 'J' },
    { code: 'ISTP', name: '鉴赏家', role: '探索者', ei: 'I', sn: 'S', tf: 'T', jp: 'P' },
    { code: 'ISFP', name: '探险家', role: '探索者', ei: 'I', sn: 'S', tf: 'F', jp: 'P' },
    { code: 'ESTP', name: '企业家', role: '探索者', ei: 'E', sn: 'S', tf: 'T', jp: 'P' },
    { code: 'ESFP', name: '表演者', role: '探索者', ei: 'E', sn: 'S', tf: 'F', jp: 'P' }
];

// SBTI状态分类
const SBTI_CATEGORIES = {
    control: ['CTRL', 'BOSS'],      // 掌控型
    give: ['ATM-er', 'MUM', 'LOVE-R'], // 给予型
    hide: ['FAKE', 'ZZZZ', 'OJBK', 'MONK'], // 逃避/隐藏型
    express: ['FUCK', 'WOC', 'HHHH', 'GOGO'], // 表达型
    doubt: ['IMSB', 'IMFW', 'OH-NO', 'DEAD'], // 怀疑型
    think: ['THIN-K', 'SHIT', 'JOKE-R'], // 思考型
    other: ['SEXY', 'THAN-K', 'MALO', 'POOR', 'DRUNK', 'Dior-s'] // 其他
};

// SBTI完整数据
const SBTI_DATA = {
    "CTRL": { "name": "拿捏者", "category": "control", "motto": "怎么样，被我拿捏了吧？", "energy": "主动掌控", "shadow": "过度控制" },
    "ATM-er": { "name": "送钱者", "category": "give", "motto": "你以为我很有钱吗？", "energy": "慷慨付出", "shadow": "边界模糊" },
    "BOSS": { "name": "领导者", "category": "control", "motto": "方向盘给我，我来开。", "energy": "主导决策", "shadow": "承担过度" },
    "THAN-K": { "name": "感恩者", "category": "other", "motto": "我感谢苍天！我感谢大地！", "energy": "正向感知", "shadow": "逃避问题" },
    "OH-NO": { "name": "哦不人", "category": "doubt", "motto": "哦不！我怎么会是这个人格？！", "energy": "快速适应", "shadow": "被动应对" },
    "GOGO": { "name": "行者", "category": "express", "motto": "gogogo~出发咯", "energy": "行动力强", "shadow": "方向不明" },
    "SEXY": { "name": "尤物", "category": "other", "motto": "您就是天生的尤物！", "energy": "魅力四射", "shadow": "依赖认可" },
    "LOVE-R": { "name": "多情者", "category": "give", "motto": "爱意太满，现实显得有点贫瘠。", "energy": "情感丰富", "shadow": "理想投射" },
    "MUM": { "name": "妈妈", "category": "give", "motto": "或许...我可以叫你妈妈吗....?", "energy": "照顾滋养", "shadow": "忽略自我" },
    "FAKE": { "name": "伪人", "category": "hide", "motto": "已经，没有人类了。", "energy": "社交适应", "shadow": "真实缺失" },
    "OJBK": { "name": "无所谓人", "category": "hide", "motto": "我说随便，是真的随便。", "energy": "包容随和", "shadow": "放弃选择" },
    "MALO": { "name": "吗喽", "category": "other", "motto": "人生是个副本，而我只是一只吗喽。", "energy": "自我解嘲", "shadow": "逃避认真" },
    "JOKE-R": { "name": "小丑", "category": "think", "motto": "原来我们都是小丑。", "energy": "幽默化解", "shadow": "压抑真实" },
    "WOC": { "name": "握草人", "category": "express", "motto": "卧槽，我怎么是这个人格？", "energy": "真实反应", "shadow": "情绪波动" },
    "THIN-K": { "name": "思考者", "category": "think", "motto": "已深度思考100s。", "energy": "深度分析", "shadow": "行动瘫痪" },
    "SHIT": { "name": "愤世者", "category": "think", "motto": "这个世界，构石一坨。", "energy": "批判洞察", "shadow": "负面聚焦" },
    "ZZZZ": { "name": "装死者", "category": "hide", "motto": "我没死，我只是在睡觉。", "energy": "自我保护", "shadow": "逃避现实" },
    "POOR": { "name": "贫困者", "category": "other", "motto": "我穷，但我很专。", "energy": "专注热爱", "shadow": "物质忽视" },
    "MONK": { "name": "僧人", "category": "hide", "motto": "没有那种世俗的欲望。", "energy": "超脱淡泊", "shadow": "与生活断裂" },
    "IMSB": { "name": "傻者", "category": "doubt", "motto": "认真的么？我真的是傻逼么？", "energy": "自我审视", "shadow": "自我否定" },
    "SOLO": { "name": "孤儿", "category": "other", "motto": "我哭了，我怎么会是孤儿？", "energy": "独立坚韧", "shadow": "拒绝依赖" },
    "FUCK": { "name": "草者", "category": "express", "motto": "操！这是什么人格？", "energy": "情绪真实", "shadow": "冲动伤人" },
    "DEAD": { "name": "死者", "category": "doubt", "motto": "我，还活着吗？", "energy": "深度追问", "shadow": "虚无感" },
    "IMFW": { "name": "废物", "category": "doubt", "motto": "我真的...是废物吗？", "energy": "成长渴望", "shadow": "自我贬低" },
    "HHHH": { "name": "傻乐者", "category": "express", "motto": "哈哈哈哈哈哈。", "energy": "快乐感染", "shadow": "情绪回避" },
    "DRUNK": { "name": "酒鬼", "category": "other", "motto": "烈酒烧喉，不得不醉。", "energy": "感性沉醉", "shadow": "逃避清醒" },
    "Dior-s": { "name": "屌丝", "category": "other", "motto": "等着我屌丝逆袭。", "energy": "逆袭信念", "shadow": "自我设限" }
};

const state = {
    zodiac: null,
    mbti: null,
    sbti: null,
    fortuneData: null,
    mbtiData: null,
    sbtiData: null
};

// ═══════════════════════════════════════════════
// 初始化
// ═══════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    renderSelectors();
    bindEvents();
});

async function loadData() {
    try {
        const [fortune, mbti] = await Promise.all([
            fetch('data/weekly-fortune.json'),
            fetch('data/mbti-data.json')
        ]);
        state.fortuneData = await fortune.json();
        state.mbtiData = await mbti.json();
        state.sbtiData = SBTI_DATA;
        console.log('数据加载成功');
    } catch (e) {
        console.error('数据加载失败', e);
    }
}

function renderSelectors() {
    // 星座
    document.getElementById('zodiacGrid').innerHTML = ZODIAC_DATA.map(z => `
        <button class="zodiac-btn" data-value="${z.name}">
            <span class="zodiac-icon">${z.symbol}</span>
            <span class="zodiac-name">${z.name}</span>
        </button>
    `).join('');
    
    // MBTI
    document.getElementById('mbtiGrid').innerHTML = MBTI_TYPES.map(t => `
        <button class="mbti-btn" data-value="${t.code}">
            <span class="mbti-code">${t.code}</span>
            <span class="mbti-name">${t.name}</span>
        </button>
    `).join('');
    
    // SBTI
    const sbtiTypes = Object.keys(SBTI_DATA);
    document.getElementById('sbtiScroll').innerHTML = sbtiTypes.map(code => {
        const data = SBTI_DATA[code];
        return `<button class="sbti-btn" data-value="${code}">
            <span class="sbti-code">${code}</span>
            <span class="sbti-name">${data?.name || code}</span>
        </button>`;
    }).join('');
    
    state.sbtiData = SBTI_DATA;
}

function bindEvents() {
    // 选择器事件
    document.getElementById('zodiacGrid').addEventListener('click', e => {
        const btn = e.target.closest('.zodiac-btn');
        if (!btn) return;
        document.querySelectorAll('.zodiac-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.zodiac = btn.dataset.value;
    });
    
    document.getElementById('mbtiGrid').addEventListener('click', e => {
        const btn = e.target.closest('.mbti-btn');
        if (!btn) return;
        document.querySelectorAll('.mbti-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.mbti = btn.dataset.value;
    });
    
    document.getElementById('sbtiScroll').addEventListener('click', e => {
        const btn = e.target.closest('.sbti-btn');
        if (!btn) return;
        document.querySelectorAll('.sbti-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.sbti = btn.dataset.value;
    });
    
    // 解码按钮
    document.getElementById('queryBtn').addEventListener('click', decode);
    
    // 模态框
    document.getElementById('closeHistory').addEventListener('click', () => {
        document.getElementById('historyModal').classList.remove('active');
    });
    document.getElementById('closeShare').addEventListener('click', () => {
        document.getElementById('shareModal').classList.remove('active');
    });
    document.getElementById('historyBtn').addEventListener('click', showHistory);
    document.getElementById('shareBtn').addEventListener('click', generateReport);
}

// ═══════════════════════════════════════════════
// 核心解码逻辑 v2.0
// ═══════════════════════════════════════════════

function decode() {
    const missing = [];
    if (!state.zodiac) missing.push('星象坐标');
    if (!state.mbti) missing.push('人格图谱');
    if (!state.sbti) missing.push('状态锚点');
    
    if (missing.length > 0) {
        alert(`请先选择：${missing.join('、')}`);
        return;
    }
    
    document.getElementById('loadingOverlay').style.display = 'flex';
    
    setTimeout(() => {
        document.getElementById('loadingOverlay').style.display = 'none';
        renderResult();
    }, 1200);
}

function renderResult() {
    const z = state.fortuneData?.horoscopes?.[state.zodiac];
    const m = state.mbtiData?.[state.mbti];
    const s = state.sbtiData?.[state.sbti];
    
    if (!z || !m || !s) {
        alert('数据加载异常，请刷新页面重试');
        return;
    }
    
    // 获取MBTI维度信息
    const mbtiInfo = MBTI_TYPES.find(t => t.code === state.mbti);
    const zodiacInfo = ZODIAC_DATA.find(zd => zd.name === state.zodiac);
    
    // 核心摘要
    document.getElementById('fortuneTitle').textContent = generateTitle(z, m, s, mbtiInfo, zodiacInfo);
    document.getElementById('userConfig').textContent = `${state.zodiac} · ${state.mbti} · ${s.name}`;
    document.getElementById('weekInfo').textContent = `${state.fortuneData.week}`;
    
    // 能量指标 - 根据三维数据计算
    renderMetrics(z, m, s, mbtiInfo);
    
    // 三维解码 - 真正的交叉分析
    renderDecode(z, m, s, mbtiInfo, zodiacInfo);
    
    // 关键议题 - 交叉维度问题
    renderIssues(z, m, s, mbtiInfo, zodiacInfo);
    
    // 行动指南 - 个性化建议
    renderGuide(z, m, s, mbtiInfo, zodiacInfo);
    
    // 幸运参数
    renderParams(z);
    
    // 显示结果
    document.getElementById('resultSection').style.display = 'block';
    document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth' });
}

function generateTitle(z, m, s, mbtiInfo, zodiacInfo) {
    // 根据运势排名和状态生成不同标题
    const ranking = state.fortuneData.rankings;
    const isTop = ranking?.top?.some(r => r.sign === state.zodiac);
    const isBottom = ranking?.bottom?.some(r => r.sign === state.zodiac);
    
    const statusMap = {
        control: '掌控中',
        give: '给予中',
        hide: '沉淀中',
        express: '表达中',
        doubt: '审视中',
        think: '思考中',
        other: '流转中'
    };
    
    const status = statusMap[s.category] || '流转中';
    
    if (isTop) {
        return `${mbtiInfo.name}在${status}的${state.zodiac}高光周`;
    } else if (isBottom) {
        return `${state.zodiac}低谷期，${mbtiInfo.name}的${status}破局`;
    }
    return `${state.zodiac}本周，${mbtiInfo.name}${status}的十字路口`;
}

// ═══════════════════════════════════════════════
// 三维交叉分析引擎
// ═══════════════════════════════════════════════

function renderDecode(z, m, s, mbtiInfo, zodiacInfo) {
    // 第一层：星象如何影响你的MBTI类型
    const zodiacLayer = analyzeZodiacForMBTI(z, mbtiInfo, s, zodiacInfo);
    
    // 第二层：你的MBTI如何应对本周运势
    const mbtiLayer = analyzeMBTIResponse(z, mbtiInfo, s, zodiacInfo);
    
    // 第三层：你的状态如何改变一切
    const sbtiLayer = analyzeStateInfluence(z, mbtiInfo, s, zodiacInfo);
    
    const decodeData = [
        { title: `星象层 · 本周对你的「${mbtiInfo.name}」意味着什么`, content: zodiacLayer },
        { title: `性格层 · ${mbtiInfo.name}如何应对这周`, content: mbtiLayer },
        { title: `状态层 · 「${s.name}」如何改写剧本`, content: sbtiLayer }
    ];
    
    document.getElementById('decodeGrid').innerHTML = decodeData.map(d => `
        <div class="decode-item">
            <div class="decode-title">${d.title}</div>
            <div class="decode-content">${d.content}</div>
        </div>
    `).join('');
}

function analyzeZodiacForMBTI(z, mbtiInfo, s, zodiacInfo) {
    const ranking = state.fortuneData.rankings;
    const isTop = ranking?.top?.some(r => r.sign === state.zodiac);
    const isBottom = ranking?.bottom?.some(r => r.sign === state.zodiac);
    
    // 根据MBTI维度分析
    let analysis = '';
    
    // E/I维度 × 运势能量
    const eiAnalysis = mbtiInfo.ei === 'E' 
        ? `作为外向型（E），本周${isTop ? '能量充沛，适合主动出击' : '需要收敛锋芒，但不要完全退缩'}。${z.title}的星象能量${isTop ? '放大你的社交影响力' : '提醒你：不是所有战场都值得投入'}。`
        : `作为内向型（I），本周${isTop ? '可以适度打开自己，好运在外' : '是深度充电的好时机'}。${z.title}的星象能量${isTop ? '给你带来意想不到的认可' : '让你有理由独处思考'}。`;
    
    // S/N维度 × 运势特质
    const snAnalysis = mbtiInfo.sn === 'S'
        ? `你的实感偏好（S）让你关注${z.description.substring(0, 20)}...这类具体问题。本周建议：${isBottom ? '不要只盯着眼前的困境，抬头看看其他可能性' : '踏实行动的同时，给自己一点想象空间'}。`
        : `你的直觉偏好（N）让你能从"${z.title}"中读出更多可能性。本周注意：${isTop ? '灵感很棒，但要落地执行' : '不要过度解读困境，有时候事情就是表面上那样'}。`;
    
    // T/F维度 × 爱情运
    const tfAnalysis = mbtiInfo.tf === 'T'
        ? `思考型（T）的你面对"${z.love}"的感情提示，可能第一反应是理性分析。这周建议：${isBottom ? '不要用逻辑解决情绪问题，有时候倾听就够了' : '可以适当表达你的关心，不需要完美方案'}。`
        : `情感型（F）的你对"${z.love}"的提示会有很强的共鸣。注意：${isTop ? '感情运好的时候也要保持边界' : '不要让情绪放大困境，这周的爱情提示是成长机会'}。`;
    
    // J/P维度 × 幸运日
    const jpAnalysis = mbtiInfo.jp === 'J'
        ? `判断型（J）的你可以把${z.lucky_day}标记为重点日，提前规划。但${isBottom ? '这周可能需要更多弹性，计划被打乱不是灾难' : '也要给意外留点空间，有时候最好的机会是计划外的'}。`
        : `知觉型（P）的你可能会觉得${z.lucky_day}只是个参考。但${isTop ? '这周的幸运日值得你稍微认真对待' : '在低谷期，给自己一个明确的发力点反而是解脱'}。`;
    
    return `
        <p><strong>${state.zodiac}本周运势：「${z.title}」</strong></p>
        <p style="margin-top: 12px;">${z.description}</p>
        <p style="margin-top: 14px; padding-left: 12px; border-left: 2px solid var(--gold);">
            <strong>${mbtiInfo.name}专属解读：</strong><br><br>
            ${eiAnalysis}<br><br>
            ${snAnalysis}<br><br>
            ${tfAnalysis}<br><br>
            ${jpAnalysis}
        </p>
        <p style="margin-top: 12px; color: var(--violet);">
            ⚡ <strong>能量边界</strong>：与${z.avoid_sign}的摩擦，对${mbtiInfo.name}来说是${mbtiInfo.tf === 'T' ? '效率问题，不必情绪化' : '关系课题，值得反思'}。
        </p>
    `;
}

function analyzeMBTIResponse(z, mbtiInfo, s, zodiacInfo) {
    const ranking = state.fortuneData.rankings;
    const isTop = ranking?.top?.some(r => r.sign === state.zodiac);
    const isBottom = ranking?.bottom?.some(r => r.sign === state.zodiac);
    
    // MBTI角色 × 运势状态
    const roleAnalysis = {
        '分析者': `${isTop ? '分析者的洞察力在好运周可能发现别人错过的机会' : '分析者的理性在低谷期是最大资产——你能看清问题本质，而不是被情绪淹没'}。`,
        '外交家': `${isTop ? '外交家的共情力让你在好运周收获真挚连接' : '外交家的情感智慧在低谷期能转化困境为成长故事'}。`,
        '守护者': `${isTop ? '守护者的稳重让好运周不只是昙花一现' : '守护者的坚持在低谷期是最可靠的支撑'}。`,
        '探索者': `${isTop ? '探索者的灵活性让你抓住好运周的多重机会' : '探索者的适应力让低谷期变成有趣的新方向探索'}。`
    };
    
    // 具体的MBTI类型 × 本周主题
    const typeSpecific = generateTypeSpecificAdvice(mbtiInfo, z, isTop, isBottom);
    
    return `
        <p><strong>${mbtiInfo.name}（${mbtiInfo.code}）的本周攻略</strong></p>
        <p style="margin-top: 12px;">
            作为<strong>${mbtiInfo.role}</strong>，${roleAnalysis[mbtiInfo.role]}
        </p>
        <p style="margin-top: 14px;">
            <strong>本周核心任务</strong>：${typeSpecific.task}
        </p>
        <p style="margin-top: 12px;">
            <strong>可能遇到的挑战</strong>：${typeSpecific.challenge}
        </p>
        <p style="margin-top: 12px;">
            <strong>破解之道</strong>：${typeSpecific.solution}
        </p>
        <p style="margin-top: 14px; color: var(--gold);">
            💡 <strong>${mbtiInfo.name}的超能力</strong>：${typeSpecific.superpower}
        </p>
    `;
}

function generateTypeSpecificAdvice(mbtiInfo, z, isTop, isBottom) {
    const adviceMap = {
        'INTJ': {
            task: '把本周的混乱整理成系统。你的Ni能看穿表象，Te让你高效执行。',
            challenge: '可能遇到不按逻辑出牌的人和事，INTJ最怕的就是"没道理"。',
            solution: '不是所有事都需要完美逻辑。这周练习：接受70%的解决方案。',
            superpower: '在别人看不清的时候，你已经规划好了三条出路。'
        },
        'INTP': {
            task: '深入研究一个问题，但记得交付成果。你的Ti能挖掘本质。',
            challenge: '可能陷入分析瘫痪，觉得信息不够就不能决定。',
            solution: '设定决策截止时间。这周练习：在信息不完整时做出80%正确的选择。',
            superpower: '别人还在纠结表象，你已经找到了根本原因。'
        },
        'ENTJ': {
            task: '主导一个项目或决策。你的Te+Ni让你看到目标并推动执行。',
            challenge: '可能过度强势，忽视他人的感受和节奏。',
            solution: '这周练习：先听完别人的想法再下结论。效率不等于压制。',
            superpower: '在混乱中建立秩序，让团队有方向感。'
        },
        'ENTP': {
            task: '提出新方案或解决复杂问题。你的Ne能产生创新解法。',
            challenge: '可能开启太多任务却难以收尾，三分钟热度。',
            solution: '这周选一个最重要的项目坚持到底。练习：完成比完美更重要。',
            superpower: '别人困在框架里，你已经找到了新路。'
        },
        'INFJ': {
            task: '洞察并帮助需要支持的人。你的Ni+Fe能感知他人的需求。',
            challenge: '可能吸收太多他人情绪，忽视自己的边界。',
            solution: '每天留出独处时间。这周练习：说一次"我需要空间"。',
            superpower: '在别人开口之前，你已经知道他们需要什么。'
        },
        'INFP': {
            task: '追求一个对你有意义的目标。你的Fi让你忠于内心。',
            challenge: '可能过度理想化，对现实感到失望。',
            solution: '把大理想拆成小步骤。这周练习：做一件虽小但符合价值观的事。',
            superpower: '在妥协的世界里，你记得什么是真正重要的。'
        },
        'ENFJ': {
            task: '带领或支持一个团队走向更好的方向。你的Fe+Ni是天然领导力。',
            challenge: '可能过度付出，忘记照顾自己。',
            solution: '接受帮助也是领导力的体现。这周练习：让别人照顾你一次。',
            superpower: '你能让每个人都觉得自己被看见和重视。'
        },
        'ENFP': {
            task: '探索新可能性，激励他人。你的Ne+Fi是感染力源泉。',
            challenge: '可能热情分散，什么都想做却什么都做不深。',
            solution: '这周只选一个最兴奋的方向。练习：深度比广度更让你满足。',
            superpower: '你能点燃别人心中的火，让他们相信自己可以。'
        },
        'ISTJ': {
            task: '按计划推进重要事务。你的Si+Te是可靠执行力。',
            challenge: '可能过于保守，错过新机会。',
            solution: '这周尝试一件你通常不会做的事。练习：打破一个小习惯。',
            superpower: '在不确定的时代，你的靠谱就是最大的确定性。'
        },
        'ISFJ': {
            task: '照顾需要帮助的人或事。你的Si+Fe是温暖支持力。',
            challenge: '可能过度付出，忽视自己的需求。',
            solution: '把自己也放进照顾清单。这周练习：为自己做一件贴心的事。',
            superpower: '你记得每个人的细节，让人感受到被珍视。'
        },
        'ESTJ': {
            task: '建立秩序，推动执行。你的Te+Si是组织能力。',
            challenge: '可能过于强硬，忽视他人的感受。',
            solution: '这周练习：问一句"你觉得呢？"再下决定。',
            superpower: '在混乱中，你能快速建立让人安心的结构。'
        },
        'ESFJ': {
            task: '维护团队和谐，照顾他人。你的Fe+Si是社交粘合剂。',
            challenge: '可能过度迎合，失去自我立场。',
            solution: '这周练习：说一次"我不同意"，不带歉意。',
            superpower: '你能感知群体的情绪，让每个人都感到被需要。'
        },
        'ISTP': {
            task: '解决一个技术或实操问题。你的Ti+Se是问题终结者。',
            challenge: '可能过于独立，忽视人际互动。',
            solution: '这周主动和一个人分享你的发现。练习：表达你的思考过程。',
            superpower: '别人还在讨论理论，你已经动手解决了。'
        },
        'ISFP': {
            task: '创造或欣赏美的事物。你的Fi+Se是美学直觉。',
            challenge: '可能过度内向，错过表达自己的机会。',
            solution: '这周用作品或行动表达一次想法，而不是憋在心里。',
            superpower: '你能发现生活中的美，提醒人们慢下来感受。'
        },
        'ESTP': {
            task: '抓住当下的机会。你的Se+Ti是行动力。',
            challenge: '可能冲动行事，忽视长远后果。',
            solution: '这周练习：行动前问自己"一年后我会怎么看这个决定"。',
            superpower: '在别人犹豫的时候，你已经抓住了机会。'
        },
        'ESFP': {
            task: '为当下创造快乐和氛围。你的Se+Fi是感染力。',
            challenge: '可能过度追求刺激，忽视深层需求。',
            solution: '这周留时间思考：什么让你真正满足，而不只是快乐？',
            superpower: '你能让沉闷的环境瞬间活跃，让每个人都轻松。'
        }
    };
    
    return adviceMap[mbtiInfo.code] || {
        task: '发挥你的优势，完成本周重要事务。',
        challenge: '可能在某些方面遇到困难。',
        solution: '相信自己的判断，适度寻求帮助。',
        superpower: '你独特的视角和方式就是你的优势。'
    };
}

function analyzeStateInfluence(z, mbtiInfo, s, zodiacInfo) {
    const ranking = state.fortuneData.rankings;
    const isTop = ranking?.top?.some(r => r.sign === state.zodiac);
    const isBottom = ranking?.bottom?.some(r => r.sign === state.zodiac);
    
    // 状态 × 运势的化学反应
    const categoryAnalysis = generateCategoryAnalysis(s, mbtiInfo, z, isTop, isBottom);
    
    // 状态如何改变MBTI的应对方式
    const stateModifier = generateStateModifier(s, mbtiInfo, z);
    
    return `
        <p><strong>「${s.name}」状态 · "${s.motto}"</strong></p>
        <p style="margin-top: 14px;">
            <strong>这个状态如何改写你的${mbtiInfo.name}剧本</strong>：
        </p>
        <p style="margin-top: 10px; padding: 12px; background: rgba(201,169,98,0.1); border-radius: 8px;">
            ${categoryAnalysis}
        </p>
        <p style="margin-top: 14px;">
            <strong>${mbtiInfo.name}+${s.name}的化学反应</strong>：
        </p>
        <p style="margin-top: 10px;">
            ${stateModifier}
        </p>
        <p style="margin-top: 14px; color: var(--rose);">
            🎯 <strong>本周破局点</strong>：${generateBreakthrough(s, mbtiInfo, z, isTop)}
        </p>
    `;
}

function generateCategoryAnalysis(s, mbtiInfo, z, isTop, isBottom) {
    const analyses = {
        control: `你正处于掌控状态。${isTop 
            ? `好运势+掌控欲=事半功倍。但注意：有些事情不需要被控制，放手反而会有惊喜。` 
            : `低谷期+掌控欲=可能感到挫败。这周练习：接纳无法掌控的部分，聚焦你能影响的范围。`}`,
        
        give: `你正处于给予状态。${isTop 
            ? `好运势+付出模式=人际关系升温。但注意：不要过度付出以至于透支自己。` 
            : `低谷期+付出模式=可能被过度索取。这周练习：设立边界，先照顾好自己的能量。`}`,
        
        hide: `你正处于回避/隐藏状态。${isTop 
            ? `好运势+隐藏状态=可能错过机会。建议：这周试着露一次头，好运在外部等你的。` 
            : `低谷期+隐藏状态=是自我保护的本能。这周允许自己躲一躲，但不要消失太久。`}`,
        
        express: `你正处于表达状态。${isTop 
            ? `好运势+表达欲=社交影响力爆棚。注意：说得太多可能招惹是非，适度保留。` 
            : `低谷期+表达欲=可能把负面情绪放大。这周练习：表达之前问自己"这是事实还是感受？"`}`,
        
        doubt: `你正处于自我怀疑状态。${isTop 
            ? `好运势+怀疑状态=你可能不相信自己配得上这份好运。这周练习：接受好意，你值得。` 
            : `低谷期+怀疑状态=双重暴击。这周提醒：你的怀疑说明你在成长，不是你在变差。`}`,
        
        think: `你正处于深度思考状态。${isTop 
            ? `好运势+思考模式=可能想太多错过时机。这周练习：想清楚70%就行动。` 
            : `低谷期+思考模式=可能陷入负面循环。这周提醒：有时候答案在行动中，不在思考里。`}`,
        
        other: `你正处于特殊状态。这周的运势和你的状态形成了有趣的组合。注意观察自己的内心变化。`
    };
    
    return analyses[s.category] || analyses.other;
}

function generateStateModifier(s, mbtiInfo, z) {
    // 不同状态如何修饰MBTI的表现
    const modifiers = {
        control: `掌控状态会让${mbtiInfo.name}${mbtiInfo.ei === 'E' ? '更积极地主导局面' : '在幕后精密规划'}。
            你的${mbtiInfo.tf === 'T' ? '理性决策' : '情感智慧'}在这个状态下被放大，但也要警惕${s.shadow}。`,
        
        give: `给予状态会让${mbtiInfo.name}的${mbtiInfo.tf === 'F' ? '共情能力' : '问题解决能力'}更突出。
            这周你可能会遇到需要帮助的人，但记得：${s.shadow}是你的阴影面。`,
        
        hide: `隐藏状态会让${mbtiInfo.ei === 'I' ? '内向的你更封闭' : '外向的你感到不自在'}。
            ${mbtiInfo.name}在这个状态下可能错过${z.lucky_day}的机会，建议那天强迫自己出门一下。`,
        
        express: `表达状态和${mbtiInfo.ei === 'E' ? '外向的你完美契合' : '内向的你形成张力'}。
            这周你的${mbtiInfo.tf === 'F' ? '情感表达' : '观点输出'}会很活跃，注意场合和分寸。`,
        
        doubt: `怀疑状态对${mbtiInfo.name}来说是${mbtiInfo.tf === 'T' ? '理性审视的好时机' : '情感波动的危险区'}。
            这周建议：把怀疑转化为探索，而不是自我否定。`,
        
        think: `思考状态和${mbtiInfo.sn === 'N' ? '直觉型的你天然契合' : '实感型的你可能感到不适应'}。
            这周${mbtiInfo.jp === 'J' ? '适合深入规划' : '容易陷入分析瘫痪'}，注意行动力。`,
        
        other: `这个独特状态与${mbtiInfo.name}的组合很特别。这周留意你的直觉和身体反应，它们会告诉你答案。`
    };
    
    return modifiers[s.category] || modifiers.other;
}

function generateBreakthrough(s, mbtiInfo, z, isTop) {
    if (isTop) {
        return `趁着好运势，练习你的非优势功能：${mbtiInfo.tf === 'T' ? '表达一次真实情感' : '做一个理性决定'}。这会打开新的可能性。`;
    } else {
        return `低谷期是你的${mbtiInfo.sn === 'N' ? '反思时间——洞察会在安静中诞生' : '调整时间——小步前进比大步跨越更稳'}。${z.lucky_day}是你的反转日。`;
    }
}

// ═══════════════════════════════════════════════
// 能量指标
// ═══════════════════════════════════════════════

function renderMetrics(z, m, s, mbtiInfo) {
    const ranking = state.fortuneData.rankings;
    const isTop = ranking?.top?.some(r => r.sign === state.zodiac);
    const isBottom = ranking?.bottom?.some(r => r.sign === state.zodiac);
    
    // 基础能量
    let baseEnergy = isTop ? 75 : (isBottom ? 45 : 60);
    
    // 状态修正
    const stateBonus = {
        control: 10,
        give: 5,
        hide: -10,
        express: 8,
        doubt: -5,
        think: 0,
        other: 0
    };
    baseEnergy += stateBonus[s.category] || 0;
    
    // MBTI维度修正
    if (mbtiInfo.ei === 'I' && s.category === 'hide') baseEnergy -= 5;
    if (mbtiInfo.ei === 'E' && s.category === 'express') baseEnergy += 5;
    
    baseEnergy = Math.min(95, Math.max(25, baseEnergy));
    
    const metrics = [
        { label: '整体能量', value: baseEnergy + '%' },
        { label: '情感指数', value: (mbtiInfo.tf === 'F' ? baseEnergy + 10 : baseEnergy - 5) + '%' },
        { label: '行动力', value: (mbtiInfo.jp === 'P' ? baseEnergy + 5 : baseEnergy) + '%' },
        { label: '洞察力', value: (mbtiInfo.sn === 'N' ? baseEnergy + 8 : baseEnergy - 3) + '%' }
    ];
    
    document.getElementById('energyMetrics').innerHTML = metrics.map(m => `
        <div class="metric-item">
            <span class="metric-label">${m.label}</span>
            <span class="metric-value">${m.value}</span>
        </div>
    `).join('');
    
    renderRadar(baseEnergy, mbtiInfo);
}

function renderRadar(baseEnergy, mbtiInfo) {
    const canvas = document.getElementById('fortuneRadar');
    const ctx = canvas.getContext('2d');
    
    // 根据MBTI调整雷达图
    const mbtiBonus = {
        'E': [5, 8, 0, -3, 10, 3],
        'I': [-5, -3, 8, 5, -8, 5],
        'S': [-3, 5, 3, 8, 0, -5],
        'N': [8, -5, 0, -5, 5, 10],
        'T': [5, -8, 3, 10, -5, 0],
        'F': [-5, 10, -3, -8, 8, 5],
        'J': [3, 0, 8, 5, 0, 5],
        'P': [-3, 5, -8, -5, 5, -5]
    };
    
    const base = baseEnergy;
    const dims = mbtiInfo.code.split('').map(c => mbtiBonus[c] || [0,0,0,0,0,0]);
    
    const data = [0,1,2,3,4,5].map(i => {
        let val = base + dims.reduce((sum, d) => sum + (d[i] || 0), 0);
        return Math.min(100, Math.max(20, val));
    });
    
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['事业', '情感', '财运', '健康', '社交', '成长'],
            datasets: [{
                data: data,
                backgroundColor: 'rgba(201, 169, 98, 0.1)',
                borderColor: 'rgba(201, 169, 98, 0.6)',
                borderWidth: 1,
                pointRadius: 2,
                pointBackgroundColor: 'rgba(201, 169, 98, 1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: { display: false },
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    angleLines: { color: 'rgba(255,255,255,0.05)' },
                    pointLabels: {
                        color: 'rgba(255,255,255,0.4)',
                        font: { size: 9 }
                    }
                }
            },
            plugins: { legend: { display: false } }
        }
    });
}

// ═══════════════════════════════════════════════
// 关键议题
// ═══════════════════════════════════════════════

function renderIssues(z, m, s, mbtiInfo, zodiacInfo) {
    const issues = generateCrossDimensionalIssues(z, m, s, mbtiInfo, zodiacInfo);
    
    document.getElementById('issuesList').innerHTML = issues.map(i => `
        <div class="issue-item">
            <div class="issue-icon">${i.icon}</div>
            <div>
                <div class="issue-text">${i.text}</div>
                <div class="issue-tag">${i.tag}</div>
            </div>
        </div>
    `).join('');
}

function generateCrossDimensionalIssues(z, m, s, mbtiInfo, zodiacInfo) {
    const ranking = state.fortuneData.rankings;
    const isTop = ranking?.top?.some(r => r.sign === state.zodiac);
    
    const issues = [];
    
    // 议题1：MBTI × 运势主题
    issues.push({
        icon: '◇',
        text: `<strong>${mbtiInfo.name}×${z.title}</strong>：作为${mbtiInfo.role}，本周"${z.title}"对你意味着${mbtiInfo.tf === 'T' ? '一个需要解决的现实问题' : '一段情感体验的旅程'}。你的${mbtiInfo.sn === 'N' ? '直觉会帮你看到机会' : '实感能帮你找到具体方法'}。`,
        tag: '性格×运势'
    });
    
    // 议题2：状态 × 幸运日
    issues.push({
        icon: '◈',
        text: `<strong>${s.name}状态×${z.lucky_day}</strong>：${s.category === 'hide' ? '你可能想躲起来，但幸运日的能量在外面' : s.category === 'control' ? '你的掌控欲在幸运日最容易实现' : '这个状态让幸运日的能量方向更明确'}。建议：${z.lucky_day}那天，做一件${s.energy}性质的事。`,
        tag: '状态×时机'
    });
    
    // 议题3：能量边界
    issues.push({
        icon: '○',
        text: `<strong>能量边界</strong>：与${z.avoid_sign}的摩擦，对${mbtiInfo.name}来说是${mbtiInfo.tf === 'T' ? '效率问题，不必情绪化处理' : '关系课题，值得反思自己的模式'}。${s.category === 'doubt' ? '你的怀疑状态可能放大这个问题，区分事实和感受。' : '保持觉察，不要被对方的节奏带偏。'}`,
        tag: '人际边界'
    });
    
    // 议题4：成长机会
    issues.push({
        icon: '◈',
        text: `<strong>本周成长机会</strong>：${mbtiInfo.name}在${s.name}状态下，最适合练习${mbtiInfo.tf === 'T' ? '情感表达' : '理性边界'}。${isTop ? '好运期是练习的最佳时机，失败成本低。' : '低谷期更需要这个能力，它能帮你破局。'}`,
        tag: '成长突破'
    });
    
    return issues;
}

// ═══════════════════════════════════════════════
// 行动指南
// ═══════════════════════════════════════════════

function renderGuide(z, m, s, mbtiInfo, zodiacInfo) {
    const guides = generatePersonalizedGuide(z, m, s, mbtiInfo, zodiacInfo);
    
    document.getElementById('guideGrid').innerHTML = guides.map(g => `
        <div class="guide-card">
            <div class="guide-icon">${g.icon}</div>
            <div class="guide-title">${g.title}</div>
            <div class="guide-text">${g.text}</div>
        </div>
    `).join('');
}

function generatePersonalizedGuide(z, m, s, mbtiInfo, zodiacInfo) {
    const ranking = state.fortuneData.rankings;
    const isTop = ranking?.top?.some(r => r.sign === state.zodiac);
    
    // 事业/学业 - 基于MBTI和状态
    const careerAdvice = generateCareerAdvice(mbtiInfo, s, z, isTop);
    
    // 关系经营 - 基于MBTI的TF维度和状态
    const relationshipAdvice = generateRelationshipAdvice(mbtiInfo, s, z);
    
    // 自我照顾 - 基于MBTI的EI维度和状态
    const selfCareAdvice = generateSelfCareAdvice(mbtiInfo, s, z);
    
    // 能量节奏 - 基于MBTI的JP维度和状态
    const energyAdvice = generateEnergyAdvice(mbtiInfo, s, z);
    
    return [
        { icon: '↗', title: '事业/学业', text: careerAdvice },
        { icon: '♡', title: '关系经营', text: relationshipAdvice },
        { icon: '○', title: '自我照顾', text: selfCareAdvice },
        { icon: '◈', title: '能量节奏', text: energyAdvice }
    ];
}

function generateCareerAdvice(mbtiInfo, s, z, isTop) {
    const base = `${z.lucky_day}是推进重要事务的最佳时机。`;
    
    const byRole = {
        '分析者': `${base}作为分析者，这周适合${isTop ? '做出关键决策，你的判断力很强' : '深入分析问题，找到根本原因'}。`,
        '外交家': `${base}作为外交家，这周适合${isTop ? '建立重要连接，你的人脉运很好' : '修复关系或寻求支持，你的共情力是资产'}。`,
        '守护者': `${base}作为守护者，这周适合${isTop ? '巩固成果，稳步推进' : '守护已有的成果，不急于扩张'}。`,
        '探索者': `${base}作为探索者，这周适合${isTop ? '抓住新机会，你的灵活性是优势' : '探索新方向，低谷期也可能是转机'}。`
    };
    
    let advice = byRole[mbtiInfo.role] || base;
    
    // 状态修正
    if (s.category === 'hide') {
        advice += `但你在"${s.name}"状态，可能想躲避。建议：至少完成一件重要的小事。`;
    } else if (s.category === 'control') {
        advice += `你的掌控状态很强，注意：不是所有事都需要你亲自把控。`;
    }
    
    return advice;
}

function generateRelationshipAdvice(mbtiInfo, s, z) {
    const tfAdvice = mbtiInfo.tf === 'T' 
        ? `本周与${z.lucky_sign}互动顺畅。作为思考型，建议：多表达你的关心，不需要完美的解决方案，有时候倾听就够了。`
        : `本周与${z.lucky_sign}互动顺畅。作为情感型，建议：保持你的敏感度，但也要设立边界，不是所有情绪都是你的责任。`;
    
    if (s.category === 'give') {
        return tfAdvice + `你在给予状态，注意：关系是双向的，这周练习接受。`;
    } else if (s.category === 'doubt') {
        return tfAdvice + `你的怀疑状态可能影响关系，提醒：区分事实和你的猜测。`;
    }
    
    return tfAdvice;
}

function generateSelfCareAdvice(mbtiInfo, s, z) {
    const eiAdvice = mbtiInfo.ei === 'E'
        ? `作为外向型，本周充电方式：高质量社交，但要选择能让你放松的人。`
        : `作为内向型，本周充电方式：独处时间，但不要完全与世隔绝。`;
    
    const stateModifier = {
        control: `你在掌控状态，给自己一个"不被掌控"的空间。`,
        give: `你在给予状态，这周练习：让别人照顾你一次。`,
        hide: `你在隐藏状态，允许自己躲一会儿，但${z.lucky_day}那天试着出来。`,
        express: `你在表达状态，找一个健康的输出渠道：写作、运动或创作。`,
        doubt: `你在怀疑状态，列出三件你做对的事，提醒自己你的价值。`,
        think: `你在思考状态，把思考转化为一个小行动。`,
        other: `留意身体信号，它会告诉你需要什么。`
    };
    
    return eiAdvice + (stateModifier[s.category] || '');
}

function generateEnergyAdvice(mbtiInfo, s, z) {
    const jpAdvice = mbtiInfo.jp === 'J'
        ? `判断型的你喜欢计划，这周把${z.lucky_day}标记为重点日，但允许计划有20%的弹性。`
        : `知觉型的你喜欢灵活，但这周建议：给${z.lucky_day}设一个明确的发力点。`;
    
    return jpAdvice + `你的"${s.name}"状态让能量节奏${s.category === 'hide' ? '偏慢' : s.category === 'express' ? '偏快' : '稳定'}，顺势而为。`;
}

// ═══════════════════════════════════════════════
// 幸运参数
// ═══════════════════════════════════════════════

function renderParams(z) {
    const colorMap = {
        '暖红色': '#e07040', '深绿色': '#2d5a3d', '雾蓝色': '#8fa4b2',
        '米白色': '#e8e8e0', '琥珀色': '#c4915a', '浅灰色': '#a0a0a0',
        '淡粉色': '#d4b8c4', '深紫色': '#6b3a7d', '天空蓝': '#5d9cad',
        '石墨灰': '#4a4a4a', '蓝色': '#4080c0', '浅海蓝': '#7d98a1'
    };
    
    document.getElementById('paramsGrid').innerHTML = `
        <div class="param-item">
            <div class="param-label">幸运数</div>
            <div class="param-value">${z.lucky_number || '-'}</div>
        </div>
        <div class="param-item">
            <div class="param-label">幸运日</div>
            <div class="param-value">${z.lucky_day || '-'}</div>
        </div>
        <div class="param-item">
            <div class="param-label">幸运色</div>
            <div class="param-value">${z.lucky_color || '-'}</div>
            <div class="param-dot" style="background: ${colorMap[z.lucky_color] || '#888'}"></div>
        </div>
        <div class="param-item">
            <div class="param-label">契合星座</div>
            <div class="param-value">${z.lucky_sign || '-'}</div>
        </div>
    `.trim();
}

// ═══════════════════════════════════════════════
// 辅助功能
// ═══════════════════════════════════════════════

function showHistory() {
    document.getElementById('historyList').innerHTML = `
        <div style="text-align: center; color: var(--smoke); padding: 20px;">
            <p style="font-size: 0.8rem;">往期回顾功能开发中</p>
        </div>
    `;
    document.getElementById('historyModal').classList.add('active');
}

function generateReport() {
    document.getElementById('shareModal').classList.add('active');
    
    const canvas = document.getElementById('shareCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 360;
    canvas.height = 480;
    
    ctx.fillStyle = '#06050a';
    ctx.fillRect(0, 0, 360, 480);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px serif';
    ctx.textAlign = 'center';
    ctx.fillText('miwu.', 180, 50);
    
    ctx.font = '14px sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.fillText(`${state.zodiac} · ${state.mbti} · ${state.sbtiData[state.sbti]?.name}`, 180, 100);
    
    const z = state.fortuneData?.horoscopes?.[state.zodiac];
    if (z) {
        ctx.font = '16px sans-serif';
        ctx.fillStyle = '#c9a962';
        ctx.fillText(z.title, 180, 150);
        
        ctx.font = '12px sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.fillText(`幸运日: ${z.lucky_day} | 幸运数: ${z.lucky_number}`, 180, 200);
        ctx.fillText(`幸运色: ${z.lucky_color} | 契合: ${z.lucky_sign}`, 180, 220);
    }
    
    ctx.font = '9px sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillText('仅供娱乐参考', 180, 450);
}

// ═══════════════════════════════════════════════
// 访问计数器
// ═══════════════════════════════════════════════

async function initVisitorCounter() {
    const counterNum = document.getElementById('counterNum');
    
    try {
        const response = await fetch('https://hits.dwyl.com/miwu-zhao/miwu-fortune.json');
        const data = await response.json();
        const count = data.value || 0;
        animateCounter(counterNum, count);
    } catch (e) {
        let count = parseInt(localStorage.getItem('miwu_visitor_count') || '0');
        count++;
        localStorage.setItem('miwu_visitor_count', count.toString());
        animateCounter(counterNum, count);
    }
}

function animateCounter(el, target) {
    let current = 0;
    const duration = 1500;
    const step = target / (duration / 16);
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        el.textContent = Math.floor(current).toLocaleString();
    }, 16);
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initVisitorCounter, 500);
});
