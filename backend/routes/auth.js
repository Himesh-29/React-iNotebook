//ROUTE TO AUTHENTICATE SIGNUP USER

const express = require("express");
const router = express.Router(); // We need to use router to link our route present here in the index.js
const { body, validationResult } = require("express-validator"); // We are using express-validator here to validate our fields easily
const bcrypt = require("bcryptjs"); //Used to hash passwords of the user
const jwt = require("jsonwebtoken"); //Helps you to ensure secure connection b/w client and server

const User = require("../models/User"); // Importing the basic template of User from the models

const { JWT_SECRET } = require("../config");

const fetchuser = require("../middleware/fetchUserDetails");

// CREATING A NEW USER
// POST REQUEST
router.post(
  "/createnewuser", // Absolute URL: http://localhost:5000/api/auth/createnewuser
  [
    body("name", "Enter a valid name").isLength({ min: 3 }), // For field 'name', we are given constraints of having minimum length of 3, and display error message 'Enter a valid name' when it is not fulfilled
    body("email", "Enter a valid email").isEmail(), // For field 'email', we are given constraints of being an email, and display error message 'Enter a valid email' when it is not fulfilled
    body("password", "Password must be atleast 6 characters").isLength({
      min: 6,
    }), // For field 'password', we are given constraints of having minimum length of 6, and display error message 'Password must be atleast 6 characters' when it is not fulfilled
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req); //Validating the request body for any errors
    if (!errors.isEmpty()) {
      // When there are errors
      return res.status(400).json({ success, errors: errors.array() }); // Give a status code of 400 and a JSON object containing array logs of errors
    }
    try {
      let user = await User.findOne({ email: req.body.email }); // Finding a user with the email address as provided in the body of request
      if (user) {
        //If there exist a user in the db
        return res.status(400).json({
          success,
          error: "Sorry a user with this email already exist!",
        }); //Return a response of status code 400 and JSON contain the error message as 'Sorry a user with this email already exist!'
      }

      const salt = await bcrypt.genSalt(10); //Creating a salt using bcrypt to add extra layer of security to our password

      user = await User.create({
        // Creating a User in the db with the values from request.body
        name: req.body.name,
        password: await bcrypt.hash(req.body.password, salt), //Hashing our password with the salt we created above
        email: req.body.email,
      });

      //We are signing our web token below to authenticate the user
      const authToken = jwt.sign({ user: { id: user.id } }, JWT_SECRET);
      success = true;
      res.json({ authToken, success }); //Providing a response JSON object with the authentication token generated to the end user.
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Some error occurred! Try again later");
    }
  }
);

// AUTHENTICATE THE USER
//POST REQUEST
router.post(
  "/login", // Absolute URL: http://localhost:5000/api/auth/login
  [
    body("email", "Enter a valid email").isEmail(), // For field 'email', we are given constraints of being an email, and display error message 'Enter a valid email' when it is not fulfilled
    body("password", "Password cannot be blank").exists(), // For field 'password', we are given constraints of not being empty, and display error message 'Password cannot be blank' when it is not fulfilled
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req); //Validating the request body for any errors
    if (!errors.isEmpty()) {
      // When there are errors
      return res.status(400).json({ errors: errors.array(), success }); // Give a status code of 400 and a JSON object containing array logs of errors
    }

    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Please log in with correct credentials", success });
      }
      const passwordMatch = await bcrypt.compare(password, user.password); // To compare between password entered by the user and the password from the user, which was looked upon in the database.
      if (!passwordMatch) {
        return res
          .status(400)
          .json({ error: "Please log in with correct credentials", success });
      }
      //We are signing our web token below to authenticate the user
      const authToken = jwt.sign({ user: { id: user.id } }, JWT_SECRET);
      success = true;
      res.json({ authToken, success }); //Providing a response JSON object with the authentication token generated to the end user.
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Some error occurred! Try again later");
    }
  }
);

// GETTING DETAILS OF LOGGED IN USER
// POST REQUEST

router.post(
  "/getuserdetails", // Absolute URL: http://localhost:5000/api/auth/getuserdetails
  fetchuser,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId).select("-password");
      res.send(user);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Some error occurred! Try again later");
    }
  }
);

module.exports = router; //Exporting this routing URL
