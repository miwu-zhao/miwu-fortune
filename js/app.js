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
    const decodeData = [
        {
            title: `星象层 · ${state.zodiac}`,
            content: `${state.zodiac}本周的核心能量围绕"${z.title}"展开。这不仅是外在运势的映射，更是内在节奏的显现。作为${state.zodiac}，你对${z.lucky_day}的能量特别敏感，这天适合重要决策。`
        },
        {
            title: `性格层 · ${m.name}`,
            content: `${m.core_traits ? m.core_traits.substring(0, 100) : m.description}。本周你的${m.keywords[0]}特质会 amplified，在处理问题时会更依赖这一优势。`
        },
        {
            title: `状态层 · ${s.name}`,
            content: `当前"${s.name}"状态意味着：${s.core_state ? s.core_state.substring(0, 80) : s.description}。这个状态会影响你本周的决策方式和人际互动模式。`
        }
    ];
    
    document.getElementById('decodeGrid').innerHTML = decodeData.map(d => `
        <div class="decode-item">
            <div class="decode-title">${d.title}</div>
            <div class="decode-content">${d.content}</div>
        </div>
    `).join('');
}

function renderIssues(z, m, s) {
    const issues = [
        {
            icon: '◇',
            text: `${m.name}的${m.keywords[0]}特质与本周${state.zodiac}的能量可能产生张力，在${z.lucky_day}前后需要特别留意决策节奏。`,
            tag: '性格×星象'
        },
        {
            icon: '◈',
            text: `${s.name}状态提示：${s.inner_tension ? s.inner_tension.substring(0, 60) : '本周内心可能存在微妙张力'}。觉察这种张力，而不是压抑它。`,
            tag: '状态觉察'
        },
        {
            icon: '○',
            text: `${z.avoid_sign ? `本周与${z.avoid_sign}相关的人事物需要更多耐心` : '人际互动需要边界感'}。这不是回避，而是能量管理。`,
            tag: '人际边界'
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
    const guides = [
        {
            icon: '↗',
            title: '事业/学业',
            text: `${z.lucky_day}是推进重要事务的最佳时机。作为${m.name}，发挥你的${m.keywords[0]}优势。`
        },
        {
            icon: '◇',
            title: '关系经营',
            text: `${s.relationship_reminder ? s.relationship_reminder.substring(0, 50) : '本周适合深度对话而非表面社交'}。`
        },
        {
            icon: '○',
            title: '自我照顾',
            text: `${m.growth_edge ? m.growth_edge.substring(0, 40) : '给自己独处和充电的空间'}。`
        },
        {
            icon: '◈',
            title: '能量管理',
            text: `${z.lucky_day}前后能量峰值，其他时间保持节奏，避免过度消耗。`
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
