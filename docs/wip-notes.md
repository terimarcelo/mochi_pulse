# Mochi Pulse WIP Notes

These notes capture the current product direction so another person can resume implementation quickly.

## Current Goal

Build a frontend-only hackathon demo for a kid-friendly Metagotchi called Mochi Pulse. The pet mirrors health patterns through emotion, body language, growth, and reactions rather than presenting health as a dry dashboard.

Live target:

```text
https://aaron-ferber.github.io/codex_hackathon/mochipulse_demo/
```

Source repo:

```text
https://github.com/amf272/mochi_pulse
```

## UX Direction

- The pet should be the main event and remain visible while the user changes settings.
- On desktop, keep the pet/play surface sticky on the left and make the right control panel independently scrollable.
- On mobile, keep the pet as a compact sticky top surface, then let controls scroll underneath.
- The UI should feel like a modern kids' game, closer to Toca Boca, Animal Crossing, Pokemon Cafe, or a cute museum toy than a classic stat-heavy Tamagotchi.
- Favor expressive animation states, particles, mood labels, and emotional feedback over visible stat bars.

## Core Loop

```text
Study
  -> learns artwork traits
  -> evolves personality
  -> unlocks new reactions
```

Health stats should change the pet immediately. Demo presets should make this obvious:

- Lazy day: sleepy, clingy, lower energy.
- Balanced day: curious, comfortable.
- Active day: glowing, stronger, guardian-like.

## Care Actions

Feed:

- Before: hungry or neutral.
- During: cheeks puff, snack particles, nom nom mood.
- After: excited, sparkle burp, energy and happiness.

Play:

- Bounce around the gallery.
- Chase butterflies or toss paintbrushes.
- Reward happiness and friendship.

Study:

- Pet examines artwork with huge eyes.
- Magnifying glass, notebook, and lightbulb effects.
- Unlocks a trait such as `Impressionist Dreamer` or `Nature Lover`.

Conserve:

- Tiny conservation gloves and sweeping brush.
- Artifact/backdrop sparkles.
- Pet ends in a proud guardian pose.

## Emotional States

Use mood labels and faces:

- Happy
- Excited
- Curious
- Sleepy
- Proud
- Hungry
- Inspired

The current `renderMeters()` direction should keep moving away from numeric meter bars and toward emotion chips.

## Artwork Discovery Moment

Selecting artwork should feel magical:

```text
Artwork card
  -> energy beam
  -> pet glows
  -> new species trait
  -> new accessory / color / personality
```

The Met artwork should be a backdrop spirit or discovery source, not an image pasted onto the pet body.

## Pet Body Language

Keep the first pet design direction: a very cute rounded animal-like creature with actual body parts.

Important parts:

- Huge glossy eyes with multiple highlights.
- Tiny heart-shaped or button nose.
- W-shaped smile, open-mouth laugh, occasional tongue.
- Arms that wave, hug, or hold tiny museum objects.
- Big rounded plush feet with toe beans.
- Ears, tuft, paws, cheeks, and feet should vary by design tier.

The current `src/petDesigns.js` database is meant to support this. Continue wiring part IDs to CSS variants.

## Evolution Showcase

Target progression:

```text
Seedling Mochi
  -> Nature Explorer
  -> Art Apprentice
  -> Gallery Guardian
  -> Master Curator
```

Current model has `baby`, `bright`, and `guardian`. Add a fourth stage later if time allows.

## Mobile Motion

Use mobile motion as bonus play:

- Shake: big happy bounce / play reaction.
- Tilt left/right: pet leans and studies the room.
- Flip upside down: sparkle reset / conserve reaction.

Keep permission handling in `src/app.js`; keep classification logic in `src/motionInteractions.js`.

## Near-Term Tasks

1. Finish visual CSS for all `data-*` pet design parts from `src/petDesigns.js`.
2. Make each care action trigger a distinct face and animation state.
3. Make health presets visually obvious: Lazy vs Balanced vs Active should visibly change mood and evolution.
4. Polish the right scroll panel and mobile sticky pet behavior in browser screenshots.
5. Deploy static files to `aaron-ferber.github.io/codex_hackathon/mochipulse_demo/`.
6. Keep README updated with the live demo link and frontend-only serving instructions.
