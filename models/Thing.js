const mongoose = require('mongoose');

const thingSchema = mongoose.Schema({
  email: { type: String, required: true },
  mot_de_passe: { type: String, required: true },

});

module.exports = mongoose.model('Thing', thingSchema);