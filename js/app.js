/**
 * miwu · 迷雾星盘
 * 三维运势解码系统 v3.0
 * 简洁版 - 直接有用
 */

const ZODIAC_DATA = [
    { name: '白羊座', symbol: '♈' },
    { name: '金牛座', symbol: '♉' },
    { name: '双子座', symbol: '♊' },
    { name: '巨蟹座', symbol: '♋' },
    { name: '狮子座', symbol: '♌' },
    { name: '处女座', symbol: '♍' },
    { name: '天秤座', symbol: '♎' },
    { name: '天蝎座', symbol: '♏' },
    { name: '射手座', symbol: '♐' },
    { name: '摩羯座', symbol: '♑' },
    { name: '水瓶座', symbol: '♒' },
    { name: '双鱼座', symbol: '♓' }
];

const MBTI_TYPES = [
    { code: 'INTJ', name: '建筑师' },
    { code: 'INTP', name: '逻辑学家' },
    { code: 'ENTJ', name: '指挥官' },
    { code: 'ENTP', name: '辩论家' },
    { code: 'INFJ', name: '提倡者' },
    { code: 'INFP', name: '调停者' },
    { code: 'ENFJ', name: '主人公' },
    { code: 'ENFP', name: '竞选者' },
    { code: 'ISTJ', name: '物流师' },
    { code: 'ISFJ', name: '守卫者' },
    { code: 'ESTJ', name: '总经理' },
    { code: 'ESFJ', name: '执政官' },
    { code: 'ISTP', name: '鉴赏家' },
    { code: 'ISFP', name: '探险家' },
    { code: 'ESTP', name: '企业家' },
    { code: 'ESFP', name: '表演者' }
];

const SBTI_DATA = {
    "CTRL": { "name": "拿捏者", "motto": "怎么样，被我拿捏了吧？" },
    "ATM-er": { "name": "送钱者", "motto": "你以为我很有钱吗？" },
    "BOSS": { "name": "领导者", "motto": "方向盘给我，我来开。" },
    "THAN-K": { "name": "感恩者", "motto": "我感谢苍天！我感谢大地！" },
    "OH-NO": { "name": "哦不人", "motto": "哦不！我怎么会是这个人格？！" },
    "GOGO": { "name": "行者", "motto": "gogogo~出发咯" },
    "SEXY": { "name": "尤物", "motto": "您就是天生的尤物！" },
    "LOVE-R": { "name": "多情者", "motto": "爱意太满，现实显得有点贫瘠。" },
    "MUM": { "name": "妈妈", "motto": "或许...我可以叫你妈妈吗?" },
    "FAKE": { "name": "伪人", "motto": "已经，没有人类了。" },
    "OJBK": { "name": "无所谓人", "motto": "我说随便，是真的随便。" },
    "MALO": { "name": "吗喽", "motto": "人生是个副本，我只是一只吗喽。" },
    "JOKE-R": { "name": "小丑", "motto": "原来我们都是小丑。" },
    "WOC": { "name": "握草人", "motto": "卧槽，我怎么是这个人格？" },
    "THIN-K": { "name": "思考者", "motto": "已深度思考100s。" },
    "SHIT": { "name": "愤世者", "motto": "这个世界，构石一坨。" },
    "ZZZZ": { "name": "装死者", "motto": "我没死，我只是在睡觉。" },
    "POOR": { "name": "贫困者", "motto": "我穷，但我很专。" },
    "MONK": { "name": "僧人", "motto": "没有那种世俗的欲望。" },
    "IMSB": { "name": "傻者", "motto": "认真的么？我真的是傻逼么？" },
    "SOLO": { "name": "孤儿", "motto": "我哭了，我怎么会是孤儿？" },
    "FUCK": { "name": "草者", "motto": "操！这是什么人格？" },
    "DEAD": { "name": "死者", "motto": "我，还活着吗？" },
    "IMFW": { "name": "废物", "motto": "我真的...是废物吗？" },
    "HHHH": { "name": "傻乐者", "motto": "哈哈哈哈哈哈。" },
    "DRUNK": { "name": "酒鬼", "motto": "烈酒烧喉，不得不醉。" },
    "Dior-s": { "name": "屌丝", "motto": "等着我屌丝逆袭。" }
};

const state = {
    zodiac: null,
    mbti: null,
    sbti: null,
    fortuneData: null,
    mbtiData: null
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
    } catch (e) {
        console.error('数据加载失败', e);
    }
}

function renderSelectors() {
    document.getElementById('zodiacGrid').innerHTML = ZODIAC_DATA.map(z => `
        <button class="zodiac-btn" data-value="${z.name}">
            <span class="zodiac-icon">${z.symbol}</span>
            <span class="zodiac-name">${z.name}</span>
        </button>
    `).join('');
    
    document.getElementById('mbtiGrid').innerHTML = MBTI_TYPES.map(t => `
        <button class="mbti-btn" data-value="${t.code}">
            <span class="mbti-code">${t.code}</span>
            <span class="mbti-name">${t.name}</span>
        </button>
    `).join('');
    
    document.getElementById('sbtiScroll').innerHTML = Object.keys(SBTI_DATA).map(code => {
        const data = SBTI_DATA[code];
        return `<button class="sbti-btn" data-value="${code}">
            <span class="sbti-code">${code}</span>
            <span class="sbti-name">${data.name}</span>
        </button>`;
    }).join('');
}

function bindEvents() {
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
    
    document.getElementById('queryBtn').addEventListener('click', decode);
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
// 核心解码 - 简洁版
// ═══════════════════════════════════════════════

function decode() {
    const missing = [];
    if (!state.zodiac) missing.push('星座');
    if (!state.mbti) missing.push('MBTI');
    if (!state.sbti) missing.push('状态');
    
    if (missing.length > 0) {
        alert(`请先选择：${missing.join('、')}`);
        return;
    }
    
    document.getElementById('loadingOverlay').style.display = 'flex';
    
    setTimeout(() => {
        document.getElementById('loadingOverlay').style.display = 'none';
        renderResult();
    }, 800);
}

function renderResult() {
    const z = state.fortuneData?.horoscopes?.[state.zodiac];
    const m = state.mbtiData?.[state.mbti];
    const s = SBTI_DATA[state.sbti];
    const mbtiType = MBTI_TYPES.find(t => t.code === state.mbti);
    
    if (!z || !m || !s) {
        alert('数据加载异常，请刷新页面重试');
        return;
    }
    
    // 检查运势排名
    const isTop = state.fortuneData.rankings?.top?.some(r => r.sign === state.zodiac);
    const isBottom = state.fortuneData.rankings?.bottom?.some(r => r.sign === state.zodiac);
    
    // 核心摘要
    document.getElementById('fortuneTitle').textContent = `${state.zodiac}本周${isTop ? '好运加持' : isBottom ? '需要稳住' : '平稳过渡'}`;
    document.getElementById('userConfig').textContent = `${mbtiType.name} · ${s.name}`;
    document.getElementById('weekInfo').textContent = state.fortuneData.week;
    
    // 能量值（简化）
    renderMetrics(z, isTop, isBottom);
    
    // 一句话解读
    renderDecode(z, m, s, mbtiType, isTop, isBottom);
    
    // 本周建议（3条）
    renderAdvice(z, m, s, mbtiType, isTop);
    
    // 幸运参数
    renderParams(z);
    
    // 显示结果
    document.getElementById('resultSection').style.display = 'block';
    document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth' });
}

function renderMetrics(z, isTop, isBottom) {
    const baseEnergy = isTop ? 80 : (isBottom ? 45 : 62);
    
    const metrics = [
        { label: '整体能量', value: baseEnergy + '%' },
        { label: '情感指数', value: (baseEnergy + Math.floor(Math.random() * 10) - 5) + '%' },
        { label: '行动力', value: (baseEnergy + Math.floor(Math.random() * 10) - 5) + '%' },
        { label: '洞察力', value: (baseEnergy + Math.floor(Math.random() * 8) - 4) + '%' }
    ];
    
    document.getElementById('energyMetrics').innerHTML = metrics.map(m => `
        <div class="metric-item">
            <span class="metric-label">${m.label}</span>
            <span class="metric-value">${m.value}</span>
        </div>
    `).join('');
    
    // 简化的雷达图
    const canvas = document.getElementById('fortuneRadar');
    const ctx = canvas.getContext('2d');
    
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['事业', '情感', '财运', '健康', '社交'],
            datasets: [{
                data: [
                    baseEnergy + (Math.random() * 20 - 10),
                    baseEnergy + (Math.random() * 20 - 10),
                    baseEnergy + (Math.random() * 15 - 7),
                    baseEnergy + (Math.random() * 10 - 5),
                    baseEnergy + (Math.random() * 20 - 10)
                ],
                backgroundColor: 'rgba(201, 169, 98, 0.15)',
                borderColor: 'rgba(201, 169, 98, 0.6)',
                borderWidth: 1.5,
                pointRadius: 3,
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
                    grid: { color: 'rgba(255,255,255,0.08)' },
                    angleLines: { color: 'rgba(255,255,255,0.08)' },
                    pointLabels: {
                        color: 'rgba(255,255,255,0.5)',
                        font: { size: 11 }
                    }
                }
            },
            plugins: { legend: { display: false } }
        }
    });
}

function renderDecode(z, m, s, mbtiType, isTop, isBottom) {
    // 一句话核心解读
    let coreReading = '';
    
    if (isTop) {
        coreReading = `本周${state.zodiac}运势旺盛，${mbtiType.name}的你正处于"${s.name}"状态，好能量会放大你的优势。`;
    } else if (isBottom) {
        coreReading = `本周${state.zodiac}能量偏低，但${mbtiType.name}的韧性+${s.name}状态，反而能让你在压力下成长。`;
    } else {
        coreReading = `本周${state.zodiac}运势平稳，${mbtiType.name}配${s.name}状态，适合稳扎稳打、积累能量。`;
    }
    
    const decodeData = [
        { title: '本周核心', content: `<p><strong>${z.title}</strong></p><p style="margin-top:8px">${z.description}</p>` },
        { title: '你的解读', content: `<p>${coreReading}</p><p style="margin-top:10px;color:var(--gold)">"${s.motto}"</p>` },
        { title: '关键提醒', content: `<p>${generateKeyReminder(z, mbtiType, s, isTop, isBottom)}</p>` }
    ];
    
    document.getElementById('decodeGrid').innerHTML = decodeData.map(d => `
        <div class="decode-item">
            <div class="decode-title">${d.title}</div>
            <div class="decode-content">${d.content}</div>
        </div>
    `).join('');
    
    // 关键议题（简化为2条）
    document.getElementById('issuesList').innerHTML = `
        <div class="issue-item">
            <div class="issue-icon">⚡</div>
            <div>
                <div class="issue-text"><strong>${z.lucky_day}</strong>是你的能量日，适合推进重要事项。</div>
                <div class="issue-tag">最佳时机</div>
            </div>
        </div>
        <div class="issue-item">
            <div class="issue-icon">⚠️</div>
            <div>
                <div class="issue-text">与<strong>${z.avoid_sign}</strong>的互动需要耐心，不是回避，是边界管理。</div>
                <div class="issue-tag">能量边界</div>
            </div>
        </div>
    `;
}

function generateKeyReminder(z, mbtiType, s, isTop, isBottom) {
    const reminders = {
        'INTJ': isTop ? '好运时别忘了分享功劳，你的团队需要被看见。' : '低谷期是你的战略期，想清楚再行动。',
        'INTP': isTop ? '灵感爆棚但要落地，先完成一个。' : '分析再多不如试一次，这周做一个决定。',
        'ENTJ': isTop ? '领导力是你的优势，但也要听取不同声音。' : '困难时期更考验领导力，稳住军心。',
        'ENTP': isTop ? '创意很多，选一个最可行的先做。' : '别同时开太多线，专注一个突破口。',
        'INFJ': isTop ? '好能量适合帮助他人，但先照顾好自己。' : '低谷期适合内省，答案会在安静中出现。',
        'INFP': isTop ? '理想可以实现，但要拆成小步骤。' : '不完美也没关系，先做再完善。',
        'ENFJ': isTop ? '你的感染力很强，带团队一起上。' : '先照顾好自己的情绪，才能帮助别人。',
        'ENFP': isTop ? '热情很好，但要有始有终。' : '低谷只是暂时的，找到让你兴奋的一件事。',
        'ISTJ': isTop ? '按计划推进，稳步前进。' : '坚持你的方法，低谷期更显价值。',
        'ISFJ': isTop ? '照顾别人时也记得照顾自己。' : '稳定的你是团队的安全感来源。',
        'ESTJ': isTop ? '高效执行是你的强项，带着团队冲。' : '压力下保持秩序，就是你的价值。',
        'ESFJ': isTop ? '人际关系是你的资产，善用它。' : '别人的情绪不是你的责任，先稳住自己。',
        'ISTP': isTop ? '动手解决问题，行动力是你的优势。' : '静下来观察，找到关键问题。',
        'ISFP': isTop ? '创意和美感让你出彩，展示自己。' : '低能量时做点让自己舒服的事。',
        'ESTP': isTop ? '抓住机会快速行动，这是你的主场。' : '冲动前停三秒，想清楚再上。',
        'ESFP': isTop ? '快乐会感染，带给大家能量。' : '低落时找朋友聊聊，别一个人扛。'
    };
    
    return reminders[mbtiType.code] || '本周稳住节奏，做好自己能控制的事。';
}

function renderAdvice(z, m, s, mbtiType, isTop) {
    // 3条具体建议
    const advices = [
        {
            icon: '→',
            title: '事业上',
            text: generateCareerAdvice(mbtiType, s, z, isTop)
        },
        {
            icon: '♡',
            title: '感情里',
            text: generateLoveAdvice(mbtiType, z)
        },
        {
            icon: '○',
            title: '照顾自己',
            text: generateSelfCareAdvice(mbtiType, s)
        },
        {
            icon: '◈',
            title: '本周节奏',
            text: `${z.lucky_day}能量最佳，重要事项放这天。其他时间保持匀速，不要过度消耗。`
        }
    ];
    
    document.getElementById('guideGrid').innerHTML = advices.map(a => `
        <div class="guide-card">
            <div class="guide-icon">${a.icon}</div>
            <div class="guide-title">${a.title}</div>
            <div class="guide-text">${a.text}</div>
        </div>
    `).join('');
}

function generateCareerAdvice(mbtiType, s, z, isTop) {
    const base = `${z.lucky_day}适合推进重要工作。`;
    
    const byRole = {
        '分析者': `${base}你的判断力强，这周适合做关键决策。`,
        '外交家': `${base}发挥你的沟通优势，处理好人际关系就等于成功一半。`,
        '守护者': `${base}稳扎稳打，按计划执行就是最好的策略。`,
        '探索者': `${base}保持灵活，但选一个方向先推进到底。`
    };
    
    return byRole[mbtiType.role] || base;
}

function generateLoveAdvice(mbtiType, z) {
    return `本周感情关键词：「${z.love}」。与${z.lucky_sign}互动更顺畅，真诚表达比猜来猜去有效。`;
}

function generateSelfCareAdvice(mbtiType, s) {
    const byEnergy = mbtiType.code[0] === 'E' 
        ? '高质量社交能给你充电，但要选对人。'
        : '独处时间很重要，但不要完全封闭自己。';
    
    return `${byEnergy} 你的"${s.name}"状态提醒：关注自己的真实需求。`;
}

function renderParams(z) {
    const colorMap = {
        '暖红色': '#e07040', '深绿色': '#2d5a3d', '雾蓝色': '#8fa4b2',
        '米白色': '#e8e8e0', '琥珀色': '#c4915a', '浅灰色': '#a0a0a0',
        '淡粉色': '#d4b8c4', '深紫色': '#6b3a7d', '天空蓝': '#5d9cad',
        '石墨灰': '#4a4a4a', '蓝色': '#4080c0', '浅海蓝': '#7d98a1',
        '金色': '#c9a962', '橙红色': '#e06030', '墨绿色': '#3a5a40',
        '电光蓝': '#4080ff'
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
    `;
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
    canvas.height = 400;
    
    ctx.fillStyle = '#06050a';
    ctx.fillRect(0, 0, 360, 400);
    
    ctx.fillStyle = '#c9a962';
    ctx.font = 'bold 24px serif';
    ctx.textAlign = 'center';
    ctx.fillText('miwu.', 180, 45);
    
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = '16px sans-serif';
    ctx.fillText(`${state.zodiac} · ${state.mbti}`, 180, 90);
    
    const z = state.fortuneData?.horoscopes?.[state.zodiac];
    if (z) {
        ctx.fillStyle = '#c9a962';
        ctx.font = '18px sans-serif';
        ctx.fillText(z.title, 180, 140);
        
        ctx.font = '13px sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.fillText(`幸运日: ${z.lucky_day}  幸运数: ${z.lucky_number}`, 180, 180);
        ctx.fillText(`幸运色: ${z.lucky_color}  契合: ${z.lucky_sign}`, 180, 205);
    }
    
    ctx.font = '10px sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillText('仅供娱乐参考', 180, 370);
}

// ═══════════════════════════════════════════════
// 访问计数器
// ═══════════════════════════════════════════════

async function initVisitorCounter() {
    const counterNum = document.getElementById('counterNum');
    try {
        const response = await fetch('https://hits.dwyl.com/miwu-zhao/miwu-fortune.json');
        const data = await response.json();
        animateCounter(counterNum, data.value || 0);
    } catch (e) {
        let count = parseInt(localStorage.getItem('miwu_visitor_count') || '0');
        count++;
        localStorage.setItem('miwu_visitor_count', count.toString());
        animateCounter(counterNum, count);
    }
}

function animateCounter(el, target) {
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 50));
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        el.textContent = current.toLocaleString();
    }, 25);
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initVisitorCounter, 500);
});
