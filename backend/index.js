//CONTROLLER
//It is the main JS file which acts as a controller

//CONNECTING TO DATABASE
let connectToMongo = require("./database"); //Importing the connectToMongo function which connects mongoose to mongoDB database
connectToMongo();

// //ADDING CORS TO OUR WEBSITE
const cors = require("cors");

//ADDING THE EXPRESS TO OUR WEBSITE
const express = require("express");
const app = express();

const rateLimit = require("express-rate-limit");

var whitelist = [process.env.FRONTEND_URL];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Something went wrong"));
    }
  },
};

// //FORCING OUR APPLICATION TO USE JSON INSTEAD OF STRING ON THE SCREEN
app.use(express.json());

//FORCING OUR APPLICATION TO USE CORS SO THAT OUR REACT APPLICATION CAN TALK WITH OUR BACKEND
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));

// To use json bodies
app.use(express.json({ limit: "300kb" }));

// API Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 5 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

//VARIOUS ENDPOINTS WE CAN LINK TO, THEY ARE PRESENT IN THE ROUTES FOLDER
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/mynotes"));

// HELPS US TO SEE WHERE OUR APP IS LISTENING TO
let port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`iNotebook backend listening at http://localhost:${port}`);
});
