# DSH Blue Archive Shiroko Theme

[简体中文](README.md) · [English](README.en.md)

An unofficial fan-made theme plugin for the **DeepSeek Harness (`dsh`) web client**. It gives DSH a Blue Archive-inspired academy-blue interface and adds a draggable, pettable Shiroko desktop companion that can display the current assistant response and securely query the DeepSeek API balance.

> [!IMPORTANT]
> This project is an unofficial fan work and is not affiliated with, endorsed by, or sponsored by NEXON Games, NEXON, Yostar, Blue Archive, or OpenAI. The source code is licensed under MIT. Character names, character likenesses, and user-provided images are not covered by the MIT license. Make sure you have permission before publishing or redistributing those assets. See [ASSET_NOTICE.md](ASSET_NOTICE.md).

![Desktop preview](assets/screenshot.png)

## Highlights

- **Blue Archive-inspired UI**
  - Academy blue and cyan accents, frosted white panels, and a tactical grid background
  - Styling for DSH sidebars, messages, composer, buttons, code blocks, and settings
- **Shiroko desktop companion**
  - Drag, resize, hide, reset position, and toggle animations
  - Autonomous idle actions such as greeting, observing, stretching, and reacting
  - Tap the character to query the DeepSeek API balance; use the dedicated gear button for quick controls
- **Secure balance lookup**
  - The host half reads DSH's configured `DEEPSEEK_API_KEY`; the key never enters the browser or `localStorage`
  - Calls the official `https://api.deepseek.com/user/balance` endpoint
  - Shows currency and available balance with a configurable low-balance threshold
  - Uses a loopback-only RPC channel to limit exposure of credentials and account data
- **Codex-style compact dialogue bubbles**
  - Reads the current assistant response and splits it into lightweight lines
  - Streaming sync, typewriter rendering, a blinking cursor, and post-completion rotation
  - Keeps up to 8 recent lines and prioritizes the live assistant response while generation is active
- **Petting interaction**
  - Hold the head for about 420ms
  - Includes a nod, pink glow ring, floating hearts, and a dedicated reaction line
  - Moving more than 8px cancels petting to avoid accidental activation while dragging
- **Companion sounds**
  - Includes a character click sound, assistant-completion chime, and low-balance warning
  - The low-balance warning has a 60-second cooldown to prevent repeated alerts
  - No official voice or sound assets are bundled; sounds can be disabled
- **Responsive settings UI**
  - Fully centered on desktop and converted to horizontal tabs on narrow screens
  - Respects `prefers-reduced-motion`

## Requirements

- A working DeepSeek Harness / `dsh` installation
- The DSH web client enabled
- A valid `DEEPSEEK_API_KEY` configured in DSH for balance lookup
- A modern Chromium-based browser such as Chrome or Edge

## Installation

### Option 1: Install the GitHub Release package (recommended)

1. Download the following file from the GitHub **Releases** page:

   ```text
   dsh-blue-archive-shiroko-0.6.0.tgz
   ```

2. Run the command below and replace the path with your actual download location:

   ```powershell
   dsh plugin --profile web add "C:\path\to\dsh-blue-archive-shiroko-0.6.0.tgz"
   ```

3. Fully restart DSH Web, then press `Ctrl + F5` in the browser.

### Option 2: Install from a cloned source directory

```powershell
git clone https://github.com/mldhao/dsh-blue-archive-shiroko.git
cd dsh-blue-archive-shiroko
dsh plugin --profile web add "$PWD"
```

Restart DSH Web and refresh the page. A directory install is useful for development because local changes can be tested after a restart or refresh.

## Usage

- **Tap the character** to play the click sound and query the DeepSeek API balance.
- **Hold the head** for about 420ms to trigger the petting effect.
- **Drag the character** more than 8px to move it without triggering balance lookup or petting; the position is saved automatically.
- **Click the gear button** to open or close the quick panel.
- Use **Change action** in the quick panel to trigger an autonomous interaction immediately.
- Open **Shiroko Theme** in DSH settings to control visibility, reply sync, companion sounds, low-balance threshold, animation, autonomous actions, and scale, or to query the balance manually.
- Use **Reset companion position** if the character was dragged outside the viewport.

Settings are stored in the current browser's `localStorage`. Autonomous interactions are enabled by default and run after roughly 12–25 seconds of idle time. They pause during tasks, while the quick panel is open, or while the page is hidden.

## Troubleshooting and removal

List installed plugins:

```powershell
dsh plugin --profile web list
```

If the page does not change after installation:

1. Confirm that the plugin appears in the `web` profile plugin list.
2. Stop and restart DSH Web completely instead of only refreshing the page.
3. Press `Ctrl + F5` to bypass the browser cache.
4. Open DSH settings and confirm the theme/plugin is enabled.
5. If an older package was installed, remove it before installing the latest release.

If balance lookup fails:

1. Confirm that `DEEPSEEK_API_KEY` is configured and valid in DSH model settings.
2. Fully restart DSH Web so the 0.6.0 host-side RPC is loaded; a browser refresh alone is not enough.
3. Balance lookup is loopback-only. A DSH page opened from another device on the LAN is intentionally rejected.
4. Custom OpenAI-compatible gateways usually do not expose the official DeepSeek balance endpoint; this feature queries the official DeepSeek account by default.

Removal commands may differ between DSH versions. Check the CLI available on your system:

```powershell
dsh plugin --help
dsh plugin --profile web --help
```

## Standalone preview

The repository includes a static preview that does not require DSH:

```powershell
cd dsh-blue-archive-shiroko
python -m http.server 4173
```

Open `http://127.0.0.1:4173/preview/`. The preview lets you switch companion states and drag the character.

## Development and packaging

Check JavaScript syntax:

```powershell
npm run check
```

Run balance parsing and credential-boundary tests:

```powershell
npm test
```

Create the installable package:

```powershell
npm run pack:release
```

The package is written to `dist/`. If npm cannot write to the global cache, point it to a local cache first:

```powershell
$env:npm_config_cache = "$PWD\.npm-cache"
npm run pack:release
```

## Project structure

```text
dsh-blue-archive-shiroko/
├─ package.json
├─ cordis.patch.yml
├─ lib/
│  ├─ index.js
│  └─ client.js
├─ preview/
│  ├─ index.html
│  ├─ preview.css
│  └─ preview.js
├─ tests/
│  └─ balance.test.js
├─ assets/
│  ├─ screenshot.png
│  ├─ screenshot-mobile.png
│  └─ shiroko-custom.webp
├─ README.md
├─ README.en.md
├─ CHANGELOG.md
└─ ASSET_NOTICE.md
```

## Customization

- Theme colors and DSH tokens: `TOKENS` in `lib/client.js`
- Character image: `assets/shiroko-custom.webp`
- Embedded runtime image: `PET_IMAGE` in `lib/client.js`
- Status copy and accent colors: `PHASES` in `lib/client.js`
- Autonomous actions and dialogue: `INTERACTIONS` in `lib/client.js`
- Visual rules: `STYLE_TEXT` in `lib/client.js`

After replacing the character image, also update the embedded `PET_IMAGE` in `lib/client.js`; otherwise the running plugin will continue to show the previous image.

## Known limitations

- “Codex-style” refers only to compact lines, typewriter rendering, and status feedback. This project does not copy Codex's official pet artwork, voice, or sound effects.
- Reply sync depends on DSH's current DOM structure, including `[data-chat-flow-kind="assistant-step"]` and the `aria-label` of the Stop generating button. Major DSH updates may require selector changes.
- Balance lookup supports the official DeepSeek API and `DEEPSEEK_API_KEY` by default; it does not assume third-party compatible gateways implement a balance endpoint.
- For security, the balance RPC only accepts a DSH page served on loopback. Remote devices cannot query the balance.
- Click, completion, and warning sounds can be skipped when browser audio is not authorized, the page is in the background, or Web Audio is restricted by the system.
- Companion state is inferred from the page DOM without a backend service. Third-party themes or DSH markup changes may affect detection.

## Version

Current version: **0.6.0**. See [CHANGELOG.md](CHANGELOG.md) for details.

## License and notices

- Source code: MIT License, see [LICENSE](LICENSE).
- Character names, likenesses, and image assets: not covered by the MIT license, see [ASSET_NOTICE.md](ASSET_NOTICE.md).
- Intended for learning, personal customization, and fan-community use.

