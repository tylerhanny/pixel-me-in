# Game design

## Pitch

You get "digitized" into a pixel-art world and run as far as you can. Your own face is the hero.

## Theme: "Save Your RAM" (2026-11-04)

A parody of the late-Oct 2026 news: OpenAI's CEO said on a podcast that RAM sitting idle in home PCs is "quite terrible" and data centers use it better, while RAM prices were rising because AI data centers buy most memory. Hook: **your face stays on your device – and so does your RAM.**

- **Pickups** are RAM sticks: 1 GB, rare RGB stick 8 GB (`RAM_RGB_CHANCE` 4 %). The HUD counts GB (TB above 1024). Jokes at real PC sizes: 8 / 16 / 32 / 64 / 128 / 256 GB (`RAM_MILESTONES`). Saves keep the old key `totalGears`.
- **Villain "The Utilizer"**: a made-up cartoon tech CEO in a glass dome on the robot body (drawn in code, never from a photo, no real name or logos). Rush attacks: _utilization beam_ (slide) and _cloud drop_ (jump). A stumble costs a quarter of this run's RAM (`ramLost`); caught = "Utilized!".
- **Power-ups**: Firewall (blocks one crash), Download More RAM (pulls RAM, every stick x2, 8 s), Jetpack.
- **Zones** (release 1): Your Desk → Data Center, repeating. Old zones are kept as `CLASSIC_ZONES`.
- **Historical ideas, outside this release**: Neon City (flying cars to slide under, drones, "Upgrade to Cloud RAM™" billboards), The Cloud (run on clouds with floating server racks, RAM worth more), Classic mode switch, optional "put any face on the villain" (local only), a RAM shop for unlocks.
- **Rules for the joke**: satire yes, fake quotes no; parody note on About and in the footer; no ads or merch with anyone's likeness.

## Modes

| Mode            | Status | Notes                                                                             |
| --------------- | ------ | --------------------------------------------------------------------------------- |
| **Zone Run**    | v1 ✅  | Endless runner. New world every 180 m. Robot chase in the last 45 m of each zone. |
| **Photo Booth** | v1 ✅  | Dress up the avatar, save/share a picture.                                        |
| **Debug view**  | v1 ✅  | `?debug` or Konami code. Hitboxes, FPS, seed, speed.                              |

## Controls

| Action             | Keyboard           | Touch                                    | Gamepad        |
| ------------------ | ------------------ | ---------------------------------------- | -------------- |
| Jump / double jump | Space, ↑, W, click | Jump button; tap/swipe up also available | A / d-pad up   |
| Short hop          | Release jump early | Release early                            | Release early  |
| Slide / fast fall  | ↓, S (hold)        | Hold Slide; swipe down also available    | B / d-pad down |
| Pause              | Esc, P             | II button                                | Start          |

## Zones and pacing

Your Desk (mug / suspended headset) and Data Center (cooling unit / drone) alternate every 180 m. Warm desk lighting and cold server racks share hard pixel outlines; bright playable objects sit ahead of quiet scenery. Classic artwork remains available in source but is not an active mode.

Five seeded phrases in `src/game/encounters.ts` provide vault, duck, two jumps, duck-to-jump and optional high RAM trails. Spacing includes each phrase's full width and recovery; the reward phrase always offers a safe low route. Speed grows from 230 to 520 px/s at 0.28 per metre, capped by visible road to preserve 1.05 seconds of approach. Slow mode multiplies speed by 0.75. Short landscape screens reserve space below the road for thumb buttons.

Jump −640 px/s, double jump −560, gravity 1900. Standing body 64 px, slide body 38 px; high hazards end 48 px above the road. Jump buffer 130 ms, coyote time 90 ms and early-release short hops remain.

## Practice and robot

First-run practice teaches jump, slide, double jump and Firewall at normal speed. It is skippable and replayable; a missed action is not reported as success.

The last 45 m of each zone is a robot encounter. Existing road hazards clear before attacks begin. The first attack is a laser: 1.1 s of anticipation, then a 350 ms beam to slide under. Bomb targets remain visible and stationary during their 900 ms flight; the landed bomb then scrolls along the road. Attacks leave recovery time and wait while jetpack is active.

A first crash causes a stumble, brief protection and six seconds of danger. A second crash during danger ends the run; surviving restores safety. The HUD shows the remaining danger time. A shield absorbs one hit without starting danger.

## Power-ups

First opportunity at 45 m, then a 90 m target interval, subject to safe spacing and active powers. The three powers rotate:

- Firewall: absorbs one crash, then 700 ms protection.
- RAM ×2: attracts RAM within 200 px and doubles its value for eight seconds.
- Jetpack: five seconds of flight, safe descent, then one second of protection from touchdown.

Active-time clocks freeze deadlines on pause. Robot following, magnet attraction and flight easing use elapsed time. Resize handling ignores unchanged dimensions; genuine rotation cancels held inputs and attack warnings.

## Unlocks (`src/storage/unlocks.ts`)

| Item                | Rule               |
| ------------------- | ------------------ |
| Crown, Space helmet | Best run ≥ 1,500 m |
| 3D glasses          | 150 gears in total |
| Space suit          | 5,000 m in total   |
| Lab coat            | 10 runs            |

## Look and feel

- Pixel art at 640×360, everything drawn in code. Big-head ("bobblehead") character so the face is easy to see.
- The "digitizer" intro (flash → face breaks into pixels → ZAP) is the nod to the inspiring episode.
- Chiptune sound effects made with Web Audio (`src/audio/sfx.ts`).
