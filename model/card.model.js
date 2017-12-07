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
    name: 'murloc raider',
    description: '',
    imagePath:'https://hearthstone.gamepedia.com/media/hearthstone.gamepedia.com/thumb/e/e4/Murloc_Raider%2855%29.png/200px-Murloc_Raider%2855%29.png?version=cb311cf2b33459579485bc689d22ce4d',
    type:'murloc',
    event:''
}).save();
*/

module.exports = Card;