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


    it('create and save a deck',function (done) {
        //_id:ObjectId("5a2d63ef25172c3dd0800002")
        var card = new Card({_id:"5a2d63ef25172c3dd0800002",name:"testcardname", description:"testcarddescription",imagePath: "testinage",type:"testtype",event:"testevent"});
        // ObjectId("5a2fdec4c12bac4380405980")
        var deck = new Deck({name:"testname",description:"testdescription", made_by: "testmadeby", hero_type:"testherotype",cards:[card] });
        deck.save()
            .then(function(){
            assert(!deck.isNew);
        done();
        });
    });

    it('return specific deck by deckname',function(done) {

        //_id:ObjectId("5a2d63ef25172c3dd0800002")
        var card = new Card({_id:"5a2d63ef25172c3dd0800002",name:"testcardname", description:"testcarddescription",imagePath: "testinage",type:"testtype",event:"testevent"});
        // ObjectId("5a2fdec4c12bac4380405980")
        var deck = new Deck({name:"testdeckname001xyz",description:"testdescription", made_by: "testmadeby", hero_type:"testherotype",cards:[card] });
        deck.save()
            .then(function(){
                Deck.find({name: 'testdeckname001xyz'})
                .then(function(decks) {
                    assert(decks[0]._id.toString() === deck._id.toString());
                    done();
                });// no catch

            });// no catch
    });


    it('API returns json', function(done) {

        //_id:ObjectId("5a2d63ef25172c3dd0800002")
        var card = new Card({_id:"5a2d63ef25172c3dd0800002",name:"testcardname", description:"testcarddescription",imagePath: "testinage",type:"testtype",event:"testevent"});

        // ObjectId("5a2fdec4c12bac4380405980")
        var deck = new Deck({name:"testname",description:"testdescription", made_by: "testmadeby", hero_type:"testherotype",cards:[card] });

        chai.request(server).post('/decks')
            .send(deck)
            .end(function(err, res) {
                res.should.be.json;//whether 200 or 400 etc. this should return json
                done();
            });
    });



});