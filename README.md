# SOPHIA — The Fall of Light

> A dark mystical platformer faithful to the Gnostic *Pistis Sophia* text.

## Story
Sophia, divine Aeon of the Pleroma, falls through the 13 Aeons into Chaos after her reckless act of creation. She must repent, be guided by the Light (Jesus), and ascend back through the Archons to be restored as the Light-Maiden.

## Game Structure
| Act | Title | Style |
|-----|-------|-------|
| Prologue | The Pleroma | Lore panels — peaceful intro |
| Act 1 | The Fall | Sonic-style fast descent |
| Act 2 | The Chaos | Hollow Knight survival/stealth |
| Act 3 | The Ascent | Altered Beast progression |
| Finale | Restoration | Boss gauntlet + transcendence |

## Mechanics
- **Light Sparks** → power progression (Sophia's scattered divine light)
- **Transformation forms** → unlock at spark milestones
- **13 Archon bosses** → one per Aeon
- **Jesus levels** → seal-based combat, guide escort missions
- **Speedrun scoring** → S/A/B/C rank per level
- **Roguelite layer** → meta-upgrades between runs

## Tech Stack
- Phaser 3 (game engine)
- Capacitor 6 (Android/iOS wrapper)
- Vanilla JS (no framework)

## Setup
```bash
npm install
npx cap add android
npx cap sync
npx cap open android
```

## Dev (web preview)
```bash
npx serve www
```
