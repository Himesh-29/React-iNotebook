import { useState, useMemo } from "react";
import noteContext from "./noteContext";

const NoteState = (props) => {
  const [notes, setNotes] = useState([]); //Using useState for all the notes in the database
  const [errors, setErrors] = useState([]); //Using useState for all the notes in the database

  // Getting all notes
  const getAllNotes = useMemo(
    () => async () => {
      // API call
      const url = `${process.env.REACT_APP_BACKEND_URL}/notes/all`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("authToken"),
        },
      });
      const json = await response.json();
      if (response.status === 200) {
        setNotes(json.notes);
      } else {
        setErrors([...errors, { error: json.error, status: response.status }]);
      }
    },
    []
  );

  //Adding a note
  const addNote = async (title, description, tag) => {
    //API call
    const url = `${process.env.REACT_APP_BACKEND_URL}/notes/create`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("authToken"),
      },
      body: JSON.stringify({ title, description, tag }),
    });
    const message = await response.json();
    if (response.status === 200) {
      setNotes(notes.concat(message.note)); //Setting the notes after concating the newly added note according to the JSON and reflecting on the frontend
      return true;
    } else {
      if ("error" in message) {
        setErrors([
          ...errors,
          { error: message.error, status: response.status },
        ]);
      } else {
        setErrors([
          ...errors,
          ...Array.from(message.errors).map((err) => {
            return { error: err.msg, status: response.status };
          }),
        ]);
      }
      return false;
    }
  };

  //Editing a note
  const editNote = async (noteId, title, description, tag) => {
    //API call
    const url = `${process.env.REACT_APP_BACKEND_URL}/notes/update/${noteId}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("authToken"),
      },
      body: JSON.stringify({ title, description, tag }),
    });

    let message = await response.json();

    if (response.status === 200) {
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
      return true;
    } else {
      if ("error" in message) {
        setErrors([
          ...errors,
          { error: message.error, status: response.status },
        ]);
      } else {
        setErrors([
          ...errors,
          ...Array.from(message.errors).map((err) => {
            return { error: err.msg, status: response.status };
          }),
        ]);
      }
      return false;
    }
  };

  //Deleting a note
  const deleteNote = async (noteId) => {
    //API call
    const url = `${process.env.REACT_APP_BACKEND_URL}/notes/delete/${noteId}`;
    let response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("authToken"),
      },
    });
    let message = await response.json();

    if (response.status === 200) {
      //Deleting logic
      const newNotes = notes.filter((note) => {
        return note._id !== noteId;
      });
      setNotes(newNotes); //Setting the notes and reflecting on the frontend
      return true;
    } else {
      if ("error" in message) {
        setErrors([
          ...errors,
          { error: message.error, status: response.status },
        ]);
      } else {
        setErrors([
          ...errors,
          ...Array.from(message.errors).map((err) => {
            return { error: err.msg, status: response.status };
          }),
        ]);
      }
      return false;
    }
  };

  //This part will tell React to provide all the children present in the noteContext to any React component which is requesting the data from this state
  return (
    <noteContext.Provider
      value={{
        notes,
        setNotes,
        getAllNotes,
        addNote,
        editNote,
        deleteNote,
        errors,
      }}
    >
      {props.children};
    </noteContext.Provider>
  );
};

export default NoteState;
