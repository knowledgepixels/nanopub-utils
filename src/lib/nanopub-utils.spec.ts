// import {test} from 'jest';
import {expect, test} from '@jest/globals';

import {double} from './nanopub-utils';

// test('double', t => {
// t.is(double(2), 4);
// });

test('double', () => {
  expect(double(2)).toBe(4);
});
