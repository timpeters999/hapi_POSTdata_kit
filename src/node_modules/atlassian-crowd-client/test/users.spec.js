import assert from 'assert';
import { assertAsync, withoutPassword } from './helpers/helpers';
import settings from './helpers/settings';
import Crowd from '../src/client';
import Attributes from '../src/models/attributes';
import Group from '../src/models/group';
import User from '../src/models/user';

describe('Crowd user resource', () => {
  let crowd = new Crowd(settings.crowd);
  let user = new User('Foo', 'Test', 'Test User', 'test@example.com', 'test1', 'test');

  beforeEach((done) => {
    crowd.user.create(user).then(() => done()).catch(done);
  });

  afterEach((done) => {
    crowd.user.remove(user.username).then(() => done()).catch(done);
  });

  it('should allow creating and removing users', (done) => {
    let newUser = new User('Baz', 'Test', 'Test User', 'test2@example.com', 'test2', 'test');

    assertAsync(crowd.user.create(newUser), (res) => {
      assert.deepEqual(res, withoutPassword(newUser));

      return assertAsync(crowd.user.remove(newUser.username), () => {
        assert.ok(true);
      });
    }).then(done, done).catch(done);
  });

  it('should allow fetching users', (done) => {
    assertAsync(crowd.user.get(user.username), (res) => {
      assert.deepEqual(res, withoutPassword(user));
    }).then(done).catch(done);
  });

  it('should allow updating users', (done) => {
    let changedUser = new User('Bar', 'Test', 'Test User', 'test@example.com', 'test1', 'test');

    assertAsync(crowd.user.update(user.username, changedUser), (res) => {
      assert.deepEqual(res, withoutPassword(changedUser));
    }).then(done).catch(done);
  });

  describe('attributes', () => {
    let attributes = new Attributes({
      foo: 'Foo',
      bar: ['Bar', 'Baz'],
      obj: { a: 'A' }
    });

    beforeEach((done) => {
      crowd.user.attributes.set(user.username, attributes).then(() => done()).catch(done);
    });

    afterEach((done) => {
      let removals = [];
      for (var key in attributes) {
        if (attributes.hasOwnProperty(key)) {
          removals.push(crowd.user.attributes.remove(user.username, key));
        }
      }
      Promise.all(removals).then(() => done()).catch(done);
    });

    it('should allow setting and removing attributes', (done) => {
      let newAttributes = new Attributes({
        foo: 'FOO',
        bar: ['Bar'],
        obj: { b: 'B' }
      });

      assertAsync(crowd.user.attributes.set(user.username, newAttributes), (res) => {
        assert.deepEqual(res, newAttributes);

        return assertAsync(crowd.user.attributes.list(user.username), (res2) => {
          assert.deepEqual(res2, newAttributes);
        });
      }).then(done).catch(done);
    });

    it('should allow listing attributes', (done) => {
      assertAsync(crowd.user.attributes.list(user.username), (res) => {
        assert.deepEqual(res, attributes);
      }).then(done).catch(done);
    });
  });

  describe('password', () => {
    it('should allow setting a new password', (done) => {
      assertAsync(crowd.user.password.set(user.username, 'newpass'), () => {
        assert.ok(true);
      }).then(done).catch(done);
    });

    it('should allow requesting a password reset email', (done) => {
      assertAsync(crowd.user.password.reset(user.username), () => {
        assert.ok(true);
      }).then(done).catch(done);
    });
  });

  describe('username', () => {
    it('should allow requesting a username reminder email', (done) => {
      assertAsync(crowd.user.username.request(user.email), () => {
        assert.ok(true);
      }).then(done).catch(done);
    });
  });

  describe('groups', () => {
    let group1 = new Group('group1', '');
    let group2 = new Group('group2', '');
    let group3 = new Group('group3', '');

    beforeEach((done) => {
      Promise.all([
        crowd.group.create(group1).then(group => crowd.user.groups.add(user.username, group.groupname)),
        crowd.group.create(group2).then(group => crowd.user.groups.add(user.username, group.groupname)),
        crowd.group.create(group3)
      ]).then(() => done()).catch(done);
    });

    afterEach((done) => {
      Promise.all([
        crowd.group.remove(group1.groupname),
        crowd.group.remove(group2.groupname),
        crowd.group.remove(group3.groupname)
      ]).then(() => done()).catch(done);
    });

    it('should allow checking group membership', (done) => {
      Promise.all([
        assertAsync(crowd.user.groups.get(user.username, group1.groupname), (res) => {
          assert.equal(res, group1.groupname);
        }),
        assertAsync(crowd.user.groups.get(user.username, group3.groupname), () => {}).catch(() => {
          assert.ok(true);
        })
      ]).then(() => done()).catch(done);
    });

    it('should allow listing user group names', (done) => {
      assertAsync(crowd.user.groups.list(user.username), (res) => {
        assert.deepEqual(res, [group1.groupname, group2.groupname]);
      }).then(done).catch(done);
    });

    it('should allow adding a user to a group', (done) => {
      crowd.user.groups.add(user.username, group3.groupname).then(() => {
        assertAsync(crowd.user.groups.list(user.username), (res) => {
          assert.deepEqual(res, [group1.groupname, group2.groupname, group3.groupname]);
        }).then(done).catch(done);
      });
    });

    it('should allow removing a user from a group', (done) => {
      crowd.user.groups.remove(user.username, group2.groupname).then(() => {
        assertAsync(crowd.user.groups.list(user.username), (res) => {
          assert.deepEqual(res, [group1.groupname]);
        }).then(done).catch(done);
      });
    });
  });
});
