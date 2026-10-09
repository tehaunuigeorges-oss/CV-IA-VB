/*
 * ============================================================
 *  CONTENU DU SITE : c'est le seul fichier à modifier
 * ============================================================
 *
 *  Chaque rubrique (passions, parcours, expériences, projets,
 *  compétences) est une liste d'éléments entre [ ].
 *  L'ordre des éléments ici est l'ordre d'affichage sur le site.
 *
 *  Pour AJOUTER un élément :
 *    1. copie un bloc { … } de la même rubrique (ou décommente
 *       le modèle prêt à l'emploi en enlevant les // devant) ;
 *    2. colle-le à l'endroit voulu, en séparant les blocs par
 *       une virgule ;
 *    3. modifie les textes entre guillemets, enregistre et
 *       recharge la page.
 *
 *  Pour RETIRER un élément : efface son bloc { … } et sa virgule.
 *
 *  Une page reste vide ou affiche un message d'erreur ? Il manque
 *  sûrement une virgule, un guillemet ou une accolade ici : la
 *  console du navigateur (touche F12) indique la ligne fautive.
 * ============================================================
 */
window.CONTENU = {

    /*
     * PASSIONS
     * Chaque passion a sa carte sur la page « Mes passions » et sa
     * propre page (passion-detail.html?id=…), créées automatiquement.
     *
     *   id       : nom court, unique, sans espace ni accent (ex. "musique")
     *   nom      : titre de la carte
     *   titre    : grand titre de sa page
     *   couleur  : couleur d'accent, en code hexadécimal (ex. "#ff8a3d")
     *   photo    : image rangée dans le dossier ressources
     *   alt      : courte description de la photo (accessibilité)
     *   objet3d  : basket, pokemon, cuisine, musculation, vetement, japon,
     *              jeux-video, ou "medaille" : une pièce 3D avec ton emoji
     *   emoji    : symbole gravé sur la médaille (seulement avec "medaille")
     *   motsCles : petites étiquettes sous le titre
     *   texte    : un paragraphe par ligne entre guillemets
     */
    passions: [
        {
            id: "basket",
            nom: "Basket",
            titre: "Le Basket pour moi",
            couleur: "#ff8a3d",
            photo: "ressources/basket.avif",
            alt: "Match de basket",
            objet3d: "basket",
            motsCles: ["Street", "NBA", "NBA 2K"],
            texte: [
                "Le basket a pris une place importante dans ma vie, et c'est assez inattendu. Pendant longtemps, j'ai joué au rugby, mais je ne me sentais plus vraiment à ma place dedans. Je cherchais un sport où je me retrouve vraiment, sans bien savoir lequel. Un jour, j'ai commencé à jouer au basket en street, sur des playgrounds avec des gens que je ne connaissais pas la veille. Ça m'a tout de suite plu. Il y a l'intensité, les duels, la légère tension avant un match, et ce plaisir simple de tirer dans un panier et de voir la balle passer dedans. Ça m'a aussi valu quelques entorses, au point qu'aujourd'hui je peux dire que j'ai des chevilles en carton, mais ça ne m'a jamais vraiment découragé.",
                "En parallèle, je me suis mis à regarder beaucoup de matchs de NBA, souvent tard le soir, en découvrant peu à peu les styles de jeu, les systèmes et les histoires derrière chaque équipe. Mon joueur préféré, c'est Zion Williamson. Sa carrière n'a pas été à la hauteur de ce qu'on attendait de lui, entre les blessures et les attentes démesurées qui ont accompagné ses débuts, mais il m'a toujours fasciné par sa puissance et sa façon unique de dominer la raquette. Quand on aime un joueur, on le suit même quand ça ne va pas, et c'est un peu ce que je fais avec lui.",
                "Ma passion a grandi petit à petit, et j'ai fini par en faire une vraie part de mon quotidien. J'ai même eu la chance d'assister à un match à Paris, lors du NBA Paris Game, entre les Spurs et les Pacers. Voir des joueurs professionnels évoluer à quelques mètres de soi, avec l'ambiance électrique d'une grande soirée, c'est un souvenir que je n'oublierai pas et qui a sans doute renforcé mon envie de continuer.",
                "Aujourd'hui, je regarde les résultats chaque matin, je suis les performances de mes équipes et de mes joueurs, et je joue tous les jours à NBA 2K. Entre le jeu vidéo, les matchs à la télé et les parties en street, le basket occupe une place que je n'avais pas prévue, mais qui me fait vraiment du bien au quotidien."
            ]
        },
        {
            id: "pokemon",
            nom: "Pokémon",
            titre: "Pokemon pour moi",
            couleur: "#ff4f5e",
            photo: "ressources/pokemon.jpg",
            alt: "Pokémon",
            objet3d: "pokemon",
            motsCles: ["Rouge Rubis", "Cartes", "Collection"],
            texte: [
                "Mon histoire avec Pokémon a commencé petit, sur ma console DS, avec Rouge Rubis. Je passais des heures à explorer les régions, à capturer des créatures, à affronter les champions d'arène et à construire mon équipe idéale. Chaque victoire et chaque nouvelle rencontre me donnaient envie d'aller plus loin. Cette passion ne m'a jamais vraiment quitté, même si j'ai mis les jeux de côté pendant un temps.",
                "Ce qui m'a toujours attiré, c'est la collection. Enfant, j'ai commencé à rassembler des cartes Pokémon, à les trier, à comparer les illustrations et à repérer les différentes éditions. Chaque carte était un petit trésor, et je passais beaucoup de temps à admirer le travail des illustrateurs. Après une longue pause, j'ai repris cette activité il y a quelques mois, et elle a vite pris de l'ampleur. Aujourd'hui, ma collection représente une valeur de plus de 1000 euros, mais ce qui compte vraiment pour moi, c'est le plaisir de chercher la carte qui manque, de dénicher une pièce rare lors d'une belle trouvaille, et de retrouver ce sentiment d'émerveillement que j'avais enfant.",
                "Parmi toutes les créatures de la franchise, mes favorites sont Forgelina et Dracaufeu. Dracaufeu reste un classique qui m'accompagne depuis mes débuts, avec son allure imposante et son lien avec mes premières aventures. Forgelina, de son côté, a su gagner une place de choix dans mon cœur grâce à son design élégant et à la façon dont elle incarne l'équilibre entre puissance et finesse."
            ]
        },
        {
            id: "cuisine",
            nom: "Cuisine",
            titre: "La cuisine pour moi",
            couleur: "#ffbf47",
            photo: "ressources/cuisine-paysage.jpg",
            alt: "Cuisine",
            objet3d: "cuisine",
            motsCles: ["Nems", "Recettes asiatiques", "Épices"],
            texte: [
                "Depuis tout petit, j'ai grandi au rythme des bons plats de ma grand-mère, qui cuisine des recettes asiatiques. Son plat phare, ce sont les nems. Il y a dans sa cuisine quelque chose de patient et de précis, et j'ai longtemps regardé faire sans vraiment comprendre ce qui se passait derrière. Un jour, j'ai eu envie de savoir comment on arrivait à ce goût-là.",
                "Vers l'adolescence, je me suis lancé dans les recettes, un peu au hasard au début. Je testais ce qui me tombait sous la main, je ratais souvent, je recommençais. À un moment, on m'a même offert un tablier et des couteaux de cuisine, comme si on me disait que c'était sérieux. Je ne suis pas encore à la hauteur de ma grand-mère ni de mes parents, loin de là. Leurs gestes ont une évidence que je n'ai pas encore. Mais je vois ma cuisine progresser, les plats sont plus justes, je sais mieux ce que je fais.",
                "Au fond, ce qui me plaît le plus, c'est le moment lui-même. Couper les légumes, sentir les épices, prendre le temps de rouler des nems sans se presser. En cuisine, je me détends, je laisse la journée de côté, et je retrouve un peu de la patience que j'ai vue chez ma grand-mère."
            ]
        },
        {
            id: "musculation",
            nom: "Musculation",
            titre: "La Musculation pour moi",
            couleur: "#5ea8ff",
            photo: "ressources/musculation-paysage.jpg",
            alt: "musculation",
            objet3d: "musculation",
            motsCles: ["Discipline", "Rigueur", "Jambes"],
            texte: [
                "J'ai poussé la porte de la salle en seconde avec un objectif simple : améliorer mon physique. Très vite, la musculation est devenue bien plus qu'une question d'apparence. Ce sport m'a transmis une discipline et une rigueur quotidiennes qui me servent aujourd'hui dans tous les aspects de ma vie, tout en m'aidant à me sentir mieux au quotidien. Et contrairement à la majorité des gens… j'adore entraîner les jambes."
            ]
        },
        {
            id: "vetement",
            nom: "Vêtements",
            titre: "La Mode pour moi",
            couleur: "#c58cff",
            photo: "ressources/mode-paysage.jpg",
            alt: "Vêtements et mode",
            objet3d: "vetement",
            motsCles: ["Sneakers", "Marques", "Style"],
            texte: [
                "C'est à une période où je me sentais mal dans ma peau que je me suis mis à soigner mon style vestimentaire. Au départ, ce n'était qu'une tentative parmi d'autres pour me sentir mieux, mais très vite, m'habiller différemment a changé quelque chose dans mon rapport à moi-même. Les vêtements sont devenus un véritable outil pour reprendre confiance : en soignant mon apparence, j'avais l'impression de reprendre un peu de contrôle sur l'image que je renvoyais, et ça m'a permis de me sentir beaucoup mieux dans ma peau.",
                "Ce qui n'était au début qu'une envie de mieux paraître s'est peu à peu transformé en une véritable passion pour la mode. Je me suis mis à m'intéresser aux marques, aux coupes, aux matières, à la façon d'associer les pièces entre elles. Les sneakers occupent une place à part dans cette passion : j'en ai toujours été fan, et encore plus à l'époque où elles étaient vraiment au centre de toutes les tendances. Chaque nouvelle paire, chaque sortie très attendue, c'était un peu un événement pour moi.",
                "Bien sûr, il faut l'avouer honnêtement : mes débuts dans la mode n'ont pas été très glorieux. J'ai porté des tenues franchement ratées, mal assorties, parfois même un peu ridicules quand j'y repense aujourd'hui. Mais c'est justement en expérimentant, en me trompant, en observant ce qui fonctionnait ou pas, que j'ai appris à développer mon propre style. Année après année, mes choix sont devenus plus réfléchis, plus cohérents, et mes tenues de plus en plus travaillées. Aujourd'hui, la mode n'est plus seulement un moyen de me sentir bien : c'est devenu une vraie passion, une façon d'exprimer qui je suis."
            ]
        },
        {
            id: "japon",
            nom: "Japon",
            titre: "Le Japon pour moi",
            couleur: "#ff6f91",
            photo: "ressources/japon.jpg",
            alt: "Paysage du Japon",
            objet3d: "japon",
            motsCles: ["Animes", "Japan Expo", "Tokyo"],
            texte: [
                "Ma passion pour le Japon est née à travers les animes. C'est en les découvrant que je suis littéralement tombé amoureux de ce pays, de sa culture, de son histoire et de son univers si particulier. Chaque anime m'a ouvert une fenêtre un peu différente sur le Japon : parfois la vie quotidienne japonaise, parfois des traditions ancestrales, parfois une modernité incroyable qu'on ne retrouve nulle part ailleurs. Plus je regardais d'animes, plus mon envie de découvrir ce pays grandissait.",
                "Cette passion, je la vis pleinement en allant à la Japan Expo. C'est pour moi l'occasion de me plonger quelques jours dans cet univers qui me fascine tant : retrouver d'autres passionnés qui partagent les mêmes centres d'intérêt, découvrir des produits dérivés, assister à des évènements autour des animes et de la culture japonaise. C'est une parenthèse qui me permet de vivre, le temps d'un week-end, un peu de ce Japon que j'aime tant, en attendant de pouvoir vraiment m'y rendre.",
                "Parce qu'au fond, mon véritable rêve, c'est de pouvoir un jour aller au Japon. Marcher dans les rues de Tokyo, découvrir les lieux que j'ai vus et revus dans mes animes préférés, ressentir cette ambiance si unique de mélange entre tradition et modernité. En attendant ce jour, je continue de nourrir cette passion à travers les animes, la Japan Expo, et tout ce qui me rapproche, même un peu, de ce pays qui me fait rêver."
            ]
        },
        {
            id: "jeux-video",
            nom: "Jeux vidéo",
            titre: "Les jeux-video pour moi",
            couleur: "#4fe3c1",
            photo: "ressources/jeux video.jpg",
            alt: "Jeux vidéo",
            objet3d: "jeux-video",
            motsCles: ["Call of Duty", "NBA 2K", "Compétition"],
            texte: [
                "Je joue aux jeux vidéo depuis que je suis tout petit, et j'ai d'abord été bercé par les jeux de tir, notamment la série Call of Duty. C'est avec ce type de jeux que j'ai vraiment commencé à m'intéresser au gaming, à développer mes réflexes et mon goût pour la compétition.",
                "Avec le temps, je me suis passionné pour les jeux de sport, où je dois avouer que je suis particulièrement doué. NBA 2K est sans doute celui qui me représente le mieux : c'est un jeu où j'excelle vraiment, où je peux prendre le dessus sur la plupart de mes adversaires. J'y retrouve à la fois ma passion pour le sport et mon goût pour la compétition, le tout dans un univers que je maîtrise de mieux en mieux au fil des années.",
                "Mais au-delà de la performance, les jeux vidéo occupent une place très importante dans ma vie. C'est un véritable moyen de m'évader, de décompresser après une journée chargée, de me retrouver seul ou avec des amis autour d'une passion commune. C'est à la fois un loisir, un défi et un espace où je peux me dépasser, tout en me détendant."
            ]
        },

        // Modèle : enlève les // devant chaque ligne pour l'activer.
        // {
        //     id: "musique",
        //     nom: "Musique",
        //     titre: "La musique pour moi",
        //     couleur: "#f472b6",
        //     photo: "ressources/ma-photo.jpg",
        //     alt: "Description de la photo",
        //     objet3d: "medaille",
        //     emoji: "🎧",
        //     motsCles: ["Mot-clé 1", "Mot-clé 2"],
        //     texte: [
        //         "Premier paragraphe.",
        //         "Deuxième paragraphe."
        //     ]
        // },
    ],

    /*
     * PARCOURS et EXPÉRIENCES (frises chronologiques)
     *
     *   date   : texte de la pastille (ex. "2024", "Depuis 2025")
     *   titre  : formation, entreprise…
     *   lignes : détails, une ligne par élément
     */
    parcours: [
        {
            date: "2023-2026",
            titre: "Baccalauréat général",
            lignes: [
                "Lycée Alfred Kastler Talence",
                "Spécialités : Mathématiques / Physique-Chimie / Sciences de l'ingénieur",
                "Option : Maths expertes"
            ]
        },
        {
            date: "2025",
            titre: "BAFA",
            lignes: [
                "Spécialisation : assistant sanitaire"
            ]
        },
        {
            date: "2026-2031",
            titre: "Bachelor / Mastère",
            lignes: [
                "Ynov Campus",
                "Spécialité : Cybersécurité"
            ]
        },

        // Modèle :
        // {
        //     date: "2031",
        //     titre: "Nouvelle formation",
        //     lignes: ["Établissement", "Spécialité : …"]
        // },
    ],

    experiences: [
        {
            date: "2023",
            titre: "AREVCO Bordeaux",
            lignes: [
                "Stage de 3e dans une entreprise d'expertise comptable"
            ]
        },
        {
            date: "2023",
            titre: "ALSH",
            lignes: [
                "Stage en tant qu'animateur pour une durée de deux semaines"
            ]
        },
        {
            date: "Actuellement en contrat",
            titre: "MCDO",
            lignes: [
                "Equipier polyvalent en cuisine"
            ]
        },

        // Modèle :
        // {
        //     date: "2026",
        //     titre: "Nom de l'entreprise",
        //     lignes: ["Poste ou mission"]
        // },
    ],

    /*
     * PROJETS
     *
     *   nom   : titre de la carte
     *   lien  : adresse du site du projet (s'ouvre dans un nouvel onglet)
     *   image : logo ou photo rangé dans le dossier ressources
     *   alt   : courte description de l'image
     */
    projets: [
        {
            nom: "Math en jean",
            lien: "https://www.mathenjeans.fr",
            image: "ressources/Math_En_Jeans_Logo_2015-Valenciennes.png",
            alt: "math"
        },
        {
            nom: "Course en cours",
            lien: "https://course-en-cours.com",
            image: "ressources/1631320557329.jpg",
            alt: "robotique"
        },
        {
            nom: "Robbocup",
            lien: "https://www.robocup.fr",
            image: "ressources/455f5203f9010191ce50e222fc92e7-3d927.jpg",
            alt: "robbocup"
        },

        // Modèle :
        // {
        //     nom: "Mon projet",
        //     lien: "https://github.com/tehaunuigeorges-oss",
        //     image: "ressources/mon-projet.png",
        //     alt: "Logo du projet"
        // },
    ],

    /*
     * COMPÉTENCES : une carte par catégorie
     *
     *   categorie : titre de la carte
     *   icone     : personnes, code, langue, outil, etoile ou coeur
     *   affichage : "pastilles" (liste compacte) ou "tuiles" (grandes cases)
     *   elements  : les compétences ; en tuiles, tu peux préciser un symbole :
     *               { nom: "GO", symbole: "{ }" }
     */
    competences: [
        {
            categorie: "Soft skills",
            icone: "personnes",
            affichage: "pastilles",
            elements: ["Autonomie", "Rigueur", "Sens des responsabilités", "Pédagogogue", "Communication", "Esprit d'équipe"]
        },
        {
            categorie: "Hard skills",
            icone: "code",
            affichage: "tuiles",
            elements: [
                { nom: "HTML/css", symbole: "</>" },
                { nom: "GO", symbole: "{ }" }
            ]
        },

        // Modèle :
        // {
        //     categorie: "Langues",
        //     icone: "langue",
        //     affichage: "pastilles",
        //     elements: ["Langue 1", "Langue 2"]
        // },
    ]
};
