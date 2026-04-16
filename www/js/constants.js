// ─── GAME CONSTANTS ───────────────────────────────────────────────────────────

export const GAME_VERSION = '0.3.0';

// Canvas base resolution (scaled up by Phaser)
export const WIDTH  = 480;
export const HEIGHT = 270;

// ─── CHARACTERS ───────────────────────────────────────────────────────────────

export const CHARACTERS = {
  sophia: {
    name: 'Sophia',
    tagline: 'Light-Maiden — Angel of Wisdom',
    loreLine: 'Divine Aeon crowned in gold. Her light splits chaos, her wings part veils.',
    texture: 'sophia',
    speed: 150,
    jumpForce: -340,
    bodySize: [14, 34],
    bodyOffset: [11, 8],
    attack: 'melee',
    attackRange: 36,
    attackDamage: 1,
    color: '#ffe080',
  },
  jesus: {
    name: 'Jesus',
    tagline: 'The Light — First Mystery',
    loreLine: 'Hears her cries from Chaos. Bears the Seals of the 13 Aeons.',
    texture: 'jesus',
    speed: 120,
    jumpForce: -300,
    bodySize: [14, 34],
    bodyOffset: [7, 8],
    attack: 'ranged',
    attackRange: 0,
    attackDamage: 1,
    color: '#ffe080',
  },
};

// ─── THE 13 ARCHONS ──────────────────────────────────────────────────────────
// (From the Apocryphon of John / Pistis Sophia tradition)
export const ARCHONS = [
  { id: 1,  name: 'Authades',    title: 'The Self-Willed',    element: 'Fire'        },
  { id: 2,  name: 'Paraplex',    title: 'The Confuser',        element: 'Shadow'      },
  { id: 3,  name: 'Hekate',      title: 'The Triple-Faced',    element: 'Illusion'    },
  { id: 4,  name: 'Ariouth',     title: 'The Devourer',        element: 'Earth'       },
  { id: 5,  name: 'Yaldabaoth',  title: 'The Lion-Faced',      element: 'Pride'       },
  { id: 6,  name: 'Sabaoth',     title: 'Lord of Forces',      element: 'Storm'       },
  { id: 7,  name: 'Adonaios',    title: 'The Hidden Lord',     element: 'Void'        },
  { id: 8,  name: 'Astaphaios',  title: 'The Envier',          element: 'Acid'        },
  { id: 9,  name: 'Ailoaios',    title: 'The Deceiver',        element: 'Mirror'      },
  { id: 10, name: 'Oraios',      title: 'The Blinding',        element: 'Corrupt Light' },
  { id: 11, name: 'Adamas',      title: 'The Unmovable',       element: 'Stone'       },
  { id: 12, name: 'Sabaoth',     title: 'The Repentant',       element: 'Redemption'  },
  { id: 13, name: 'The Veil',    title: 'The Final Boundary',  element: 'Void'        },
];

// ─── LEVELS ───────────────────────────────────────────────────────────────────
// Three Acts: The Fall → The Chaos → The Ascent.
// Each level references a Gnostic stage; bgKey selects background texture.

export const LEVELS = [
  {
    id: 1,
    act: 'Act I — The Fall',
    name: 'Aeon I — Through the Gates of Authades',
    subtitle: 'Dragged from the Pleroma by the Archons.',
    lore: '"The Archons of the 13 Aeons dragged me into their darkness.\n My consort was not with me. The Light grew dim."',
    worldWidth: 1600,
    bgKey: 'bg_stars',
    bgTint: 0x08001a,
    decor: 'gates',
    worldTint: 0xffffff,
    worldAlpha: 1,
    worldColor: '#c8a0ff',
    worldColorHex: 0xc8a0ff,
    platforms: [
      [0,    254, 260],
      [340,  254, 180],
      [620,  254, 160],
      [900,  254, 260],
      [1240, 254, 360],
      [300,  200, 80],
      [520,  160, 80],
      [720,  190, 80],
      [980,  150, 80],
      [1140, 110, 80],
    ],
    enemies: [
      [420, 220, 'patrol'],
      [760, 220, 'patrol'],
      [1080, 220, 'patrol'],
    ],
    sparks: [
      [180, 220], [360, 180], [540, 140], [740, 170],
      [1000, 130], [1160, 90], [1340, 220],
    ],
    exit: [1520, 222],
  },
  {
    id: 2,
    act: 'Act II — The Chaos',
    name: 'Aeon VI — The Storm of Paraplex',
    subtitle: 'Trapped in the abyss. Hunted by shadow Archons.',
    lore: '"I cried out of the darkness. There was no consort here —\n only Paraplex, and the claws of the Hunt."',
    worldWidth: 2000,
    bgKey: 'bg_chaos',
    bgTint: 0x0a001e,
    decor: 'shadows',
    worldColor: '#ff6080',
    worldColorHex: 0xff6080,
    platforms: [
      [0,    254, 200],
      [260,  254, 140],
      [460,  254, 140],
      [660,  200, 100],
      [820,  160, 100],
      [980,  200, 100],
      [1140, 254, 160],
      [1360, 220, 80],
      [1480, 180, 80],
      [1600, 140, 80],
      [1720, 254, 300],
    ],
    enemies: [
      [320, 220, 'patrol'],
      [520, 220, 'chase'],
      [900, 130, 'patrol'],
      [1180, 220, 'chase'],
      [1780, 220, 'patrol'],
    ],
    sparks: [
      [150, 220], [360, 210], [560, 210], [710, 170],
      [870, 130], [1030, 170], [1220, 220],
      [1400, 190], [1520, 150], [1640, 110], [1880, 220],
    ],
    exit: [1940, 222],
  },
  {
    id: 3,
    act: 'Act III — The Ascent',
    name: 'Aeon XIII — The Veil Parts',
    subtitle: 'Guided by the Light. Rising through the restored gates.',
    lore: '"Jesus said: \'Rejoice. I am the First Mystery,\n I have heard thy prayer, I ascend with thee.\'"',
    worldWidth: 2200,
    bgKey: 'bg_ascent',
    bgTint: 0x200008,
    decor: 'ascending',
    worldColor: '#ffe080',
    worldColorHex: 0xffe080,
    platforms: [
      [0,    254, 220],
      [260,  210, 100],
      [400,  170, 100],
      [540,  130, 100],
      [680,  170, 100],
      [820,  210, 100],
      [960,  254, 140],
      [1140, 210, 100],
      [1280, 170, 100],
      [1420, 130, 100],
      [1560, 90,  100],
      [1700, 130, 100],
      [1840, 170, 100],
      [1980, 254, 220],
    ],
    enemies: [
      [300, 180, 'patrol'],
      [580, 100, 'patrol'],
      [990, 220, 'chase'],
      [1180, 180, 'patrol'],
      [1460, 100, 'patrol'],
      [1720, 100, 'chase'],
      [2020, 220, 'chase'],
    ],
    sparks: [
      [150, 220], [300, 180], [440, 140], [580, 100],
      [720, 140], [860, 180], [1060, 220],
      [1180, 180], [1320, 140], [1460, 100], [1600, 60],
      [1740, 100], [1880, 140], [2100, 220],
    ],
    exit: [2140, 222],
  },
];
