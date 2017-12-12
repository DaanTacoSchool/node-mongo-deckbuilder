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
    console.log('add deck body: '+b.cards +' and '+ b.description);
    session.run('CREATE (user:User {made_by: "'+b.made_by+'", name: "'+ b.made_by+'" }) RETURN user LIMIT 1').then(function (result){
        console.log('result: '+result.records);
        var deck;
        result.records.forEach(function(record){
            console.log(record._fields[0].properties.made_by);
            deck = new Deck({
                name: b.name,
                description: b.description,
                made_by: record._fields[0].properties.made_by,
                hero_type: b.hero_type,
                cards: b.cards,
                userId:record._fields[0].identity.low,
            });
        });
        console.log('user: '+ result.records.toString());
        deck.save()
            .then( (deck) => res.status(200).json(deck))
    .catch((error) => { console.log(error); res.status(400).json(deck); });

    }).catch(function (error) {
        console.log(error);
    })
});

/* TODO: instead of deck in body, maybe card in body then add card to parent and save it; check nexxt line.
    https://stackoverflow.com/questions/15621970/pushing-object-into-array-schema-in-mongoose */

/* edit Deck ~/decks/$id */
routes.put('/decks/:id', function (req, res) {

    const b= req.body;

    console.log('deck-put req.body: '+req.body);
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