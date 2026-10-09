/*
 * Interactions communes à toutes les pages :
 *  - apparition des blocs au défilement (.reveal)
 *  - cartes qui s'inclinent en 3D sous la souris ([data-tilt])
 *  - ligne de la frise qui se remplit au défilement ([data-timeline])
 *  - parallaxe douce des bannières ([data-parallax])
 * Aucune dépendance : le site reste lisible même si ce fichier ne se charge pas.
 */
(function () {
    'use strict';

    var root = document.documentElement;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    root.classList.add('js');

    function initReveal() {
        var items = document.querySelectorAll('.reveal');
        if (!items.length) return;

        if (reduceMotion || !('IntersectionObserver' in window)) {
            items.forEach(function (el) { el.classList.add('is-in'); });
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var el = entry.target;
                el.classList.add('is-in');
                observer.unobserve(el);
                // Sécurité : une fois l'animation finie, on fige l'état final. Si un navigateur
                // n'a pas joué la transition (onglet en veille, mode économie…), le bloc s'affiche quand même.
                var delay = (parseFloat(getComputedStyle(el).getPropertyValue('--i')) || 0) * 110;
                setTimeout(function () { el.classList.add('is-done'); }, 2200 + delay);
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });

        items.forEach(function (el) { observer.observe(el); });
    }

    function initTilt() {
        if (reduceMotion || !finePointer) return;

        document.querySelectorAll('[data-tilt]').forEach(function (el) {
            var max = parseFloat(el.getAttribute('data-tilt')) || 7;
            var rect = null;
            var frame = 0;
            var px = 0.5;
            var py = 0.5;

            function apply() {
                frame = 0;
                el.style.setProperty('--rx', ((0.5 - py) * max * 2).toFixed(2) + 'deg');
                el.style.setProperty('--ry', ((px - 0.5) * max * 2).toFixed(2) + 'deg');
                el.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
                el.style.setProperty('--my', (py * 100).toFixed(1) + '%');
            }

            function schedule() {
                if (!frame) frame = requestAnimationFrame(apply);
            }

            // Le rectangle est mesuré à l'entrée de la souris : le mesurer pendant
            // l'inclinaison renverrait la boîte déformée et ferait trembler la carte.
            el.addEventListener('pointerenter', function () {
                rect = el.getBoundingClientRect();
                el.classList.add('is-tilting');
            });

            el.addEventListener('pointermove', function (event) {
                if (!rect) rect = el.getBoundingClientRect();
                px = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
                py = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
                schedule();
            });

            el.addEventListener('pointerleave', function () {
                rect = null;
                el.classList.remove('is-tilting');
                px = 0.5;
                py = 0.5;
                schedule();
            });

            window.addEventListener('scroll', function () { rect = null; }, { passive: true });
        });
    }

    function initTimeline() {
        var timeline = document.querySelector('[data-timeline]');
        if (!timeline) return;

        var items = Array.prototype.slice.call(timeline.querySelectorAll('.timeline-item'));
        var ticking = false;

        function update() {
            ticking = false;
            var box = timeline.getBoundingClientRect();
            var viewport = window.innerHeight;
            var progress = (viewport * 0.8 - box.top) / box.height;
            var atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
            if (atBottom) progress = 1;
            progress = Math.max(0, Math.min(1, progress));
            timeline.style.setProperty('--progress', progress.toFixed(4));

            items.forEach(function (item) {
                var mark = (item.offsetTop + 40) / box.height;
                item.classList.toggle('is-active', progress >= mark);
            });
        }

        function schedule() {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(update);
            }
        }

        window.addEventListener('scroll', schedule, { passive: true });
        window.addEventListener('resize', schedule);
        update();
    }

    function initParallax() {
        var layers = document.querySelectorAll('[data-parallax]');
        if (!layers.length || reduceMotion) return;
        var ticking = false;

        function update() {
            ticking = false;
            var y = window.scrollY;
            if (y > window.innerHeight * 1.5) return;
            layers.forEach(function (layer) {
                var factor = parseFloat(layer.getAttribute('data-parallax')) || 0.3;
                layer.style.setProperty('--parallax', (y * factor).toFixed(1) + 'px');
            });
        }

        window.addEventListener('scroll', function () {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(update);
            }
        }, { passive: true });
        update();
    }

    [initReveal, initTilt, initTimeline, initParallax].forEach(function (init) {
        try {
            init();
        } catch (error) {
            // Une animation qui échoue ne doit jamais masquer le contenu.
            document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-in'); });
            if (window.console) console.error(error);
        }
    });
})();
