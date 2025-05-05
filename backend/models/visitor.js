const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema({
  count: {
    type: Number,
    default: 0
  }
});

module.exports = (conn) => conn.model("Visitor", visitorSchema);
