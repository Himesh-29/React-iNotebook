// DESCRIBES THE SCHEMA OF THE USER WHICH LOGS IN OUR APP

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("user", userSchema); //creating a object/template of the schema we decided above
// User.createIndexes(); // Used to not duplicate our database with same user email
module.exports = User; //Exporting this basic template
