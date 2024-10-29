const mongoose = require("mongoose");

const userModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      
    },
    profilePic: {
        type: String,
        default: "https://api.dicebear.com/avatars/initials/1234.svg",
    },
    events: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userModel);
module.exports = User;
