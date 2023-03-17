const mongoose = require('mongoose');

const mydataSchema = mongoose.Schema({
    panoId: String,
    krpanoxml: String,
});

const Xmldata = mongoose.model('Xmldata', mydataSchema);
module.exports = Xmldata;