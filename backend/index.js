//CONTROLLER
//It is the main JS file which acts as a controller

//CONNECTING TO DATABASE
let connectToMongo = require("./database"); //Importing the connectToMongo function which connects mongoose to mongoDB database
connectToMongo();

//ADDING THE EXPRESS TO OUR WEBSITE
const express = require("express");
const app = express();

//FORCING OUR APPLICATION TO USE JSON INSTEAD OF STRING ON THE SCREEN
app.use(express.json());

//FORCING OUR APPLICATION TO USE CORS SO THAT OUR REACT APPLICATION CAN TALK WITH OUR BACKEND
app.use(cors());

//VARIOUS ENDPOINTS WE CAN LINK TO, THEY ARE PRESENT IN THE ROUTES FOLDER
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/mynotes"));

// HELPS US TO SEE WHERE OUR APP IS LISTENING TO
let port=5000;
app.listen(port, () => {
  console.log(`iNotebook backend listening at http://localhost:5000`);
});
