import assert from 'node:assert/strict';
import test from 'node:test';

import {
  classifyMotionSample,
  classifyOrientationSample,
  createReactionQueue,
  nextReaction,
} from './motionInteractions.js';

test('classifyMotionSample detects a strong shake with cooldown metadata', () => {
  const reaction = classifyMotionSample({ x: 14, y: -11, z: 19, interval: 80 });

  assert.equal(reaction.action, 'shake');
  assert.equal(reaction.intensity, 'high');
  assert.equal(reaction.source, 'motion');
  assert.equal(reaction.cooldownMs, 900);
  assert.ok(reaction.score > 20);
});

test('classifyMotionSample keeps ordinary gravity drift calm', () => {
  const reaction = classifyMotionSample({ x: 0.4, y: -0.2, z: 9.8, interval: 120 });

  assert.equal(reaction.action, 'calm');
  assert.equal(reaction.intensity, 'low');
  assert.equal(reaction.source, 'motion');
  assert.equal(reaction.cooldownMs, 250);
});

test('classifyOrientationSample detects upside-down flip posture', () => {
  const reaction = classifyOrientationSample({ beta: 176, gamma: 4 });

  assert.equal(reaction.action, 'flip');
  assert.equal(reaction.intensity, 'high');
  assert.equal(reaction.source, 'orientation');
  assert.equal(reaction.cooldownMs, 1200);
});

test('classifyOrientationSample classifies left and right tilt', () => {
  assert.equal(classifyOrientationSample({ beta: 12, gamma: -31 }).action, 'tilt-left');
  assert.equal(classifyOrientationSample({ beta: 8, gamma: 33 }).action, 'tilt-right');
});

test('classifyOrientationSample treats level posture as calm', () => {
  const reaction = classifyOrientationSample({ beta: 5, gamma: 6 });

  assert.equal(reaction.action, 'calm');
  assert.equal(reaction.intensity, 'low');
  assert.equal(reaction.source, 'orientation');
});

test('reaction queue returns actionable samples before calm and respects cooldowns', () => {
  const queue = createReactionQueue({ now: 1000 });

  const shake = queue.push(classifyMotionSample({ x: 18, y: 10, z: -16, interval: 60 }), 1000);
  const blocked = queue.push(classifyMotionSample({ x: -20, y: 12, z: 15, interval: 60 }), 1200);
  const tilt = queue.push(classifyOrientationSample({ beta: 6, gamma: -29 }), 2000);

  assert.equal(shake.action, 'shake');
  assert.equal(blocked.action, 'calm');
  assert.equal(blocked.reason, 'cooldown');
  assert.equal(tilt.action, 'tilt-left');
  assert.equal(nextReaction(queue).action, 'shake');
  assert.equal(nextReaction(queue).action, 'tilt-left');
  assert.equal(nextReaction(queue).action, 'calm');
});
