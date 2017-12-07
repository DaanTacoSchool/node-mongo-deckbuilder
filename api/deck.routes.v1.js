//
// ./api/v1/Deck.routes.v1.js
//
var express = require('express');
var routes = express.Router();
var mongodb = require('../config/mongo.db');
var Deck = require('../model/deck.model');

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

    const deck = new Deck({
        name: b.name,
        description: b.description,
        made_by: b.made_by,
        cards: b.cards
    });
    Deck.save()
        .then( () => res.status(200).json(deck))
.catch((error) => res.status(400).json(deck));

});

/* TODO: instead of deck in body, maybe card in body then add card to parent and save it; check next line.
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
        cards: b.cards
    });

    Deck.findOneAndUpdate({ _id: deck._id }, { $set: deck }).then(() => res.status(200).json(deck))
        .catch((error) => {
        res.status(400).json(error);
    });
});

/* delete Deck ~/decks/$id */
routes.delete('/decks/:id', function (req, res) {

    Deck.remove({"_id" :req.params.id})
    /* Recipe.findByIdAndRemove(req.params._id)*/
        .then( res.status(200).json('OK'))
        .catch(res.status(400).json(error));
});


module.exports = routes;