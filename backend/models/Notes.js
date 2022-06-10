// DESCRIBES THE SCHEMA OF THE NOTES OF A PARTICULAR USER WHICH LOGS IN OUR APP

const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema(
  {
    //The field user is added to have a relationship between User table and Notes table
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    title: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    tag: {
      type: String,
      default: "General",
    },
  },
  {
    timestamps: true,
  }
);

const Note = mongoose.model("notes", notesSchema); //creating a object/template of the schema we decided above
module.exports = Note; //Exporting this basic template
