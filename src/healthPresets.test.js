import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getHealthPreset,
  getHealthPresetOptions,
} from './healthPresets.js';

test('getHealthPreset returns active stats that are stronger than lazy stats', () => {
  const lazy = getHealthPreset('lazy');
  const active = getHealthPreset('active');

  assert.ok(active.stats.steps > lazy.stats.steps);
  assert.ok(active.stats.remHours > lazy.stats.remHours);
  assert.ok(active.stats.activeMinutes > lazy.stats.activeMinutes);
  assert.ok(active.stats.restingHeartRate < lazy.stats.restingHeartRate);
});

test('getHealthPreset returns a defensive stats copy', () => {
  const preset = getHealthPreset('active');
  preset.stats.steps = 1;

  assert.equal(getHealthPreset('active').stats.steps, 12400);
});

test('getHealthPresetOptions exposes the three demo modes', () => {
  assert.deepEqual(
    getHealthPresetOptions().map((preset) => preset.id),
    ['lazy', 'balanced', 'active'],
  );
});
