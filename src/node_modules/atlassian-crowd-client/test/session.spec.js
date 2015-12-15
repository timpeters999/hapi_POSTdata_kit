import assert from 'assert';
import { assertAsync, withoutPassword } from './helpers/helpers';
import settings from './helpers/settings';
import Crowd from '../src/client';
import User from '../src/models/user';
import Session from '../src/models/session';
import ValidationFactors from '../src/models/validation-factors';

describe('Crowd session resource', () => {
  let crowd = new Crowd(settings.crowd);
  let user = new User('Foo', 'Test', 'Test User', 'test@example.com', 'test1', 'test');

  beforeEach((done) => {
    crowd.user.create(user).then(() => done()).catch(done);
  });

  afterEach((done) => {
    crowd.user.remove(user.username).then(() => done()).catch(done);
  });

  it('should allow creating a new session', (done) => {
    assertAsync(crowd.session.create(user.username, user.password), (res) => {
      assert(res instanceof Session);
    }).then(done, done);
  });

  it('should allow creating an unvalidated session', (done) => {
    assertAsync(crowd.session.createUnvalidated(user.username), (res) => {
      assert(res instanceof Session);
    }).then(done, done);
  });

  it('should allow fetching a user by its session token', (done) => {
    crowd.session.create(user.username, user.password).then((session) => {
      assertAsync(crowd.session.getUser(session.token), (res) => {
        assert.deepEqual(res, withoutPassword(user));
      }).then(done, done);
    });
  });

  it('should allow validating a session token', (done) => {
    crowd.session.create(user.username, user.password).then((session) => {
      assertAsync(crowd.session.validate(session.token), (res) => {
        assert(res instanceof Session);
      }).then(done, done);
    });
  });

  describe('with validation factors', () => {
    let validationFactors1 = new ValidationFactors({ 'remote_address': '127.0.0.1' });
    let validationFactors2 = new ValidationFactors({ 'remote_address': '127.0.0.2' });

    it('should validate the session when the validation factors are identical', (done) => {
      assertAsync(crowd.session.create(user.username, user.password, validationFactors1), (session) => {
        return assertAsync(crowd.session.validate(session.token, validationFactors1), (res) => {
          assert(res instanceof Session);
        });
      }).then(done, done);
    });

    it('should not validate the session when validation factors are different', (done) => {
      assertAsync(crowd.session.create(user.username, user.password, validationFactors1), (session) => {
        return assertAsync(crowd.session.validate(session.token, validationFactors2)).catch(() => {
          assert(true);
        });
      }).then(done, done);
    });
  });
});
