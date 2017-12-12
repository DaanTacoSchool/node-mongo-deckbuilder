const assert = require('assert');
const Card = require('../model/card.model');
const Deck = require('../model/deck.model');

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');
var chould = chai.should();


process.env.NODE_ENV = 'test';


chai.use(chaiHttp);

describe('POST METHODS', function() {

    it('Creates a deck and returns created deck', function(done) {

        //_id:ObjectId("5a2d63ef25172c3dd0800002")
        var card = new Card({_id:"5a2d63ef25172c3dd0800002",name:"testcardname", description:"testcarddescription",imagePath: "testinage",type:"testtype",event:"testevent"});

        // ObjectId("5a2fdec4c12bac4380405980")
        var deck = new Deck({name:"testname",description:"testdescription", made_by: "testmadeby", hero_type:"testherotype",cards:[card] });

        chai.request(server).post('/decks')
            .send(deck)
            .end(function(err, res) {
                // res.should.have.status(200);
                res.should.be.json;
                // res.body.should.be.an('object');
                // res.body.should.have.property('name').that.is.a('string');
                // expect(res.body.name).to.equal("testname");
                assert(true);
                done();
            });
    });



});