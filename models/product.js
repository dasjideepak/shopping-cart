var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var slug = require("slug");

var productSchema = new Schema({
    name: { type: String },
    images: { type: String },
    price: { type: Number },
    description: { type: String },
}, {timestamps: true});

module.exports = mongoose.model('Product', productSchema);