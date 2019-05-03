var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PeopleData = new Schema({
    name: {
        type: String,
        required: true,
        max: 100,
        default: 'unknown'
    },
    position: {
        type: String,
        max: 1000,
        default: 'unknown'
    },
    education: {
        type: String,
        required: true,
        max: 100,
        default: 0
    },
    thought:{
        type: String,
        max: 400,
        required: true,
    },
    image: {
        data: {
            type: Buffer,
        },
        contentType: {
            type: String,
            max: 15,
            default: 'png'
        }
    }
    
});


//Export model
module.exports = mongoose.model(' ', PeopleData);
