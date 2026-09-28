/* L&O Nexus — Demonstração estática
   Sem backend: favoritos, tema e estado do menu ficam apenas no localStorage do navegador,
   só como conveniência de protótipo — não representam persistência real do sistema real. */

const Nexus = (() => {
    function safeGet(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch {
            return fallback;
        }
    }

    function safeSet(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch {
            /* ambiente sem storage disponível — ignora silenciosamente */
        }
    }

    function initTheme() {
        const saved = safeGet('nexus.theme', 'dark');
        if (saved === 'light') document.documentElement.setAttribute('data-theme', 'light');
        const btn = document.querySelector('[data-theme-toggle]');
        if (!btn) return;
        updateThemeButton(btn);
        btn.addEventListener('click', () => {
            const isLight = document.documentElement.getAttribute('data-theme') === 'light';
            if (isLight) {
                document.documentElement.removeAttribute('data-theme');
                safeSet('nexus.theme', 'dark');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                safeSet('nexus.theme', 'light');
            }
            updateThemeButton(btn);
        });
    }

    function updateThemeButton(btn) {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        btn.textContent = isLight ? '🌙' : '☀️';
        btn.setAttribute('aria-label', isLight ? 'Mudar para o tema escuro' : 'Mudar para o tema claro');
        btn.title = btn.getAttribute('aria-label');
    }

    function initSidebar() {
        const sidebar = document.querySelector('.sidebar');
        const toggle = document.querySelector('.collapse-toggle');
        if (!sidebar || !toggle) return;

        if (safeGet('nexus.sidebarCollapsed', false)) sidebar.classList.add('collapsed');

        toggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            safeSet('nexus.sidebarCollapsed', sidebar.classList.contains('collapsed'));
        });
    }

    function markActiveNav() {
        const current = document.body.dataset.page;
        document.querySelectorAll('.nav-item[data-page]').forEach((el) => {
            if (el.dataset.page === current) el.classList.add('nav-item-active');
        });
    }

    async function loadData(file) {
        const res = await fetch(`data/${file}`);
        if (!res.ok) throw new Error(`Falha ao carregar ${file}`);
        return res.json();
    }

    function isFavorite(id) {
        return safeGet('nexus.favorites', []).includes(id);
    }

    function toggleFavorite(id) {
        const favs = safeGet('nexus.favorites', []);
        const idx = favs.indexOf(id);
        if (idx >= 0) favs.splice(idx, 1); else favs.push(id);
        safeSet('nexus.favorites', favs);
        return favs.includes(id);
    }

    const INTEGRATION_LABEL = {
        atalho_externo: 'Atalho externo',
        nova_aba: 'Nova aba',
        iframe: 'Incorporado (iframe)',
        auth_externa: 'Autenticação externa',
        sso: 'Login único (SSO)',
        api: 'Integração via API',
        importacao: 'Importação de dados',
        pendente: 'Pendente',
    };

    function integrationLabel(type) {
        return INTEGRATION_LABEL[type] || type;
    }

    function statusLabel(status) {
        const map = { ativo: 'Ativo', manutencao: 'Manutenção', rascunho: 'Rascunho', descontinuado: 'Descontinuado' };
        return map[status] || status;
    }

    function statusChipClass(status) {
        const map = { ativo: 'chip-brand-bg', manutencao: 'chip-warning-bg', rascunho: 'chip-info-bg', descontinuado: 'chip-danger-bg' };
        return map[status] || 'chip-info-bg';
    }

    async function renderTicker(container) {
        try {
            const items = await loadData('comunicados.json');
            if (!items.length) { container.style.display = 'none'; return; }
            const chipClass = { atencao: 'chip-warning-bg', informativo: 'chip-info-bg', critico: 'chip-danger-bg' };
            const track = items.map(a => `
                <span class="ticker__item">
                    <span class="ticker__flag ${chipClass[a.priority] || 'chip-info-bg'}">${a.priority_label}</span>
                    ${a.title} — ${a.body}
                </span>
            `).join('');
            container.innerHTML = `<div class="ticker__track">${track}${track}</div>`;
        } catch {
            container.style.display = 'none';
        }
    }

    async function renderAreas(container) {
        try {
            const areas = await loadData('areas.json');
            container.innerHTML = areas.map((area, idx) => {
                const hasItems = area.items && area.items.length > 0;
                return `
                    <div class="area-group">
                        <div class="nav-item area-toggle" data-area="${idx}">
                            <span class="icon">${area.icon}</span>
                            <span class="nav-label">${area.name}</span>
                            <span class="chevron">▾</span>
                        </div>
                        <div class="area-body" data-area-body="${idx}">
                            ${hasItems ? area.items.map(group => `
                                <div class="area-cat">${group.category}</div>
                                ${group.links.map(l => `<a href="${l.type}s.html">${l.icon} ${l.title}</a>`).join('')}
                            `).join('') : 'Nenhum conteúdo cadastrado ainda.'}
                        </div>
                    </div>
                `;
            }).join('');

            container.querySelectorAll('.area-toggle').forEach(el => {
                el.addEventListener('click', () => {
                    el.classList.toggle('open');
                    const body = container.querySelector(`[data-area-body="${el.dataset.area}"]`);
                    body.classList.toggle('open');
                });
            });
        } catch {
            container.innerHTML = '';
        }
    }

    function init() {
        initTheme();
        initSidebar();
        markActiveNav();
        const ticker = document.querySelector('[data-ticker]');
        if (ticker) renderTicker(ticker);
        const areas = document.querySelector('[data-areas]');
        if (areas) renderAreas(areas);
    }

    return { loadData, isFavorite, toggleFavorite, statusLabel, statusChipClass, integrationLabel, init };
})();

document.addEventListener('DOMContentLoaded', Nexus.init);
