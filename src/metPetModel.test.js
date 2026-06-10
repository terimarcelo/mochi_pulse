import assert from 'node:assert/strict';
import test from 'node:test';

import {
  MET_API_BASE,
  applyCareAction,
  createGalleryPet,
  createInitialCareState,
  extractObjectId,
  extractSearchQuery,
  getPetEvolution,
  getPetMood,
  normalizeMetObject,
} from './metPetModel.js';

const sampleObject = {
  objectID: 436535,
  title: 'Wheat Field with Cypresses',
  artistDisplayName: 'Vincent van Gogh',
  department: 'European Paintings',
  objectName: 'Painting',
  medium: 'Oil on canvas',
  objectDate: '1889',
  culture: '',
  period: '',
  primaryImage: 'https://images.metmuseum.org/CRDImages/ep/original/DT1567.jpg',
  primaryImageSmall: 'https://images.metmuseum.org/CRDImages/ep/web-large/DT1567.jpg',
  objectURL: 'https://www.metmuseum.org/art/collection/search/436535',
  isHighlight: true,
  isPublicDomain: true,
  GalleryNumber: '822',
  tags: [{ term: 'Landscapes' }, { term: 'Cypresses' }],
};

test('extractObjectId accepts Met object pages, API URLs, and bare ids', () => {
  assert.equal(extractObjectId('https://www.metmuseum.org/art/collection/search/436535'), 436535);
  assert.equal(extractObjectId('https://www.metmuseum.org/art/collection/search/436535?foo=bar'), 436535);
  assert.equal(extractObjectId(`${MET_API_BASE}/objects/436535`), 436535);
  assert.equal(extractObjectId('436535'), 436535);
});

test('extractObjectId rejects unsupported links without guessing', () => {
  assert.equal(extractObjectId('https://www.metmuseum.org/art/collection/search?q=cat'), null);
  assert.equal(extractObjectId('not a met url'), null);
  assert.equal(extractObjectId(''), null);
});

test('extractSearchQuery recovers search text from Met result links and plain terms', () => {
  assert.equal(extractSearchQuery('https://www.metmuseum.org/art/collection/search?q=blue%20vase'), 'blue vase');
  assert.equal(extractSearchQuery('https://www.metmuseum.org/art/collection/search#!?q=cat&offset=0'), 'cat');
  assert.equal(extractSearchQuery('wheat field'), 'wheat field');
  assert.equal(extractSearchQuery('436535'), '');
});

test('normalizeMetObject keeps the fields needed for a gallery pet', () => {
  const normalized = normalizeMetObject(sampleObject);

  assert.equal(normalized.id, 436535);
  assert.equal(normalized.title, 'Wheat Field with Cypresses');
  assert.equal(normalized.artist, 'Vincent van Gogh');
  assert.equal(normalized.displayType, 'Painting');
  assert.equal(normalized.imageUrl, sampleObject.primaryImageSmall);
  assert.deepEqual(normalized.tags, ['Landscapes', 'Cypresses']);
  assert.equal(normalized.metUrl, sampleObject.objectURL);
});

test('createGalleryPet derives deterministic personality and visual traits from the artwork', () => {
  const pet = createGalleryPet(normalizeMetObject(sampleObject));
  const repeated = createGalleryPet(normalizeMetObject(sampleObject));

  assert.equal(pet.id, 436535);
  assert.equal(pet.name, 'Cypress Sprout');
  assert.equal(pet.artist, 'Vincent van Gogh');
  assert.equal(pet.favoriteCare, 'play');
  assert.equal(pet.palette.hue, repeated.palette.hue);
  assert.equal(pet.shellPattern, repeated.shellPattern);
  assert.match(pet.lore, /European Paintings/);
});

test('applyCareAction changes only the targeted care meters and clamps values', () => {
  const initial = createInitialCareState(436535);
  const cared = applyCareAction(initial, 'feed');
  const overfed = applyCareAction({ ...cared, hunger: 98 }, 'feed');

  assert.equal(cared.hunger, initial.hunger + 14);
  assert.equal(cared.joy, initial.joy + 2);
  assert.equal(cared.shine, initial.shine);
  assert.equal(overfed.hunger, 100);
});

test('getPetMood summarizes the care state for the UI', () => {
  assert.equal(getPetMood({ hunger: 92, joy: 91, shine: 94, curiosity: 90 }).id, 'radiant');
  assert.equal(getPetMood({ hunger: 51, joy: 60, shine: 58, curiosity: 62 }).id, 'steady');
  assert.equal(getPetMood({ hunger: 18, joy: 40, shine: 36, curiosity: 42 }).id, 'wilting');
});

test('getPetEvolution grows a well-cared pet into a guardian with high health support', () => {
  const evolution = getPetEvolution(
    { hunger: 95, joy: 90, shine: 88, curiosity: 92 },
    88,
  );

  assert.equal(evolution.id, 'guardian');
  assert.equal(evolution.label, 'Guardian');
  assert.equal(evolution.strength, 90);
});

test('getPetEvolution keeps growth at bright when one care meter is lagging', () => {
  const evolution = getPetEvolution(
    { hunger: 96, joy: 92, shine: 45, curiosity: 91 },
    94,
  );

  assert.equal(evolution.id, 'bright');
  assert.equal(evolution.label, 'Bright');
  assert.equal(evolution.strength, 85);
});

test('getPetEvolution stays baby when the health score is too low to evolve', () => {
  const evolution = getPetEvolution(
    { hunger: 92, joy: 89, shine: 91, curiosity: 90 },
    20,
  );

  assert.equal(evolution.id, 'baby');
  assert.equal(evolution.label, 'Baby');
  assert.equal(evolution.strength, 65);
});
