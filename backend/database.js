//DATABASE PART - LINKING MONGOOSE WITH OUR MONGODB DATABASE
let mongoose = require("mongoose");
require("dotenv").config();

let mongoURI = process.env.MONGO_URL;
let connectToMongo = () => {
  mongoose.connect(mongoURI, () => {
    console.log("Connected successfully");
  });
  mongoose.connection.on("error", (err) => {
    console.log(err);
  });
};

module.exports = connectToMongo;
  