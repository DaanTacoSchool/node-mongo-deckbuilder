const assert = require('assert');
const Card = require('../model/card.model');
const Deck = require('../model/deck.model');

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');
var chould = chai.should();


process.env.NODE_ENV = 'test';


chai.use(chaiHttp);
//wrong file
// describe('Retreiving cards', () => {
//     it('retreives a card from mongo',(done) => {
//     const joe = new User({ name: 'Joe' });
//
//     joe.save()
//         .then(() => {
//         //has joe been saved succesfullu?
//         assert(!joe.isNew);//when saved he isnt new anymore
//     done();
// });
// });
// });


describe('POST METHODS', function() {

    // it('creates a deck', function(done) {
    //     chai.request(require('../server.js'))
    //         .get('/api/v1/todos')
    //         .end(function(err, res) {
    //             res.should.have.status(401);
    //             res.should.be.json;
    //             res.body.should.be.a('object');
    //             res.body.should.have.property('message').equal('No authorization token was found');
    //             res.body.should.have.property('name').equal('UnauthorizedError');
    //             done();
    //         });
    // });

    it('Creates a deck and returns created deck', function(done) {

        var card = new Card({_id:ObjectId("5a2d63ef25172c3dd0800002"), name:"testcardname", description:"testcarddescription",imagePath: "testinage",type:"testtype",event:"testevent"});

        var deck = new Deck({name:"testname",description:"testdescription", made_by: "testmadeby", hero_type:"testherotype",cards:[card] });

        chai.request(server).post('/decks')
            .send(deck)
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.an('object');
                res.body.should.have.property('name').that.is.a('string');
                expect(res.body.name).to.equal("testname");
                assert(true);
                done();
            });
    });




    it('returns an error on POST /api/v1/login with invalid credentials ', function(done) {
        var user = {
            username: "invalid"
        }
        chai.request(require('../server.js'))
            .post('/api/v1/login')
            .send(user)
            .end(function(err, res) {
                res.should.have.status(401);
                res.should.be.json;
                res.body.should.be.an('object');
                res.body.should.have.property('error').that.is.a('string');
                res.body.error.should.equal('Invalid credentials, bye')
                done();
            });
    });

    it('returns a token on POST /api/v1/login', function(done) {
        var user = {
            username: "username",
            password: "password"
        }
        chai.request(server)
            .post('/api/v1/login')
            .send(user)
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.an('object');
                res.body.should.have.property('token').that.is.a('string');
                done();
            });
    });

});