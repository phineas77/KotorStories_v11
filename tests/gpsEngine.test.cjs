const test = require('node:test');
const assert = require('node:assert/strict');
const { evaluateTrigger, emptyTriggerState } = require('../.test-build/gpsEngine.js');
const stop = { id:'sea-gate', latitude:42.4248, longitude:18.7714, radiusMeters:28 };
const now = 1_800_000_000_000;
const fix = (time, overrides={}) => ({latitude:stop.latitude, longitude:stop.longitude, accuracyMeters:8, timestamp:time, ...overrides});
test('two sequential accurate fixes trigger once', () => {
  const a = evaluateTrigger(emptyTriggerState(), fix(now), stop, now);
  assert.equal(a.triggered, false);
  const b = evaluateTrigger(a.state, fix(now + 1100), stop, now + 1100);
  assert.equal(b.triggered, true);
  assert.equal(b.state.count, 0);
});
test('one fix is not enough', () => assert.equal(evaluateTrigger(emptyTriggerState(), fix(now), stop, now).reason,'first-fix'));
test('same timestamp cannot trigger', () => {
  const a = evaluateTrigger(emptyTriggerState(), fix(now), stop, now);
  assert.equal(evaluateTrigger(a.state, fix(now), stop, now).reason, 'too-soon');
});
test('inaccurate fix clears the candidate', () => {
  const a = evaluateTrigger(emptyTriggerState(), fix(now), stop, now);
  const b = evaluateTrigger(a.state, fix(now+1000, { accuracyMeters: 65 }), stop, now+1000);
  assert.equal(b.reason, 'inaccurate');
  assert.equal(b.state.count, 0);
});
test('outside zone never triggers', () => {
  assert.equal(evaluateTrigger(emptyTriggerState(), fix(now,{ latitude:42.4278 }), stop, now).reason,'outside');
});
test('stale position never triggers', () => {
  assert.equal(evaluateTrigger(emptyTriggerState(), fix(now-30000), stop, now).reason, 'stale');
});
test('changing the target requires new two fixes', () => {
  const a = evaluateTrigger(emptyTriggerState(), fix(now), stop, now);
  const second = { ...stop, id:'another' };
  assert.equal(evaluateTrigger(a.state,fix(now+1000),second,now+1000).triggered,false);
});
