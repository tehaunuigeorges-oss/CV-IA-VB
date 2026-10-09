/*
 * Construit les rubriques du site à partir de js/contenu.js :
 * cartes des passions, page de chaque passion, frises du parcours et des
 * expériences, cartes des projets et catégories de compétences.
 *
 * Pour ajouter, modifier ou retirer un élément, il suffit de modifier js/contenu.js :
 * ce fichier-ci n'a pas besoin d'être touché.
 */
(function () {
    'use strict';

    var contenu = window.CONTENU;

    var TRACES = {
        fleche: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
        retour: '<path d="M19 12H5"/><path d="m11 18-6-6 6-6"/>',
        rotation: '<path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 3v6h-6"/>',
        lien: '<path d="M7 17 17 7"/><path d="M8 7h9v9"/>',
        personnes: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
        code: '<path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/>',
        langue: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
        outil: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
        etoile: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>',
        coeur: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>'
    };

    /* ---------------------------------------------------------
       Outils
       --------------------------------------------------------- */

    // Protège les textes (une apostrophe, un « & » ou un « < » ne doivent rien casser)
    function texte(valeur) {
        return String(valeur == null ? '' : valeur)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    // Chemin d'image ou de lien : les espaces (ex. "jeux video.jpg") sont encodés
    function chemin(valeur) {
        return texte(String(valeur || '').trim().replace(/ /g, '%20'));
    }

    function liste(nom) {
        return Array.isArray(contenu[nom]) ? contenu[nom] : [];
    }

    function enListe(valeur) {
        if (Array.isArray(valeur)) return valeur;
        return valeur ? [valeur] : [];
    }

    function icone(nom, secours) {
        var trace = TRACES[nom] || TRACES[secours] || '';
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + trace + '</svg>';
    }

    function numero(index) {
        return String(index + 1).padStart(2, '0');
    }

    function couleur(valeur) {
        return /^#[0-9a-f]{3,8}$/i.test(String(valeur || '').trim()) ? String(valeur).trim() : '#8f83ff';
    }

    // Identifiant d'une passion : son "id", ou à défaut son nom sans accents ni espaces
    function identifiant(passion) {
        var base = passion.id || passion.nom || '';
        return String(base).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }

    function lienPassion(passion) {
        return 'passion-detail.html?id=' + encodeURIComponent(identifiant(passion));
    }

    function etiquettes(mots) {
        mots = enListe(mots);
        if (!mots.length) return '';
        return '<ul class="tags">' + mots.map(function (mot) { return '<li>' + texte(mot) + '</li>'; }).join('') + '</ul>';
    }

    function objet3d(passion) {
        return 'data-model="' + texte(passion.objet3d || 'medaille') + '"' +
            (passion.emoji ? ' data-emoji="' + texte(passion.emoji) + '"' : '') +
            ' data-label="' + texte(passion.nom) + '"';
    }

    function domaine(lien) {
        try {
            return new URL(lien).hostname.replace(/^www\./, '');
        } catch (erreur) {
            return '';
        }
    }

    function message(titre, details, lienRetour) {
        return '<div class="content-error" role="alert">' +
            '<h2>' + texte(titre) + '</h2>' +
            '<p>' + texte(details) + '</p>' +
            (lienRetour ? '<a class="btn" href="' + lienRetour.href + '">' + texte(lienRetour.label) + '</a>' : '') +
            '</div>';
    }

    /* ---------------------------------------------------------
       Rubriques
       --------------------------------------------------------- */

    function frise(elements) {
        if (!elements.length) return '';
        return '<ol class="timeline" data-timeline>' + elements.map(function (element) {
            var lignes = enListe(element.lignes);
            return '<li class="timeline-item reveal">' +
                '<span class="timeline-node" aria-hidden="true"></span>' +
                '<article class="timeline-content" data-tilt="6">' +
                    (element.date ? '<span class="timeline-date">' + texte(element.date) + '</span>' : '') +
                    '<h2>' + texte(element.titre) + '</h2>' +
                    (lignes.length ? '<p>' + lignes.map(function (ligne) { return texte(ligne); }).join('<br>') + '</p>' : '') +
                '</article>' +
            '</li>';
        }).join('') + '</ol>';
    }

    var RUBRIQUES = {
        passions: function () {
            var passions = liste('passions');
            if (!passions.length) return '';
            return '<ul class="passion-grid">' + passions.map(function (passion, index) {
                return '<li class="passion-grid__item reveal" style="--i: ' + (index % 3) + '">' +
                    '<a href="' + lienPassion(passion) + '" class="passion-card has-glare" data-tilt="6" style="--accent: ' + couleur(passion.couleur) + '">' +
                        (passion.photo ? '<img class="passion-card__photo" src="' + chemin(passion.photo) + '" alt="' + texte(passion.alt) + '"' + (index > 2 ? ' loading="lazy"' : '') + '>' : '') +
                        '<canvas class="passion-card__stage" ' + objet3d(passion) + ' aria-hidden="true"></canvas>' +
                        '<div class="passion-card__body">' +
                            '<span class="passion-card__num">' + numero(index) + '</span>' +
                            '<h2 class="passion-card__title">' + texte(passion.nom) + '</h2>' +
                            etiquettes(passion.motsCles) +
                            '<span class="passion-card__cta">Découvrir ' + icone('fleche') + '</span>' +
                        '</div>' +
                    '</a>' +
                '</li>';
            }).join('') + '</ul>';
        },

        // Page d'une passion : passion-detail.html?id=basket
        passion: function () {
            var passions = liste('passions');
            var id = new URLSearchParams(window.location.search).get('id');
            var index = -1;
            passions.forEach(function (passion, i) {
                if (index < 0 && identifiant(passion) === id) index = i;
            });
            if (index < 0) {
                return message('Passion introuvable', 'Cette passion n\'existe pas dans js/contenu.js (vérifie son "id").', { href: 'passion.html', label: 'Voir toutes les passions' });
            }

            var passion = passions[index];
            var titre = passion.titre || passion.nom;
            var paragraphes = enListe(passion.texte);
            // Pas de lettrine quand le texte commence par « J'… » ou « C'… »
            var lettrine = paragraphes.length && !/^\p{L}['’]/u.test(paragraphes[0]);
            var precedente = passions[(index + passions.length - 1) % passions.length];
            var suivante = passions[(index + 1) % passions.length];

            document.title = titre + ' — Tehaunui GEORGES';
            document.body.style.setProperty('--accent', couleur(passion.couleur));

            return '<header class="passion-hero" data-stage-host>' +
                    (passion.photo ? '<img class="passion-hero__photo" src="' + chemin(passion.photo) + '" alt="' + texte(passion.alt) + '" data-parallax="0.25">' : '') +
                    '<canvas class="passion-hero__stage" ' + objet3d(passion) + ' data-interactive data-margin="1.5" aria-hidden="true"></canvas>' +
                    '<a class="back-link" href="passion.html">' + icone('retour') + ' Mes passions</a>' +
                    '<div class="passion-hero__inner">' +
                        '<p class="passion-hero__num">' + numero(index) + ' / ' + numero(passions.length - 1) + '</p>' +
                        '<h1 class="passion-hero__title">' + texte(titre) + '</h1>' +
                        etiquettes(passion.motsCles) +
                    '</div>' +
                    '<p class="drag-hint" aria-hidden="true">' + icone('rotation') + ' Glisser pour faire tourner</p>' +
                '</header>' +
                '<main class="passion-article">' +
                    (paragraphes.length ?
                        '<div class="reveal"><article class="prose' + (lettrine ? ' prose--lettrine' : '') + '">' +
                            paragraphes.map(function (paragraphe) { return '<p>' + texte(paragraphe) + '</p>'; }).join('') +
                        '</article></div>' : '') +
                    (passions.length > 1 ?
                        '<nav class="pager" aria-label="Autres passions">' +
                            '<a class="pager__link has-glare" href="' + lienPassion(precedente) + '" data-tilt="6">' +
                                '<span class="pager__label">← Précédente</span>' +
                                '<span class="pager__name">' + texte(precedente.nom) + '</span>' +
                            '</a>' +
                            '<a class="pager__link pager__link--next has-glare" href="' + lienPassion(suivante) + '" data-tilt="6">' +
                                '<span class="pager__label">Suivante →</span>' +
                                '<span class="pager__name">' + texte(suivante.nom) + '</span>' +
                            '</a>' +
                        '</nav>' : '') +
                '</main>';
        },

        parcours: function () {
            return frise(liste('parcours'));
        },

        experiences: function () {
            return frise(liste('experiences'));
        },

        projets: function () {
            var projets = liste('projets');
            if (!projets.length) return '';
            return '<ul class="project-grid">' + projets.map(function (projet, index) {
                var adresse = domaine(projet.lien);
                var balise = projet.lien ? 'a' : 'div';
                var lien = projet.lien ? ' href="' + chemin(projet.lien) + '" target="_blank" rel="noopener"' : '';
                return '<li class="reveal" style="--i: ' + (index % 3) + '">' +
                    '<' + balise + lien + ' class="project-card has-glare" data-tilt="8">' +
                        '<div class="project-card__media">' +
                            (projet.image ? '<img src="' + chemin(projet.image) + '" alt="' + texte(projet.alt) + '">' : '') +
                        '</div>' +
                        '<div class="project-card__body">' +
                            '<div>' +
                                '<h2>' + texte(projet.nom) + '</h2>' +
                                (adresse ? '<span class="project-card__url">' + texte(adresse) + '</span>' : '') +
                            '</div>' +
                            (projet.lien ? '<span class="project-card__arrow" aria-hidden="true">' + icone('lien') + '</span>' : '') +
                        '</div>' +
                    '</' + balise + '>' +
                '</li>';
            }).join('') + '</ul>';
        },

        competences: function () {
            var categories = liste('competences');
            if (!categories.length) return '';
            return '<div class="competences">' + categories.map(function (categorie, index) {
                var tuiles = categorie.affichage === 'tuiles';
                var elements = enListe(categorie.elements).map(function (element, n) {
                    var nom = element && typeof element === 'object' ? element.nom : element;
                    if (!tuiles) return '<li style="--n: ' + n + '">' + texte(nom) + '</li>';
                    var symbole = element && typeof element === 'object' && element.symbole ? element.symbole : '</>';
                    return '<li class="tile" style="--n: ' + n + '">' +
                        '<span class="tile__glyph" aria-hidden="true">' + texte(symbole) + '</span>' +
                        '<span class="tile__label">' + texte(nom) + '</span>' +
                    '</li>';
                }).join('');
                return '<div class="reveal" style="--i: ' + index + '">' +
                    '<section class="skill-card" data-tilt="5">' +
                        '<div class="skill-card__head">' +
                            '<span class="skill-card__icon" aria-hidden="true">' + icone(categorie.icone, 'etoile') + '</span>' +
                            '<h2>' + texte(categorie.categorie) + '</h2>' +
                        '</div>' +
                        '<ul class="' + (tuiles ? 'tiles' : 'chips') + '">' + elements + '</ul>' +
                    '</section>' +
                '</div>';
            }).join('') + '</div>';
        }
    };

    /* ---------------------------------------------------------
       Affichage
       --------------------------------------------------------- */

    document.querySelectorAll('[data-rendu]').forEach(function (zone) {
        if (!contenu) {
            zone.innerHTML = message('Le contenu n\'a pas pu être chargé',
                'Le fichier js/contenu.js contient sûrement une erreur (virgule, guillemet ou accolade oubliée). Ouvre la console du navigateur (touche F12) pour voir la ligne concernée.');
            return;
        }
        var rubrique = RUBRIQUES[zone.getAttribute('data-rendu')];
        if (!rubrique) return;
        try {
            zone.innerHTML = rubrique();
        } catch (erreur) {
            zone.innerHTML = message('Erreur d\'affichage', String((erreur && erreur.message) || erreur));
            if (window.console) console.error(erreur);
        }
    });
})();
