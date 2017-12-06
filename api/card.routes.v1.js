//
// ./api/v1/card.routes.v1.js
//
var express = require('express');
var routes = express.Router();
var mongodb = require('../config/mongo.db');
var Card = require('../model/card.model');

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

// TODO: implement find in deck feature
/* get cards in deck route ~/cards/deck/$id */
routes.get('/cards/deck/:id', function (req, res) {
    res.contentType('application/json');
    Card.findOne({ _id: req.params.id })
        .then(function (cards) {
            res.status(200).json(cards);
        })
        .catch((error) => {
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
        ingredients: b.ingredients
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
        type: b.type
    });


/*{
        name: req.body.name,
        description: req.body.description,
        imagePath: req.body.imagePath,
        ingredients: req.body.ingredients
    }*/

    Card.findOneAndUpdate({ _id: card._id }, { $set: card }).then(() => res.status(200).json(Card))
.catch((error) => {
        res.status(400).json(error);
});

});

/* delete card ~/cards/$id */
routes.delete('/cards/:id', function (req, res) {

    Card.remove({"_id" :req.params.id})
    /* Recipe.findByIdAndRemove(req.params._id)*/
        .then( res.status(200).json('OK'))
        .catch(res.status(400).json(error));
});


module.exports = routes;