const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstName: {
    type: "string",
    required: true,
    min: 3,
    max: 50,
  },
  lastName: {
    type: "string",
    required: true,
    min: 3,
    max: 50,
  },
  email: {
    type: "string",
    required: true,
    min: 6,
  },
  password: {
    type: "string",
    required: true,
    min: 6,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("User", userSchema);
