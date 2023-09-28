/* eslint-disable no-unused-vars */
import React, { useContext, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import noteContext from "../../context/Notes/noteContext";
import { useHistory } from "react-router";

export const AddNote = () => {
  const { notes, addNote, errors } = useContext(noteContext); //Getting the notes and addNote function from the noteContext (indirectly from noteState.js)
  const [note, setNote] = useState({ title: "", description: "", tag: "" }); //This is used to store the content on the form input and not directly on database

  let history = useHistory();

  // This function will be called when we submit the form, the page will not reload, we will call the addNote function(which will add note to the database) and then we will set the value in the input fields to be blank
  const handleAddNote = async (event) => {
    event.preventDefault();
    let success = await addNote(note.title, note.description, note.tag);
    if (success) {
      setNote({
        title: "",
        description: "",
        tag: "",
      });
      toast.success("Note created successfully", {
        position: "top-left",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      while (errors.length > 0) {
        const { error, status } = errors.shift();
        toast.error(error, {
          position: "top-left",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        if (status === 401 && history.location.pathname !== "/login") {
          setTimeout(() => {
            localStorage.removeItem("authToken");
            history.push("/login");
          }, 1500);
        }
      }
    }
  };

  const onChange = (event) => {
    setNote({ ...note, [event.target.name]: event.target.value }); //This syntax will help us to firstly spread the orginal values in the note and then overwrite the new values
  };

  return (
    <>
      <ToastContainer
        position="top-left"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        theme="light"
      />
      <div className="container my-4">
        <h1>Add note</h1>
        <form className="my-3">
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title*
            </label>
            <input
              type="text "
              className="form-control"
              id="title"
              name="title"
              aria-describedby="emailHelp"
              onChange={onChange}
              value={note.title}
              minLength={5}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description*
            </label>
            <input
              type="text"
              className="form-control"
              id="description"
              name="description"
              onChange={onChange}
              value={note.description}
              minLength={20}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="tag" className="form-label">
              Tag*
            </label>
            <input
              type="text"
              className="form-control"
              id="tag"
              name="tag"
              onChange={onChange}
              value={note.tag}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            onClick={handleAddNote}
            disabled={note.title.length < 5 || note.description.length < 20} //Making this button disabled if title/description entered in the modal is less than corresponding values required/specified in the database modal of note
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
};
