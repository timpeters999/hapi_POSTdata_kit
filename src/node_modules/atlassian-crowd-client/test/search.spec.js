import assert from 'assert';
import { assertAsync, withoutPassword } from './helpers/helpers';
import settings from './helpers/settings';
import Crowd from '../src/client';
import Group from '../src/models/group';
import User from '../src/models/user';

describe('Crowd search resource', () => {
  let crowd = new Crowd(settings.crowd);
  let group = new Group('testgroup1', 'Test group');
  let user = new User('Foo', 'Test', 'Test User', 'test@example.com', 'test1', 'test');

  beforeEach((done) => {
    Promise.all([
      crowd.group.create(group),
      crowd.user.create(user)
    ]).then(() => done()).catch(done);
  });

  afterEach((done) => {
    Promise.all([
      crowd.group.remove(group.groupname),
      crowd.user.remove(user.username)
    ]).then(() => done()).catch(done);
  });

  describe('when searching for users', () => {
    it('should return a list of usernames', (done) => {
      assertAsync(crowd.search.user('firstName=Foo'), (res) => {
        assert.deepEqual(res, [user.username]);
      }).then(done, done);
    });
  });

  describe('when searching for groups', () => {
    it('should return a list of group names', (done) => {
      assertAsync(crowd.search.group('name=testgroup1'), (res) => {
        assert.deepEqual(res, [group.groupname]);
      }).then(done, done);
    });
  });

  describe('expanded search', () => {
    it('should return a list of model objects', (done) => {
      Promise.all([
        assertAsync(crowd.search.user('firstName=Foo', true), (res) => {
          assert.deepEqual(res, [withoutPassword(user)]);
        }),
        assertAsync(crowd.search.group('name=testgroup1', true), (res) => {
          assert.deepEqual(res, [group]);
        })
      ]).then(() => done(), done);
    });
  });
});
