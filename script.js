/* ============================================
   FLORES AMARILLAS – Script Principal
   Experiencia romántica interactiva
   21 de Septiembre – Día de las Flores Amarillas
   ============================================ */

// =========================================================
// 🔧 CONFIGURACIÓN – Modificar estos valores para reutilizar
// =========================================================
const CONFIG = {
    // Textos iniciales
    initialMessage:  'Solo para Darlena, mi morochita hermosa 🌻',
    initialSub:      'Hacé click donde quieras...',

    // Milestone especial (primera vez, en flowerTarget flores)
    flowerTarget:    21,
    finalMessage:    '21 flores para Alis 🌻',
    finalSub:        'Una por cada razón que me quedo sin palabras al verte.',

    // Milestones cada N flores a partir del primero
    milestoneInterval: 100,

    // Música (poner en true y agregar archivo para activar)
    musicEnabled:    false,
    musicFile:       'music.mp3',

    // Apariencia de las flores
    flower: {
        minScale:       0.45,
        maxScale:       1.15,
        minPetals:      8,
        maxPetals:      18,
        stemHeightBase: 80,   // altura base del tallo
        growthDuration: 2800,
    },

    // Partículas ambientales
    particles: {
        enabled:     true,
        maxAmbient:  22,
        bloomBurst:  9,
    },

    // Viento (siempre activo después de la primera milestone)
    wind: {
        strength: 0.03,
        speed1:   0.0008,
        speed2:   0.0005,
    },
};


// =========================================================
// 💬 50 FRASES ROMÁNTICAS para milestones
// =========================================================
const FRASES = [
    'Darlena, cada flor es un pensamiento tuyo que no sé cómo decir en voz alta.',
    'El 21 de septiembre me recuerda que Alis tiene que existir en el mundo.',
    'Si pudiera darte flores todos los días, morochita, lo haría sin dudarlo.',
    'No sé hacer grandes cosas, pero sí pienso en vos, Darlena.',
    'Las flores amarillas son para las personas que uno ama. Y vos sabés que sos una de esas.',
    'Hoy el mundo huele un poco más a morochita hermosa.',
    'Hay días en los que simplemente te extraño sin motivo, Alis.',
    'Si existiera una flor perfecta, te la daría a vos, Darlena.',
    'Gracias por ser parte de algo que no sé definir pero que me alegra mucho.',
    'Siempre que veo algo bonito, pienso que a mi morochita le gustaría.',
    'Ojalá el mundo te trate como vos te merecés, Alis.',
    'Sos de esas personas que hacen que todo valga más, Darlena.',
    'Hoy quise mandarte algo sin palabras, morochita.',
    'No todas las flores nacen en primavera. Algunas nacen cuando pensamos en Darlena.',
    'Quisiera que supieras lo especial que sos, Alis, aunque sea un poco.',
    'Cada vez que veo el sol, algo me hace pensar en mi morochita.',
    'Hay un tipo de cariño que no tiene nombre. Eso es lo que te tengo, Darlena.',
    'Gracias por existir exactamente como sos, Alis.',
    'Sos de las pocas cosas que me alegran sin esfuerzo, morochita.',
    'No sé bien qué decirte, Darlena, pero sé que quería decirte algo.',
    'Que el otoño te encuentre llena de todo lo lindo que te merecés, Alis.',
    'Me gustás mucho, morochita. Así de simple.',
    'No hace falta que sea el 21 para pensar en vos, Darlena.',
    'Algunas personas cambian el sabor de los días. Alis sí.',
    'Ojalá sepas cuánto bien me hacés, morochita.',
    'Hay pocos instantes perfectos. Este puede ser uno, Darlena.',
    'Querías flores. Acá están, hechas solo para vos, Alis.',
    'No tengo forma de medirlo, pero te quiero mucho, morochita.',
    'Cada click fue un pensamiento. Y todos eran de Darlena.',
    'Si el amor fuera una flor, sería amarilla. Como el sol. Como Alis.',
    'Hoy el 21 de septiembre me parece la fecha más bonita del año, morochita.',
    'Ojalá algún día pueda decirte en persona todo esto, Darlena.',
    'Tengo un montón de cosas para decirte, Alis, y no sé por dónde empezar.',
    'Sos la persona con la que quiero compartir los momentos lindos, morochita.',
    'No necesito una razón para quererte, Darlena. Solo necesito que existas.',
    'Gracias por ser exactamente vos, Alis, sin más ni menos.',
    'Hay personas que uno lleva en el pecho sin darse cuenta. Darlena es una de esas.',
    'Me alegra que el universo haya conspirado para que nos cruzáramos, morochita.',
    'Si cada flor fuera una razón para quererte, Alis, el jardín nunca terminaría.',
    'Hoy quise que sintieras que no estás sola, Darlena.',
    'Pensé en mi morochita y decidí hacer algo con ese pensamiento.',
    'Sos de esas personas que no se explican, solo se sienten. Sos Darlena.',
    'Que florezca todo lo lindo que te merecés, Alis.',
    'No existen palabras suficientes, morochita, así que elegí flores.',
    'El 21 de septiembre es de Darlena, aunque no lo hayamos elegido.',
    'Ojalá cada día tengas algo que te haga sonreír así, morochita.',
    'Sos especial de un modo que cuesta mucho describir, Alis.',
    'Gracias por dejarme darte estas flores, Darlena, aunque sean digitales.',
    'Nada de lo que haga va a alcanzar para decirte todo lo que siento, morochita.',
    'Y sin embargo, acá estoy, intentándolo con flores amarillas para Alis.',
];

// Índices usados (para no repetir hasta agotar la lista)
let frasePool = [];
function getRandomFrase() {
    if (frasePool.length === 0) {
        frasePool = [...Array(FRASES.length).keys()];
        // Fisher-Yates shuffle
        for (let i = frasePool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [frasePool[i], frasePool[j]] = [frasePool[j], frasePool[i]];
        }
    }
    return FRASES[frasePool.pop()];
}


// =========================================================
// Estado interno
// =========================================================
const state = {
    flowers:         [],
    particles:       [],
    flowerCount:     0,
    windActive:      false,   // el viento se activa tras la primera milestone
    animating:       false,
    initialFaded:    false,
    canPlant:        true,
    milestoneShown:  new Set(), // milestones ya mostradas
};


// =========================================================
// DOM
// =========================================================
const canvas            = document.getElementById('flowerCanvas');
const ctx               = canvas.getContext('2d');
const warmGlow          = document.getElementById('warmGlow');
const finalOverlay      = document.getElementById('finalOverlay');
const initialMsgEl      = document.getElementById('initialMessage');
const mainMsgEl         = document.getElementById('mainMessage');
const subMsgEl          = document.getElementById('subMessage');
const finalMsgContainer = document.getElementById('finalMessage');
const finalMainEl       = document.getElementById('finalMainText');
const finalSubEl        = document.getElementById('finalSubText');
const heartEl           = document.getElementById('heart');
const rippleContainer   = document.getElementById('rippleContainer');
const musicPlayer       = document.getElementById('musicPlayer');
const musicToggle       = document.getElementById('musicToggle');
const bgMusic           = document.getElementById('bgMusic');


// =========================================================
// Inicialización de textos
// =========================================================
mainMsgEl.textContent   = CONFIG.initialMessage;
subMsgEl.textContent    = CONFIG.initialSub;
finalMainEl.textContent = CONFIG.finalMessage;
finalSubEl.textContent  = CONFIG.finalSub;


// =========================================================
// Canvas – Setup con DPI
// =========================================================
let dpr = 1;

function resizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width  = window.innerWidth  * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width  = window.innerWidth  + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!state.animating) renderFrame(performance.now());
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();


// =========================================================
// Utilidades
// =========================================================
function clamp(v, min = 0, max = 1) {
    return v < min ? min : v > max ? max : v;
}
function rand(min, max) { return min + Math.random() * (max - min); }
function randInt(min, max) { return Math.floor(rand(min, max + 1)); }

const ease = {
    outQuad:   t => t * (2 - t),
    outCubic:  t => 1 - Math.pow(1 - t, 3),
    outQuart:  t => 1 - Math.pow(1 - t, 4),
    inOutSine: t => -(Math.cos(Math.PI * t) - 1) / 2,
    outBack:   t => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
    outElastic: t => {
        if (t === 0 || t === 1) return t;
        return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI) / 3) + 1;
    },
};


// =========================================================
// 🌻 TIPOS DE FLORES – para mayor variedad
// =========================================================
// Cada flor tendrá un "tipo" que define su forma general
const FLOWER_TYPES = [
    // 0: Girasol clásico – pétalos largos y puntiagudos
    { petalLen: 1.0, petalWidth: 0.85, petalTip: 0.85, centerSize: 1.1, layers: 2, petalHueRange: [40, 52] },
    // 1: Margarita – pétalos angostos y elongados
    { petalLen: 1.35, petalWidth: 0.55, petalTip: 0.92, centerSize: 0.75, layers: 1, petalHueRange: [42, 58] },
    // 2: Rosa amarilla estilizada – pétalos anchos y curvos
    { petalLen: 0.85, petalWidth: 1.2, petalTip: 0.65, centerSize: 0.9, layers: 3, petalHueRange: [38, 50] },
    // 3: Flor silvestre – pétalos irregulares, desordenados
    { petalLen: 1.15, petalWidth: 0.75, petalTip: 0.78, centerSize: 0.85, layers: 2, petalHueRange: [44, 60] },
    // 4: Botón de oro – flor pequeña y compacta, muchos pétalos
    { petalLen: 0.7, petalWidth: 1.1, petalTip: 0.55, centerSize: 1.2, layers: 3, petalHueRange: [46, 56] },
];

// =========================================================
// 🌻 Creación de una flor
// =========================================================
function createFlower(x, y) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const margin = 25;
    x = clamp(x, margin, vw - margin);

    // Escala variable
    let scale = rand(CONFIG.flower.minScale, CONFIG.flower.maxScale);
    const stemH = CONFIG.flower.stemHeightBase * scale * rand(0.8, 1.3);
    if (y + stemH > vh - 8) {
        scale = Math.max(0.32, (vh - y - 8) / CONFIG.flower.stemHeightBase);
    }
    if (y < 50) scale *= clamp(y / 50, 0.45, 1);

    // Tipo de flor
    const type = FLOWER_TYPES[Math.floor(Math.random() * FLOWER_TYPES.length)];
    const petalCount = randInt(CONFIG.flower.minPetals, CONFIG.flower.maxPetals);
    if (type.id === 4) petalCount + randInt(3, 6); // botón de oro: más pétalos

    // Tamaños individuales de pétalos – más rango en silvestre
    const petalSizes = [];
    const sizeRange = type.petalTip > 0.8 ? [0.72, 1.28] : [0.85, 1.15];
    for (let i = 0; i < petalCount; i++) petalSizes.push(rand(...sizeRange));

    // Ángulo de asimetría por pétalo
    const petalAngleJitter = [];
    for (let i = 0; i < petalCount; i++) {
        petalAngleJitter.push(rand(-0.08, 0.08)); // leve irregularidad angular
    }

    // Hojas (1 a 3 hojas, formas distintas)
    const leafCount = randInt(1, 3);
    const leaves = [];
    for (let i = 0; i < leafCount; i++) {
        leaves.push({
            pos:      rand(0.22, 0.78),
            side:     Math.random() > 0.5 ? 1 : -1,
            size:     rand(0.55, 1.35),
            angle:    rand(0.22, 0.62),
            width:    rand(0.28, 0.52),  // relación ancho/largo de la hoja
            drooping: rand(0, 0.3),      // cuánto "cae" la hoja
        });
    }
    leaves.sort((a, b) => a.pos - b.pos);

    // Variación de color
    const [hMin, hMax] = type.petalHueRange;
    const hue = rand(hMin, hMax);

    // Saturación y luminosidad variables
    const sat   = rand(85, 100);
    const lit   = rand(50, 68);
    const lit2  = lit + rand(8, 18);

    // Tallo: distintas curvaturas y grosores
    const stemCurve    = rand(-18, 18);
    const stemThick    = rand(0.85, 1.25);   // modificador del grosor del tallo
    const stemZigzag   = Math.random() > 0.65 ? rand(0.3, 0.8) : 0; // tallos con quiebre leve
    const stemHeight   = CONFIG.flower.stemHeightBase * scale * rand(0.75, 1.3);

    return {
        x, y,
        scale,
        rotation:       rand(-0.18, 0.18),
        type,
        petalCount,
        petalSizes,
        petalAngleJitter,
        petalOffset:    Math.random() * ((Math.PI * 2) / petalCount),
        leaves,
        stemCurve,
        stemThick,
        stemZigzag,
        stemHeight,
        growthStart:    performance.now(),
        growth:         0,
        isGrowing:      true,
        windPhase:      rand(0, Math.PI * 2),
        windFreq:       rand(0.8, 1.3),  // cada flor "respira" diferente
        bloomDone:      false,

        // Color
        petalHue:       hue,
        petalSat:       sat,
        petalLit:       lit,
        petalLit2:      lit2,
        centerDark:     `hsl(${rand(22, 36)}, ${rand(50, 72)}%, ${rand(18, 30)}%)`,
        centerMid:      `hsl(${rand(28, 40)}, ${rand(58, 78)}%, ${rand(30, 40)}%)`,
        centerAccent:   `hsl(${rand(34, 46)}, ${rand(70, 90)}%, ${rand(44, 56)}%)`,
        stemGreen1:     `hsl(${rand(100, 120)}, ${rand(38, 55)}%, ${rand(28, 40)}%)`,
        stemGreen2:     `hsl(${rand(105, 125)}, ${rand(42, 60)}%, ${rand(34, 46)}%)`,
        leafGreen1:     `hsl(${rand(98, 118)}, ${rand(36, 52)}%, ${rand(25, 38)}%)`,
        leafGreen2:     `hsl(${rand(108, 128)}, ${rand(40, 56)}%, ${rand(38, 50)}%)`,
    };
}


// =========================================================
// ✏️ Dibujo – Tallo
// =========================================================
function drawStem(flower, stemProgress) {
    const s  = flower.scale;
    const sh = flower.stemHeight;
    const ch = sh * stemProgress;
    const sc = flower.stemCurve * s;
    const zz = flower.stemZigzag;

    ctx.beginPath();
    ctx.moveTo(0, 0);

    if (zz > 0) {
        // Tallo con ligera doble curvatura
        ctx.bezierCurveTo(
            sc * 0.6,  ch * 0.3,
            -sc * zz,  ch * 0.65,
            sc * 0.25 * stemProgress, ch
        );
    } else {
        ctx.quadraticCurveTo(sc * stemProgress, ch * 0.5, sc * 0.25 * stemProgress, ch);
    }

    const gd = ctx.createLinearGradient(0, 0, sc * 0.15, ch);
    gd.addColorStop(0,   flower.stemGreen2);
    gd.addColorStop(0.5, flower.stemGreen1);
    gd.addColorStop(1,   flower.stemGreen2);
    ctx.strokeStyle = gd;
    ctx.lineWidth   = Math.max(1.4, 2.8 * s * flower.stemThick);
    ctx.lineCap     = 'round';
    ctx.stroke();
}


// =========================================================
// ✏️ Dibujo – Hoja individual
// =========================================================
function drawLeaf(leaf, stemH, progress, scale, stemCurve) {
    const t     = leaf.pos;
    const stemX = stemCurve * scale * 2 * t * (1 - t);
    const stemY = stemH * t;

    ctx.save();
    ctx.translate(stemX, stemY);
    const leanAngle = leaf.side * (leaf.angle + leaf.drooping * progress) * ease.outCubic(progress);
    ctx.rotate(leanAngle);

    const len = 15 * scale * leaf.size * ease.outCubic(progress);
    const w   = len * leaf.width;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(
        w * 0.85, -len * (0.24 + leaf.drooping * 0.15),
        len * 0.72, -w * (0.38 + leaf.drooping * 0.1),
        len, 0
    );
    ctx.bezierCurveTo(
        len * 0.72,  w * (0.38 + leaf.drooping * 0.1),
        w * 0.85,  len * (0.24 + leaf.drooping * 0.15),
        0, 0
    );

    const lg = ctx.createLinearGradient(0, 0, len, 0);
    lg.addColorStop(0,   flower.leafGreen1 || '#5D8A4E');
    lg.addColorStop(0.5, flower.leafGreen2 || '#6D9A56');
    lg.addColorStop(1,   flower.leafGreen1 || '#5D8A4E');
    ctx.fillStyle = lg;
    ctx.fill();

    // Nervadura
    ctx.beginPath();
    ctx.moveTo(1, 0);
    ctx.quadraticCurveTo(len * 0.5, leaf.drooping * w * 0.18, len * 0.85, 0);
    ctx.strokeStyle = 'rgba(30, 65, 20, 0.22)';
    ctx.lineWidth   = 0.5 * scale;
    ctx.lineCap     = 'round';
    ctx.stroke();

    ctx.restore();
}

// Alias para usar flower.leafGreen1/2 dentro de drawLeaf
// (workaround: pasamos la flor directamente)
function drawLeafFull(leaf, stemH, progress, flower) {
    const scale = flower.scale;
    const t     = leaf.pos;
    const stemX = flower.stemCurve * scale * 2 * t * (1 - t);
    const stemY = stemH * t;

    ctx.save();
    ctx.translate(stemX, stemY);
    const leanAngle = leaf.side * (leaf.angle + leaf.drooping * progress) * ease.outCubic(progress);
    ctx.rotate(leanAngle);

    const len = 15 * scale * leaf.size * ease.outCubic(progress);
    const w   = len * leaf.width;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(
        w * 0.85, -len * (0.24 + leaf.drooping * 0.15),
        len * 0.72, -w * (0.38 + leaf.drooping * 0.1),
        len, 0
    );
    ctx.bezierCurveTo(
        len * 0.72,  w * (0.38 + leaf.drooping * 0.1),
        w * 0.85,  len * (0.24 + leaf.drooping * 0.15),
        0, 0
    );

    const lg = ctx.createLinearGradient(0, 0, len, 0);
    lg.addColorStop(0,   flower.leafGreen1);
    lg.addColorStop(0.55, flower.leafGreen2);
    lg.addColorStop(1,   flower.leafGreen1);
    ctx.fillStyle = lg;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(1, 0);
    ctx.quadraticCurveTo(len * 0.5, leaf.drooping * w * 0.18, len * 0.85, 0);
    ctx.strokeStyle = 'rgba(30, 65, 20, 0.22)';
    ctx.lineWidth   = 0.5 * scale;
    ctx.lineCap     = 'round';
    ctx.stroke();

    ctx.restore();
}


// =========================================================
// ✏️ Dibujo – Pétalo (forma configurable por tipo)
// =========================================================
function drawPetal(angle, angleJitter, progress, sizeM, scale, flower, centerR, alpha, layer) {
    if (progress <= 0) return;
    const type = flower.type;

    ctx.save();
    ctx.rotate(angle + angleJitter);

    const p  = ease.outCubic(progress);
    const pl = type.petalLen;
    const pw = type.petalWidth;

    const len = 21 * sizeM * scale * pl * p;
    const w   = 6.5 * sizeM * scale * pw * p;

    // Forma diferente según capa: exterior más abierta, interior más cerrada
    const openness  = layer === 0 ? 1.0 : 0.82;
    const curve1    = type.petalTip;

    const cr = centerR * ease.outQuad(clamp(progress * 1.4));

    // Control points variados por tipo
    ctx.beginPath();
    ctx.moveTo(cr, 0);
    ctx.bezierCurveTo(
        cr + len * 0.26,           -w * openness,
        cr + len * (0.62 + curve1 * 0.12), -w * 0.5 * openness,
        cr + len,                   -w * 0.04
    );
    ctx.bezierCurveTo(
        cr + len * (0.62 + curve1 * 0.12),  w * 0.5 * openness,
        cr + len * 0.26,            w * openness,
        cr, 0
    );

    // Gradiente del pétalo
    const h  = flower.petalHue;
    const s  = flower.petalSat;
    const l1 = flower.petalLit  - (layer === 0 ? 4 : 0);
    const l2 = flower.petalLit2 + (layer === 2 ? 6 : 0);
    const a  = layer === 0 ? alpha * 0.58 : alpha * 0.92;

    const pg = ctx.createLinearGradient(cr, 0, cr + len, 0);
    pg.addColorStop(0,    `hsla(${h - 10}, ${s - 10}%, ${l1 - 6}%, ${a})`);
    pg.addColorStop(0.3,  `hsla(${h - 2},  ${s}%, ${l1}%, ${a})`);
    pg.addColorStop(0.65, `hsla(${h + 3},  ${s}%, ${l2}%, ${a})`);
    pg.addColorStop(1,    `hsla(${h + 10}, ${s - 5}%, ${l2 + 8}%, ${a * 0.78})`);
    ctx.fillStyle = pg;
    ctx.fill();

    // Nervadura sutil
    ctx.beginPath();
    ctx.moveTo(cr + 1, 0);
    ctx.lineTo(cr + len * 0.78, 0);
    ctx.strokeStyle = `hsla(${h - 6}, ${s - 20}%, ${l1 - 10}%, ${a * 0.12})`;
    ctx.lineWidth   = 0.42 * scale;
    ctx.stroke();

    ctx.restore();
}


// =========================================================
// ✏️ Dibujo – Todos los pétalos (capas según tipo)
// =========================================================
function drawPetals(flower, progress, scale) {
    const count    = flower.petalCount;
    const type     = flower.type;
    const centerR  = 9 * scale * type.centerSize;
    const numLayers = type.layers;

    const petalDur = 0.36;
    const petalDel = count > 1 ? (1 - petalDur) / (count - 1) : 0;

    for (let layer = numLayers - 1; layer >= 0; layer--) {
        const layerScale  = 1 - layer * 0.15;
        const layerOffset = (layer / numLayers) * (Math.PI / count);
        const layerDelay  = layer * 0.04;

        for (let i = 0; i < count; i++) {
            const angle  = (i / count) * Math.PI * 2 + flower.petalOffset + layerOffset;
            const start  = i * petalDel + layerDelay;
            const pP     = clamp((progress - start) / petalDur);
            drawPetal(
                angle,
                flower.petalAngleJitter[i],
                pP,
                flower.petalSizes[i] * layerScale,
                scale,
                flower,
                centerR,
                1,
                layer
            );
        }
    }
}


// =========================================================
// ✏️ Dibujo – Centro
// =========================================================
function drawCenter(flower, progress, scale) {
    const r = 9 * scale * flower.type.centerSize * ease.outBack(clamp(progress * 1.1));
    if (r <= 0) return;

    // Anillo exterior oscuro
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fillStyle = flower.centerDark;
    ctx.fill();

    if (progress > 0.2) {
        // Anillo medio
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.75, 0, Math.PI * 2);
        ctx.fillStyle = flower.centerMid;
        ctx.fill();
    }

    if (progress > 0.35) {
        // Punto central brillante
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.38, 0, Math.PI * 2);
        ctx.fillStyle = flower.centerAccent;
        ctx.fill();
    }

    // Patrón de semillas (espiral de Fibonacci aproximada)
    if (progress > 0.45) {
        const seedAlpha = clamp((progress - 0.45) / 0.55);
        const goldenAngle = Math.PI * (3 - Math.sqrt(5));
        const seedCount   = Math.floor(r * r * 0.55);
        const maxR        = r * 0.92;

        for (let i = 0; i < seedCount; i++) {
            const sr    = Math.sqrt(i / seedCount) * maxR;
            const sa    = i * goldenAngle;
            const sx    = Math.cos(sa) * sr;
            const sy    = Math.sin(sa) * sr;
            const sSize = clamp(0.9 * scale * (1 - sr / (maxR * 1.2)), 0.3, 1.6);
            ctx.beginPath();
            ctx.arc(sx, sy, sSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(20, 12, 4, ${0.28 * seedAlpha})`;
            ctx.fill();
        }
    }
}


// =========================================================
// ✏️ Dibujo – Flor completa
// =========================================================
function drawFlower(flower, time) {
    const g  = flower.growth;
    if (g <= 0) return;

    const s  = flower.scale;
    const sh = flower.stemHeight;

    ctx.save();

    // Movimiento de viento (siempre que windActive, no solo al completar)
    if (state.windActive) {
        const w1 = Math.sin(time * CONFIG.wind.speed1 * flower.windFreq + flower.windPhase) * CONFIG.wind.strength;
        const w2 = Math.sin(time * CONFIG.wind.speed2 * flower.windFreq + flower.windPhase * 1.6) * CONFIG.wind.strength * 0.4;
        // El movimiento es mayor en el top, 0 en la base
        const windAngle = (w1 + w2) * clamp(g); // más fuerte cuando más crecida
        ctx.translate(flower.x, flower.y + sh);
        ctx.rotate(windAngle);
        ctx.translate(0, -sh);
    } else {
        ctx.translate(flower.x, flower.y);
    }

    ctx.rotate(flower.rotation);

    // Sombra en el suelo
    if (g > 0.1) {
        const sa = clamp(g) * 0.05;
        ctx.save();
        ctx.translate(flower.stemCurve * s * 0.18, sh + 2);
        ctx.scale(1.2, 0.22);
        ctx.beginPath();
        ctx.arc(0, 0, 16 * s, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(50, 30, 10, ${sa})`;
        ctx.fill();
        ctx.restore();
    }

    // Tallo (0%–28%)
    const stemP = ease.outQuad(clamp(g / 0.28));
    if (stemP > 0) drawStem(flower, stemP);

    // Hojas (12%–48%)
    const leafP = clamp((g - 0.12) / 0.36);
    if (leafP > 0) {
        for (const leaf of flower.leaves) {
            const lp = ease.outCubic(clamp(leafP * 1.35));
            drawLeafFull(leaf, sh, lp, flower);
        }
    }

    // Centro (33%–58%)
    const centerP = clamp((g - 0.33) / 0.25);
    if (centerP > 0) drawCenter(flower, centerP, s);

    // Pétalos (44%–100%)
    const petalP = clamp((g - 0.44) / 0.52);
    if (petalP > 0) drawPetals(flower, petalP, s);

    // Destello final de bloom
    if (g >= 0.90 && g < 1) {
        const glowP = clamp((g - 0.90) / 0.1);
        const glowR = 32 * s * glowP;
        const ga    = (1 - glowP) * 0.20;
        const grd   = ctx.createRadialGradient(0, 0, 0, 0, 0, glowR);
        grd.addColorStop(0, `rgba(255, 230, 80, ${ga})`);
        grd.addColorStop(1, 'rgba(255, 230, 80, 0)');
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(0, 0, glowR, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
}


// =========================================================
// ✨ Partículas
// =========================================================
function createBloomParticles(x, y) {
    if (!CONFIG.particles.enabled) return;
    for (let i = 0; i < CONFIG.particles.bloomBurst; i++) {
        const angle = rand(0, Math.PI * 2);
        const speed = rand(0.3, 2.2);
        state.particles.push({
            x, y,
            vx:    Math.cos(angle) * speed,
            vy:    Math.sin(angle) * speed - rand(0.2, 1.0),
            life:  1,
            decay: rand(0.010, 0.022),
            size:  rand(1.2, 3.2),
            hue:   rand(38, 58),
        });
    }
}

function spawnAmbientParticle() {
    if (!CONFIG.particles.enabled) return;
    if (state.flowers.length === 0) return;
    if (state.particles.length >= CONFIG.particles.maxAmbient + 12) return;
    const f = state.flowers[Math.floor(Math.random() * state.flowers.length)];
    state.particles.push({
        x: f.x + rand(-30, 30),
        y: f.y + rand(-10, 20),
        vx: rand(-0.25, 0.25),
        vy: rand(-0.15, -0.55),
        life:  1,
        decay: rand(0.003, 0.007),
        size:  rand(0.8, 2.0),
        hue:   rand(36, 56),
    });
}

function updateParticles() {
    for (let i = state.particles.length - 1; i >= 0; i--) {
        const p = state.particles[i];
        p.x   += p.vx;
        p.y   += p.vy;
        p.vx  += rand(-0.012, 0.012);
        p.life -= p.decay;
        if (p.life <= 0) state.particles.splice(i, 1);
    }
}

function drawParticles() {
    for (const p of state.particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 66%, ${p.life * 0.42})`;
        ctx.fill();
    }
}


// =========================================================
// 🔄 Bucle de animación
// =========================================================
let ambientTimer = 0;

function updateFlowers(time) {
    for (const f of state.flowers) {
        if (!f.isGrowing) continue;
        f.growth = clamp((time - f.growthStart) / CONFIG.flower.growthDuration);
        if (f.growth >= 1) {
            f.growth = 1;
            f.isGrowing = false;
            if (!f.bloomDone) {
                f.bloomDone = true;
                createBloomParticles(f.x, f.y);
            }
        }
    }
}

function renderFrame(time) {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // Ordenar por Y para efecto de profundidad
    const sorted = [...state.flowers].sort((a, b) => {
        if (!a.isGrowing && b.isGrowing) return -1;
        if (a.isGrowing && !b.isGrowing) return 1;
        return (a.y + a.stemHeight) - (b.y + b.stemHeight);
    });

    for (const f of sorted) drawFlower(f, time);
    drawParticles();
}

function animate(time) {
    if (!state.animating) return;

    updateFlowers(time);
    updateParticles();

    ambientTimer++;
    if (ambientTimer % 42 === 0 && state.flowers.length > 2) spawnAmbientParticle();

    renderFrame(time);

    const hasGrowing   = state.flowers.some(f => f.isGrowing);
    const hasParticles = state.particles.length > 0;
    const needsWind    = state.windActive;

    if (hasGrowing || hasParticles || needsWind) {
        requestAnimationFrame(animate);
    } else {
        state.animating = false;
    }
}

function startAnimating() {
    if (!state.animating) {
        state.animating = true;
        requestAnimationFrame(animate);
    }
}


// =========================================================
// 🌱 Plantar una flor
// =========================================================
function plantFlower(x, y) {
    if (!state.canPlant) return;

    const flower = createFlower(x, y);
    state.flowers.push(flower);
    state.flowerCount++;

    createRipple(x, y);
    updateBackground();

    // Fade del mensaje inicial tras 2 flores
    if (state.flowerCount >= 2 && !state.initialFaded) {
        state.initialFaded = true;
        initialMsgEl.classList.add('fading');
    }

    // Chequear milestones
    checkMilestones(state.flowerCount);

    startAnimating();
}


// =========================================================
// 🎯 Sistema de milestones
// =========================================================
function checkMilestones(count) {
    // Milestone especial: flowerTarget (21)
    if (count === CONFIG.flowerTarget && !state.milestoneShown.has('special')) {
        state.milestoneShown.add('special');
        triggerSpecialMilestone();
        return;
    }

    // Milestones cada milestoneInterval (100, 200, 300...)
    if (count > CONFIG.flowerTarget && count % CONFIG.milestoneInterval === 0) {
        const key = `m${count}`;
        if (!state.milestoneShown.has(key)) {
            state.milestoneShown.add(key);
            triggerFlashMilestone(count, getRandomFrase());
        }
    }
}


// =========================================================
// 🎬 Milestone especial (21 flores) – NO bloquea clicks
// =========================================================
function triggerSpecialMilestone() {
    // Activar viento
    state.windActive = true;
    startAnimating();

    // Overlay cálido sutil
    setTimeout(() => { finalOverlay.style.opacity = '0.7'; }, 800);

    // Mostrar mensaje
    setTimeout(() => {
        finalMsgContainer.classList.remove('hidden');
        setTimeout(() => finalMainEl.classList.add('visible'), 100);
    }, 1800);

    setTimeout(() => { finalSubEl.classList.add('visible'); }, 3600);

    setTimeout(() => {
        heartEl.classList.remove('hidden');
        heartEl.classList.add('visible');
    }, 5400);

    setTimeout(() => { heartEl.classList.add('beating'); }, 7000);

    // Después de 10 segundos, fade del overlay para que sigan clickeando
    setTimeout(() => {
        finalOverlay.style.opacity   = '0';
        finalOverlay.style.transition = 'opacity 3s ease';
        setTimeout(() => {
            // Fade muy suave del mensaje central para que no bloquee
            finalMsgContainer.style.transition = 'opacity 4s ease';
            finalMsgContainer.style.opacity    = '0';
            setTimeout(() => {
                finalMsgContainer.classList.add('hidden');
                finalMsgContainer.style.opacity = '';
                finalMsgContainer.style.transition = '';
            }, 4100);
        }, 800);
    }, 10500);
}


// =========================================================
// 💬 Toast de milestone (cada 100 flores)
// =========================================================
function triggerFlashMilestone(count, phrase) {
    const toast = document.createElement('div');
    toast.className = 'milestone-toast';

    toast.innerHTML = `
        <span class="toast-count">${count} flores 🌻</span>
        <span class="toast-phrase">${phrase}</span>
    `;

    document.body.appendChild(toast);

    // Forzar reflow
    toast.getBoundingClientRect();
    toast.classList.add('toast-visible');

    // Remover después de 6s
    setTimeout(() => {
        toast.classList.remove('toast-visible');
        toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    }, 6000);
}


// =========================================================
// 💫 Ripple
// =========================================================
function createRipple(x, y) {
    const el = document.createElement('div');
    el.className  = 'click-ripple';
    el.style.left = x + 'px';
    el.style.top  = y + 'px';
    rippleContainer.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
}


// =========================================================
// 🌅 Progresión de fondo
// =========================================================
function updateBackground() {
    const progress = Math.min(state.flowerCount / CONFIG.flowerTarget, 1);
    warmGlow.style.opacity = clamp(progress * 1.2, 0, 1).toString();
}


// =========================================================
// 🎯 Eventos
// =========================================================
canvas.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    plantFlower(e.clientX, e.clientY);
});

canvas.addEventListener('contextmenu', (e) => e.preventDefault());

let lastTap = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTap < 300) e.preventDefault();
    lastTap = now;
}, { passive: false });


// =========================================================
// 🎵 Música
// =========================================================
function initMusic() {
    if (!CONFIG.musicEnabled) return;
    const source = document.createElement('source');
    source.src  = CONFIG.musicFile;
    source.type = 'audio/mpeg';
    bgMusic.appendChild(source);
    bgMusic.load();
    musicPlayer.classList.remove('hidden');

    let playing = false;
    musicToggle.addEventListener('click', () => {
        if (playing) {
            bgMusic.pause();
            musicToggle.querySelector('.music-icon').textContent = '♪';
            musicToggle.style.opacity = '0.6';
        } else {
            bgMusic.play().catch(() => {});
            musicToggle.querySelector('.music-icon').textContent = '♫';
            musicToggle.style.opacity = '1';
        }
        playing = !playing;
    });
}


// =========================================================
// 🚀 Inicio
// =========================================================
function init() {
    initMusic();
    renderFrame(performance.now());
}

if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(init);
} else {
    window.addEventListener('load', init);
}
