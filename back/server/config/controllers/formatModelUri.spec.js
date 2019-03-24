/**
 * formatModelUri unit tests
 * 1.0.1
 */

import _ from 'lodash';

import formatModelUri from './formatModelUri';

describe('formatModelUri', () => {
  it('should throw if modelUri is not a string', () => {
    expect(_.partial(formatModelUri, {})).to.throw('Model URI must be a string');
  });

  it('should return modelUri if perfect (no trim, starts with /, do not end with /)', () => {
    expect(formatModelUri('/perfect')).to.equal('/perfect');
  });

  it('should trim modelUri', () => {
    expect(formatModelUri(' /to trim ')).to.equal('/to trim');
  });

  it('should add / at start if not', () => {
    expect(formatModelUri('not start')).to.equal('/not start');
  });

  it('should remove / at end if exists', () => {
    expect(formatModelUri('/end/')).to.equal('/end');
  });
});
