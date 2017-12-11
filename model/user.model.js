// user.js
// User model logic.
// neo4j documentation

var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver('bolt://localhost',neo4j.auth.basic("neo4j","neo4j"));
var session = driver.session();


// Private constructor:

var User = module.exports = function User(_node) {
    // All we'll really store is the node; the rest of our properties will be
    // derivable or just pass-through properties (see below).
    this._node = _node;
}

// Public constants:

User.VALIDATION_INFO = {
    'username': {
        required: true,
        minLength: 2,
        maxLength: 16,
        pattern: /^[A-Za-z0-9_]+$/,
        message: '2-16 characters; letters, numbers, and underscores only.'
    },
};

// Public instance properties:


Object.defineProperty(User.prototype, 'username', {
    get: function () { return this._node.properties['username']; }
});


User.prototype.patch = function (props, callback) {

    var query = [
        'MATCH (user:User {username: {username}})',
        'SET user += {props}',
        'RETURN user',
    ].join('\n');

    var params = {
        username: this.username,
        props: props,
    };

    var self = this;

    db.cypher({
        query: query,
        params: params,
    }, function (err, results) {

        if (err) return callback(err);

        if (!results.length) {
            err = new Error('User has been deleted! Username: ' + self.username);
            return callback(err);
        }

        // Update our node with this updated+latest data from the server:
        self._node = results[0]['user'];

        callback(null);
    });
};

User.prototype.del = function (callback) {
    // Use a Cypher query to delete both this user and his/her following
    // relationships in one query and one network request:
    // (Note that this'll still fail if there are any relationships attached
    // of any other types, which is good because we don't expect any.)
    var query = [
        'MATCH (user:User {username: {username}})',
        'OPTIONAL MATCH (user) -[rel:follows]- (other)',
        'DELETE user, rel',
    ].join('\n')

    var params = {
        username: this.username,
    };

    db.cypher({
        query: query,
        params: params,
    }, function (err) {
        callback(err);
    });
};

// Static methods:

User.get = function (username, callback) {
    var query = [
        'MATCH (user:User {username: {username}})',
        'RETURN user',
    ].join('\n')

    var params = {
        username: username,
    };

    db.cypher({
        query: query,
        params: params,
    }, function (err, results) {
        if (err) return callback(err);
        if (!results.length) {
            err = new Error('No such user with username: ' + username);
            return callback(err);
        }
        var user = new User(results[0]['user']);
        callback(null, user);
    });
};

User.getAll = function (callback) {
    var query = [
        'MATCH (user:User)',
        'RETURN user',
    ].join('\n');

    db.cypher({
        query: query,
    }, function (err, results) {
        if (err) return callback(err);
        var users = results.map(function (result) {
            return new User(result['user']);
        });
        callback(null, users);
    });
};

// Creates the user and persists (saves) it to the db, incl. indexing it:
User.create = function (made_by,name ) {
    var query = [
        'CREATE (user:User {made_by = "'+made_by+'", name = "'+ name+'" })',
        'RETURN user',
    ].join('\n');

    session.run('CREATE (user:User {made_by: "'+made_by+'", name: "'+ name+'" }) RETURN user').then(function(result){
            console.log('result: '+result);
            return result.records;})
        .catch(function(error) { console.log(error);});
};

// Static initialization:

// Register our unique username constraint.
// TODO: This is done async'ly (fire and forget) here for simplicity,
// // but this would be better as a formal schema migration script or similar.
// db.createConstraint({
//     label: 'User',
//     property: 'username',
// }, function (err, constraint) {
//     if (err) throw err;     // Failing fast for now, by crash the application.
//     if (constraint) {
//         console.log('(Registered unique usernames constraint.)');
//     } else {
//         // Constraint already present; no need to log anything.
//     }
// })
