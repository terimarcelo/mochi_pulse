import assert from 'node:assert/strict';
import test from 'node:test';

import {
  PET_PART_DATABASE,
  getPetDesign,
  getPetDesignTier,
} from './petDesigns.js';

test('getPetDesign returns the same full design for the same identity and care state', () => {
  const first = getPetDesign({
    id: 436535,
    name: 'Cypress Sprout',
    healthScore: 72,
    evolutionId: 'bright',
  });
  const second = getPetDesign({
    id: 436535,
    name: 'Cypress Sprout',
    healthScore: 72,
    evolutionId: 'bright',
  });

  assert.deepEqual(second, first);
  assert.equal(first.seedKey, '436535|Cypress Sprout|bright|72');
  assert.equal(first.tier, 'bright');
  assert.equal(first.strength, 74);
  assert.ok(first.parts.body);
  assert.ok(first.parts.eyes);
  assert.ok(first.parts.accessory);
});

test('getPetDesign is varied across different pets at the same tier', () => {
  const cypress = getPetDesign({ id: 436535, name: 'Cypress Sprout', healthScore: 72, evolutionId: 'bright' });
  const moon = getPetDesign({ id: 999001, name: 'Moon Pip', healthScore: 72, evolutionId: 'bright' });

  assert.notDeepEqual(moon.parts, cypress.parts);
});

test('getPetDesign biases toward stronger parts as health and evolution improve', () => {
  const fragile = getPetDesign({ id: 17, name: 'Mochi', healthScore: 20, evolutionId: 'baby' });
  const guardian = getPetDesign({ id: 17, name: 'Mochi', healthScore: 96, evolutionId: 'guardian' });

  assert.equal(fragile.tier, 'fragile');
  assert.equal(guardian.tier, 'guardian');
  assert.ok(guardian.strength > fragile.strength);
  assert.ok(guardian.parts.body.power >= fragile.parts.body.power);
  assert.ok(guardian.parts.eyes.power >= fragile.parts.eyes.power);
  assert.ok(guardian.parts.accessory.power >= fragile.parts.accessory.power);
});

test('getPetDesignTier combines health score and evolution id conservatively', () => {
  assert.equal(getPetDesignTier(15, 'guardian'), 'fragile');
  assert.equal(getPetDesignTier(62, 'baby'), 'cozy');
  assert.equal(getPetDesignTier(67, 'bright'), 'bright');
  assert.equal(getPetDesignTier(81, 'bright'), 'bright');
  assert.equal(getPetDesignTier(89, 'guardian'), 'guardian');
});

test('PET_PART_DATABASE exposes cute animal-like part categories for renderers', () => {
  const categories = ['bodyShapes', 'ears', 'arms', 'feet', 'eyes', 'cheeks', 'tufts', 'accessories'];

  for (const category of categories) {
    assert.ok(Array.isArray(PET_PART_DATABASE[category]), category);
    assert.ok(PET_PART_DATABASE[category].length >= 4, category);
    assert.ok(PET_PART_DATABASE[category].every((part) => part.id && part.label && part.power >= 0));
  }
});
