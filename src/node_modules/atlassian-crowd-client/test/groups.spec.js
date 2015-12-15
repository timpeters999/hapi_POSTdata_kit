import assert from 'assert';
import { assertAsync } from './helpers/helpers';
import settings from './helpers/settings';
import Crowd from '../src/client';
import Attributes from '../src/models/attributes';
import Group from '../src/models/group';
import User from '../src/models/user';

describe('Crowd group resource', () => {
  let crowd = new Crowd(settings.crowd);
  let group = new Group('testgroup1', 'Test group');

  beforeEach((done) => {
    crowd.group.create(group).then(() => done()).catch(done);
  });

  afterEach((done) => {
    crowd.group.remove(group.groupname).then(done).catch(done);
  });

  it('should allow creating and removing groups', (done) => {
    let newGroup = new Group('testgroup2', 'Test group');

    assertAsync(crowd.group.create(newGroup), (res) => {
      assert.deepEqual(res, newGroup);

      return assertAsync(crowd.group.remove(newGroup.groupname), () => {
        assert.ok(true);
      });
    }).then(done, done).catch(done);
  });

  it('should allow fetching groups', (done) => {
    assertAsync(crowd.group.get(group.groupname), (res) => {
      assert.deepEqual(res, group);
    }).then(done).catch(done);
  });

  it('should allow updating groups', (done) => {
    let changedGroup = new Group('testgroup1', 'Foobar');

    assertAsync(crowd.group.update(group.groupname, changedGroup), (res) => {
      assert.deepEqual(res, changedGroup);
    }).then(done).catch(done);
  });

  describe('attributes', () => {
    let attributes = new Attributes({
      foo: 'Foo',
      bar: ['Bar', 'Baz'],
      obj: { a: 'A' }
    });

    beforeEach((done) => {
      crowd.group.attributes.set(group.groupname, attributes).then(() => done()).catch(done);
    });

    afterEach((done) => {
      let removals = [];
      for (var key in attributes) {
        if (attributes.hasOwnProperty(key)) {
          removals.push(crowd.group.attributes.remove(group.groupname, key));
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

      assertAsync(crowd.group.attributes.set(group.groupname, newAttributes), (res) => {
        assert.deepEqual(res, newAttributes);

        return assertAsync(crowd.group.attributes.list(group.groupname), (res2) => {
          assert.deepEqual(res2, newAttributes);
        });
      }).then(done).catch(done);
    });

    it('should allow listing attributes', (done) => {
      assertAsync(crowd.group.attributes.list(group.groupname), (res) => {
        assert.deepEqual(res, attributes);
      }).then(done).catch(done);
    });

    it('should reject large attribute values', (done) => {
      let largeAttributes = new Attributes({
        foo: 'Aliquam laoreet ultricies neque, non sollicitudin diam euismod et. Suspendisse volutpat et velit quis scelerisque. Sed elit diam, accumsan ut facilisis id, gravida in justo. Maecenas dolor dolor, volutpat vel nunc eget, vehicula convallis lorem. Praelol',
        bar: ['Aliquam laoreet ultricies neque, non sollicitudin diam euismod et. Suspendisse volutpat et velit quis scelerisque. Sed elit diam, accumsan ut facilisis id, gravida in justo. Maecenas dolor dolor, volutpat vel nunc eget, vehicula convallis lorem. Praesent aliquet, dui nec iaculis dignissim, sapien mauris sodales ex, ut tempus sem turpis sit amet sem.']
      });

      assertAsync(crowd.group.attributes.set(group.groupname, largeAttributes)).then(() => {}, (e) => {
        assert.equal(e, 'Error: Attribute bar is too large. Values can be no larger than 255 characters after JSON encoding.');
        done();
      }).catch(done);
    });
  });

  describe('users', () => {
    let user1 = new User('test', 'test', 'test', 'test@example.com', 'test1', 'test');
    let user2 = new User('test', 'test', 'test', 'test@example.com', 'test2', 'test');
    let user3 = new User('test', 'test', 'test', 'test@example.com', 'test3', 'test');

    beforeEach((done) => {
      Promise.all([
        crowd.user.create(user1).then(user => crowd.group.users.add(group.groupname, user.username)),
        crowd.user.create(user2).then(user => crowd.group.users.add(group.groupname, user.username)),
        crowd.user.create(user3)
      ]).then(() => done()).catch(done);
    });

    afterEach((done) => {
      Promise.all([
        crowd.user.remove(user1.username),
        crowd.user.remove(user2.username),
        crowd.user.remove(user3.username)
      ]).then(() => done()).catch(done);
    });

    it('should allow checking group membership', (done) => {
      Promise.all([
        assertAsync(crowd.group.users.get(group.groupname, user1.username), () => {
          assert.ok(true);
        }),
        assertAsync(crowd.user.groups.get(group.groupname, user3.username), () => {}).catch(() => {
          assert.ok(true);
        })
      ]).then(() => done()).catch(done);
    });

    it('should allow listing group member usernames', (done) => {
      assertAsync(crowd.group.users.list(group.groupname), (res) => {
        assert.deepEqual(res, [user1.username, user2.username]);
      }).then(done).catch(done);
    });

    it('should allow adding a user to a group', (done) => {
      crowd.group.users.add(group.groupname, user3.username).then(() => {
        assertAsync(crowd.group.users.list(group.groupname), (res) => {
          assert.deepEqual(res, [user1.username, user2.username, user3.username]);
        }).then(done).catch(done);
      });
    });

    it('should allow removing a user from a group', (done) => {
      crowd.group.users.remove(group.groupname, user2.username).then(() => {
        assertAsync(crowd.group.users.list(group.groupname), (res) => {
          assert.deepEqual(res, [user1.username]);
        }).then(done).catch(done);
      });
    });
  });

  describe('parents', () => {
    if (!settings.crowd.nesting) {
      return;
    }

    let parent1 = new Group('testparent1', 'Test parent group');
    let parent2 = new Group('testparent2', 'Test parent group');

    beforeEach((done) => {
      Promise.all([
        crowd.group.create(parent1).then(() => crowd.group.parents.add(group.groupname, parent1.groupname)),
        crowd.group.create(parent2)
      ]).then(() => done()).catch(done);
    });

    afterEach((done) => {
      Promise.all([
        crowd.group.remove(parent1.groupname),
        crowd.group.remove(parent2.groupname)
      ]).then(() => done()).catch(done);
    });

    it('should allow listing parent groups', (done) => {
      assertAsync(crowd.group.parents.list(group.groupname), (res) => {
        assert.deepEqual(res, [parent1.groupname]);
      }).then(done).catch(done);
    });

    it('should allow adding a parent group', (done) => {
      crowd.group.parents.add(group.groupname, parent2.groupname).then(() => {
        assertAsync(crowd.group.parents.list(group.groupname), (res) => {
          assert.deepEqual(res, [parent1.groupname, parent2.groupname]);
        }).then(done).catch(done);
      });
    });
  });

  describe('children', () => {
    if (!settings.crowd.nesting) {
      return;
    }

    let child1 = new Group('testchild1', 'Test child group');
    let child2 = new Group('testchild2', 'Test child group');

    beforeEach((done) => {
      Promise.all([
        crowd.group.create(child1).then(() => crowd.group.children.add(group.groupname, child1.groupname)),
        crowd.group.create(child2)
      ]).then(() => done()).catch(done);
    });

    afterEach((done) => {
      Promise.all([
        crowd.group.remove(child1.groupname),
        crowd.group.remove(child2.groupname)
      ]).then(() => done()).catch(done);
    });

    it('should allow listing child groups', (done) => {
      assertAsync(crowd.group.children.list(group.groupname), (res) => {
        assert.deepEqual(res, [child1.groupname]);
      }).then(done).catch(done);
    });

    it('should allow adding a child group', (done) => {
      crowd.group.children.add(group.groupname, child2.groupname).then(() => {
        assertAsync(crowd.group.children.list(group.groupname), (res) => {
          assert.deepEqual(res, [child1.groupname, child2.groupname]);
        }).then(done).catch(done);
      });
    });
  });

  it('should allow fetching full details of all group memberships', (done) => {
    assertAsync(crowd.group.membership(), () => {
      assert.ok(true);
    }).then(done).catch(done);
  });
});
