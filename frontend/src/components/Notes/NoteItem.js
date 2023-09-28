import React, { useContext } from "react";
import noteContext from "../../context/Notes/noteContext";
import { toast } from "react-toastify";
import { useHistory } from "react-router";

export const NoteItem = (props) => {
  let history = useHistory();

  const note = props.usernote; //Getting the note from Notes.js as props as we had map all the notes in Notes.js
  const updateNote = props.updateNote; //Getting the updateNote function from Notes.js as props

  const { deleteNote, errors } = useContext(noteContext); //Getting the deleteNote function from the noteContext (indirectly from noteState.js)

  return (
    <div className="card col-md-3 mx-3 my-3" style={{ width: "18rem" }}>
      <div className="card-body">
        <h5 className="card-title">{note.title}</h5>
        <p className="card-text">{note.description}</p>
        <p className="card-text">
          <strong>Tag</strong>: {note.tag}
        </p>
        <i
          className="far fa-trash-alt mx-2"
          onClick={async () => {
            //Passing an arrow function which the delete icon will call which will indirectly call the delete function
            let success = await deleteNote(note._id);
            if (success) {
              toast.success("Deleted successfully", {
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
          }}
        ></i>
        <i
          className="fas fa-pen mx-2"
          onClick={() => {
            updateNote(note);
          }}
        ></i>
      </div>
    </div>
  );
};
