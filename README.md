# Pixel Me In: Save Your RAM

**Put your face in a 2D pixel-art runner game – and save your RAM from the data center.** Take a selfie (or upload a photo), watch it turn into pixels, then run across your desk and through a data center, grabbing every stick of RAM before _The Utilizer_ (a made-up cartoon villain) does.

▶️ **[Play the improvement fork](https://tylerhanny.github.io/pixel-me-in/)** · [Original game by Madhav Kwatra](https://play.madhavkwatra.in)

_Parody: a fan-made joke game, not linked to or approved by any company or person. See [About](about.html)._

🔒 **Your photo never leaves your device.** Face detection runs in your browser. There is no server and no upload. [How we make sure of that →](docs/PRIVACY.md)

![Pixel Me In](public/og-image.png)

## This release

Dependable on-press phone buttons, corrected collision bodies, five authored encounter types, earlier robot attacks, safe power-up transitions and separate normal/slow records. Both workspaces and playable sprites have been redrawn; attack poses, persistent danger feedback and a quieter warning-focused mix improve readability.

Quick play needs no photo or face-model download. Photo processing stays local. After the first online visit, wait for “Ready to play offline”; use Settings → Offline → Download for new-photo creation without a connection. Updates wait for the Reload prompt and preserve the saved avatar. Both analytics integrations are disabled unless explicitly enabled at build time.

The production artifact is `dist/`; relative asset paths support a subdirectory deployment. Preview hosting uses a separate `preview` branch. Tests target Chromium desktop and phone emulation; physical-device and auditory listening checks remain separate from automation.

## Features

- 📸 **Camera or upload** – or skip the photo and pick a ready-made character
- 🧑‍🎨 **On-device pixel filter** – pixel size, colour palettes, outline, or keep the photo look
- 🎩 **Photo Booth** – hats, masks, glasses, outfits; save or share a picture of your character
- 🏃 **Zone Run** – endless runner, a new world every 180 m, robot chase before each zap
- ⚡ **Power-ups** – shield, gear magnet, jetpack
- 📱 **Works everywhere** – keyboard, touch and gamepad; installable app (PWA) that plays offline
- ♿ **Accessible** – reduce-motion and slow-mode options, screen-reader announcements, keyboard menus
- 🛠️ **Debug view** – add `?debug` to the URL (or enter the Konami code on the menu) to see hitboxes and FPS

## Run it locally

Needs Node.js 20+.

```bash
git clone --branch improvement/playable-release https://github.com/tylerhanny/pixel-me-in.git
cd pixel-me-in
npm ci             # also copies the MediaPipe runtime into public/mediapipe/wasm
npm run dev        # http://localhost:5190
```

| Command           | What it does                                      |
| ----------------- | ------------------------------------------------- |
| `npm run dev`     | Dev server with hot reload                        |
| `npm run build`   | Type-check + production build into `dist/`        |
| `npm run preview` | Serve the production build                        |
| `npm test`        | Unit tests (Vitest)                               |
| `npm run e2e`     | Browser smoke tests (Playwright, desktop + phone) |
| `npm run lint`    | ESLint                                            |
| `npm run icons`   | Re-draw icons and the social preview image        |

Dev review tools (need `npm run dev` running; output in `test-results/`): `node scripts/play-check.mjs`, `node scripts/ui-check.mjs`, `node scripts/preview-sprites.mjs`, `node scripts/likeness-gallery.mjs <photo-folder>`.

The camera needs HTTPS or `localhost`.

### Test on your phone (same Wi-Fi)

```bash
npm run dev:phone   # https://<your-PC-IP>:5191 (self-signed HTTPS, so the camera works)
```

Open the "Network" link on your phone. The first time, the browser warns "not private" (self-signed certificate): choose Advanced → Proceed. Windows may ask to allow Node.js on private networks. Installing the app (PWA) needs a real certificate, so test that after deploying.

## Tech

[Phaser 4](https://phaser.io) (game engine) · TypeScript · [Vite](https://vite.dev) · [MediaPipe Face Landmarker + Image Segmenter](https://ai.google.dev/edge/mediapipe/solutions/vision/face_landmarker) (self-hosted) · [idb-keyval](https://github.com/jakearchibald/idb-keyval) · [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)

All art and sounds are drawn/synthesized in code – no asset files to download.

## Docs

- [Architecture](docs/ARCHITECTURE.md) – how the pieces fit together
- [Privacy](docs/PRIVACY.md) – the photo pipeline, step by step, with links to the code
- [Game design](docs/GAME_DESIGN.md) – modes, zones, controls, balance
- [Roadmap / TODO](docs/TODO.md)
- [Dev journal](docs/JOURNAL.md)
- [Contributing](CONTRIBUTING.md)

## About

A fan-made, open-source game inspired by the _Phineas and Ferb_ episode "Gaming the System" (season 2, 2009), where the boys build a video game and zap themselves into it. Not affiliated with or endorsed by Disney. No characters, names or art from the show are used.

## Author

Made by **Madhav Kwatra** – [portfolio](https://madhavkwatra.in) · [GitHub](https://github.com/MadhavKwatra) · [LinkedIn](https://www.linkedin.com/in/madhav-kwatra/) · [X](https://x.com/madhav_kwatra)

## License

Code: [MIT](LICENSE). Third-party credits: [CREDITS.md](CREDITS.md).
