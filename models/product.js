var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var slug = require("slug");

var productSchema = new Schema({
    name:{  type: String },
    images: { type: Array },
    price: { type: Number },
    offers: { type: Array },
    description: []
}, {timestamps: true});

module.exports = mongoose.model('Product', productSchema);