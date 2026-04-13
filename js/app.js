/**
 * miwu · 迷雾星盘
 * 三维运势解码系统
 */

// ═══════════════════════════════════════════════
// 数据定义
// ═══════════════════════════════════════════════

const ZODIAC_DATA = [
    { name: '白羊座', symbol: '♈', en: 'Aries' },
    { name: '金牛座', symbol: '♉', en: 'Taurus' },
    { name: '双子座', symbol: '♊', en: 'Gemini' },
    { name: '巨蟹座', symbol: '♋', en: 'Cancer' },
    { name: '狮子座', symbol: '♌', en: 'Leo' },
    { name: '处女座', symbol: '♍', en: 'Virgo' },
    { name: '天秤座', symbol: '♎', en: 'Libra' },
    { name: '天蝎座', symbol: '♏', en: 'Scorpio' },
    { name: '射手座', symbol: '♐', en: 'Sagittarius' },
    { name: '摩羯座', symbol: '♑', en: 'Capricorn' },
    { name: '水瓶座', symbol: '♒', en: 'Aquarius' },
    { name: '双鱼座', symbol: '♓', en: 'Pisces' }
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
        const [fortune, mbti, sbti] = await Promise.all([
            fetch('data/weekly-fortune.json'),
            fetch('data/mbti-data.json'),
            fetch('data/sbti-data.json')
        ]);
        state.fortuneData = await fortune.json();
        state.mbtiData = await mbti.json();
        state.sbtiData = await sbti.json();
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
    const sbtiTypes = Object.keys(state.sbtiData || {});
    document.getElementById('sbtiScroll').innerHTML = sbtiTypes.map(code => {
        const data = state.sbtiData[code];
        return `<button class="sbti-btn" data-value="${code}">
            <span class="sbti-code">${code}</span>
            <span class="sbti-name">${data?.name || code}</span>
        </button>`;
    }).join('');
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
// 核心解码逻辑
// ═══════════════════════════════════════════════

function decode() {
    if (!state.zodiac || !state.mbti || !state.sbti) {
        return;
    }
    
    // 显示加载
    document.getElementById('loadingOverlay').style.display = 'flex';
    
    setTimeout(() => {
        document.getElementById('loadingOverlay').style.display = 'none';
        renderResult();
    }, 1200);
}

function renderResult() {
    const z = state.fortuneData.horoscopes[state.zodiac];
    const m = state.mbtiData[state.mbti];
    const s = state.sbtiData[state.sbti];
    
    if (!z || !m || !s) return;
    
    // 核心摘要
    document.getElementById('fortuneTitle').textContent = generateTitle(z, m, s);
    document.getElementById('userConfig').textContent = `${state.zodiac} · ${state.mbti} · ${s.name}`;
    document.getElementById('weekInfo').textContent = `${state.fortuneData.week}`;
    
    // 能量指标
    renderMetrics(z, m, s);
    
    // 三维解码
    renderDecode(z, m, s);
    
    // 关键议题
    renderIssues(z, m, s);
    
    // 行动指南
    renderGuide(z, m, s);
    
    // 幸运参数
    renderParams(z);
    
    // 显示结果
    document.getElementById('resultSection').style.display = 'block';
    document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth' });
}

function generateTitle(z, m, s) {
    const templates = [
        `在${s.name}状态下审视${m.name}的${state.zodiac}周`,
        `${m.name}与${state.zodiac}的共振·${s.name}周期`,
        `${state.zodiac}星象下的${m.name}图谱`
    ];
    return templates[Math.floor(Math.random() * templates.length)];
}

function renderMetrics(z, m, s) {
    const metrics = [
        { label: '整体能量', value: Math.floor(60 + Math.random() * 30) + '%' },
        { label: '情感指数', value: Math.floor(50 + Math.random() * 40) + '%' },
        { label: '行动力', value: Math.floor(55 + Math.random() * 35) + '%' },
        { label: '洞察力', value: Math.floor(65 + Math.random() * 25) + '%' }
    ];
    
    document.getElementById('energyMetrics').innerHTML = metrics.map(m => `
        <div class="metric-item">
            <span class="metric-label">${m.label}</span>
            <span class="metric-value">${m.value}</span>
        </div>
    `).join('');
    
    // 绘制雷达图
    renderRadar();
}

function renderRadar() {
    const canvas = document.getElementById('fortuneRadar');
    const ctx = canvas.getContext('2d');
    
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['事业', '情感', '财运', '健康', '社交', '成长'],
            datasets: [{
                data: [
                    60 + Math.random() * 30,
                    50 + Math.random() * 40,
                    55 + Math.random() * 35,
                    65 + Math.random() * 25,
                    45 + Math.random() * 40,
                    70 + Math.random() * 25
                ],
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

function renderDecode(z, m, s) {
    // 生成更丰富的三维解码内容
    const decodeData = [
        {
            title: `星象层 · ${state.zodiac}`,
            content: generateZodiacDecode(z, m, s)
        },
        {
            title: `性格层 · ${m.name} (${state.mbti})`,
            content: generateMbtiDecode(z, m, s)
        },
        {
            title: `状态层 · ${s.name}`,
            content: generateSbtiDecode(z, m, s)
        }
    ];
    
    document.getElementById('decodeGrid').innerHTML = decodeData.map(d => `
        <div class="decode-item">
            <div class="decode-title">${d.title}</div>
            <div class="decode-content">${d.content}</div>
        </div>
    `).join('');
}

function generateZodiacDecode(z, m, s) {
    const ranking = state.fortuneData.rankings;
    let rankInfo = '';
    
    // 检查排名
    const topIndex = ranking?.top?.findIndex(r => r.sign === state.zodiac);
    const bottomIndex = ranking?.bottom?.findIndex(r => r.sign === state.zodiac);
    
    if (topIndex !== -1 && topIndex !== undefined) {
        rankInfo = `<span class="highlight">本周运势排名第${topIndex + 1}</span>，能量场格外活跃。`;
    } else if (bottomIndex !== -1 && bottomIndex !== undefined) {
        rankInfo = `<span class="highlight">本周能量相对低迷</span>，但这恰恰是内省和调整的绝佳时机。`;
    }
    
    return `
        <p>${state.zodiac}本周的核心能量围绕"<strong>${z.title}</strong>"展开。</p>
        <p style="margin-top: 10px;">${rankInfo}</p>
        <p style="margin-top: 10px;">${z.description}</p>
        <p style="margin-top: 10px; color: var(--gold);">
            📅 <strong>关键日期</strong>：${z.lucky_day}能量最旺，适合推进重要事项。
        </p>
        <p style="margin-top: 8px; color: var(--violet);">
            ⚠️ <strong>能量预警</strong>：与${z.avoid_sign}的互动需要更多耐心，这是能量边界，不是人际回避。
        </p>
    `;
}

function generateMbtiDecode(z, m, s) {
    const mbtiType = state.mbti;
    const keywords = m.keywords || [];
    
    // 根据MBTI四个维度生成个性化分析
    const ei = mbtiType[0] === 'E' ? '外向' : '内向';
    const sn = mbtiType[1] === 'S' ? '实感' : '直觉';
    const tf = mbtiType[2] === 'T' ? '思考' : '情感';
    const jp = mbtiType[3] === 'J' ? '判断' : '知觉';
    
    return `
        <p>${m.core_traits || m.description}</p>
        <p style="margin-top: 12px;">
            <strong>你的认知偏好</strong>：${ei}(${mbtiType[0]}) · ${sn}(${mbtiType[1]}) · ${tf}(${mbtiType[2]}) · ${jp}(${mbtiType[3]})
        </p>
        <p style="margin-top: 10px;">
            <strong>本周特质放大</strong>：你的「${keywords[0]}」特质会被星象能量放大。在处理问题时，这既是优势也是盲点——<em>过度依赖会变成限制</em>。
        </p>
        <p style="margin-top: 10px;">
            <strong>成长方向</strong>：${m.growth_edge || '本周适合探索自己的内在边界'}
        </p>
        <p style="margin-top: 10px; color: var(--rose);">
            💡 <strong>使用建议</strong>：${m.lucky_activities ? m.lucky_activities.slice(0, 3).join('、') : '深度思考、独立行动'}
        </p>
    `;
}

function generateSbtiDecode(z, m, s) {
    return `
        <p><strong>"${s.motto}"</strong></p>
        <p style="margin-top: 12px;">${s.core_state || s.description}</p>
        <p style="margin-top: 10px;">
            <strong>本周节奏</strong>：${s.weekly_rhythm || '保持自我觉察，顺应内在节奏'}
        </p>
        <p style="margin-top: 10px;">
            <strong>内心张力</strong>：${s.inner_tension || '觉察内在的微妙波动，不压抑也不过度放大'}
        </p>
        <p style="margin-top: 10px;">
            <strong>关系提醒</strong>：${s.relationship_reminder || '在关系中保持真实，不被角色定义'}
        </p>
        <p style="margin-top: 10px; color: var(--gold);">
            ✨ <strong>行动关键词</strong>：${s.action_hint || '接纳当下，顺势而为'}
        </p>
    `;
}

function renderIssues(z, m, s) {
    const issues = [
        {
            icon: '◇',
            text: `${m.name}的「${m.keywords[0]}」特质与本周${state.zodiac}能量产生微妙共振。当事情不如预期时，你会倾向于用「${m.keywords[1] || '理性'}」来应对。觉察这个模式，它既是你的力量，也可能成为盲区。`,
            tag: '性格×星象共振'
        },
        {
            icon: '◈',
            text: `「${s.name}」状态下，你内心有一股${s.inner_tension ? s.inner_tension.substring(0, 50) : '微妙的张力在涌动'}。这不是问题，而是信号——你的内在正在重新整合。给它空间，不要急着解决。`,
            tag: '内在信号'
        },
        {
            icon: '○',
            text: `本周与${z.avoid_sign || '某些人'}的互动可能消耗更多能量。这不是要你回避，而是提醒：<strong>边界是能量管理，不是人际疏离</strong>。在关系中选择何时投入、何时抽离。`,
            tag: '能量边界'
        },
        {
            icon: '◈',
            text: `${z.lucky_day}前后，你可能会遇到一个需要快速决策的时刻。作为${m.name}，你的本能反应是${m.keywords[2] || '深思熟虑'}。给自己30秒缓冲，让直觉和理性对话。`,
            tag: '决策提醒'
        }
    ];
    
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

function renderGuide(z, m, s) {
    const mbtiType = state.mbti;
    
    // 根据MBTI生成个性化建议
    const careerAdvice = generateCareerAdvice(z, m, s, mbtiType);
    const relationshipAdvice = generateRelationshipAdvice(z, m, s, mbtiType);
    const selfCareAdvice = generateSelfCareAdvice(z, m, s, mbtiType);
    const energyAdvice = generateEnergyAdvice(z, m, s, mbtiType);
    
    const guides = [
        {
            icon: '↗',
            title: '事业/学业',
            text: careerAdvice
        },
        {
            icon: '♡',
            title: '关系经营',
            text: relationshipAdvice
        },
        {
            icon: '○',
            title: '自我照顾',
            text: selfCareAdvice
        },
        {
            icon: '◈',
            title: '能量节奏',
            text: energyAdvice
        }
    ];
    
    document.getElementById('guideGrid').innerHTML = guides.map(g => `
        <div class="guide-card">
            <div class="guide-icon">${g.icon}</div>
            <div class="guide-title">${g.title}</div>
            <div class="guide-text">${g.text}</div>
        </div>
    `).join('');
}

function generateCareerAdvice(z, m, s, mbtiType) {
    const luckyDay = z.lucky_day;
    const keyword = m.keywords?.[0] || '专注';
    
    // 根据MBTI类型给出具体建议
    const mbtiTips = {
        'E': '主动沟通、展示想法、扩展人脉',
        'I': '深度思考、独立完成、避免过多会议',
        'S': '注重细节、踏实执行、用数据说话',
        'N': '创意策划、展望未来、提出新方案',
        'T': '逻辑分析、客观决策、解决难题',
        'F': '团队协作、关注感受、建立共识',
        'J': '制定计划、按部推进、及时复盘',
        'P': '灵活应变、保持开放、探索可能'
    };
    
    return `${luckyDay}是推进重要事务的最佳时机。作为${m.name}，本周重点发挥「${keyword}」优势。具体行动：${mbtiTips[mbtiType[0]]}、${mbtiTips[mbtiType[2]]}`;
}

function generateRelationshipAdvice(z, m, s, mbtiType) {
    const luckySign = z.lucky_sign || '水象星座';
    
    const tips = {
        'E': '主动发起对话，但也要留出倾听空间',
        'I': '选择一对一的深度交流，而非群体社交',
        'F': '表达你的真实感受，不要过度理性化',
        'T': '多一点温度，少一点道理'
    };
    
    return `${s.relationship_reminder ? s.relationship_reminder.substring(0, 40) : '本周适合深度连接'}。与${luckySign}的人互动更顺畅。小贴士：${tips[mbtiType[0]] || tips[mbtiType[2]] || '保持真实，不必刻意取悦'}。`;
}

function generateSelfCareAdvice(z, m, s, mbtiType) {
    const activities = m.lucky_activities || ['独处', '思考', '休息'];
    
    const selfCareTips = {
        'I': '每天预留一段完全独处的时间充电',
        'E': '和朋友聊天也是充电，但要选择高质量社交',
        'N': '允许自己天马行空，创意是最好的休息',
        'S': '做些手工、运动，让身体动起来',
        'T': '写日记整理思绪，逻辑能带来平静',
        'F': '听音乐、看展，让情感有出口',
        'J': '安排好的休息时间就认真休息',
        'P': '不需要计划休息，随心而动'
    };
    
    return `${m.growth_edge ? m.growth_edge.substring(0, 35) : '给自己独处和充电的空间'}。本周适合：${activities.slice(0, 2).join('、')}。${selfCareTips[mbtiType[0]] || ''}`;
}

function generateEnergyAdvice(z, m, s, mbtiType) {
    const luckyDay = z.lucky_day;
    
    return `${luckyDay}前后能量达到峰值，可以安排重要事项。其他时间保持匀速前进，不要过度消耗。作为${mbtiType[0] === 'J' ? 'J型人' : 'P型人'}，${mbtiType[3] === 'J' ? '按计划行事最安心，但也要允许适度弹性' : '保持灵活很重要，但重要事项还是要设deadline'}。`;
}

function renderParams(z) {
    const colorMap = {
        '烈焰橙': '#e07040',
        '橄榄棕': '#6b5b3d',
        '浅灰蓝': '#8fa4b2',
        '月光白': '#e8e8e0',
        '暗金色': '#a08040',
        '浅卡其': '#c3b091',
        '雾粉色': '#d4b8c4',
        '深酒红': '#622a30',
        '湖水蓝': '#5d9cad',
        '深灰色': '#4a4a4a',
        '电光紫': '#9050c0',
        '海雾蓝': '#7d98a1'
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
    
    // 背景
    ctx.fillStyle = '#06050a';
    ctx.fillRect(0, 0, 360, 480);
    
    // 品牌
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px serif';
    ctx.textAlign = 'center';
    ctx.fillText('miwu.', 170, 50);
    
    ctx.font = '11px sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillText('迷雾', 210, 50);
    
    ctx.font = '10px sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fillText('三维运势解码', 180, 70);
    
    // 配置
    const z = state.fortuneData.horoscopes[state.zodiac];
    const s = state.sbtiData[state.sbti];
    
    ctx.font = '14px sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.fillText(`${state.zodiac} · ${state.mbti} · ${s.name}`, 180, 110);
    
    // 标题
    ctx.font = '18px serif';
    ctx.fillStyle = '#c9a962';
    ctx.fillText(document.getElementById('fortuneTitle').textContent, 180, 160);
    
    // 周期
    ctx.font = '10px sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillText(state.fortuneData.week, 180, 185);
    
    // 幸运参数
    ctx.font = '12px sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.fillText(`幸运数: ${z.lucky_number} | 幸运日: ${z.lucky_day}`, 180, 230);
    ctx.fillText(`幸运色: ${z.lucky_color} | 契合: ${z.lucky_sign}`, 180, 250);
    
    // 底部
    ctx.font = '9px sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillText('仅供娱乐参考', 180, 450);
}

// ═══════════════════════════════════════════════
// 工具函数
// ═══════════════════════════════════════════════

function fadeUp(el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    requestAnimationFrame(() => {
        el.style.transition = 'all 0.6s cubic-bezier(0, 0, 0.2, 1)';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
    });
}

// ═══════════════════════════════════════════════
// 访问计数器
// ═══════════════════════════════════════════════

async function initVisitorCounter() {
    const counterNum = document.getElementById('counterNum');
    
    // 使用免费计数器API
    try {
        const response = await fetch('https://hits.dwyl.com/miwu-zhao/miwu-fortune.json');
        const data = await response.json();
        const count = data.value || 0;
        
        // 动画显示数字
        animateCounter(counterNum, count);
    } catch (e) {
        // 如果API失败，使用本地存储模拟
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

// 页面加载时初始化计数器
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initVisitorCounter, 500);
});
