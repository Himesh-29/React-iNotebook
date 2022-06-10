import { useState } from "react";
import noteContext from "./noteContext";

const NoteState = (props) => {
  const notesInitial = []; //Initially the notes are empty

  const [notes, setNotes] = useState(notesInitial); //Using useState for all the notes in the database

  // Getting all notes
  const getAllNotes = async () => {
    //API call
    const url = `${process.env.REACT_APP_BACKEND_URL}/notes/fetchallnotes`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("authtoken"),
      },
    });
    const json = await response.json();

    setNotes(json); //Setting the notes according to the JSON and reflecting on the frontend
  };

  //Adding a note
  const addNote = async (title, description, tag) => {
    //API call
    const url = `${process.env.REACT_APP_BACKEND_URL}/notes/createnote`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("authtoken"),
      },
      body: JSON.stringify({ title, description, tag }),
    });
    const newNote = await response.json();
    setNotes(notes.concat(newNote)); //Setting the notes after concating the newly added note according to the JSON and reflecting on the frontend
  };

  //Editing a note
  const editNote = async (noteId, title, description, tag) => {
    //API call
    const url = `${process.env.REACT_APP_BACKEND_URL}/notes/updatenote/${noteId}`;
    await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("authtoken"),
      },
      body: JSON.stringify({ title, description, tag }),
    });

    let newNotes = JSON.parse(JSON.stringify(notes)); //To create deep-copy of notes because in editing logic we cannot directly edit the notes variable

    //Editing logic
    for (let index = 0; index < newNotes.length; index++) {
      const note = newNotes[index];
      if (note._id === noteId) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
    }

    setNotes(newNotes); //Setting the notes and reflecting on the frontend
  };

  //Deleting a note
  const deleteNote = async (noteId) => {
    //API call
    const url = `${process.env.REACT_APP_BACKEND_URL}/notes/deletenote/${noteId}`;
    await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("authtoken"),
      },
    });

    //Deleting logic
    const newNotes = notes.filter((note) => {
      return note._id !== noteId;
    });
    setNotes(newNotes); //Setting the notes and reflecting on the frontend
  };

  //This part will tell React to provide all the children present in the noteContext to any React component which is requesting the data from this state
  return (
    <noteContext.Provider
      value={{ notes, setNotes, getAllNotes, addNote, editNote, deleteNote }}
    >
      {props.children};
    </noteContext.Provider>
  );
};

export default NoteState;
