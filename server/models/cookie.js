const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var cookieSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    // address: {
    //   type: String,
    //   required: true,
    // },
    email: {
      type: String,
      required: true,
      // unique: true,
    },
    mobile: {
      type: String,
      required: true,
      // unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Cookie", cookieSchema);
