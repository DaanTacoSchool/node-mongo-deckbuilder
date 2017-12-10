//
// ./api/v1/card.routes.v1.js
//
var express = require('express');
var routes = express.Router();
var mongodb = require('../config/mongo.db');
var Card = require('../model/card.model');
var Deck = require('../model/deck.model');

/* get all cards ~/cards */
routes.get('/cards', function (req, res) {
    res.contentType('application/json');

    Card.find({})
        .then(function (cards) {
            res.status(200).json(cards);
        })
        .catch((error) => {
        res.status(400).json(error);
        });
});

/* get single card by id ~/cards/$id */
routes.get('/cards/:id', function (req, res) {
    res.contentType('application/json');
    Card.findOne({ _id: req.params.id })
        .then(function (cards) {
            res.status(200).json(cards);
        })
        .catch((error) => {
        res.status(400).json(error);
    });
});


/* get cards in deck route ~/cards/deck/$id */
routes.get('/cards/deck/:id', function (req, res) {
    res.contentType('application/json');
    // deck -> find deck by id
    // then use deck.cards to get all card ids and proceed to find the card with that id. add to resultset and return.
    Deck.findOne({ _id: req.params.id })
        .then((decks) => {
            Card.find({ "_id": { "$in": decks.cards }}).then((cards)=> { res.status(200).json(cards); }).catch((error)=>{console.log(error);});
         }).catch((error) => {
        console.log(error);
            res.status(400).json(error);
        });

});


/* add card ~/cards */
routes.post('/cards', function (req, res) {
    const b = req.body;

    const card = new Card({
        name: b.name,
        description: b.description,
        imagePath: b.imagePath,
        type: b.type,
        event: b.event
    });
    card.save()
        .then( () => res.status(200).json(card))
        .catch((error) => res.status(400).json(card));

});

/* edit card ~/cards/$id */
routes.put('/cards/:id', function (req, res) {
    const b= req.body;
    const card = new Card({
        _id: b._id,
        name: b.name,
        description: b.description,
        imagePath: b.imagePath,
        type: b.type,
        event: b.event
    });

    Card.findOneAndUpdate({ _id: card._id }, { $set: card }).then(() => res.status(200).json(Card))
    .catch((error) => {
        res.status(400).json(error);
    });

});

/* delete card ~/cards/$id */
routes.delete('/cards/:id', function (req, res) {

    Card.remove({"_id" :req.params.id})
        .then( res.status(200).json('OK'))
        .catch(res.status(400).json(error));
});

routes.post('/cards/search/:search', function(req, res) {

    Card.find({ $text: { $search: req.params.search } } )
        .then(function (cards) {
            res.status(200).json(cards);
        })
        .catch((error) => {
        res.status(400).json(error);
});

});

module.exports = routes;