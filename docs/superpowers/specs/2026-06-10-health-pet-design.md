# Health Pet Prototype Design

## Goal

Build a fast browser prototype for a kawaii virtual pet whose visible condition mirrors a user's daily health patterns. The hackathon demo uses mock Health App-style values so the loop is clear without needing Apple HealthKit integration.

## Core Loop

The player adjusts or imports daily stats, sees the pet's health state update immediately, and gets a short pattern nudge. The intended feeling is Tamagotchi-like care: the pet is cute enough that a tired or fragile state makes the user want to check their own sleep and movement.

## Prototype Scope

- Single-screen browser app.
- Mock metrics: steps, REM sleep, active minutes, mindful minutes.
- Transparent score explainer with stage bands, per-metric weight share, and per-metric contribution.
- Four pet states: thriving, steady, tired, fragile.
- Presets for demo storytelling.
- No medical diagnosis or real HealthKit connection in this version.

## Architecture

`src/healthModel.js` owns scoring, state labels, and nudges. `src/app.js` owns DOM rendering and input handling. The visual pet is CSS/DOM so it stays lightweight and quick to modify during the hackathon.

## Verification

Use Node's built-in test runner for scoring and state mapping, then boot the static app in a browser and verify desktop/mobile layout, state changes, and score-breakdown updates when stats are toggled.

## Follow-Ups

- Add a desktop-friendly motion demo mode so shake, tilt, and flip reactions are easy to show without phone sensors.
- Add richer demo-scene shortcuts that jump directly between fragile, tired, steady, and thriving gallery states.
