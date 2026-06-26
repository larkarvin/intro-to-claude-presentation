import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addDays, computeStreak, todayStr } from './streak.js';

test('addDays shifts across month boundary', () => {
  assert.equal(addDays('2026-01-31', 1), '2026-02-01');
  assert.equal(addDays('2026-03-01', -1), '2026-02-28');
});

test('todayStr formats a Date as YYYY-MM-DD', () => {
  assert.equal(todayStr(new Date(2026, 5, 27)), '2026-06-27');
});

test('consecutive days ending today count up', () => {
  const dates = ['2026-06-25', '2026-06-26', '2026-06-27'];
  assert.equal(computeStreak(dates, '2026-06-27'), 3);
});

test('a gap resets the streak', () => {
  const dates = ['2026-06-23', '2026-06-25', '2026-06-26', '2026-06-27'];
  assert.equal(computeStreak(dates, '2026-06-27'), 3);
});

test('today undone but yesterday done shows yesterday count', () => {
  const dates = ['2026-06-25', '2026-06-26'];
  assert.equal(computeStreak(dates, '2026-06-27'), 2);
});

test('neither today nor yesterday done is 0', () => {
  const dates = ['2026-06-20'];
  assert.equal(computeStreak(dates, '2026-06-27'), 0);
});

test('streak above the flame cap still computes true N', () => {
  const dates = Array.from({ length: 10 }, (_, i) => addDays('2026-06-27', -i));
  assert.equal(computeStreak(dates, '2026-06-27'), 10);
});
