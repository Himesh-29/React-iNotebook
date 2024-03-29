//ROUTE TO AUTHENTICATE SIGNUP USER

const express = require("express");
const router = express.Router(); // We need to use router to link our route present here in the index.js
const { body, validationResult } = require("express-validator"); // We are using express-validator here to validate our fields easily
let CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken"); //Helps you to ensure secure connection b/w client and server

const User = require("../models/User"); // Importing the basic template of User from the models

// CREATING A NEW USER
// POST REQUEST
router.post(
  "/signup", // Absolute URL: http://localhost:5000/api/auth/signup
  [
    body("name", "Enter a valid name").isLength({ min: 3 }), // For field 'name', we are given constraints of having minimum length of 3, and display error message 'Enter a valid name' when it is not fulfilled
    body("email", "Enter a valid email").isEmail(), // For field 'email', we are given constraints of being an email, and display error message 'Enter a valid email' when it is not fulfilled
    body("password", "Password must be atleast 6 characters").isLength({
      min: 6,
    }), // For field 'password', we are given constraints of having minimum length of 6, and display error message 'Password must be atleast 6 characters' when it is not fulfilled
  ],
  async (req, res) => {
    const errors = validationResult(req); //Validating the request body for any errors
    if (!errors.isEmpty()) {
      // When there are errors
      return res.status(400).json({ errors: errors.array() }); // Give a status code of 400 and a JSON object containing array logs of errors
    }
    try {
      let user = await User.findOne({ email: req.body.email }); // Finding a user with the email address as provided in the body of request
      if (user) {
        //If there exist a user in the db
        return res.status(403).json({
          error: "Sorry a user with this email already exist!",
        }); //Return a response of status code 403 and JSON contain the error message as 'Sorry a user with this email already exist!'
      }

      user = await User.create({
        // Creating a User in the db with the values from request.body
        name: req.body.name,
        password: CryptoJS.AES.encrypt(
          JSON.stringify(req.body.password),
          process.env.SECRETKEY
        ).toString(),
        email: req.body.email,
      });

      //We are signing our web token below to authenticate the user
      const authToken = jwt.sign(
        { userId: user.id },
        `${process.env.JWT_SECRET}`
      );
      return res.status(200).json({ authToken }); //Providing a response JSON object with the authentication token generated to the end user.
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({
        error: "Some error occurred! Try again later",
      });
    }
  }
);

// AUTHENTICATE THE USER
//POST REQUEST
router.post(
  "/login", // Absolute URL: http://localhost:5000/api/auth/login
  [
    body("email", "Enter a valid email").isEmail(), // For field 'email', we are given constraints of being an email, and display error message 'Enter a valid email' when it is not fulfilled
    body("password", "Password must be atleast 6 characters").isLength({
      min: 6,
    }), // For field 'password', we are given constraints of not being empty, and display error message 'Password cannot be blank' when it is not fulfilled
  ],
  async (req, res) => {
    const errors = validationResult(req); //Validating the request body for any errors
    if (!errors.isEmpty()) {
      // When there are errors
      return res.status(400).json({ errors: errors.array() }); // Give a status code of 400 and a JSON object containing array logs of errors
    }

    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(404).json({
          error: "User with this email doesn't exists",
        });
      }
      let encryptedPassword = CryptoJS.AES.decrypt(
        user.password,
        process.env.SECRETKEY
      ).toString(CryptoJS.enc.Utf8);
      if (encryptedPassword !== '"' + password + '"') {
        return res.status(401).json({
          error: "Please log in with correct credentials",
        });
      }
      //We are signing our web token below to authenticate the user
      const authToken = jwt.sign(
        { userId: user.id },
        `${process.env.JWT_SECRET}`
      );
      return res.status(200).json({ authToken }); //Providing a response JSON object with the authentication token generated to the end user.
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({
        error: "Some error occurred! Try again later",
      });
    }
  }
);

module.exports = router; //Exporting this routing URL
