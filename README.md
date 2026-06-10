# Mochi Pulse

Mochi Pulse is a fast browser prototype for a Health-app-linked virtual pet. The pet changes mood, strength, and appearance based on mock health stats such as steps, sleep, REM, active minutes, mindfulness, resting heart rate, and HRV.

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

## Prototype Notes

- Health presets let reviewers switch between Lazy, Balanced, and Active days.
- Users can choose which health metrics count and edit their goals.
- The health panel now shows stage bands plus each metric's live weight share and score contribution.
- The Met artwork search provides a gallery backdrop and pet identity flavor.
- Pet care actions and mobile motion events trigger expressive reactions.
