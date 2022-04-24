import 'mocha';
import {expect} from 'chai';
import {add} from '../src/index';

describe('Sonar Test', () => {
  it('Add test', () => {
    expect(add(1)).to.be.equal(1);
  });
});
