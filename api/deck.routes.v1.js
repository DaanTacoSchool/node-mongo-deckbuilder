//
// ./api/v1/Deck.routes.v1.js
//
var express = require('express');
var routes = express.Router();
var mongodb = require('../config/mongo.db');
var Deck = require('../model/deck.model');
var neo4j = require('neo4j-driver').v1;

var driver = neo4j.driver('bolt://hobby-fgnnmjnckhclgbkeioopeial.dbs.graphenedb.com:24786',neo4j.auth.basic("heroku-user","b.xRXKM5qHdFN7.MZiHqh0HQmrORtWI"));
//var driver = neo4j.driver('bolt://localhost',neo4j.auth.basic("neo4j","neo4j"));
var session = driver.session();
var debug = false;


/* get all decks ~/decks */
routes.get('/decks', function (req, res) {
    res.contentType('application/json');

    Deck.find({})
        .then(function (decks) {
            res.status(200).json(decks);
        })
        .catch((error) => {
        res.status(400).json(error);
        });
});

/* get single Deck by id ~/decks/$id */
routes.get('/decks/:id', function (req, res) {
    res.contentType('application/json');
    Deck.findOne({ _id: req.params.id })
        .then(function (decks) {
            res.status(200).json(decks);
        })
        .catch((error) => {
        res.status(400).json(error);
        });
});

// TODO: deprc. dit is exact hetzelfde as deck by id
/* get decks in deck route ~/decks/deck/$id */
routes.get('/decks/deck/:id', function (req, res) {
    res.contentType('application/json');
    Deck.findOne({ _id: req.params.id })
        .then(function (decks) {
            res.status(200).json(decks);
        })
        .catch((error) => {
        res.status(400).json(error);
    });
});

/* add Deck ~/decks */
routes.post('/decks', function (req, res) {
    const b = req.body;
    debug?console.log('add deck body: '+b.cards +' and '+ b.description):false;
    var deck;
    //Match(n:User) Where ID(n) = 1 Create (b:Deck {mongodb_id: ,name: 'test',made_by: n.made_by, description: 'test', hero_type: 'test', cards:['test','test'], userId: ID(n)})<-[rel:Made]-(n)
   if(b.userId){
       debug?console.log('new eck existing user'):false;
     //  deck = new Deck(b);
       deck = new Deck({
           name: b.name,
           description: b.description,
           made_by: b.made_by,
           hero_type: b.hero_type,
           cards: b.cards,
           userId: b.userId,
       });
       debug?console.log(deck):false;

       deck.save()
           .then(function(deck){
               debug?console.log(deck._id):false;
                var query = "Match(n:User) Where ID(n) = "+deck.userId+" Create (b:Deck {mongodb_id: '"+deck._id+"' ,name: '"+deck.name+"',made_by: '"+deck.made_by+"', description: '"+deck.description+"', hero_type: '"+deck.hero_type+"', cards: [''], userId: ID(n)})<-[rel:Made]-(n)";
                session.run(query).then(function (result) {
                    debug?console.log(result):false;
                }).catch(function (error) {debug?console.log(error):false;});
               res.status(200).json(deck);})
           .catch(function(error){debug?console.log(error):false;res.status(400).json(deck); });
      // deck = b;
    /*   deck = new Deck({

           name: b.name,
           description: b.description,
           made_by: b.made_by,
           hero_type: b.hero_type,
           cards: b.cards,
           userId: b.userId
       });*/

   }else { // create new user along with deck
       session.run('CREATE (user:User {made_by: "' + b.made_by + '", name: "' + b.made_by + '" }) RETURN user LIMIT 1').then(function (result) {
           debug?console.log('result: ' + result.records):false;

           result.records.forEach(function (record) {
               debug?console.log(record._fields[0].properties.made_by):false;
               deck = new Deck({
                   name: b.name,
                   description: b.description,
                   made_by: record._fields[0].properties.made_by,
                   hero_type: b.hero_type,
                   cards: b.cards,
                   userId: record._fields[0].identity.low,
               });
           });
           debug?console.log('user: ' + result.records.toString()):false;
           deck.save()
               .then(function(deck){res.status(200).json(deck);}).catch(function(error){debug?console.log(error):false;res.status(400).json(deck); });
       }).catch(function (error) {
           debug?console.log(error):false;
       });
   }
});

/* TODO: instead of deck in body, maybe card in body then add card to parent and save it; check nexxt line.
    https://stackoverflow.com/questions/15621970/pushing-object-into-array-schema-in-mongoose */

/* edit Deck ~/decks/$id */
routes.put('/decks/:id', function (req, res) {

    const b= req.body;

    debug?console.log('deck-put req.body: '+req.body):false;
    const deck = new Deck({
        _id: b._id,
        name: b.name,
        description: b.description,
        made_by: b.made_by,
        hero_type: b.hero_type,
        cards: b.cards,
        userId: b.userId,
    });

    Deck.findOneAndUpdate({ _id: deck._id }, { $set: deck }).then(() => res.status(200).json(deck))
        .catch((error) => {
        res.status(400).json(error);
    });
});

/* delete Deck ~/decks/$id */
routes.delete('/decks/:id', function (req, res) {

    Deck.remove({"_id" :req.params.id})
        .then( res.status(200).json('OK'))
        .catch(res.status(400).json(error));
});



module.exports = routes;