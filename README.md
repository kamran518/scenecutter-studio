# SceneCutter Studio

Build a polished, clickable SceneCutter Pro UI prototype. The source ZIP could not be attached, so here is the exact product/UI guide distilled from it; follow these component names and behavior: App.tsx orchestrates state; TitleBar.tsx; VideoDropBanner.tsx; VideoInfoBadge.tsx; TimestampEditor.tsx; ClipSummary.tsx; ProgressBar.tsx; ControlBar.tsx. The app's core workflow is: import one movie/video file (MP4, MKV, MOV, AVI, WEBM); paste timestamps generated externally by ChatGPT/Claude into a text editor; smart-parse formats such as "00:01:20 - 00:01:35", "01:20 -> 01:35", "1:20 to 1:35", and "[00:02:10 - 00:02:25] Scene description"; show parsed clips with start, end, duration, count, total stitched duration, and validation warnings for overlap or timestamps beyond video duration; choose local output path; toggle Smart-Cut; start cutting/merge; display progress and completion with Play Video, Open Folder, Reset. Video metadata when loaded includes duration, resolution, FPS, video codec, audio codec, and Change Video.

Create exactly TWO main screens/states, not a multi-page dashboard:
1) MOVIE + TIMESTAMPS: movie import/drop area; after import show compact movie metadata and a cinematic video preview; large monospace multi-line timestamp editor with paste-ready sample timestamp data and Load Sample / AI Master Prompt / Clear actions; parsed clip preview/count and Continue to review.
2) CLIPS + EXPORT: video preview and parsed detected clips in a clean list/timeline; each clip shows index, optional scene description, start/end and duration, with edit/remove; total clip count and stitched duration; validity indicators / overlap and out-of-bounds warnings; bottom sticky output control with output filename/path, Browse, Smart-Cut toggle, primary Start Cutting & Merge; simulated progress and success state with Play Video / Open Folder / Reset; Back to timestamps.

VISUAL DIRECTION (user priority overrides dark theme in the source guide): premium Apple/macOS/iOS-inspired LIGHT minimalism. Wide calm desktop utility-window layout, warm white/off-white background, crisp white surfaces, graphite typography, system/SF-like sans, subtle hairline borders, very restrained shadows, small tasteful blue accent, generous whitespace, precise alignment, modest radii. Cinematic media preview should be prominent. Avoid purple neon/dark dashboard styling, gradients, clutter, generic SaaS sidebar, excessive cards, extra navigation or unnecessary features.

RESPONSIVE DESKTOP + ANDROID: desktop is a wide macOS utility app composition. Android is a polished native-feeling single-column layout with same workflow, same information architecture and visual language; compact video preview, touch-friendly controls, timestamp editor and clips list, bottom sticky export action. Include a visible way to preview both desktop and mobile responsive states (e.g. a small device preview toggle in prototype chrome if helpful), but do not add extra product screens.

INTERACTIONS: functional frontend prototype only: simulate choosing/dropping a movie (a demo sample is acceptable), playback toggle, parsing timestamp text into clip rows, load sample, clear, editing/removing clips, validation, moving between the two screens, changing filename, toggling Smart-Cut, mocked browse-path chooser and simulated render progress/completion. Make it explicit in code/UI notes that browser preview cannot access native Tauri dialogs, invoke FFmpeg, write to arbitrary local folders, or perform actual local rendering. Do not claim real export. No backend/auth/cloud database/cloud storage/subscriptions. Use React + TypeScript + Tailwind + shadcn/ui with clean reusable components. High-fidelity clickable prototype, not a wireframe.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/53cc89a3-9793-4b52-8622-c2b1d75f2e2b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
