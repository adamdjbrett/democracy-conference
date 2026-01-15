/**
 * Axcora Commerce Pro - Core JS
 * Zetta Core Standard 2026
 * Final Stability Fix: Home Context & Mutation Observer
 */

window.zettaTimer = null;

const initCountdown = () => {
    const card = document.getElementById('countdown-card');
    
    if (window.zettaTimer) {
        clearInterval(window.zettaTimer);
        window.zettaTimer = null;
    }

    if (!card) return;

    // FORCE CLEANUP: Jika elemen ada, pastikan tidak ada teks 'Loading'
    const targets = ['d-days', 'd-hours', 'd-mins', 'd-secs'];
    targets.forEach(id => {
        const el = document.getElementById(id);
        if (el && el.innerText.toLowerCase().includes('load')) el.innerText = '00';
    });

    const startTime = new Date(card.dataset.start.replace(' ', 'T')).getTime();
    const endTime = new Date(card.dataset.end.replace(' ', 'T')).getTime();

    if (isNaN(startTime) || isNaN(endTime)) return;

    const updateTimer = () => {
        const now = new Date().getTime();
        let diff;

        if (now > endTime) {
            const lbl = document.getElementById('status-label');
            if (lbl) {
                lbl.innerText = "THIS SESSION HAS CONCLUDED";
                lbl.className = "fw-bold text-white-50 mb-4 small ls-2";
            }
            [...targets].forEach(id => { 
                const el = document.getElementById(id); 
                if(el) el.innerText = "00"; 
            });
            if (window.zettaTimer) clearInterval(window.zettaTimer);
            return;
        }

        if (now >= startTime && now <= endTime) {
            const lbl = document.getElementById('status-label');
            if (lbl) {
                lbl.innerText = "● LIVE NOW - ENDING IN";
                lbl.className = "fw-bold text-success animate-pulse mb-4 small ls-2";
            }
            diff = endTime - now;
        } else {
            const lbl = document.getElementById('status-label');
            if (lbl) {
                lbl.innerText = "TIME UNTIL SESSION STARTS";
                lbl.className = "fw-bold text-gold-soft mb-4 small ls-2";
            }
            diff = startTime - now;
        }

        const d = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
        const h = Math.max(0, Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
        const m = Math.max(0, Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
        const s = Math.max(0, Math.floor((diff % (1000 * 60)) / 1000));

        const setVal = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.innerText = String(val).padStart(2, '0');
        };

        setVal('d-days', d);
        setVal('d-hours', h);
        setVal('d-mins', m);
        setVal('d-secs', s);
    };

    window.zettaTimer = setInterval(updateTimer, 1000);
    updateTimer();
};

const initCore = () => {
    initCountdown();

    // 1. UPDATE SCHEDULE STATUSES (Menghilangkan stuck 'LOADING' pada accordion)
    // Kita jalankan langsung setiap kali initCore dipanggil oleh SPA
    const updateAllStatuses = () => {
        const badges = document.querySelectorAll('.status-badge');
        if (badges.length === 0) return;
        const now = new Date().getTime();
        badges.forEach(el => {
            const start = new Date(el.dataset.start).getTime();
            const end = new Date(el.dataset.end).getTime();
            if (isNaN(start) || isNaN(end)) return;
            if (now >= start && now <= end) {
                el.innerText = "● LIVE NOW";
                el.className = "status-badge badge bg-success text-white ms-2 animate-pulse";
            } else if (now < start) {
                el.innerText = "UPCOMING";
                el.className = "status-badge badge border border-maroon text-maroon small ms-2";
            } else {
                el.innerText = "CONCLUDED";
                el.className = "status-badge badge bg-secondary text-white ms-2";
            }
        });
    };
    updateAllStatuses();

    // NAVBAR TOGGLE
    const navBtn = document.querySelector('.navbar-toggler');
    const navCollapse = document.querySelector('.navbar-collapse');
    if (navBtn && navCollapse) {
        navBtn.onclick = (e) => {
            e.preventDefault();
            navCollapse.classList.toggle('show');
        };
    }

    // ACCORDION
    document.querySelectorAll('.accordion-button').forEach(btn => {
        btn.onclick = function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('data-bs-target'));
            if (!target) return;
            const parent = this.closest('.accordion');
            const isOpen = target.classList.contains('show');

            if (parent) {
                parent.querySelectorAll('.accordion-collapse').forEach(c => c.classList.remove('show'));
                parent.querySelectorAll('.accordion-button').forEach(b => {
                    b.classList.add('collapsed');
                    b.setAttribute('aria-expanded', 'false');
                });
            }

            if (!isOpen) {
                target.classList.add('show');
                this.classList.remove('collapsed');
                this.setAttribute('aria-expanded', 'true');
            }
        };
    });
};

// SPA ENGINE - DENGAN PURGE SYSTEM
const spaNavigate = async (url, push = true) => {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error();
        const html = await res.text();
        const nextDoc = new DOMParser().parseFromString(html, 'text/html');
        const nextMain = nextDoc.querySelector('main');

        if (nextMain) {
            // SYNC STYLES
            const nextStyles = nextDoc.querySelectorAll('style, link[rel="stylesheet"]');
            nextStyles.forEach(s => {
                const isNew = !Array.from(document.head.querySelectorAll('style, link[rel="stylesheet"]'))
                    .some(old => (s.href ? old.href === s.href : old.textContent === s.textContent));
                if (isNew) document.head.appendChild(s.cloneNode(true));
            });

            const main = document.querySelector('main');
            main.innerHTML = ''; // TOTAL PURGE
            main.innerHTML = nextMain.innerHTML;
            document.title = nextDoc.title;

            if (push) history.pushState({}, '', url);
            window.scrollTo(0, 0);

            // GANTI SETTIMEOUT DENGAN MUTATION OBSERVER UNTUK KECEPATAN MAKSIMAL
            initCore();
        }
    } catch (e) {
        window.location.href = url;
    }
};

// GLOBAL OBSERVER: Jika elemen muncul tanpa melalui SPA (Back button/Direct)
const observer = new MutationObserver((mutations) => {
    if (document.getElementById('countdown-card') && !window.zettaTimer) {
        initCountdown();
    }
});
observer.observe(document.documentElement, { childList: true, subtree: true });

document.addEventListener('click', e => {
    const a = e.target.closest('a');
    if (a && a.href && a.href.startsWith(location.origin) && !a.hash && !a.target) {
        e.preventDefault();
        spaNavigate(a.href);
    }
});

window.onpopstate = () => {
    window.location.reload();
};

document.addEventListener('DOMContentLoaded', initCore);