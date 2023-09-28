let express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator"); // We are using express-validator here to validate our fields easily

const Notes = require("../models/Notes");

const fetchuser = require("../middleware/fetchUserDetails");

// GETTING All NOTES OF LOGGED IN USER
// GET REQUEST
router.get(
  "/all", // Absolute URL: http://localhost:5000/api/notes/all
  fetchuser,
  async (req, res) => {
    const notes = await Notes.find({ user: req.userId });
    return res.status(200).json({ notes });
  }
);

// CREATING A NOTE FOR LOGGED IN USER
// POST REQUEST
router.post(
  "/create", // Absolute URL: http://localhost:5000/api/notes/create
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 5 }), // For field 'title', we are given constraints of having minimum length of 5, and display error message 'Enter a valid title' when it is not fulfilled
    body(
      "description",
      "Description must of at least 20 characters long"
    ).isLength({ min: 20 }), // For field 'description', we are given constraints of having minimum length of 20, and display error message 'Enter a valid description' when it is not fulfilled
  ],
  async (req, res) => {
    const { title, description, tag } = req.body;
    const errors = validationResult(req); //Validating the request body for any errors
    if (!errors.isEmpty()) {
      // When there are errors
      return res.status(400).json({ errors: errors.array() }); // Give a status code of 400 and a JSON object containing array logs of errors
    }
    try {
      // Creating a note with the fields entered
      const note = Notes({
        title,
        description,
        tag,
        user: req.userId, //Here we are getting the ID due to the fetchUserDetail function which returns user from the data after validating the auth token
      });
      const savedNote = await note.save(); //Saving the note
      return res.status(200).json({ note: savedNote }); // Returning the saved note in the form of json as a response to the post request
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({
        error: "Some error occurred! Try again later",
      });
    }
  }
);

// UPDATING A NOTE FOR LOGGED IN USER
// PUT REQUEST
router.put(
  "/update/:id", // Absolute URL: http://localhost:5000/api/notes/update
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 5 }), // For field 'title', we are given constraints of having minimum length of 5, and display error message 'Enter a valid title' when it is not fulfilled
    body(
      "description",
      "Description must of at least 20 characters long"
    ).isLength({ min: 20 }), // For field 'description', we are given constraints of having minimum length of 20, and display error message 'Enter a valid description' when it is not fulfilled
  ],
  async (req, res) => {
    const { title, description, tag } = req.body;
    const errors = validationResult(req); //Validating the request body for any errors
    if (!errors.isEmpty()) {
      // When there are errors
      return res.status(400).json({ errors: errors.array() }); // Give a status code of 400 and a JSON object containing array logs of errors
    }
    try {
      const newNote = {};

      if (title) newNote.title = title;
      if (description) newNote.description = description;
      if (tag) newNote.tag = tag;

      //Find the note to be updated using the note ID
      let note = await Notes.findById(req.params.id);
      if (!note) {
        return res.status(404).json({ error: "Note doesn't exist!" });
      }
      if (note.user.toString() !== req.userId) {
        return res.status(401).json({ error: "Access denied" });
      }
      //Finding the note with id and updating it.
      note = await Notes.findByIdAndUpdate(
        req.params.id,
        { $set: newNote },
        { new: true } //Here new:true means that if new content comes in the request, it will get added.
      );
      return res.status(200).json({ note }); // Returning the updated note in the form of json as a response to the put request
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({
        error: "Some error occurred! Try again later",
      });
    }
  }
);

// UPDATING A NOTE FOR LOGGED IN USER
// DELETE REQUEST
router.delete(
  "/delete/:id", // Absolute URL: http://localhost:5000/api/notes/delete
  fetchuser,
  async (req, res) => {
    try {
      //Find the note to be updated using the note ID
      let note = await Notes.findById(req.params.id);
      if (!note) {
        return res.status(404).json({ error: "Note doesn't exist!" });
      }
      if (note.user.toString() !== req.userId) {
        return res.status(401).json({ error: "Access denied" });
      }

      //Finding the note with id and updating it.
      note = await Notes.findByIdAndDelete(req.params.id);

      return res.status(200).json({ info: "Success, note has been deleted" }); // Returning a success message string that note has been deleted as a response to the delete request
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({
        error: "Some error occurred! Try again later",
      });
    }
  }
);

module.exports = router;
