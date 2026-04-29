// ─── GAME CONSTANTS ───────────────────────────────────────────────────────────

export const GAME_VERSION = '0.6.0';

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
    color: '#f0e8ff',
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
    color: '#ffcc80',
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

// ─── BOSSES ───────────────────────────────────────────────────────────────────
// Reusable boss configs consumed by ArchonBoss subclasses (Authades, etc).
// `arenaX`/`arenaWidth` define an invisible-walled fight zone inside the level.
// `triggerX` is where the player must cross to spawn the encounter.

export const BOSSES = {
  authades: {
    archonId: 1,
    name: 'Authades',
    title: 'The Self-Willed',
    element: 'Fire',
    texture: 'authades',
    hp: 12,
    phaseCount: 3,
    bodyW: 32, bodyH: 36,
    bodyOX: 12, bodyOY: 14,
    deathTints: [0xffffff, 0xffe060, 0xff8020, 0xff3010],
    barColor: 0xff5020,
    lore:
      '"Authades, Self-Willed, knew no master.\n' +
      'His fire blazed in pride — but Sophia\'s\n' +
      'swift feet outpaced even his fury."',
  },
  paraplex: {
    archonId: 2,
    name: 'Paraplex',
    title: 'The Confuser',
    element: 'Shadow',
    texture: 'paraplex',
    hp: 14,
    phaseCount: 3,
    bodyW: 30, bodyH: 38,
    bodyOX: 13, bodyOY: 13,
    deathTints: [0xffffff, 0x8060ff, 0x4020a0, 0x100040],
    barColor: 0x6040c0,
    lore:
      '"Paraplex stirred the shadows, scattering thought.\n' +
      'Yet through prayer the veil thinned — and his\n' +
      'confusion broke against the Light."',
  },
  hekate: {
    archonId: 3,
    name: 'Hekate',
    title: 'The Triple-Faced',
    element: 'Illusion',
    texture: 'hekate',
    hp: 16,
    phaseCount: 3,
    bodyW: 30, bodyH: 40,
    bodyOX: 13, bodyOY: 12,
    deathTints: [0xffffff, 0x80ffff, 0x40a0c0, 0x103060],
    barColor: 0x40c0e0,
    lore:
      '"Three faces had Hekate, three lies in one mouth.\n' +
      'I knew her by the truth she could not bear:\n' +
      'her own reflection, shattered by Wisdom."',
  },
  ariouth: {
    archonId: 4,
    name: 'Ariouth',
    title: 'The Devourer',
    element: 'Earth',
    texture: 'ariouth',
    hp: 18,
    phaseCount: 3,
    bodyW: 44, bodyH: 38,
    bodyOX: 10, bodyOY: 18,
    deathTints: [0xffffff, 0xa08040, 0x604020, 0x201808],
    barColor: 0x806030,
    lore:
      '"Ariouth opened his maw — vast as the Below.\n' +
      'But what he swallowed was only stone and dust.\n' +
      'My light he could not chew, and so he fell."',
  },
};

// ─── LEVELS ───────────────────────────────────────────────────────────────────
// Three Acts: The Fall → The Chaos → The Ascent.
// Each level references a Gnostic stage; bgKey selects background texture.
// `boss` (optional): { id, x, y, triggerX, arenaX, arenaWidth }

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
    boss: {
      id: 'authades',
      spawnX: 1500, spawnY: 210,
      triggerX: 1280,
      arenaX: 1260, arenaWidth: 320,
    },
    exit: [1560, 222],
  },
  {
    id: 2,
    act: 'Act I — The Fall',
    name: 'Aeon II — Through the Veil of Paraplex',
    subtitle: 'The Confuser stirs the dark between gates.',
    lore: '"Paraplex unstrung my thought —\n what was Sophia, what was shadow, became one."',
    worldWidth: 1700,
    bgKey: 'bg_stars',
    bgTint: 0x05001a,
    decor: 'gates',
    worldTint: 0xffffff,
    worldAlpha: 1,
    worldColor: '#9070ff',
    worldColorHex: 0x9070ff,
    platforms: [
      [0,    254, 240],
      [320,  254, 160],
      [560,  220, 100],
      [720,  180, 100],
      [880,  220, 100],
      [1040, 254, 200],
      [1300, 254, 400],
    ],
    enemies: [
      [380, 220, 'patrol'],
      [620, 190, 'patrol'],
      [820, 150, 'chase'],
      [1100, 220, 'patrol'],
    ],
    sparks: [
      [180, 220], [400, 220], [620, 190], [780, 150],
      [920, 190], [1080, 220], [1240, 220],
    ],
    boss: {
      id: 'paraplex',
      spawnX: 1620, spawnY: 200,
      triggerX: 1380,
      arenaX: 1300, arenaWidth: 400,
    },
    exit: [1660, 222],
  },
  {
    id: 3,
    act: 'Act I — The Fall',
    name: 'Aeon III — The Mirrors of Hekate',
    subtitle: 'Three faces wait — only one is real.',
    lore: '"Hekate stood thrice before me,\n laughing in voices that were almost mine."',
    worldWidth: 1800,
    bgKey: 'bg_stars',
    bgTint: 0x040022,
    decor: 'gates',
    worldTint: 0xffffff,
    worldAlpha: 1,
    worldColor: '#80e8ff',
    worldColorHex: 0x80e8ff,
    platforms: [
      [0,    254, 220],
      [280,  220, 100],
      [440,  180, 100],
      [600,  140, 100],
      [760,  180, 100],
      [920,  220, 100],
      [1080, 254, 180],
      [1320, 254, 480],
    ],
    enemies: [
      [320, 190, 'patrol'],
      [500, 150, 'chase'],
      [780, 150, 'patrol'],
      [980, 190, 'chase'],
      [1140, 220, 'patrol'],
    ],
    sparks: [
      [180, 220], [320, 190], [480, 150], [640, 110],
      [800, 150], [960, 190], [1120, 220], [1260, 220],
    ],
    boss: {
      id: 'hekate',
      spawnX: 1620, spawnY: 200,
      triggerX: 1400,
      arenaX: 1320, arenaWidth: 480,
    },
    exit: [1760, 222],
  },
  {
    id: 4,
    act: 'Act I — The Fall',
    name: 'Aeon IV — The Maw of Ariouth',
    subtitle: 'The Devourer waits where the path narrows.',
    lore: '"The Devourer rose, hungering for my Light.\n His teeth were the gates I yet had to pass."',
    worldWidth: 1900,
    bgKey: 'bg_stars',
    bgTint: 0x0a0410,
    decor: 'gates',
    worldTint: 0xffffff,
    worldAlpha: 1,
    worldColor: '#c8a060',
    worldColorHex: 0xc8a060,
    platforms: [
      [0,    254, 280],
      [340,  254, 160],
      [560,  220, 100],
      [720,  180, 100],
      [880,  140, 100],
      [1040, 180, 100],
      [1200, 254, 220],
      [1480, 254, 420],
    ],
    enemies: [
      [400, 220, 'patrol'],
      [620, 190, 'chase'],
      [780, 150, 'patrol'],
      [940, 110, 'chase'],
      [1280, 220, 'patrol'],
    ],
    sparks: [
      [180, 220], [380, 220], [600, 190], [760, 150],
      [920, 110], [1080, 150], [1240, 220], [1420, 220],
    ],
    boss: {
      id: 'ariouth',
      spawnX: 1780, spawnY: 200,
      triggerX: 1560,
      arenaX: 1480, arenaWidth: 420,
    },
    exit: [1860, 222],
  },
  {
    id: 5,
    act: 'Act II — The Chaos',
    name: 'Aeon VI — The Storm of Sabaoth',
    subtitle: 'Trapped in the abyss. Hunted by shadow Archons.',
    lore: '"I cried out of the darkness. There was no consort here —\n only Sabaoth, and the claws of the Hunt."',
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
    id: 6,
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
