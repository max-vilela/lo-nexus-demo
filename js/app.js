/* L&O Nexus — Demonstração estática
   Sem backend: favoritos e estado do menu ficam apenas no localStorage do navegador,
   só como conveniência de protótipo — não representam persistência real do sistema. */

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

    function initSidebar() {
        const sidebar = document.querySelector('.sidebar');
        const toggle = document.querySelector('.collapse-toggle');
        if (!sidebar || !toggle) return;

        if (safeGet('nexus.sidebarCollapsed', false)) {
            sidebar.classList.add('collapsed');
        }

        toggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            safeSet('nexus.sidebarCollapsed', sidebar.classList.contains('collapsed'));
        });

        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => sidebar.classList.toggle('open'));
        }
    }

    function markActiveNav() {
        const current = document.body.dataset.page;
        document.querySelectorAll('.nav-item[data-page]').forEach((el) => {
            if (el.dataset.page === current) el.classList.add('active');
        });
    }

    async function loadData(file) {
        const res = await fetch(`data/${file}`);
        if (!res.ok) throw new Error(`Falha ao carregar ${file}`);
        return res.json();
    }

    function isFavorite(id) {
        const favs = safeGet('nexus.favorites', []);
        return favs.includes(id);
    }

    function toggleFavorite(id) {
        const favs = safeGet('nexus.favorites', []);
        const idx = favs.indexOf(id);
        if (idx >= 0) favs.splice(idx, 1); else favs.push(id);
        safeSet('nexus.favorites', favs);
        return favs.includes(id);
    }

    function statusLabel(status) {
        const map = {
            ativo: 'Ativo',
            manutencao: 'Manutenção',
            rascunho: 'Rascunho',
            descontinuado: 'Descontinuado',
        };
        return map[status] || status;
    }

    function licenseLabel(license) {
        const map = {
            free: 'Requer licença Free',
            pro: 'Requer licença Pro',
            ppu: 'Requer licença PPU',
            nao_aplicavel: '',
        };
        return map[license] || '';
    }

    function init() {
        initSidebar();
        markActiveNav();
    }

    return { loadData, isFavorite, toggleFavorite, statusLabel, licenseLabel, init };
})();

document.addEventListener('DOMContentLoaded', Nexus.init);
