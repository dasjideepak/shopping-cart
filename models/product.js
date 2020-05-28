var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var slug = require("slug");

var productSchema = new Schema({
    name:{
        type: String,        
    },
    images: {
        type: Array,
    },
    price: {
        type: Number,
    },
    warranty: {
        type: Number,
    },
    offers: {
        type: Array,
    },
    highlight: {
        type: Array,
    }
}, {timestamps: true});

module.exports = mongoose.model('Product', productSchema);