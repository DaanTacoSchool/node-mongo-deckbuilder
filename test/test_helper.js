const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

before((done) => {
    mongoose.connect('mongodb://localhost:3000/api/v1');
    mongoose.connection
    .once('open',() => { done(); })
    .on('error',(error)=> {
        console.warn('warning',error);
    });// console.log('good to go')
});

// beforeEach((done)=> {
//     mongoose.connection.collections.de.drop( () => {
//         //ready to run next test
//         done();
//     });
// });
