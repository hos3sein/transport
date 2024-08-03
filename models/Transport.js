const mongoose = require("mongoose");

const TransportSchema = new mongoose.Schema(
  {
    user: {
      _id: { type: mongoose.Schema.ObjectId },
      username: { type: String },
      pictureProfile: { type: String },
      phone: { type: String },
    },

    group: {
      type: String,
    },

    companyName: {
      type: String,
    },

    companyLicensePhoto: {
      type: String,
    },

    companyAddress: [
      {
        address: { type: String },
        nameAddress: { type: String },
        latitude: { type: Number },
        longitude: { type: Number },
        target: { type: Number },
        city: { type: String },
        province: { type: String },
        district: { type: String },
        street: { type: String },
        country: { type: String },
        streetNumber: { type: String },
        _id: false,
      },
    ],

    deals: [
      {
        val: { type: Number },
        selected:{type:Boolean}
      },
    ],

    idCard: {
      type: String,
    },

    idCardPhoto: {
      type: String,
    },

    profileCompany: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transport", TransportSchema);
