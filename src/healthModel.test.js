import assert from 'node:assert/strict';
import test from 'node:test';

import {
  calculatePetHealth,
  createMetricSettings,
  getPrimaryNudge,
  getPetStage,
} from './healthModel.js';

test('calculatePetHealth rewards balanced steps and REM sleep', () => {
  const result = calculatePetHealth({
    steps: 10200,
    sleepHours: 7.6,
    remHours: 1.9,
    activeMinutes: 42,
    mindfulMinutes: 12,
  });

  assert.equal(result.score, 100);
  assert.equal(result.breakdown.steps.status, 'met');
  assert.equal(result.breakdown.rem.status, 'met');
});

test('calculatePetHealth highlights the weakest health pattern', () => {
  const result = calculatePetHealth({
    steps: 2600,
    sleepHours: 5.2,
    remHours: 0.7,
    activeMinutes: 12,
    mindfulMinutes: 2,
  });

  assert.equal(result.score, 30);
  assert.equal(result.weakestMetric, 'rem');
  assert.equal(getPetStage(result.score).id, 'fragile');
  assert.match(getPrimaryNudge(result), /wind-down/i);
});

test('calculatePetHealth caps the score when REM is in a fragile range', () => {
  const result = calculatePetHealth({
    steps: 7800,
    sleepHours: 5.9,
    remHours: 0.8,
    activeMinutes: 34,
    mindfulMinutes: 6,
  });

  assert.equal(result.score, 50);
  assert.equal(getPetStage(result.score).id, 'tired');
  assert.equal(result.weakestMetric, 'rem');
});

test('calculatePetHealth only scores metrics the user has selected', () => {
  const settings = createMetricSettings({
    steps: { enabled: true, target: 5000 },
    sleep: { enabled: false },
    rem: { enabled: false },
    active: { enabled: false },
    mindful: { enabled: false },
    restingHeartRate: { enabled: false },
    hrv: { enabled: false },
  });

  const result = calculatePetHealth(
    {
      steps: 5000,
      sleepHours: 0,
      remHours: 0,
      activeMinutes: 0,
      mindfulMinutes: 0,
      restingHeartRate: 95,
      hrv: 12,
    },
    settings,
  );

  assert.equal(result.score, 100);
  assert.deepEqual(Object.keys(result.breakdown), ['steps']);
});

test('calculatePetHealth supports lower-is-better user goals for vitals', () => {
  const settings = createMetricSettings({
    steps: { enabled: false },
    sleep: { enabled: false },
    rem: { enabled: false },
    active: { enabled: false },
    mindful: { enabled: false },
    restingHeartRate: { enabled: true, target: 60 },
    hrv: { enabled: false },
  });

  const result = calculatePetHealth({ restingHeartRate: 72 }, settings);

  assert.equal(result.score, 83);
  assert.equal(result.breakdown.restingHeartRate.status, 'watch');
  assert.equal(result.weakestMetric, 'restingHeartRate');
});

test('calculatePetHealth does not treat missing lower-is-better vitals as perfect', () => {
  const settings = createMetricSettings({
    steps: { enabled: false },
    sleep: { enabled: false },
    rem: { enabled: false },
    active: { enabled: false },
    mindful: { enabled: false },
    restingHeartRate: { enabled: true, target: 60 },
    hrv: { enabled: false },
  });

  const result = calculatePetHealth({ restingHeartRate: 0 }, settings);

  assert.equal(result.score, 0);
  assert.equal(result.breakdown.restingHeartRate.status, 'watch');
});

test('getPetStage maps midrange scores to a tired but recoverable pet', () => {
  assert.equal(getPetStage(54).id, 'tired');
  assert.equal(getPetStage(55).id, 'steady');
  assert.equal(getPetStage(82).id, 'thriving');
});
