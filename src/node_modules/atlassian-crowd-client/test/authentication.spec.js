import assert from 'assert';
import { assertAsync, withoutPassword } from './helpers/helpers';
import settings from './helpers/settings';
import Crowd from '../src/client';
import User from '../src/models/user';

describe('Crowd authentication resource', () => {
  let crowd = new Crowd(settings.crowd);
  let user = new User('Foo', 'Test', 'Test User', 'test@example.com', 'test1', 'test');

  beforeEach((done) => {
    crowd.user.create(user).then(() => done()).catch(done);
  });

  afterEach((done) => {
    crowd.user.remove(user.username).then(() => done()).catch(done);
  });

  it('should allow authentication', (done) => {
    assertAsync(crowd.authentication.authenticate(user.username, user.password), (res) => {
      assert.deepEqual(res, withoutPassword(user));
    }).then(done, done);
  });
});
