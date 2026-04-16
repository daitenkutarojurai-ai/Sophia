# SOPHIA — The Fall of Light
## Project Reference & Developer Bible

---

## 1. LORE — The Real Story (Pistis Sophia / Gnostic Texts)

### The Accurate Narrative
Sophia is one of the divine **Aeons** living inside the **Pleroma** (the realm of divine fullness and light).

**The Fall:**
- Sophia is moved by an intense, passionate desire to know the unknowable Father **alone** — without her consort, without consent
- Her unilateral act of creation produces a **formless, deficient being**: **Yaldabaoth** (the Demiurge)
- Horrified, she casts him into the Chaos below the Pleroma and veils him from the other Aeons
- Yaldabaoth, ignorant of his true origin, declares himself the supreme god and creates the **material world** and its **Archons**
- The Archons of the 13 Aeons, drawn by her grief, **drag Sophia downward into Chaos**

**The Trick (key lore moment — game mechanic):**
- Yaldabaoth creates Adam but cannot animate him — he has no true divine power
- Sophia (through divine beings) **manipulates Yaldabaoth's ego** — goads him into breathing life into Adam to prove his power
- In doing so, Yaldabaoth transfers **Sophia's own divine light** (which he inherited from her) into the human body
- Adam awakens **more luminous than his creator** — Yaldabaoth panics
- Sophia's divine light is now **scattered across all of humanity**
- This is why every human carries a divine spark they don't know about → **Gnosis = remembering**

**The Redemption:**
- Sophia cries out in repentance from the Chaos — 13 prayers/repentances
- Jesus/the Light, ascending after his earthly mission, **hears her cries** and intervenes
- He reveals mysteries, empowers her with **seals, names, and sacred ciphers** to fight the Archons
- Her redemption = a **triumphant ascent through the 13 Aeons**, defeating each Archon with Jesus as guide
- She is restored as the **"Light-Maiden"**, crowned with a radiant diadem
- Reintegrated into the Pleroma, she becomes a **universal guide for repentant souls**

**Key theological point:**
> Sophia's liberation and humanity's liberation are **the same event** — she cannot fully return until her scattered light is recollected from human souls.

### Important: What Sophia Does NOT Do
- She does **not** confront Yaldabaoth directly in combat
- She **outsmarts** him (the Adam trick = puzzle mechanic, not fight)
- The real enemies on the ascent are the **13 Archons**, not Yaldabaoth himself
- Yaldabaoth appears in Act 1 as a **presence/threat**, not a boss to fight

---

## 2. GAME STRUCTURE

### Five Acts
| Act | Title | Lore Basis | Gameplay Style | Character |
|-----|-------|-----------|----------------|-----------|
| Prologue | The Pleroma | Sophia before the fall | Lore panels, peaceful | — |
| Act 1 | The Fall | Dragged through 13 Aeons | Sonic-style fast descent, auto-scroll | Sophia |
| Act 2 | The Chaos | Trapped, tormented, repentance | Hollow Knight — dark survival/stealth | Sophia |
| Act 3 | The Ascent | Guided by Jesus through 13 Aeons | Altered Beast progression, unlock seals/forms | Sophia + Jesus |
| Finale | Restoration | Crowned Light-Maiden | Boss gauntlet + transcendence ending | Both |

### Level Flow
```
MainMenu
  └─ Prologue (lore panels × 8)
       └─ Act1Scene (The Fall — 13 Aeons × 800px = 10,400px)
            └─ Act2Scene (The Chaos — [TODO])
                 └─ Act3Scene (The Ascent — 13 Aeons upward — [TODO])
                      └─ FinaleScene ([TODO])
                           └─ EndingScene ([TODO])
```

---

## 3. THE 13 ARCHONS (Bosses)

Based on Gnostic tradition (Pistis Sophia / Apocryphon of John):

| # | Name | Title | Element | Role in game |
|---|------|-------|---------|--------------|
| 1 | Authades | The Self-Willed | Fire | Act 1 mini-boss (first encounter) |
| 2 | Paraplex | The Confusion | Shadow | Act 1 — disorientation attacks |
| 3 | Hekate | The Triple-Faced | Illusion | Act 1 — split/mirror mechanic |
| 4 | Ariouth | The Devourer | Earth | Act 1 — ground smash |
| 5 | Yaldabaoth | The Lion-Faced | Pride | Act 1 — presence only, NOT fought directly |
| 6 | Sabaoth | Lord of Forces | Storm | Act 2 — storm arena |
| 7 | Adonaios | The Hidden Lord | Void | Act 2 — invisibility mechanic |
| 8 | Astaphaios | The Envier | Acid | Act 2 — environmental hazard |
| 9 | Ailoaios | The Deceiver | Mirror | Act 3 — false copies of Sophia |
| 10 | Oraios | The Blinding | Corrupt Light | Act 3 — uses light as weapon |
| 11 | Adamas | The Unmovable | Stone | Act 3 — shield/puzzle mechanic |
| 12 | Sabaoth (Repentant) | The Redeemed | Redemption | Act 3 — turns ally mid-fight |
| 13 | The Veil | The Final Boundary | Void | Finale — true final boss |

> **Note:** Archon #12 (Sabaoth) is canonically the Archon who repents and sides with Sophia — use this as a narrative twist boss fight.

---

## 4. PLAYABLE CHARACTERS

### Sophia (Acts 1–3 + Finale)
- **Style:** Agile, speedrun-focused, light-spark collection, transformation forms
- **Controls:** Arrow keys + Z (attack) + X (dash) + C (seal use)
- **Speed:** 200px/s base, +15 per form level
- **Jump:** -450 velocity
- **HP:** 3 hearts

#### Transformation Forms (Altered Beast mechanic)
Unlocked by collecting Light Sparks (Sophia's own divine light scattered in humans):

| Form | Name | Sparks Required | Ability gained |
|------|------|----------------|----------------|
| 0 | Fallen Sophia | 0 | Base form |
| 1 | Pistis (Faith Form) | 10 | Longer dash range |
| 2 | Form of Zoe | 25 | Double jump |
| 3 | Wings of Pistis | 50 | Glide + air dash |
| 4 | Light-Maiden (Crown) | 100 | Full power — light beam attack |

### Jesus / The Light (Act 3 + Finale)
- **Style:** Powerful, seal-based attacks, slower but devastating
- **Mode 1 — Guide:** AI follows Sophia, auto-casts seals at nearby enemies
- **Mode 2 — Playable:** WASD + J (seal) + K (light beam)
- **Speed:** 160px/s
- **Jump:** -400 velocity
- **HP:** 5 hearts (tankier)

#### Jesus Seals (unlocked per Aeon in Act 3)
| Seal | Name | Unlocked | Effect |
|------|------|---------|--------|
| 1 | Seal of Binding | Act3 Aeon 1 | Stuns Archon 3s |
| 2 | Seal of Banishing | Act3 Aeon 5 | Deals 2 damage + knockback |
| 3 | Seal of Truth | Act3 Aeon 9 | Reveals hidden enemies/paths |
| 4 | Seal of Light | Finale | Full-screen divine beam |

---

## 5. ADDICTIVE LOOPS (Three Layers)

### Layer 1 — Speedrun (per level)
- S/A/B/C rank based on: time (40%) + sparks collected (30%) + no-hit bonus (20%) + combo (10%)
- Leaderboard per level stored in device storage
- Ghost replay of best run (future feature)

### Layer 2 — Roguelite (per run)
- Permadeath run mode (optional toggle)
- Die = restart from Act 1 (or last unlocked checkpoint)
- Meta-currency: **Gnosis Points** (earned per run regardless of death)
- Spend at **The Pleroma Shop** between runs

#### Meta-Upgrades (Roguelite unlocks)
| ID | Name | Effect |
|----|------|--------|
| light_memory | Memory of Light | Start with 5 Light Sparks |
| swift_fall | Swift Descent | +10% speed in Act 1 |
| repentance | Repentance | Revive once per run in Act 2 |
| seal_echo | Echo of the Seal | Jesus seals deal +25% damage |
| spark_magnet | Spark Magnetism | Auto-collect sparks in radius |
| archon_memory | Archon Memory | See Archon attack patterns earlier |

### Layer 3 — Power Progression (permanent)
- Transformation forms persist between runs once unlocked
- Light Archive: lore collectibles — one per Aeon (13 total)
- Archon entries unlocked after defeating each boss
- New Game+ after completion: all 13 Archons have enhanced patterns

---

## 6. FILE STRUCTURE

```
sophia-game/
├── CLAUDE.md                  ← this file
├── README.md
├── capacitor.config.ts
├── package.json
└── www/
    ├── index.html
    └── js/
        ├── main.js            ← Phaser config, scene registry
        ├── constants.js       ← ACTS, ARCHONS, CHARACTERS, RANKS, META_UPGRADES
        ├── entities/
        │   ├── Sophia.js      ← player: movement, dash, attack, forms, sparks
        │   ├── Jesus.js       ← guide AI + playable mode, seals, halo
        │   └── ArchonScout.js ← enemy: patrol/chase/shooter, projectiles
        ├── scenes/
        │   ├── BootScene.js        ← pixel art setup, registry init
        │   ├── PreloadScene.js     ← calls SpriteFactory, loading bar
        │   ├── MainMenuScene.js    ← title, ambient sparks, menu
        │   ├── PrologueScene.js    ← 8 lore panels (tap to advance)
        │   ├── GameScene.js        ← base scene (extended by Act scenes)
        │   ├── Act1Scene.js        ← The Fall: auto-scroll, 13 Aeons, scouts
        │   ├── UIScene.js          ← HUD: HP hearts, timer, sparks, combo
        │   └── GameOverScene.js    ← death screen, retry/menu
        └── utils/
            └── SpriteFactory.js   ← generates ALL sprites via canvas (no image files)
```

---

## 7. TECH STACK

| Layer | Tech | Notes |
|-------|------|-------|
| Game engine | Phaser 3 | Arcade physics, tilemaps, animations |
| Mobile wrapper | Capacitor 6 | Android + iOS |
| Language | Vanilla JS (ES modules) | No framework |
| Sprites | Canvas-generated (SpriteFactory) | Replace with real pixel art per sprite |
| Audio | Not yet wired | Phaser WebAudio — files go in www/assets/audio/ |
| Tilemaps | Tiled JSON | Files go in www/assets/tilemaps/ |
| Store | Google Play | Same account as Chess Kombat |
| Repo | github.com/daitenkutarojurai-ai/Sophia | main branch |

### Resolution
- **Base:** 480 × 270px (16:9, pixel-art friendly)
- **Scale mode:** FIT + CENTER_BOTH (fills any screen)
- **Pixel art:** renderer.setPixelArt(true) in BootScene

---

## 8. TO DO

### 🔴 High Priority (next session)
- [ ] **Act2Scene** — The Chaos
  - Dark, claustrophobic Hollow Knight style
  - Sophia trapped — limited movement initially
  - Stealth sections (avoid Archon patrols)
  - 13 repentance prayers = collectible lore items
  - Jesus appears at end of Act 2 (hearing her cries)
- [ ] **ArchonBoss base class** — reusable boss framework
  - HP bar, phases (2–3 per boss), attack patterns
  - Death animation + Archon lore panel on defeat
- [ ] **Authades boss fight** — Act 1 mini-boss
  - First boss: fire attacks, self-willed charge
  - Teaches: dash mechanic is key to survive

### 🟡 Medium Priority
- [ ] **Act3Scene** — The Ascent
  - Reversed Act 1 — upward through 13 Aeons
  - Jesus in guide mode throughout
  - Each Aeon = one Archon boss
  - Seal unlocks per Aeon
- [ ] **Roguelite meta screen** — between runs
  - Gnosis Point counter
  - Meta-upgrade shop
  - Run history (time, rank, sparks)
- [ ] **Touch controls** — for Android
  - D-pad (left/right), jump button, attack, dash
  - Use Phaser virtual joystick or custom overlay
- [ ] **The Adam puzzle mechanic** — in Act 2
  - Sophia must trick Yaldabaoth into animating Adam
  - Puzzle/stealth segment — no combat
  - Rewards: unlock Form of Zoe (double jump)

### 🟢 Lower Priority / Polish
- [ ] **Real pixel art sprites** — replace SpriteFactory canvas art
  - Sophia: 5 forms × full animation sets
  - Jesus: idle/walk/seal/beam
  - 13 Archon bosses (64×64)
  - Background tilemaps per Act
- [ ] **Audio** — ambient + SFX
  - Act 1: dark descent drone
  - Act 2: silence broken by Archon sounds
  - Act 3: building toward light
  - SFX: spark collect, seal cast, transformation, hit
- [ ] **Light Archive screen** — lore collectibles
  - 13 Aeon entries + 13 Archon entries
  - Unlocked by completing levels / defeating bosses
- [ ] **FinaleScene** — boss gauntlet
- [ ] **EndingScene** — Sophia crowned as Light-Maiden, cinematic
- [ ] **New Game+** — enhanced Archon patterns
- [ ] **Speedrun ghost** — replay best run as ghost overlay
- [ ] **Google Play Store listing** — app ID: ai.daitenkutarojurai.sophia

---

## 9. SCENE KEY REGISTRY

All scene keys used with `this.scene.start(key)`:

| Key | Class | Status |
|-----|-------|--------|
| `Boot` | BootScene | ✅ Done |
| `Preload` | PreloadScene | ✅ Done |
| `MainMenu` | MainMenuScene | ✅ Done |
| `Prologue` | PrologueScene | ✅ Done |
| `Game` | GameScene | ✅ Done (base) |
| `Act1` | Act1Scene | ✅ Done |
| `Act2` | Act2Scene | ❌ TODO |
| `Act3` | Act3Scene | ❌ TODO |
| `Finale` | FinaleScene | ❌ TODO |
| `UI` | UIScene | ✅ Done |
| `GameOver` | GameOverScene | ✅ Done |
| `MetaScreen` | MetaScene | ❌ TODO |
| `LightArchive` | ArchiveScene | ❌ TODO |

---

## 10. CONSTANTS REFERENCE

### ARCHONS array — `constants.js`
```js
ARCHONS[0] = { id:1, name:'Authades', title:'The Self-Willed', element:'fire' }
// ... up to ARCHONS[12]
```

### CHARACTERS object — `constants.js`
```js
CHARACTERS.sophia.forms[4] = { id:'crowned', name:'Light-Maiden', sparksRequired:100 }
CHARACTERS.jesus.seals[3]  = { id:'seal4', name:'Seal of Light', unlockedAt:'act3_finale' }
```

### Score weights
```js
SCORE_WEIGHTS = { timeBonus:0.4, sparks:0.3, noHit:0.2, combos:0.1 }
```

---

## 11. DEVELOPMENT NOTES

### Running locally
```bash
cd sophia-game/www
npx serve .
# open http://localhost:3000
```

### Android build
```bash
npm install
npx cap add android
npx cap sync
npx cap open android
```

### Key decisions made
- **No image files needed** — SpriteFactory generates everything via canvas. Replace textures one at a time with real art.
- **Sophia never fights Yaldabaoth directly** — lore-accurate. He's a presence/dread figure, not a combat boss.
- **Archon #12 (Sabaoth) turns ally** — canonical Gnostic detail, used as narrative twist.
- **The Adam trick = puzzle mechanic** — Sophia's cunning, not combat power, defeats the Demiurge.
- **Light Sparks = Sophia's scattered divine light in humanity** — the core progression mechanic is lore-accurate.
- **Resolution 480×270** — pixel-art friendly, scales cleanly to all mobile screens.
