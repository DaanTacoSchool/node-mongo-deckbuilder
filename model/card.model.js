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

const card = new Card({
    name: 'target dummy',
    description: 'taunt',
    imagePath:'http://media-hearth.cursecdn.com/avatars/149/57/12288.png',
    type:'minion',
    event:'taunt'
}).save();


module.exports = Card;