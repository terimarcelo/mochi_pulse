# Mochi Pulse

Mochi Pulse is a fast browser prototype for a Health-app-linked virtual pet. The pet changes mood, strength, and appearance based on mock health stats such as steps, sleep, REM, active minutes, mindfulness, resting heart rate, and HRV.

Live demo: [https://aaron-ferber.github.io/codex_hackathon/mochipulse_demo/](https://aaron-ferber.github.io/codex_hackathon/mochipulse_demo/)

This is frontend-only. It does not need a backend or build step; GitHub Pages can serve `index.html` and the files under `src/` directly.

## Run

```sh
python3 -m http.server 5173
```

Open `http://localhost:5173/`.

## Test

```sh
npm test
npm run check
```

## Deploy

Copy `index.html` and `src/` into a static host folder. The current shared demo is deployed from the `aaron-ferber.github.io` repo at:

```text
codex_hackathon/mochipulse_demo/
```

## Prototype Notes

- Health presets let reviewers switch between Lazy, Balanced, and Active days.
- Users can choose which health metrics count and edit their goals.
- The Met artwork search provides a gallery backdrop and pet identity flavor.
- Pet care actions and mobile motion events trigger expressive reactions.
