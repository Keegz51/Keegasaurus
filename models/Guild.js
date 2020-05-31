const {Schema, model} = require('mongoose');

const Guild = Schema({

    id: String,
    prefix: {
        default: '?',
        type: String
    },

    demerits: Number,
    prefix: {
        default: '?',
        type: Number
    }
});

module.exports = model('Guild', Guild);