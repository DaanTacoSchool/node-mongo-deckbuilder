const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CardSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    imagePath: String,
    type: String,
    event: String
}, {
    timestamps: true
});


const Card = mongoose.model('card', CardSchema);

// Add a 'dummy' card (every time you require this file!)
/*
const card = new Card({
    name: 'Fireguard Destroyer',
    description: 'Battlecry: gain 1-4 attack. Overload (1)',
    imagePath:'http://media-hearth.cursecdn.com/avatars/328/299/14455.png',
    type:'Elemental',
    event:'Battlecry, Overload'
}).save();
*/

module.exports = Card;