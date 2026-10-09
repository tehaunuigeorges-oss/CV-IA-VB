/*
 * Objets 3D des passions, dessinés avec Three.js (r149, chargé juste avant ce fichier).
 *
 * Un seul contexte WebGL dessine tous les objets de la page, puis chaque
 * <canvas data-model="..."> reçoit une copie de son image. C'est bien plus léger
 * que sept contextes WebGL, et chaque objet suit les inclinaisons CSS de sa carte.
 *
 * Sans WebGL (ou si Three.js ne charge pas), la classe "no-webgl" est ajoutée
 * sur <html> et les pages restent complètes : photos et textes ne dépendent pas de la 3D.
 */
(function () {
    'use strict';

    var canvases = Array.prototype.slice.call(document.querySelectorAll('canvas[data-model]'));
    if (!canvases.length) return;

    var THREE = window.THREE;

    function disable() {
        document.documentElement.classList.add('no-webgl');
    }

    if (!THREE) {
        disable();
        return;
    }

    THREE.ColorManagement.legacyMode = false;

    var renderer;
    try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch (error) {
        disable();
        return;
    }

    renderer.setPixelRatio(1);
    renderer.setClearColor(0x000000, 0);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    var stillQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    var environment = createEnvironment();
    var textures = {
        shadow: radialTexture('rgba(0,0,0,0.8)', 'rgba(0,0,0,0)'),
        glow: radialTexture('rgba(255,255,255,1)', 'rgba(255,255,255,0)')
    };

    /* ---------------------------------------------------------
       Outils
       --------------------------------------------------------- */

    function random(min, max) {
        return min + Math.random() * (max - min);
    }

    function radialTexture(inner, outer) {
        var size = 128;
        var canvas = document.createElement('canvas');
        canvas.width = canvas.height = size;
        var g = canvas.getContext('2d');
        var gradient = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        gradient.addColorStop(0, inner);
        gradient.addColorStop(1, outer);
        g.fillStyle = gradient;
        g.fillRect(0, 0, size, size);
        var texture = new THREE.CanvasTexture(canvas);
        texture.encoding = THREE.sRGBEncoding;
        return texture;
    }

    // Petits points en relief (cuir du ballon, pâte des nems, moletage de la barre).
    // Les points qui débordent sont recopiés de l'autre côté pour éviter une couture visible.
    function speckleTexture(width, height, count, maxRadius) {
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        var g = canvas.getContext('2d');
        g.fillStyle = '#787878';
        g.fillRect(0, 0, width, height);
        for (var i = 0; i < count; i++) {
            var value = 120 + Math.floor(Math.random() * 110);
            var x = Math.random() * width;
            var y = Math.random() * height;
            var r = 0.5 + Math.random() * maxRadius;
            g.fillStyle = 'rgb(' + value + ',' + value + ',' + value + ')';
            [x, x - width, x + width].forEach(function (cx) {
                if (cx + r < 0 || cx - r > width) return;
                g.beginPath();
                g.arc(cx, y, r, 0, Math.PI * 2);
                g.fill();
            });
        }
        var texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        return texture;
    }

    // Feuille posée à plat : bords ondulés et nervure centrale plus claire.
    function leafGeometry(length, width, ruffle, centerColor, edgeColor) {
        var geometry = new THREE.PlaneGeometry(length, 2, 40, 12);
        var position = geometry.attributes.position;
        var colors = [];
        var center = new THREE.Color(centerColor);
        var edge = new THREE.Color(edgeColor);
        var mixed = new THREE.Color();
        for (var i = 0; i < position.count; i++) {
            var x = position.getX(i);
            var side = position.getY(i);
            var t = x / length + 0.5;
            var half = Math.pow(Math.sin(Math.PI * t), 0.6) * width / 2;
            var rim = side * side;
            var lift = rim * width * 0.16 + Math.sin(t * Math.PI * 9) * ruffle * rim - Math.pow(2 * t - 1, 2) * 0.03;
            position.setXYZ(i, x, side * half, lift);
            mixed.copy(center).lerp(edge, Math.min(1, Math.abs(side) * 1.4));
            colors.push(mixed.r, mixed.g, mixed.b);
        }
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geometry.computeVertexNormals();
        geometry.rotateX(-Math.PI / 2);
        return geometry;
    }

    // Galette frite : fond doré, cloques plus foncées et reflets clairs.
    function friedTexture() {
        var canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 128;
        var g = canvas.getContext('2d');
        g.fillStyle = '#d4913f';
        g.fillRect(0, 0, 256, 128);
        for (var i = 0; i < 900; i++) {
            var dark = Math.random() < 0.6;
            g.fillStyle = dark ? 'rgba(130, 62, 18, ' + random(0.15, 0.45) + ')' : 'rgba(255, 214, 140, ' + random(0.2, 0.5) + ')';
            g.beginPath();
            g.ellipse(Math.random() * 256, Math.random() * 128, random(1, 5), random(0.8, 2.5), Math.random() * Math.PI, 0, Math.PI * 2);
            g.fill();
        }
        // Plis de la galette de riz qui s'enroulent autour du nem (u = tour, v = longueur)
        g.strokeStyle = 'rgba(120, 58, 16, 0.35)';
        g.lineWidth = 2;
        for (var y = 6; y < 128; y += 17) {
            g.beginPath();
            g.moveTo(0, y);
            g.bezierCurveTo(85, y + 9, 170, y - 9, 256, y);
            g.stroke();
        }
        var texture = new THREE.CanvasTexture(canvas);
        texture.encoding = THREE.sRGBEncoding;
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        return texture;
    }

    // Face de la médaille : dégradé dans la couleur d'accent, anneau clair et symbole au centre.
    function badgeTexture(symbol, accent) {
        var size = 512;
        var canvas = document.createElement('canvas');
        canvas.width = canvas.height = size;
        var g = canvas.getContext('2d');
        var base = '#' + accent.getHexString();
        var gradient = g.createRadialGradient(size * 0.38, size * 0.32, size * 0.05, size / 2, size / 2, size / 2);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.25, base);
        gradient.addColorStop(1, '#14141c');
        g.fillStyle = base;
        g.fillRect(0, 0, size, size);
        g.globalAlpha = 0.55;
        g.fillStyle = gradient;
        g.fillRect(0, 0, size, size);
        g.globalAlpha = 1;

        g.strokeStyle = 'rgba(255, 255, 255, 0.55)';
        g.lineWidth = 8;
        g.beginPath();
        g.arc(size / 2, size / 2, size * 0.41, 0, Math.PI * 2);
        g.stroke();

        g.textAlign = 'center';
        g.textBaseline = 'middle';
        g.font = '250px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", "Agrandir", system-ui, sans-serif';
        g.shadowColor = 'rgba(0, 0, 0, 0.45)';
        g.shadowBlur = 18;
        g.shadowOffsetY = 8;
        g.fillStyle = '#ffffff';
        g.fillText(symbol, size / 2, size / 2 + 12);

        var texture = new THREE.CanvasTexture(canvas);
        texture.encoding = THREE.sRGBEncoding;
        texture.anisotropy = 4;
        return texture;
    }

    // Studio photo virtuel : quelques panneaux lumineux qui donnent de beaux reflets.
    function createEnvironment() {
        var pmrem = new THREE.PMREMGenerator(renderer);
        var studio = new THREE.Scene();
        var room = new THREE.BoxGeometry(12, 12, 12);
        var panel = new THREE.PlaneGeometry(1, 1);

        studio.add(new THREE.Mesh(room, new THREE.MeshBasicMaterial({ color: 0x15151d, side: THREE.BackSide })));

        [
            // largeur, hauteur, intensité, x, y, z
            [9, 3, 3.2, 0, 5.9, 0],
            [3.2, 6, 2.2, -5.9, 1.2, 1.5],
            [3.2, 6, 1.4, 5.9, 0.6, -1.5],
            [7, 2.2, 0.9, 0, -0.6, 5.9]
        ].forEach(function (p) {
            var material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
            material.color.multiplyScalar(p[2]);
            var light = new THREE.Mesh(panel, material);
            light.scale.set(p[0], p[1], 1);
            light.position.set(p[3], p[4], p[5]);
            light.lookAt(0, 0, 0);
            studio.add(light);
        });

        var texture = pmrem.fromScene(studio, 0.04).texture;
        pmrem.dispose();
        studio.traverse(function (object) {
            if (object.material) object.material.dispose();
        });
        room.dispose();
        panel.dispose();
        return texture;
    }

    function lathe(points, segments) {
        return new THREE.LatheGeometry(points.map(function (p) {
            return new THREE.Vector2(p[0], p[1]);
        }), segments || 64);
    }

    /* ---------------------------------------------------------
       Modèles : chaque fonction renvoie
         root   : l'objet, centré sur l'origine
         radius : rayon englobant (sert à cadrer la caméra)
         view   : inclinaison de présentation vers la caméra (radians)
         roll   : inclinaison latérale (radians)
         sway   : amplitude de balancement ; 0 = rotation complète
         speed  : vitesse de rotation ou de balancement
         extras : éléments qui flottent sans tourner (vapeur, pétales…)
         update : animation propre à l'objet
       --------------------------------------------------------- */

    var MODELS = {
        basket: function () {
            var group = new THREE.Group();
            var pebbles = speckleTexture(1024, 512, 30000, 1.5);
            var leather = new THREE.MeshStandardMaterial({ color: 0xd4601e, roughness: 0.68, bumpMap: pebbles, bumpScale: 0.012 });
            group.add(new THREE.Mesh(new THREE.SphereGeometry(1, 72, 48), leather));

            var seam = new THREE.MeshStandardMaterial({ color: 0x1c1310, roughness: 0.55 });
            function ring(radius, rotationX, rotationY, offsetX) {
                var mesh = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.026, 10, 160), seam);
                mesh.rotation.set(rotationX, rotationY, 0);
                mesh.position.x = offsetX || 0;
                group.add(mesh);
            }
            var curve = THREE.MathUtils.degToRad(56);
            ring(1, Math.PI / 2, 0);
            ring(1, 0, Math.PI / 2);
            ring(Math.sin(curve), 0, Math.PI / 2, Math.cos(curve));
            ring(Math.sin(curve), 0, Math.PI / 2, -Math.cos(curve));

            return { root: group, radius: 1.03, view: 0.35, roll: -0.38, speed: 0.75 };
        },

        pokemon: function () {
            var group = new THREE.Group();
            var red = new THREE.MeshPhysicalMaterial({ color: 0xe12a32, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.1 });
            var white = new THREE.MeshPhysicalMaterial({ color: 0xf1f1f4, roughness: 0.35, clearcoat: 1, clearcoatRoughness: 0.12 });
            var black = new THREE.MeshStandardMaterial({ color: 0x131318, roughness: 0.4 });
            var gap = 0.045;

            var top = new THREE.Mesh(new THREE.SphereGeometry(1, 72, 36, 0, Math.PI * 2, 0, Math.PI / 2), red);
            top.position.y = gap;
            var bottom = new THREE.Mesh(new THREE.SphereGeometry(1, 72, 36, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), white);
            bottom.position.y = -gap;
            var core = new THREE.Mesh(new THREE.SphereGeometry(0.985, 48, 24), black);

            var housing = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.2, 64), black);
            housing.rotation.x = Math.PI / 2;
            housing.position.z = 0.93;
            var button = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.1, 64), white);
            button.rotation.x = Math.PI / 2;
            button.position.z = 1.04;
            var ring = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.012, 10, 48), new THREE.MeshStandardMaterial({ color: 0xc9c9d2, roughness: 0.3 }));
            ring.position.z = 1.092;
            var lightMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, emissive: 0xffffff, emissiveIntensity: 0.2 });
            var light = new THREE.Mesh(new THREE.CircleGeometry(0.1, 48), lightMaterial);
            light.position.z = 1.0905;

            group.add(top, bottom, core, housing, button, ring, light);

            return {
                root: group,
                radius: 1.1,
                view: 0.18,
                sway: 0.7,
                speed: 0.7,
                boost: 1.4,
                update: function (time, delta, stage) {
                    // Petites secousses façon « capture » quand la carte est survolée
                    var phase = (time % 2.2) / 2.2;
                    var shake = phase < 0.4 ? Math.sin(phase / 0.4 * Math.PI * 3) * (1 - phase / 0.4) * 0.3 : 0;
                    group.rotation.z = shake * stage.energy;
                    lightMaterial.emissiveIntensity = 0.2 + stage.energy * (0.9 + Math.sin(time * 7) * 0.3);
                }
            };
        },

        cuisine: function () {
            var group = new THREE.Group();
            var ceramic = new THREE.MeshPhysicalMaterial({ color: 0xf4f0e8, roughness: 0.22, clearcoat: 0.6, clearcoatRoughness: 0.1, side: THREE.DoubleSide });
            var blue = new THREE.MeshStandardMaterial({ color: 0x2f62b0, roughness: 0.35, side: THREE.DoubleSide });

            group.add(new THREE.Mesh(lathe([[0, 0], [0.92, 0], [1.02, 0.03], [1.3, 0.15], [1.38, 0.18], [1.37, 0.215], [1.3, 0.2], [1.02, 0.075], [0.94, 0.06], [0, 0.06]], 96), ceramic));
            var rim = new THREE.Mesh(new THREE.TorusGeometry(1.255, 0.014, 8, 128), blue);
            rim.rotation.x = Math.PI / 2;
            rim.position.y = 0.182;
            group.add(rim);

            // Les nems reposent sur une feuille de salade, en biais dans l'assiette
            var dish = new THREE.Group();
            dish.rotation.y = -0.4;
            group.add(dish);

            var salad = new THREE.Mesh(leafGeometry(1.75, 0.9, 0.06, 0xc4e88a, 0x3f8f2c), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.5, side: THREE.DoubleSide }));
            salad.position.y = 0.075;
            dish.add(salad);

            var mintMaterial = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.45, side: THREE.DoubleSide });
            var mintGeometry = leafGeometry(0.42, 0.22, 0.012, 0x6fbf5a, 0x1f6b2a);
            [[0.82, 0.3, 0.6], [-0.8, -0.32, -0.5]].forEach(function (m) {
                var mint = new THREE.Mesh(mintGeometry, mintMaterial);
                mint.position.set(m[0], 0.09, m[1]);
                mint.rotation.y = m[2];
                dish.add(mint);
            });

            var crust = speckleTexture(256, 128, 2400, 1.4);
            var fried = new THREE.MeshStandardMaterial({ map: friedTexture(), roughness: 0.48, bumpMap: crust, bumpScale: 0.03 });
            var nemGeometry = new THREE.CapsuleGeometry(0.17, 0.86, 10, 28);
            [[0, 0.27, -0.2, 0.06], [0.04, 0.27, 0.2, -0.05], [0.02, 0.546, 0, 0.12]].forEach(function (n) {
                var nem = new THREE.Mesh(nemGeometry, fried);
                nem.rotation.set(0, n[3], Math.PI / 2);
                nem.position.set(n[0], n[1], n[2]);
                dish.add(nem);
            });

            // Coupelle de sauce d'un côté, baguettes posées sur le bord de l'autre
            var bowl = new THREE.Group();
            bowl.position.set(0, 0.06, -0.72);
            bowl.scale.setScalar(0.9);
            bowl.add(new THREE.Mesh(lathe([[0, 0], [0.14, 0], [0.2, 0.03], [0.25, 0.12], [0.26, 0.15], [0.24, 0.15], [0.23, 0.12], [0.18, 0.05], [0, 0.045]], 48), blue));
            var sauce = new THREE.Mesh(new THREE.CircleGeometry(0.215, 40), new THREE.MeshPhysicalMaterial({ color: 0xc8641e, roughness: 0.08, clearcoat: 1 }));
            sauce.rotation.x = -Math.PI / 2;
            sauce.position.y = 0.11;
            bowl.add(sauce);
            dish.add(bowl);

            var lacquer = new THREE.MeshStandardMaterial({ color: 0x7a2a22, roughness: 0.35 });
            var stickGeometry = new THREE.CylinderGeometry(0.02, 0.034, 2.2, 14);
            [0.705, 0.795].forEach(function (z) {
                var stick = new THREE.Mesh(stickGeometry, lacquer);
                stick.rotation.z = Math.PI / 2;
                stick.position.set(0, 0.24, z);
                dish.add(stick);
            });

            // Vapeur qui s'élève au-dessus du plat
            var steam = new THREE.Group();
            var puffs = [];
            for (var p = 0; p < 7; p++) {
                var puff = new THREE.Sprite(new THREE.SpriteMaterial({ map: textures.glow, color: 0xffffff, transparent: true, opacity: 0, depthWrite: false }));
                puff.userData = { phase: p / 7, x: random(-0.3, 0.3), z: random(-0.15, 0.15) };
                steam.add(puff);
                puffs.push(puff);
            }

            return {
                root: group,
                extras: steam,
                radius: 1.42,
                view: 0.62,
                speed: 0.35,
                update: function (time, delta, stage) {
                    puffs.forEach(function (puff) {
                        var data = puff.userData;
                        var life = (time * 0.28 + data.phase) % 1;
                        var size = 0.25 + life * 0.55;
                        puff.position.set(data.x + Math.sin(life * 5 + data.phase * 9) * 0.12, 0.55 + life * 1.3, data.z);
                        puff.scale.set(size, size, 1);
                        puff.material.opacity = Math.sin(life * Math.PI) * (0.16 + stage.energy * 0.12);
                    });
                }
            };
        },

        musculation: function (accent) {
            var group = new THREE.Group();
            var bar = new THREE.Group();
            bar.rotation.z = Math.PI / 2;
            group.add(bar);

            var chrome = new THREE.MeshStandardMaterial({ color: 0xe1e4ea, metalness: 1, roughness: 0.2 });
            var knurl = speckleTexture(256, 64, 1600, 0.9);
            knurl.repeat.set(3, 1);
            var grip = new THREE.MeshStandardMaterial({ color: 0xc9ccd4, metalness: 1, roughness: 0.42, bumpMap: knurl, bumpScale: 0.01 });
            var rubber = new THREE.MeshStandardMaterial({ color: 0x1a1b21, roughness: 0.55, side: THREE.DoubleSide });
            var colored = new THREE.MeshStandardMaterial({ color: accent, roughness: 0.38, metalness: 0.15, side: THREE.DoubleSide });

            function cylinder(radius, height, material, y) {
                var mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, 40), material);
                mesh.position.y = y;
                bar.add(mesh);
            }

            // Disque aux bords arrondis, troué au centre pour le manchon
            function plate(radius, thickness, material, y) {
                var h = thickness / 2;
                var b = Math.min(0.035, h * 0.6);
                var mesh = new THREE.Mesh(lathe([[0.095, -h], [radius - b, -h], [radius, -h + b], [radius, h - b], [radius - b, h], [0.095, h]], 64), material);
                mesh.position.y = y;
                bar.add(mesh);
            }

            cylinder(0.075, 1.0, grip, 0);
            [-1, 1].forEach(function (side) {
                cylinder(0.12, 0.07, chrome, side * 0.535);
                cylinder(0.095, 0.62, chrome, side * 0.81);
                plate(0.58, 0.16, rubber, side * 0.66);
                plate(0.47, 0.13, colored, side * 0.81);
                plate(0.36, 0.1, rubber, side * 0.93);
                cylinder(0.13, 0.08, chrome, side * 1.02);
            });

            return { root: group, radius: 1.18, view: 0.32, roll: 0.42, speed: 0.6 };
        },

        vetement: function (accent) {
            var group = new THREE.Group();
            var swing = new THREE.Group();
            var hanging = new THREE.Group();
            swing.position.y = 1.045;
            hanging.position.y = -1.26;
            swing.add(hanging);
            group.add(swing);

            var outline = new THREE.Shape();
            outline.moveTo(-0.22, 0.75);
            outline.lineTo(-0.56, 0.69);
            outline.lineTo(-1.0, 0.36);
            outline.lineTo(-0.8, 0.08);
            outline.lineTo(-0.6, 0.24);
            outline.quadraticCurveTo(-0.63, -0.25, -0.6, -0.8);
            outline.quadraticCurveTo(0, -0.84, 0.6, -0.8);
            outline.quadraticCurveTo(0.63, -0.25, 0.6, 0.24);
            outline.lineTo(0.8, 0.08);
            outline.lineTo(1.0, 0.36);
            outline.lineTo(0.56, 0.69);
            outline.lineTo(0.22, 0.75);
            outline.absarc(0, 0.75, 0.22, 0, Math.PI, true);

            var shirtGeometry = new THREE.ExtrudeGeometry(outline, { depth: 0.1, bevelEnabled: true, bevelThickness: 0.07, bevelSize: 0.045, bevelSegments: 5, curveSegments: 24 });
            shirtGeometry.translate(0, 0, -0.05);
            var fabric = new THREE.MeshPhysicalMaterial({ color: 0xece6dc, roughness: 0.92, sheen: 1, sheenRoughness: 0.5, sheenColor: accent.clone().lerp(new THREE.Color(0xffffff), 0.4) });
            hanging.add(new THREE.Mesh(shirtGeometry, fabric));

            var rib = new THREE.MeshPhysicalMaterial({ color: accent, roughness: 0.8, sheen: 0.6 });
            var collar = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.045, 12, 48, Math.PI), rib);
            collar.position.set(0, 0.75, 0);
            collar.rotation.z = Math.PI;
            collar.scale.z = 2.6;
            hanging.add(collar);

            var badge = new THREE.Mesh(new THREE.CircleGeometry(0.15, 48), new THREE.MeshStandardMaterial({ color: accent, roughness: 0.6 }));
            badge.position.set(0, 0.2, 0.123);
            var badgeRing = new THREE.Mesh(new THREE.RingGeometry(0.085, 0.105, 48), new THREE.MeshStandardMaterial({ color: 0xf6f2ea, roughness: 0.6 }));
            badgeRing.position.set(0, 0.2, 0.124);
            hanging.add(badge, badgeRing);

            var wood = new THREE.MeshStandardMaterial({ color: 0x8d5b34, roughness: 0.45 });
            var arms = new THREE.CatmullRomCurve3([
                new THREE.Vector3(-0.8, 0.44, 0),
                new THREE.Vector3(-0.4, 0.64, 0),
                new THREE.Vector3(0, 0.8, 0),
                new THREE.Vector3(0.4, 0.64, 0),
                new THREE.Vector3(0.8, 0.44, 0)
            ]);
            hanging.add(new THREE.Mesh(new THREE.TubeGeometry(arms, 64, 0.04, 12, false), wood));

            var metal = new THREE.MeshStandardMaterial({ color: 0xd5d8de, metalness: 1, roughness: 0.25 });
            var stem = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.2, 12), metal);
            stem.position.y = 0.9;
            var hook = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.02, 10, 40, Math.PI * 1.55), metal);
            hook.position.y = 1.13;
            hook.rotation.z = -Math.PI / 2;
            hanging.add(stem, hook);

            return {
                root: group,
                radius: 1.15,
                view: 0.05,
                sway: 0.55,
                speed: 0.55,
                update: function (time, delta, stage) {
                    swing.rotation.z = Math.sin(time * 1.7) * (0.04 + stage.energy * 0.08);
                }
            };
        },

        japon: function () {
            var group = new THREE.Group();
            var vermilion = new THREE.MeshStandardMaterial({ color: 0xd63a26, roughness: 0.45 });
            var lacquer = new THREE.MeshStandardMaterial({ color: 0x18181d, roughness: 0.35 });
            var gold = new THREE.MeshStandardMaterial({ color: 0xd4a548, metalness: 0.9, roughness: 0.3 });

            function add(geometry, material, x, y, z) {
                var mesh = new THREE.Mesh(geometry, material);
                mesh.position.set(x, y, z || 0);
                group.add(mesh);
            }

            var pillar = new THREE.CylinderGeometry(0.085, 0.105, 2.0, 32);
            var foot = new THREE.CylinderGeometry(0.125, 0.14, 0.2, 32);
            [-0.72, 0.72].forEach(function (x) {
                add(pillar, vermilion, x, -0.12);
                add(foot, lacquer, x, -1.02);
            });
            add(new THREE.BoxGeometry(2.04, 0.12, 0.13), vermilion, 0, 0.42);
            add(new THREE.BoxGeometry(0.11, 0.3, 0.1), vermilion, 0, 0.62);
            add(new THREE.BoxGeometry(0.3, 0.36, 0.04), gold, 0, 0.62, 0.065);
            add(new THREE.BoxGeometry(0.24, 0.3, 0.05), lacquer, 0, 0.62, 0.07);
            add(new THREE.BoxGeometry(2.24, 0.13, 0.17), vermilion, 0, 0.8);

            // Linteau supérieur aux extrémités relevées
            var lintel = new THREE.Shape();
            lintel.moveTo(-1.3, 0);
            lintel.quadraticCurveTo(0, -0.07, 1.3, 0);
            lintel.lineTo(1.47, 0.17);
            lintel.quadraticCurveTo(0, 0.02, -1.47, 0.17);
            lintel.lineTo(-1.3, 0);
            var lintelGeometry = new THREE.ExtrudeGeometry(lintel, { depth: 0.26, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015, bevelSegments: 2, curveSegments: 32 });
            lintelGeometry.translate(0, 0, -0.13);
            add(lintelGeometry, lacquer, 0, 0.865);

            // Soleil couchant + pétales de cerisier qui tombent
            var scenery = new THREE.Group();
            var sun = new THREE.Mesh(new THREE.CircleGeometry(0.62, 64), new THREE.MeshBasicMaterial({ color: 0xffd28a, toneMapped: false }));
            sun.position.set(0.55, 0.5, -1.6);
            var halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: textures.glow, color: 0xffb35c, transparent: true, opacity: 0.45, depthWrite: false, toneMapped: false }));
            halo.position.set(0.55, 0.5, -1.62);
            halo.scale.set(2.6, 2.6, 1);
            scenery.add(halo, sun);

            var petalGeometry = new THREE.CircleGeometry(0.05, 12);
            petalGeometry.scale(1, 0.62, 1);
            var petalMaterial = new THREE.MeshStandardMaterial({ color: 0xffb8cb, roughness: 0.55, side: THREE.DoubleSide, emissive: 0x6b2340, emissiveIntensity: 0.35 });
            var count = 40;
            var petals = new THREE.InstancedMesh(petalGeometry, petalMaterial, count);
            petals.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
            var flakes = [];
            for (var i = 0; i < count; i++) {
                flakes.push({ x: random(-1.8, 1.8), y: random(-1.3, 1.7), z: random(-1, 1), speed: random(0.18, 0.35), phase: random(0, Math.PI * 2), spin: random(0.6, 1.8) });
            }
            scenery.add(petals);
            var dummy = new THREE.Object3D();

            return {
                root: group,
                extras: scenery,
                radius: 1.6,
                view: 0.06,
                sway: 0.5,
                speed: 0.45,
                boost: 0.8,
                update: function (time, delta, stage) {
                    flakes.forEach(function (flake, index) {
                        flake.y -= delta * flake.speed * (1 + stage.energy * 0.8);
                        if (flake.y < -1.35) {
                            flake.y = 1.7;
                            flake.x = random(-1.8, 1.8);
                        }
                        dummy.position.set(flake.x + Math.sin(time * 0.9 + flake.phase) * 0.15, flake.y, flake.z);
                        dummy.rotation.set(time * flake.spin + flake.phase, time * flake.spin * 0.7, flake.phase);
                        dummy.updateMatrix();
                        petals.setMatrixAt(index, dummy.matrix);
                    });
                    petals.instanceMatrix.needsUpdate = true;
                }
            };
        },

        'jeux-video': function (accent) {
            var group = new THREE.Group();
            var body = new THREE.Group();
            body.rotation.x = -Math.PI / 2;
            body.position.z = -0.17;
            group.add(body);

            // Demi-contour de la manette (courbes de Bézier), recopié en miroir pour l'autre moitié
            var half = [
                [[0.35, 0.47], [0.7, 0.56], [0.95, 0.5]],
                [[1.16, 0.45], [1.24, 0.3], [1.23, 0.1]],
                [[1.22, -0.18], [1.16, -0.55], [0.99, -0.73]],
                [[0.87, -0.86], [0.66, -0.84], [0.6, -0.69]],
                [[0.53, -0.5], [0.45, -0.33], [0.3, -0.3]],
                [[0.18, -0.28], [0.08, -0.28], [0, -0.28]]
            ];
            var outline = new THREE.Shape();
            outline.moveTo(0, 0.45);
            half.forEach(function (s) {
                outline.bezierCurveTo(s[0][0], s[0][1], s[1][0], s[1][1], s[2][0], s[2][1]);
            });
            for (var i = half.length - 1; i >= 0; i--) {
                var s = half[i];
                var start = i > 0 ? half[i - 1][2] : [0, 0.45];
                outline.bezierCurveTo(-s[1][0], s[1][1], -s[0][0], s[0][1], -start[0], start[1]);
            }

            var depth = 0.22;
            var bevel = 0.11;
            var shellGeometry = new THREE.ExtrudeGeometry(outline, { depth: depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: 0.09, bevelSegments: 8, curveSegments: 40 });
            shellGeometry.translate(0, 0, -depth / 2);
            var shell = new THREE.MeshPhysicalMaterial({ color: 0xe8e9ef, roughness: 0.38, clearcoat: 0.6, clearcoatRoughness: 0.25 });
            body.add(new THREE.Mesh(shellGeometry, shell));

            var top = depth / 2 + bevel;
            var dark = new THREE.MeshStandardMaterial({ color: 0x1c1e26, roughness: 0.45 });
            var well = new THREE.MeshStandardMaterial({ color: 0x2c2e38, roughness: 0.6 });
            var glow = new THREE.MeshStandardMaterial({ color: accent, emissive: accent, emissiveIntensity: 1.2, roughness: 0.3 });

            function part(geometry, material, x, y, z, faceUp) {
                var mesh = new THREE.Mesh(geometry, material);
                mesh.position.set(x, y, z);
                if (faceUp) mesh.rotation.x = Math.PI / 2;
                body.add(mesh);
                return mesh;
            }

            // Croix directionnelle
            part(new THREE.CylinderGeometry(0.2, 0.2, 0.02, 40), well, -0.64, 0.14, top + 0.01, true);
            part(new THREE.BoxGeometry(0.3, 0.095, 0.07), dark, -0.64, 0.14, top + 0.035);
            part(new THREE.BoxGeometry(0.095, 0.3, 0.07), dark, -0.64, 0.14, top + 0.035);

            // Boutons d'action
            var buttonGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.07, 32);
            [[0, 0.12, 0xf5c518], [0.12, 0, 0xf0454f], [0, -0.12, 0x3fcf6d], [-0.12, 0, 0x3d86f0]].forEach(function (b) {
                var material = new THREE.MeshStandardMaterial({ color: b[2], roughness: 0.3, emissive: b[2], emissiveIntensity: 0.15 });
                part(buttonGeometry, material, 0.64 + b[0], 0.14 + b[1], top + 0.035, true);
            });

            // Joysticks
            [-0.32, 0.32].forEach(function (x) {
                part(new THREE.CylinderGeometry(0.155, 0.155, 0.02, 40), well, x, -0.2, top + 0.01, true);
                part(new THREE.CylinderGeometry(0.05, 0.05, 0.08, 20), dark, x, -0.2, top + 0.05, true);
                part(new THREE.CylinderGeometry(0.125, 0.115, 0.05, 40), dark, x, -0.2, top + 0.11, true);
                part(new THREE.TorusGeometry(0.1, 0.018, 10, 40), dark, x, -0.2, top + 0.135, false);
            });

            // Bouton central, petits boutons et barre lumineuse
            part(new THREE.CylinderGeometry(0.07, 0.07, 0.03, 32), glow, 0, 0.12, top + 0.015, true);
            [-0.2, 0.2].forEach(function (x) {
                part(new THREE.CylinderGeometry(0.035, 0.035, 0.025, 20), dark, x, 0.3, top + 0.0125, true);
            });
            var led = part(new THREE.BoxGeometry(0.34, 0.03, 0.02), glow, 0, 0.36, top + 0.01, false);

            // Gâchettes
            [-1, 1].forEach(function (side) {
                var bumper = part(new THREE.BoxGeometry(0.42, 0.09, 0.2), dark, side * 0.74, 0.53, 0, false);
                bumper.rotation.z = -side * 0.15;
            });

            return {
                root: group,
                radius: 1.3,
                view: 0.75,
                sway: 0.6,
                speed: 0.6,
                update: function (time, delta, stage) {
                    led.material.emissiveIntensity = 0.9 + Math.sin(time * 3) * 0.3 + stage.energy * 0.8;
                    group.rotation.z = Math.sin(time * 9) * 0.035 * stage.energy;
                }
            };
        },

        // Objet par défaut des nouvelles passions : une pièce qui tourne, avec l'emoji
        // choisi dans js/contenu.js (ou l'initiale du nom) gravé sur ses deux faces.
        medaille: function (accent, options) {
            var group = new THREE.Group();
            var symbol = options.emoji || (options.label || '★').trim().charAt(0).toUpperCase();
            var face = new THREE.MeshPhysicalMaterial({ map: badgeTexture(symbol, accent), roughness: 0.35, clearcoat: 1, clearcoatRoughness: 0.12 });
            var metal = new THREE.MeshStandardMaterial({ color: accent, metalness: 0.85, roughness: 0.28 });

            var faceGeometry = new THREE.CircleGeometry(0.96, 96);
            var front = new THREE.Mesh(faceGeometry, face);
            front.position.z = 0.09;
            var back = new THREE.Mesh(faceGeometry, face);
            back.position.z = -0.09;
            back.rotation.y = Math.PI;
            var rim = new THREE.Mesh(new THREE.TorusGeometry(0.98, 0.11, 24, 120), metal);
            var edge = new THREE.Mesh(new THREE.CylinderGeometry(0.97, 0.97, 0.18, 96, 1, true), metal);
            edge.rotation.x = Math.PI / 2;
            group.add(front, back, edge, rim);

            return { root: group, radius: 1.12, view: 0.1, speed: 0.9 };
        }
    };

    /* ---------------------------------------------------------
       Scènes
       --------------------------------------------------------- */

    function createStage(canvas) {
        // Un nom d'objet inconnu (nouvelle passion) donne la médaille avec emoji
        var factory = MODELS[canvas.getAttribute('data-model')] || MODELS.medaille;

        var accentValue = getComputedStyle(canvas).getPropertyValue('--accent').trim() || '#8f83ff';
        var accent = new THREE.Color(accentValue);
        var model = factory(accent, canvas.dataset);

        var scene = new THREE.Scene();
        scene.environment = environment;

        var camera = new THREE.PerspectiveCamera(28, 1, 0.1, 60);

        scene.add(new THREE.HemisphereLight(0xffffff, 0x20202c, 0.55));
        var key = new THREE.DirectionalLight(0xffffff, 1.35);
        key.position.set(3, 5, 4);
        var rim = new THREE.DirectionalLight(accent, 2.4);
        rim.position.set(-4, 2.5, -4);
        var fill = new THREE.DirectionalLight(accent, 0.5);
        fill.position.set(-3, -1.5, 3);
        scene.add(key, rim, fill);

        // pivot : flottement, inclinaison vers la souris, zoom au survol
        // tilt  : angle de présentation propre à l'objet
        // spin  : rotation continue ou balancement
        var pivot = new THREE.Group();
        var tilt = new THREE.Group();
        var spin = new THREE.Group();
        tilt.rotation.x = model.view || 0;
        tilt.rotation.z = model.roll || 0;
        spin.add(model.root);
        tilt.add(spin);
        pivot.add(tilt);
        if (model.extras) pivot.add(model.extras);
        scene.add(pivot);

        var shadow = new THREE.Mesh(
            new THREE.PlaneGeometry(1, 1),
            new THREE.MeshBasicMaterial({ map: textures.shadow, transparent: true, depthWrite: false, toneMapped: false })
        );
        shadow.rotation.x = -Math.PI / 2;
        shadow.position.y = -model.radius * 1.08;
        scene.add(shadow);

        var stage = {
            canvas: canvas,
            context: canvas.getContext('2d'),
            scene: scene,
            camera: camera,
            model: model,
            pivot: pivot,
            spin: spin,
            shadow: shadow,
            rim: rim,
            rimBase: rim.intensity,
            width: 0,
            height: 0,
            visible: false,
            dirty: true,
            hover: false,
            energy: 0,
            pointerX: 0,
            pointerY: 0,
            tiltX: 0,
            tiltY: 0,
            angle: 0,
            appear: 0,
            drag: { active: false, x: 0, time: 0, velocity: 0, offset: 0 }
        };

        bindPointer(stage);
        return stage;
    }

    function bindPointer(stage) {
        var canvas = stage.canvas;
        var host = canvas.closest('[data-stage-host], [data-tilt]') || canvas.parentElement;

        host.addEventListener('pointerenter', function () { stage.hover = true; });
        host.addEventListener('pointerleave', function () {
            stage.hover = false;
            stage.pointerX = 0;
            stage.pointerY = 0;
        });
        host.addEventListener('pointermove', function (event) {
            if (event.pointerType !== 'mouse') return;
            var box = host.getBoundingClientRect();
            stage.pointerX = ((event.clientX - box.left) / box.width) * 2 - 1;
            stage.pointerY = ((event.clientY - box.top) / box.height) * 2 - 1;
        });
        host.addEventListener('focusin', function () { stage.hover = true; });
        host.addEventListener('focusout', function () { stage.hover = false; });

        if (!canvas.hasAttribute('data-interactive')) return;

        // Faire tourner l'objet à la souris ou au doigt (avec un peu d'inertie)
        var drag = stage.drag;
        canvas.addEventListener('pointerdown', function (event) {
            drag.active = true;
            drag.x = event.clientX;
            drag.time = performance.now();
            drag.velocity = 0;
            canvas.setPointerCapture(event.pointerId);
            canvas.classList.add('is-dragging');
        });
        canvas.addEventListener('pointermove', function (event) {
            if (!drag.active) return;
            var step = (event.clientX - drag.x) * 0.011;
            drag.x = event.clientX;
            drag.time = performance.now();
            drag.offset += step;
            drag.velocity = step;
            stage.dirty = true;
        });
        function release() {
            if (!drag.active) return;
            drag.active = false;
            if (performance.now() - drag.time > 90) drag.velocity = 0;
            canvas.classList.remove('is-dragging');
        }
        canvas.addEventListener('pointerup', release);
        canvas.addEventListener('pointercancel', release);
    }

    function frameCamera(stage) {
        var camera = stage.camera;
        var aspect = stage.width / stage.height;
        var verticalFov = THREE.MathUtils.degToRad(camera.fov);
        var horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * aspect);
        var fit = Math.min(verticalFov, horizontalFov);
        var margin = parseFloat(stage.canvas.getAttribute('data-margin')) || 1.3;
        var distance = (stage.model.radius * margin) / Math.sin(fit / 2);
        var elevation = THREE.MathUtils.degToRad(10);

        camera.aspect = aspect;
        camera.position.set(0, Math.sin(elevation) * distance, Math.cos(elevation) * distance);
        camera.lookAt(0, 0, 0);
        camera.near = distance / 20;
        camera.far = distance * 4;
        camera.updateProjectionMatrix();
    }

    function measure(stage) {
        var ratio = Math.min(window.devicePixelRatio || 1, 2);
        var width = Math.round(stage.canvas.clientWidth * ratio);
        var height = Math.round(stage.canvas.clientHeight * ratio);
        if (!width || !height || (width === stage.width && height === stage.height)) return;
        stage.width = stage.canvas.width = width;
        stage.height = stage.canvas.height = height;
        frameCamera(stage);
        stage.dirty = true;
    }

    function update(stage, time, delta, still, now) {
        var model = stage.model;
        var ease = 1 - Math.exp(-delta * 6);
        var hover = still ? 0 : (stage.hover ? 1 : 0);

        stage.energy += (hover - stage.energy) * ease;
        stage.tiltX += ((still ? 0 : stage.pointerY * 0.22) - stage.tiltX) * ease;
        stage.tiltY += ((still ? 0 : stage.pointerX * 0.4) - stage.tiltY) * ease;

        var drag = stage.drag;
        if (!drag.active) {
            drag.offset += drag.velocity;
            drag.velocity *= Math.pow(0.05, delta);
            if (Math.abs(drag.velocity) < 0.0001) drag.velocity = 0;
        }

        // Entrée en scène : l'objet arrive en tournant et en grossissant la première fois qu'il est visible
        // (calée sur l'horloge réelle : même un appareil lent affiche l'objet en entier après 1,1 s)
        if (!stage.appearStart) stage.appearStart = now;
        stage.appear = still ? 1 : Math.min(1, (now - stage.appearStart) / 1100);
        var t = stage.appear - 1;
        var pop = 1 + 2.70158 * t * t * t + 1.70158 * t * t;
        var swirl = -1.8 * Math.pow(1 - stage.appear, 3);

        if (!still) stage.angle += delta * (model.speed || 0.5) * (1 + stage.energy * (model.boost || 2.2));
        var turn = model.sway ? Math.sin(stage.angle) * model.sway : stage.angle;
        stage.spin.rotation.y = turn + drag.offset + swirl;

        var lift = (still ? 0 : Math.sin(time * 1.3) * 0.05) + stage.energy * 0.06;
        stage.pivot.position.y = lift * model.radius;
        stage.pivot.rotation.x = stage.tiltX;
        stage.pivot.rotation.y = stage.tiltY;
        stage.pivot.scale.setScalar((1 + stage.energy * 0.06) * (0.3 + 0.7 * pop));

        var shadowSize = model.radius * 2.1 * (1 - lift * 0.6) * (0.3 + 0.7 * pop);
        stage.shadow.scale.set(shadowSize, shadowSize, 1);
        stage.shadow.material.opacity = (0.85 - lift * 1.6) * stage.appear;
        stage.rim.intensity = stage.rimBase * (1 + stage.energy * 0.6);

        if (model.update) model.update(time, still ? 0 : delta, stage);
    }

    var buffer = { width: 0, height: 0 };

    function draw(stage) {
        if (stage.width > buffer.width || stage.height > buffer.height) {
            buffer.width = Math.max(buffer.width, stage.width);
            buffer.height = Math.max(buffer.height, stage.height);
            renderer.setSize(buffer.width, buffer.height, false);
        }
        renderer.setViewport(0, 0, stage.width, stage.height);
        renderer.setScissor(0, 0, stage.width, stage.height);
        renderer.setScissorTest(true);
        renderer.render(stage.scene, stage.camera);

        // L'image WebGL est en bas à gauche du tampon (origine OpenGL) : on recopie cette zone.
        stage.context.clearRect(0, 0, stage.width, stage.height);
        stage.context.drawImage(renderer.domElement, 0, buffer.height - stage.height, stage.width, stage.height, 0, 0, stage.width, stage.height);
    }

    /* ---------------------------------------------------------
       Démarrage
       --------------------------------------------------------- */

    var stages = canvases.map(createStage).filter(Boolean);
    if (!stages.length) return;

    stages.forEach(function (stage) {
        stage.canvas.__stage = stage;
        measure(stage);
    });

    if ('IntersectionObserver' in window) {
        var visibility = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                var stage = entry.target.__stage;
                stage.visible = entry.isIntersecting;
                if (stage.visible) stage.dirty = true;
            });
        }, { rootMargin: '150px 0px' });
        stages.forEach(function (stage) { visibility.observe(stage.canvas); });
    } else {
        stages.forEach(function (stage) { stage.visible = true; });
    }

    if ('ResizeObserver' in window) {
        var sizes = new ResizeObserver(function (entries) {
            entries.forEach(function (entry) { measure(entry.target.__stage); });
        });
        stages.forEach(function (stage) { sizes.observe(stage.canvas); });
    } else {
        window.addEventListener('resize', function () { stages.forEach(measure); });
    }

    var time = 0;
    var last = performance.now();

    function tick(now) {
        requestAnimationFrame(tick);
        var delta = Math.min(0.05, Math.max(0, (now - last) / 1000));
        last = now;
        var still = stillQuery.matches;
        if (!still) time += delta;

        stages.forEach(function (stage) {
            if (!stage.visible || !stage.width) return;
            var moving = stage.drag.active || stage.drag.velocity !== 0;
            if (still && !stage.dirty && !moving) return;
            update(stage, time, delta, still, now);
            draw(stage);
            stage.dirty = false;
        });
    }

    requestAnimationFrame(tick);
})();
