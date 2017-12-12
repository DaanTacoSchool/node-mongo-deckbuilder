const assert = require('assert');
const User = require('../src/user');

describe('deleting a user', () => { 
    let joe;

    beforeEach((done) => { 
        joe = new User({ name: 'Joe'});
        joe.save()
            .then(() => done());
    });
    //joe = model instance (easiest)
    it('model instance remove',(done) => { 
        joe.remove()
            .then(() => User.findOne({ name: 'Joe'}))
            .then((user) => { 
                assert(user ===null);
                done();
            });
    });
    //classmethod = User class
    it('class method remove',(done) => { 
    //remove bunch of records wih given vriteria
        User.remove({ name: 'Joe'})
            .then(() => User.findOne({ name: 'Joe'}))
            .then((user) => { 
                assert(user ===null);
                done();
            });
    });

    it('class method findAndRemove',(done) => { 
        User.findOneAndRemove({ name: 'Joe'})
          .then(() => User.findOne({ name: 'Joe'}))
          .then((user) => { 
              assert(user ===null);
              done();
          });
    });

    it('class method findByIdAndRemove',(done) => {
        User.findByIdAndRemove(joe._id)
          .then(() => User.findOne({ name: 'Joe'}))
          .then((user) => { 
              assert(user ===null);
              done();
          });
    });
});