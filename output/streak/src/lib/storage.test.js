import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

globalThis.localStorage = {
  _d: {},
  getItem(k) { return k in this._d ? this._d[k] : null; },
  setItem(k, v) { this._d[k] = String(v); },
  removeItem(k) { delete this._d[k]; },
};

const { loadHabits, saveHabits, loadDevDate, saveDevDate } =
  await import('./storage.js');

beforeEach(() => { globalThis.localStorage._d = {}; });

test('loadHabits returns [] when nothing stored', () => {
  assert.deepEqual(loadHabits(), []);
});

test('saveHabits then loadHabits round-trips', () => {
  const habits = [{ id: 'a', name: 'Read', completedDates: ['2026-06-27'] }];
  saveHabits(habits);
  assert.deepEqual(loadHabits(), habits);
});

test('loadHabits returns [] on corrupt JSON', () => {
  globalThis.localStorage.setItem('streak.habits', '{not json');
  assert.deepEqual(loadHabits(), []);
});

test('loadHabits fills missing completedDates with []', () => {
  globalThis.localStorage.setItem(
    'streak.habits',
    JSON.stringify([{ id: 'a', name: 'Read' }]),
  );
  assert.deepEqual(loadHabits(), [
    { id: 'a', name: 'Read', completedDates: [] },
  ]);
});

test('loadHabits drops entries with no name and keeps valid ones', () => {
  globalThis.localStorage.setItem(
    'streak.habits',
    JSON.stringify([null, { foo: 1 }, { id: 'b', name: 'Walk', completedDates: ['2026-06-27'] }]),
  );
  assert.deepEqual(loadHabits(), [
    { id: 'b', name: 'Walk', completedDates: ['2026-06-27'] },
  ]);
});

test('dev date round-trips and clears with null', () => {
  saveDevDate('2026-06-30');
  assert.equal(loadDevDate(), '2026-06-30');
  saveDevDate(null);
  assert.equal(loadDevDate(), null);
});
