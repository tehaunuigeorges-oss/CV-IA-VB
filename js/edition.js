/*
 * Mode édition : une case « Ajouter » au bout de chaque rubrique (passions, parcours,
 * expériences, projets, compétences) et un bouton « × » pour retirer un élément.
 *
 * - Visible seulement quand le site est ouvert sur ton ordinateur (fichier local ou
 *   localhost), ou avec ?edition à la fin de l'adresse. Les visiteurs du site en
 *   ligne ne voient ni les cases ni les boutons.
 * - Dans Chrome et Edge, chaque ajout est écrit directement dans js/contenu.js, et
 *   la photo est copiée dans ressources/. Au premier ajout, le navigateur demande
 *   de choisir le dossier du site (celui qui contient index.html).
 * - Dans les autres navigateurs, le fichier contenu.js mis à jour est téléchargé :
 *   il suffit de remplacer l'ancien.
 */
(function (racine) {
    'use strict';

    /* =========================================================
       1. Écriture du fichier js/contenu.js
       ========================================================= */

    var ENTETE = [
        '/*',
        ' * ============================================================',
        ' *  CONTENU DU SITE',
        ' * ============================================================',
        ' *',
        ' *  Le plus simple : ouvre le site sur ton ordinateur et utilise',
        ' *  les cases « Ajouter » et les boutons « × » de chaque rubrique.',
        ' *  Ils mettent ce fichier à jour tout seuls.',
        ' *',
        ' *  Tu peux aussi le modifier à la main. Chaque rubrique (passions,',
        ' *  parcours, expériences, projets, compétences) est une liste',
        ' *  d\'éléments entre [ ], affichés sur le site dans le même ordre.',
        ' *',
        ' *  Pour AJOUTER un élément à la main :',
        ' *    1. copie un bloc { … } de la même rubrique (ou décommente',
        ' *       le modèle prêt à l\'emploi en enlevant les // devant) ;',
        ' *    2. colle-le à l\'endroit voulu, en séparant les blocs par',
        ' *       une virgule ;',
        ' *    3. modifie les textes entre guillemets, enregistre et',
        ' *       recharge la page.',
        ' *',
        ' *  Pour RETIRER un élément : efface son bloc { … } et sa virgule.',
        ' *',
        ' *  Une page reste vide ou affiche un message d\'erreur ? Il manque',
        ' *  sûrement une virgule, un guillemet ou une accolade ici : la',
        ' *  console du navigateur (touche F12) indique la ligne fautive.',
        ' * ============================================================',
        ' */'
    ].join('\n');

    var RUBRIQUES = [
        {
            cle: 'passions',
            ordre: ['id', 'nom', 'titre', 'couleur', 'photo', 'alt', 'objet3d', 'emoji', 'motsCles', 'texte'],
            doc: [
                '    /*',
                '     * PASSIONS',
                '     * Chaque passion a sa carte sur la page « Mes passions » et sa',
                '     * propre page (passion-detail.html?id=…), créées automatiquement.',
                '     *',
                '     *   id       : nom court, unique, sans espace ni accent (ex. "musique")',
                '     *   nom      : titre de la carte',
                '     *   titre    : grand titre de sa page',
                '     *   couleur  : couleur d\'accent, en code hexadécimal (ex. "#ff8a3d")',
                '     *   photo    : image rangée dans le dossier ressources',
                '     *   alt      : courte description de la photo (accessibilité)',
                '     *   objet3d  : basket, pokemon, cuisine, musculation, vetement, japon,',
                '     *              jeux-video, ou "medaille" : une pièce 3D avec ton emoji',
                '     *   emoji    : symbole gravé sur la médaille (seulement avec "medaille")',
                '     *   motsCles : petites étiquettes sous le titre',
                '     *   texte    : un paragraphe par ligne entre guillemets',
                '     */'
            ],
            modele: [
                '        // Modèle : enlève les // devant chaque ligne pour l\'activer.',
                '        // {',
                '        //     id: "musique",',
                '        //     nom: "Musique",',
                '        //     titre: "La musique pour moi",',
                '        //     couleur: "#f472b6",',
                '        //     photo: "ressources/ma-photo.jpg",',
                '        //     alt: "Description de la photo",',
                '        //     objet3d: "medaille",',
                '        //     emoji: "🎧",',
                '        //     motsCles: ["Mot-clé 1", "Mot-clé 2"],',
                '        //     texte: [',
                '        //         "Premier paragraphe.",',
                '        //         "Deuxième paragraphe."',
                '        //     ]',
                '        // },'
            ]
        },
        {
            cle: 'parcours',
            ordre: ['date', 'titre', 'lignes'],
            doc: [
                '    /*',
                '     * PARCOURS et EXPÉRIENCES (frises chronologiques)',
                '     *',
                '     *   date   : texte de la pastille (ex. "2024", "Depuis 2025")',
                '     *   titre  : formation, entreprise…',
                '     *   lignes : détails, une ligne par élément',
                '     */'
            ],
            modele: [
                '        // Modèle :',
                '        // {',
                '        //     date: "2031",',
                '        //     titre: "Nouvelle formation",',
                '        //     lignes: ["Établissement", "Spécialité : …"]',
                '        // },'
            ]
        },
        {
            cle: 'experiences',
            ordre: ['date', 'titre', 'lignes'],
            doc: [],
            modele: [
                '        // Modèle :',
                '        // {',
                '        //     date: "2026",',
                '        //     titre: "Nom de l\'entreprise",',
                '        //     lignes: ["Poste ou mission"]',
                '        // },'
            ]
        },
        {
            cle: 'projets',
            ordre: ['nom', 'lien', 'image', 'alt'],
            doc: [
                '    /*',
                '     * PROJETS',
                '     *',
                '     *   nom   : titre de la carte',
                '     *   lien  : adresse du site du projet (s\'ouvre dans un nouvel onglet)',
                '     *   image : logo ou photo rangé dans le dossier ressources',
                '     *   alt   : courte description de l\'image',
                '     */'
            ],
            modele: [
                '        // Modèle :',
                '        // {',
                '        //     nom: "Mon projet",',
                '        //     lien: "https://github.com/tehaunuigeorges-oss",',
                '        //     image: "ressources/mon-projet.png",',
                '        //     alt: "Logo du projet"',
                '        // },'
            ]
        },
        {
            cle: 'competences',
            ordre: ['categorie', 'icone', 'affichage', 'elements'],
            doc: [
                '    /*',
                '     * COMPÉTENCES : une carte par catégorie',
                '     *',
                '     *   categorie : titre de la carte',
                '     *   icone     : personnes, code, langue, outil, etoile ou coeur',
                '     *   affichage : "pastilles" (liste compacte) ou "tuiles" (grandes cases)',
                '     *   elements  : les compétences ; en tuiles, tu peux préciser un symbole :',
                '     *               { nom: "GO", symbole: "{ }" }',
                '     */'
            ],
            modele: [
                '        // Modèle :',
                '        // {',
                '        //     categorie: "Langues",',
                '        //     icone: "langue",',
                '        //     affichage: "pastilles",',
                '        //     elements: ["Langue 1", "Langue 2"]',
                '        // },'
            ]
        }
    ];

    // Ces listes s'affichent toujours avec un élément par ligne (textes longs)
    var MULTILIGNE = { texte: true, lignes: true };

    function cleJs(cle) {
        return /^[A-Za-z_$][\w$]*$/.test(cle) ? cle : JSON.stringify(cle);
    }

    function valeurJs(valeur, cle, retrait) {
        if (Array.isArray(valeur)) return tableauJs(valeur, cle, retrait);
        if (valeur && typeof valeur === 'object') {
            return '{ ' + Object.keys(valeur).map(function (k) {
                return cleJs(k) + ': ' + valeurJs(valeur[k], k, retrait);
            }).join(', ') + ' }';
        }
        return JSON.stringify(valeur === undefined ? null : valeur);
    }

    function tableauJs(tableau, cle, retrait) {
        if (!tableau.length) return '[]';
        var elements = tableau.map(function (v) { return valeurJs(v, cle, retrait + '    '); });
        var enLigne = '[' + elements.join(', ') + ']';
        var simple = tableau.every(function (v) { return v === null || typeof v !== 'object'; });
        if (simple && !MULTILIGNE[cle] && enLigne.length <= 90) return enLigne;
        return '[\n' + elements.map(function (e) { return retrait + '    ' + e; }).join(',\n') + '\n' + retrait + ']';
    }

    function blocJs(element, ordre) {
        if (!element || typeof element !== 'object' || Array.isArray(element)) return '        ' + valeurJs(element, '', '        ');
        var cles = ordre.filter(function (k) { return element[k] !== undefined; })
            .concat(Object.keys(element).filter(function (k) { return ordre.indexOf(k) < 0 && element[k] !== undefined; }));
        return '        {\n' + cles.map(function (k) {
            return '            ' + cleJs(k) + ': ' + valeurJs(element[k], k, '            ');
        }).join(',\n') + '\n        }';
    }

    // Transforme les données en un fichier js/contenu.js lisible et commenté
    function serialiser(contenu) {
        var cles = RUBRIQUES.map(function (r) { return r.cle; });
        var autres = Object.keys(contenu).filter(function (k) { return cles.indexOf(k) < 0; });
        var lignes = [ENTETE, 'window.CONTENU = {'];

        RUBRIQUES.forEach(function (rubrique, index) {
            lignes.push('');
            if (rubrique.doc.length) lignes.push(rubrique.doc.join('\n'));
            lignes.push('    ' + rubrique.cle + ': [');
            (Array.isArray(contenu[rubrique.cle]) ? contenu[rubrique.cle] : []).forEach(function (element) {
                lignes.push(blocJs(element, rubrique.ordre) + ',');
            });
            lignes.push('');
            lignes.push(rubrique.modele.join('\n'));
            lignes.push('    ]' + (index === RUBRIQUES.length - 1 && !autres.length ? '' : ','));
        });

        autres.forEach(function (cle, index) {
            lignes.push('');
            lignes.push('    ' + cleJs(cle) + ': ' + valeurJs(contenu[cle], cle, '    ') + (index === autres.length - 1 ? '' : ','));
        });

        lignes.push('};', '');
        return lignes.join('\n');
    }

    var api = { serialiser: serialiser, options: { recharger: true } };

    // Utilisable aussi depuis Node.js (outils), sans l'interface ci-dessous
    if (typeof module === 'object' && module.exports) {
        module.exports = api;
        return;
    }
    racine.CVEdition = api;

    /* =========================================================
       2. Quand afficher le mode édition ?
       ========================================================= */

    var contenu = racine.CONTENU;
    var RUBRIQUES_EDITABLES = ['passions', 'parcours', 'experiences', 'projets', 'competences'];
    var zones = Array.prototype.slice.call(document.querySelectorAll('[data-rendu]')).filter(function (zone) {
        return RUBRIQUES_EDITABLES.indexOf(zone.getAttribute('data-rendu')) >= 0;
    });
    if (!contenu || !zones.length) return;

    var local = location.protocol === 'file:' || /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
    if (!local && !new URLSearchParams(location.search).has('edition')) return;

    function reglage(cle, valeur) {
        try {
            if (arguments.length > 1) localStorage.setItem(cle, valeur);
            return localStorage.getItem(cle);
        } catch (erreur) {
            return null;
        }
    }

    var actif = reglage('cv-edition') !== 'off';
    creerInterrupteur();
    if (!actif) return;

    document.documentElement.classList.add('mode-edition');

    /* =========================================================
       3. Cases « Ajouter » et boutons « × » dans les rubriques
       ========================================================= */

    function echapper(valeur) {
        return String(valeur == null ? '' : valeur)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function creerInterrupteur() {
        var bouton = document.createElement('button');
        bouton.type = 'button';
        bouton.className = 'edition-interrupteur' + (actif ? ' is-actif' : '');
        bouton.setAttribute('aria-pressed', String(actif));
        bouton.title = actif
            ? 'Masquer les cases d\'ajout (elles ne sont visibles que sur ton ordinateur)'
            : 'Afficher les cases d\'ajout';
        bouton.innerHTML = '<span aria-hidden="true">✎</span>' +
            (actif ? '<span>Mode édition</span>' : '<span class="sr-only">Afficher les cases d\'ajout</span>');
        bouton.addEventListener('click', function () {
            reglage('cv-edition', actif ? 'off' : 'on');
            location.reload();
        });
        document.body.appendChild(bouton);
    }

    function caseAjout(type, label, detail, classe, attributs) {
        return '<button type="button" class="carte-ajout' + (classe ? ' ' + classe : '') + '" data-ajout="' + type + '"' + (attributs || '') + '>' +
            '<span class="carte-ajout__plus" aria-hidden="true">+</span>' +
            '<span class="carte-ajout__label">' + echapper(label) + '</span>' +
            (detail ? '<span class="carte-ajout__detail">' + echapper(detail) + '</span>' : '') +
            '</button>';
    }

    function boutonSupprimer(rubrique, index, nom, attributs) {
        return '<button type="button" class="bouton-supprimer" data-supprimer="' + rubrique + '" data-index="' + index + '"' + (attributs || '') +
            ' aria-label="Supprimer ' + echapper(nom) + '" title="Supprimer">×</button>';
    }

    // Retrouve la liste rendue par js/rendu.js, ou la crée si la rubrique est vide
    function conteneur(zone, selecteur, html) {
        var element = zone.querySelector(selecteur);
        if (!element) {
            zone.insertAdjacentHTML('beforeend', html);
            element = zone.querySelector(selecteur);
        }
        return element;
    }

    function frise(zone, rubrique, label, detail) {
        var liste = conteneur(zone, '.timeline', '<ol class="timeline" data-timeline></ol>');
        liste.querySelectorAll('.timeline-item[data-index]').forEach(function (item) {
            var index = item.getAttribute('data-index');
            var element = contenu[rubrique][index];
            var carte = item.querySelector('.timeline-content');
            if (carte && element) carte.insertAdjacentHTML('beforeend', boutonSupprimer(rubrique, index, element.titre));
        });
        liste.insertAdjacentHTML('beforeend', '<li class="timeline-item timeline-item--ajout reveal">' +
            '<span class="timeline-node" aria-hidden="true"></span>' +
            caseAjout(rubrique, label, detail, 'timeline-content') +
            '</li>');
    }

    var CASES = {
        passions: function (zone) {
            var grille = conteneur(zone, '.passion-grid', '<ul class="passion-grid"></ul>');
            grille.querySelectorAll('.passion-grid__item[data-index]').forEach(function (item) {
                var index = item.getAttribute('data-index');
                var passion = contenu.passions[index];
                if (passion) item.insertAdjacentHTML('beforeend', boutonSupprimer('passions', index, passion.nom));
            });
            grille.insertAdjacentHTML('beforeend', '<li class="passion-grid__item passion-grid__item--ajout reveal">' +
                caseAjout('passions', 'Ajouter une passion', 'Sa carte et sa page sont créées automatiquement') +
                '</li>');
        },

        parcours: function (zone) {
            frise(zone, 'parcours', 'Ajouter une étape', 'Formation, diplôme, certification…');
        },

        experiences: function (zone) {
            frise(zone, 'experiences', 'Ajouter une expérience', 'Stage, job, bénévolat…');
        },

        projets: function (zone) {
            var grille = conteneur(zone, '.project-grid', '<ul class="project-grid"></ul>');
            grille.querySelectorAll('.project-grid > li[data-index]').forEach(function (item) {
                var index = item.getAttribute('data-index');
                var projet = contenu.projets[index];
                if (projet) item.insertAdjacentHTML('beforeend', boutonSupprimer('projets', index, projet.nom));
            });
            grille.insertAdjacentHTML('beforeend', '<li class="reveal">' +
                caseAjout('projets', 'Ajouter un projet', 'Logo ou photo, et lien vers le projet') +
                '</li>');
        },

        competences: function (zone) {
            var grille = conteneur(zone, '.competences', '<div class="competences"></div>');
            grille.querySelectorAll('.competences > [data-index]').forEach(function (bloc) {
                var index = bloc.getAttribute('data-index');
                var categorie = contenu.competences[index];
                var carte = bloc.querySelector('.skill-card');
                var liste = carte && carte.querySelector('.chips, .tiles');
                if (!categorie || !liste) return;

                carte.insertAdjacentHTML('beforeend', boutonSupprimer('competences', index, 'la catégorie ' + categorie.categorie));
                liste.querySelectorAll('li[data-index]').forEach(function (li) {
                    var element = (categorie.elements || [])[li.getAttribute('data-index')];
                    var nom = element && typeof element === 'object' ? element.nom : element;
                    li.insertAdjacentHTML('beforeend', boutonSupprimer('competence', li.getAttribute('data-index'), nom, ' data-categorie="' + index + '"'));
                });

                var tuiles = liste.classList.contains('tiles');
                liste.insertAdjacentHTML('beforeend', '<li class="' + (tuiles ? 'tile tile--ajout' : 'chip-ajout') + '">' +
                    '<button type="button" data-ajout="competence" data-categorie="' + index + '">' +
                    '<span aria-hidden="true">+</span> Ajouter une compétence</button></li>');
            });
            grille.insertAdjacentHTML('beforeend', '<div class="reveal">' +
                caseAjout('competences', 'Ajouter une catégorie', 'Langues, outils, logiciels…') +
                '</div>');
        }
    };

    zones.forEach(function (zone) {
        CASES[zone.getAttribute('data-rendu')](zone);
    });

    /* =========================================================
       4. Formulaires
       ========================================================= */

    var OBJETS_3D = [
        ['medaille', 'Médaille avec un emoji'],
        ['basket', 'Ballon de basket'],
        ['pokemon', 'Poké Ball'],
        ['cuisine', 'Assiette de nems'],
        ['musculation', 'Haltère'],
        ['vetement', 'T-shirt sur cintre'],
        ['japon', 'Torii japonais'],
        ['jeux-video', 'Manette de jeu']
    ];

    var ICONES = [
        ['etoile', 'Étoile'],
        ['personnes', 'Personnes'],
        ['code', 'Code'],
        ['langue', 'Globe (langues)'],
        ['outil', 'Outil'],
        ['coeur', 'Cœur']
    ];

    function champsFrise(exempleDate, labelTitre, exempleTitre, exempleDetails) {
        return [
            { cle: 'date', label: 'Date', requis: true, exemple: exempleDate, aide: 'Texte libre : « 2026 », « 2026-2028 », « Depuis 2025 »…' },
            { cle: 'titre', label: labelTitre, requis: true, exemple: exempleTitre },
            { cle: 'lignes', label: 'Détails', type: 'lignes', exemple: exempleDetails, aide: 'Une information par ligne.' }
        ];
    }

    function ajouterA(rubrique, element) {
        return function (donnees) {
            if (!Array.isArray(donnees[rubrique])) donnees[rubrique] = [];
            donnees[rubrique].push(nettoyer(element));
        };
    }

    var FORMULAIRES = {
        passions: {
            titre: 'Ajouter une passion',
            bouton: 'Ajouter la passion',
            image: 'photo',
            champs: [
                { cle: 'nom', label: 'Nom de la passion', requis: true, exemple: 'Musique' },
                { cle: 'titre', label: 'Titre de sa page', exemple: 'La musique pour moi', aide: 'Laisse vide pour reprendre le nom.' },
                { cle: 'texte', label: 'Ton texte', type: 'paragraphes', exemple: 'Raconte ta passion…', aide: 'Laisse une ligne vide entre deux paragraphes.' },
                { cle: 'motsCles', label: 'Mots-clés', type: 'liste', exemple: 'Rap, Concerts, Guitare', aide: 'Séparés par des virgules.' },
                { cle: 'photo', label: 'Photo', type: 'image', aide: 'Elle sera copiée (et allégée) dans le dossier ressources.' },
                { cle: 'alt', label: 'Description de la photo', exemple: 'Concert dans une salle', aide: 'Lue par les lecteurs d\'écran.' },
                { cle: 'objet3d', label: 'Objet 3D', type: 'choix', options: OBJETS_3D, defaut: 'medaille' },
                { cle: 'emoji', label: 'Emoji de la médaille', exemple: '🎧', defaut: '⭐', aide: 'Clavier emoji : touche Windows + point (;).', siChoix: ['objet3d', 'medaille'] },
                { cle: 'couleur', label: 'Couleur', type: 'couleur', defaut: '#8f83ff' }
            ],
            creer: function (v, image, donnees) {
                var passions = Array.isArray(donnees.passions) ? donnees.passions : [];
                return ajouterA('passions', {
                    id: idUnique(v.nom, passions),
                    nom: v.nom,
                    titre: v.titre || v.nom,
                    couleur: v.couleur,
                    photo: image,
                    alt: image ? (v.alt || v.nom) : undefined,
                    objet3d: v.objet3d,
                    emoji: v.objet3d === 'medaille' ? (v.emoji || '⭐') : undefined,
                    motsCles: v.motsCles,
                    texte: v.texte
                })(donnees);
            }
        },

        parcours: {
            titre: 'Ajouter une étape du parcours',
            bouton: 'Ajouter l\'étape',
            champs: champsFrise('2026-2031', 'Formation ou diplôme', 'Bachelor / Mastère', 'Ynov Campus\nSpécialité : Cybersécurité'),
            creer: function (v, image, donnees) {
                ajouterA('parcours', { date: v.date, titre: v.titre, lignes: v.lignes })(donnees);
            }
        },

        experiences: {
            titre: 'Ajouter une expérience',
            bouton: 'Ajouter l\'expérience',
            champs: champsFrise('Été 2026', 'Entreprise ou structure', 'Nom de l\'entreprise', 'Poste occupé\nMissions principales'),
            creer: function (v, image, donnees) {
                ajouterA('experiences', { date: v.date, titre: v.titre, lignes: v.lignes })(donnees);
            }
        },

        projets: {
            titre: 'Ajouter un projet',
            bouton: 'Ajouter le projet',
            image: 'image',
            champs: [
                { cle: 'nom', label: 'Nom du projet', requis: true, exemple: 'Mon projet' },
                { cle: 'lien', label: 'Lien', type: 'url', exemple: 'https://github.com/…', aide: 'Facultatif : la carte s\'ouvrira sur ce site.' },
                { cle: 'image', label: 'Logo ou photo', type: 'image', aide: 'Il sera copié (et allégé) dans le dossier ressources.' },
                { cle: 'alt', label: 'Description de l\'image', exemple: 'Logo du projet' }
            ],
            creer: function (v, image, donnees) {
                var lien = v.lien && !/^[a-z]+:/i.test(v.lien) ? 'https://' + v.lien : v.lien;
                ajouterA('projets', { nom: v.nom, lien: lien, image: image, alt: image ? (v.alt || v.nom) : undefined })(donnees);
            }
        },

        competences: {
            titre: 'Ajouter une catégorie de compétences',
            bouton: 'Ajouter la catégorie',
            champs: [
                { cle: 'categorie', label: 'Nom de la catégorie', requis: true, exemple: 'Langues' },
                { cle: 'elements', label: 'Compétences', type: 'liste', exemple: 'Français, Anglais, Espagnol', aide: 'Séparées par des virgules (ou une par ligne).' },
                { cle: 'icone', label: 'Icône', type: 'choix', options: ICONES, defaut: 'etoile' },
                { cle: 'affichage', label: 'Affichage', type: 'choix', options: [['pastilles', 'Pastilles (liste compacte)'], ['tuiles', 'Tuiles (grandes cases)']], defaut: 'pastilles' }
            ],
            creer: function (v, image, donnees) {
                ajouterA('competences', { categorie: v.categorie, icone: v.icone, affichage: v.affichage, elements: v.elements || [] })(donnees);
            }
        },

        competence: {
            titre: 'Ajouter une compétence',
            bouton: 'Ajouter',
            champs: [
                { cle: 'nom', label: 'Compétence', requis: true, exemple: 'Python' },
                { cle: 'symbole', label: 'Symbole (facultatif)', exemple: '{ }', aide: 'Petit symbole affiché au-dessus du nom.', siTuiles: true }
            ],
            creer: function (v, image, donnees, reference) {
                var categorie = retrouver(donnees.competences, reference);
                if (!Array.isArray(categorie.elements)) categorie.elements = [];
                categorie.elements.push(v.symbole ? { nom: v.nom, symbole: v.symbole } : v.nom);
            }
        }
    };

    function nettoyer(element) {
        var propre = {};
        Object.keys(element).forEach(function (cle) {
            var valeur = element[cle];
            if (valeur === undefined || valeur === null || valeur === '') return;
            if (Array.isArray(valeur) && !valeur.length) return;
            propre[cle] = valeur;
        });
        return propre;
    }

    function identifiant(texte) {
        return String(texte || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
            .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }

    function idUnique(nom, passions) {
        var base = identifiant(nom) || 'passion';
        var pris = passions.map(function (p) { return p.id || identifiant(p.nom); });
        var id = base;
        for (var n = 2; pris.indexOf(id) >= 0; n++) id = base + '-' + n;
        return id;
    }

    // Retrouve un élément par son contenu (et pas par sa position, qui a pu changer)
    function position(liste, reference) {
        var cherche = JSON.stringify(reference);
        var index = Array.isArray(liste) ? liste.findIndex(function (e) { return JSON.stringify(e) === cherche; }) : -1;
        if (index < 0) {
            throw new Error('Cet élément a été modifié dans js/contenu.js depuis l\'ouverture de la page. Recharge la page puis réessaie.');
        }
        return index;
    }

    function retrouver(liste, reference) {
        return liste[position(liste, reference)];
    }

    /* --- Fenêtre (dialog) commune aux formulaires et confirmations --- */

    var dialogue = null;
    var actionCourante = null;
    var enCours = false;

    function boite() {
        if (dialogue) return dialogue;
        dialogue = document.createElement('dialog');
        dialogue.className = 'editeur';
        dialogue.setAttribute('aria-labelledby', 'editeur-titre');
        dialogue.innerHTML =
            '<form class="editeur__form" novalidate>' +
                '<div class="editeur__entete">' +
                    '<h2 class="editeur__titre" id="editeur-titre"></h2>' +
                    '<button type="button" class="editeur__fermer" data-fermer aria-label="Fermer">×</button>' +
                '</div>' +
                '<div class="editeur__corps"></div>' +
                '<p class="editeur__statut" role="status" aria-live="polite"></p>' +
                '<div class="editeur__actions">' +
                    '<button type="button" class="editeur__bouton" data-fermer>Annuler</button>' +
                    '<button type="submit" class="editeur__bouton editeur__bouton--principal"></button>' +
                '</div>' +
                '<p class="editeur__note"></p>' +
            '</form>';
        document.body.appendChild(dialogue);

        dialogue.addEventListener('click', function (evenement) {
            if (evenement.target.closest('[data-fermer]') && !enCours) dialogue.close();
        });
        dialogue.addEventListener('cancel', function (evenement) {
            if (enCours) evenement.preventDefault();
        });
        dialogue.querySelector('form').addEventListener('submit', function (evenement) {
            evenement.preventDefault();
            if (!enCours && actionCourante) actionCourante();
        });
        return dialogue;
    }

    function statut(message, type) {
        var zone = boite().querySelector('.editeur__statut');
        zone.textContent = message || '';
        zone.className = 'editeur__statut' + (type ? ' is-' + type : '');
    }

    function preparerBoite(titre, bouton, danger) {
        var d = boite();
        d.querySelector('.editeur__titre').textContent = titre;
        var principal = d.querySelector('.editeur__bouton--principal');
        principal.textContent = bouton;
        principal.classList.toggle('editeur__bouton--danger', !!danger);
        d.querySelector('.editeur__note').textContent = typeof racine.showDirectoryPicker === 'function'
            ? 'Enregistré directement dans js/contenu.js.'
            : 'Ton navigateur téléchargera le fichier contenu.js mis à jour.';
        statut('');
        return d;
    }

    function champHtml(champ) {
        var id = 'editeur-' + champ.cle;
        var commun = ' id="' + id + '" name="' + champ.cle + '"' + (champ.requis ? ' required' : '');
        var exemple = champ.exemple ? ' placeholder="' + echapper(champ.exemple) + '"' : '';
        var entree;
        switch (champ.type) {
            case 'paragraphes':
            case 'lignes':
                entree = '<textarea' + commun + exemple + ' rows="' + (champ.type === 'paragraphes' ? 6 : 3) + '"></textarea>';
                break;
            case 'choix':
                entree = '<select' + commun + '>' + champ.options.map(function (o) {
                    return '<option value="' + o[0] + '"' + (o[0] === champ.defaut ? ' selected' : '') + '>' + echapper(o[1]) + '</option>';
                }).join('') + '</select>';
                break;
            case 'couleur':
                entree = '<input type="color"' + commun + ' value="' + champ.defaut + '">';
                break;
            case 'image':
                entree = '<input type="file" accept="image/*"' + commun + '><img class="champ__apercu" alt="" hidden>';
                break;
            case 'url':
                entree = '<input type="url" inputmode="url"' + commun + exemple + '>';
                break;
            default:
                entree = '<input type="text"' + commun + exemple + (champ.defaut ? ' value="' + echapper(champ.defaut) + '"' : '') + '>';
        }
        return '<div class="champ champ--' + (champ.type || 'texte') + '" data-champ="' + champ.cle + '">' +
            '<label class="champ__label" for="' + id + '">' + echapper(champ.label) + (champ.requis ? ' <span aria-hidden="true">*</span>' : '') + '</label>' +
            entree +
            (champ.aide ? '<small class="champ__aide">' + echapper(champ.aide) + '</small>' : '') +
            '</div>';
    }

    function lireValeurs(corps, champs) {
        var valeurs = {};
        champs.forEach(function (champ) {
            var bloc = corps.querySelector('[data-champ="' + champ.cle + '"]');
            var entree = bloc && bloc.querySelector('[name]');
            if (!entree || bloc.hidden) return;
            if (champ.type === 'image') {
                valeurs[champ.cle] = (entree.files && entree.files[0]) || null;
                return;
            }
            var brut = entree.value.trim();
            if (champ.type === 'liste') {
                valeurs[champ.cle] = brut.split(/[,\n]/).map(function (t) { return t.trim(); }).filter(Boolean);
            } else if (champ.type === 'lignes') {
                valeurs[champ.cle] = brut.split('\n').map(function (t) { return t.trim(); }).filter(Boolean);
            } else if (champ.type === 'paragraphes') {
                valeurs[champ.cle] = brut.split(/\n\s*\n/).map(function (p) { return p.replace(/\s*\n\s*/g, ' ').trim(); }).filter(Boolean);
            } else {
                valeurs[champ.cle] = brut;
            }
        });
        return valeurs;
    }

    function ouvrirFormulaire(type, indexCategorie) {
        var config = FORMULAIRES[type];
        var reference = type === 'competence' ? contenu.competences[indexCategorie] : null;
        var champs = config.champs.filter(function (champ) {
            return !champ.siTuiles || (reference && reference.affichage === 'tuiles');
        });
        var titre = reference ? config.titre + ' : ' + reference.categorie : config.titre;
        var d = preparerBoite(titre, config.bouton);
        var corps = d.querySelector('.editeur__corps');
        corps.innerHTML = champs.map(champHtml).join('');

        // Champs qui n'apparaissent que pour un choix précis (ex. l'emoji pour la médaille)
        champs.filter(function (c) { return c.siChoix; }).forEach(function (champ) {
            var bloc = corps.querySelector('[data-champ="' + champ.cle + '"]');
            var choix = corps.querySelector('[name="' + champ.siChoix[0] + '"]');
            var maj = function () { bloc.hidden = choix.value !== champ.siChoix[1]; };
            choix.addEventListener('change', maj);
            maj();
        });

        // Aperçu de l'image choisie
        corps.querySelectorAll('input[type="file"]').forEach(function (entree) {
            entree.addEventListener('change', function () {
                var apercu = entree.parentNode.querySelector('.champ__apercu');
                if (apercu.src) URL.revokeObjectURL(apercu.src);
                var fichier = entree.files && entree.files[0];
                apercu.hidden = !fichier;
                if (fichier) apercu.src = URL.createObjectURL(fichier);
            });
        });

        actionCourante = function () {
            var valeurs = lireValeurs(corps, champs);
            var manquant = champs.filter(function (c) { return c.requis && !valeurs[c.cle]; })[0];
            if (manquant) {
                statut('Le champ « ' + manquant.label + ' » est obligatoire.', 'erreur');
                corps.querySelector('[name="' + manquant.cle + '"]').focus();
                return;
            }
            var fichier = config.image ? valeurs[config.image] : null;
            var nomImage = identifiant(valeurs.nom || valeurs.categorie) || 'image';
            executer(function (donnees, cheminImage) {
                config.creer(valeurs, cheminImage, donnees, reference);
            }, fichier ? { fichier: fichier, nom: nomImage } : null, 'Ajouté !');
        };

        d.showModal();
        var premier = corps.querySelector('input, textarea, select');
        if (premier) premier.focus();
    }

    function demanderSuppression(rubrique, index, indexCategorie) {
        var reference;
        var nom;
        var modifier;
        if (rubrique === 'competence') {
            var categorie = contenu.competences[indexCategorie];
            reference = categorie.elements[index];
            nom = reference && typeof reference === 'object' ? reference.nom : reference;
            modifier = function (donnees) {
                var cible = retrouver(donnees.competences, categorie);
                cible.elements.splice(position(cible.elements, reference), 1);
            };
        } else {
            reference = contenu[rubrique][index];
            nom = reference.nom || reference.titre || reference.categorie;
            modifier = function (donnees) {
                donnees[rubrique].splice(position(donnees[rubrique], reference), 1);
            };
        }

        var d = preparerBoite('Supprimer « ' + nom + ' » ?', 'Supprimer', true);
        d.querySelector('.editeur__corps').innerHTML = '<p class="editeur__texte">' +
            (rubrique === 'competences' ? 'Toute la catégorie et ses compétences seront retirées' : 'L\'élément sera retiré') +
            ' du site et de js/contenu.js. Les images restent dans le dossier ressources.</p>';
        actionCourante = function () {
            executer(modifier, null, 'Supprimé.');
        };
        d.showModal();
    }

    document.addEventListener('click', function (evenement) {
        var ajout = evenement.target.closest('[data-ajout]');
        if (ajout) {
            evenement.preventDefault();
            ouvrirFormulaire(ajout.getAttribute('data-ajout'), ajout.getAttribute('data-categorie'));
            return;
        }
        var suppression = evenement.target.closest('[data-supprimer]');
        if (suppression) {
            evenement.preventDefault();
            evenement.stopPropagation();
            demanderSuppression(suppression.getAttribute('data-supprimer'), Number(suppression.getAttribute('data-index')), suppression.getAttribute('data-categorie'));
        }
    });

    /* =========================================================
       5. Enregistrement
       ========================================================= */

    function basculer(occupe) {
        enCours = occupe;
        boite().querySelectorAll('button').forEach(function (bouton) { bouton.disabled = occupe; });
    }

    function executer(modifier, image, succes) {
        basculer(true);
        statut('Enregistrement…');
        enregistrer(modifier, image).then(function (mode) {
            if (mode === 'fichier') {
                statut(succes + ' js/contenu.js est à jour, la page va se recharger…', 'ok');
                if (api.options.recharger) setTimeout(function () { location.reload(); }, 900);
                else basculer(false);
                return;
            }
            basculer(false);
            statut('Ton navigateur ne peut pas modifier les fichiers du site (c\'est possible dans Chrome et Edge). ' +
                'Le fichier contenu.js mis à jour vient d\'être téléchargé : remplace js/contenu.js par ce fichier, puis recharge la page.', 'info');
        }).catch(function (erreur) {
            basculer(false);
            statut(erreur && erreur.name === 'AbortError'
                ? 'Choix du dossier annulé : rien n\'a été modifié.'
                : (erreur && erreur.message) || String(erreur), 'erreur');
        });
    }

    async function enregistrer(modifier, image) {
        if (typeof racine.showDirectoryPicker === 'function') {
            // Le dossier est demandé en premier : le navigateur exige que ce soit juste après le clic
            var dossier = await dossierDuSite();
            var donnees = await lireContenu(dossier);
            var chemin = image ? await ecrireImage(dossier, await preparerImage(image.fichier), image.nom) : null;
            modifier(donnees, chemin);
            await ecrireFichier(await sousDossier(dossier, 'js'), 'contenu.js', serialiser(donnees));
            return 'fichier';
        }

        var copie = JSON.parse(JSON.stringify(contenu));
        var dataUrl = image ? await enDataUrl((await preparerImage(image.fichier)).blob) : null;
        modifier(copie, dataUrl);
        telecharger(serialiser(copie));
        return 'telechargement';
    }

    function sousDossier(dossier, nom, creer) {
        return dossier.getDirectoryHandle(nom, { create: !!creer });
    }

    async function ecrireFichier(dossier, nom, donnees) {
        var fichier = await dossier.getFileHandle(nom, { create: true });
        var flux = await fichier.createWritable();
        await flux.write(donnees);
        await flux.close();
    }

    async function estDossierDuSite(dossier) {
        try {
            await (await sousDossier(dossier, 'js')).getFileHandle('contenu.js');
            return true;
        } catch (erreur) {
            return false;
        }
    }

    async function dossierDuSite() {
        var dossier = await memoire('dossier');
        if (dossier) {
            var permission = dossier.queryPermission ? await dossier.queryPermission({ mode: 'readwrite' }) : 'granted';
            if (permission !== 'granted' && dossier.requestPermission) permission = await dossier.requestPermission({ mode: 'readwrite' });
            if (permission === 'granted' && await estDossierDuSite(dossier)) return dossier;
        }
        statut('Choisis le dossier du site (celui qui contient index.html) dans la fenêtre qui s\'ouvre…');
        dossier = await racine.showDirectoryPicker({ id: 'cv-site', mode: 'readwrite' });
        if (!(await estDossierDuSite(dossier))) {
            throw new Error('Le dossier « ' + dossier.name + ' » ne contient pas js/contenu.js. Choisis le dossier du site, celui qui contient index.html.');
        }
        await memoire('dossier', dossier);
        return dossier;
    }

    // Relit js/contenu.js sur le disque : les modifications faites à la main ne sont jamais écrasées
    async function lireContenu(dossier) {
        var fichier = await (await sousDossier(dossier, 'js')).getFileHandle('contenu.js');
        var texte = await (await fichier.getFile()).text();
        var bac = {};
        try {
            new Function('window', texte)(bac);
        } catch (erreur) {
            throw new Error('js/contenu.js contient une erreur (' + erreur.message + '). Corrige-la avant d\'ajouter un élément.');
        }
        if (!bac.CONTENU) throw new Error('js/contenu.js ne définit plus window.CONTENU.');
        return bac.CONTENU;
    }

    // Photo allégée : 1600 px maximum, JPEG (ou PNG si l'image d'origine en est un)
    async function preparerImage(fichier) {
        if (fichier.type === 'image/svg+xml' || fichier.type === 'image/gif') {
            return { blob: fichier, extension: fichier.type === 'image/gif' ? 'gif' : 'svg' };
        }
        var image;
        try {
            image = await createImageBitmap(fichier);
        } catch (erreur) {
            throw new Error('Cette image ne peut pas être lue. Utilise un fichier JPG, PNG ou WebP.');
        }
        var echelle = Math.min(1, 1600 / Math.max(image.width, image.height));
        var canvas = document.createElement('canvas');
        canvas.width = Math.round(image.width * echelle);
        canvas.height = Math.round(image.height * echelle);
        var g = canvas.getContext('2d');
        var png = fichier.type === 'image/png';
        if (!png) {
            g.fillStyle = '#ffffff';
            g.fillRect(0, 0, canvas.width, canvas.height);
        }
        g.drawImage(image, 0, 0, canvas.width, canvas.height);
        var blob = await new Promise(function (resoudre) {
            canvas.toBlob(resoudre, png ? 'image/png' : 'image/jpeg', 0.86);
        });
        return { blob: blob, extension: png ? 'png' : 'jpg' };
    }

    async function ecrireImage(dossier, image, base) {
        var ressources = await sousDossier(dossier, 'ressources', true);
        var nom;
        for (var n = 1; n < 100; n++) {
            nom = base + (n > 1 ? '-' + n : '') + '.' + image.extension;
            try {
                await ressources.getFileHandle(nom);
            } catch (erreur) {
                break;
            }
        }
        await ecrireFichier(ressources, nom, image.blob);
        return 'ressources/' + nom;
    }

    function enDataUrl(blob) {
        return new Promise(function (resoudre, rejeter) {
            var lecteur = new FileReader();
            lecteur.onload = function () { resoudre(lecteur.result); };
            lecteur.onerror = function () { rejeter(lecteur.error); };
            lecteur.readAsDataURL(blob);
        });
    }

    function telecharger(texte) {
        var lien = document.createElement('a');
        lien.href = URL.createObjectURL(new Blob([texte], { type: 'text/javascript;charset=utf-8' }));
        lien.download = 'contenu.js';
        document.body.appendChild(lien);
        lien.click();
        lien.remove();
        setTimeout(function () { URL.revokeObjectURL(lien.href); }, 4000);
    }

    // Mémorise le dossier choisi (IndexedDB) pour ne pas le redemander à chaque ajout
    function memoire(cle, valeur) {
        return new Promise(function (resoudre) {
            var ouverture;
            try {
                ouverture = indexedDB.open('cv-edition', 1);
            } catch (erreur) {
                resoudre(null);
                return;
            }
            ouverture.onupgradeneeded = function () { ouverture.result.createObjectStore('reglages'); };
            ouverture.onerror = function () { resoudre(null); };
            ouverture.onsuccess = function () {
                var magasin = ouverture.result.transaction('reglages', valeur === undefined ? 'readonly' : 'readwrite').objectStore('reglages');
                var requete = valeur === undefined ? magasin.get(cle) : magasin.put(valeur, cle);
                requete.onsuccess = function () { resoudre(valeur === undefined ? requete.result || null : valeur); };
                requete.onerror = function () { resoudre(null); };
            };
        });
    }
})(typeof window !== 'undefined' ? window : this);
