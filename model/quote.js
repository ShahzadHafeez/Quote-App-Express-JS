const mongoose = require("mongoose");

const quoteSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    min: 3,
    max: 50,
  },
  lastName: {
    type: String,
    required: true,
    min: 3,
    max: 50,
  },
  organizationName: {
    type: String,
    required: true,
    min: 3,
    max: 50,
  },
  email: {
    type: String,
    required: true,
    min: 6,
  },
  phone: {
    type: String,
    required: true,
    min: 9,
  },
  services: [
    {
      type: String,
      required: true,
    },
  ],
  sizeOfLown: {
    type: String,
    required: true,
  },
  additionalRequest: {
    type: String,
    required: false,
  },
  dateFrom: {
    type: Date,
    required: true,
  },
  dateTo: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date().setHours(0, 0, 0, 0),
  },
});

module.exports = mongoose.model("Quote", quoteSchema);
