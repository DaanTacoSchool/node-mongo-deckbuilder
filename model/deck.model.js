const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Card = mongoose.model('card');
//var Card = require('./card');

const DeckSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    made_by: String,
    hero_type: String,
    cards: [{type: mongoose.Schema.Types.ObjectId, ref: 'Card'}]
}, {
    timestamps: true
});


const Deck = mongoose.model('deck', DeckSchema);

// Add a 'dummy' card (every time you require this file!)
/*
const card = new Card({
    name: 'target dummy',
    description: 'taunt',
    imagePath:'http://media-hearth.cursecdn.com/avatars/149/57/12288.png',
    type:'mech',
    event:'taunt'
});


var cardarray= [card,card,card,card,card];
const deck = new Deck({
    name: 'target dummy deck',
    description: 'for testing purposes',
    made_by:'Daan',
    hero_type: 'warrior',
    cards: cardarray
}).save();
*/
module.exports = Deck;