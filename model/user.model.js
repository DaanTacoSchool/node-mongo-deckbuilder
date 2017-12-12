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
