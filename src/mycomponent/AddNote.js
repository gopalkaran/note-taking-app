import React, { useEffect, useState } from "react";
import db from "../config/firebase.config";
import "../css/AddNote.css";

function AddNote({
  notes,
  editId,
  editItem,
  closeAddNoteForm,
  clearTempEditData,
}) {
  const [data, setData] = useState({
    // state for maintaining controlled input
    title: "",
    description: "",
  });

  const onchangeHandler = (name) => {
    return ({ target: { value } }) => {
      setData({ ...data, [name]: value });
    };
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (!data.title || !data.description) {
      alert("You must fill title and description");
      return;
    }
    if (notes.find(isExists) && !editId) {
      alert("Title already exists");
      return;
    }
    if (editId) {
      updateToDatabase();
      setData({ title: "", description: "" });
      clearTempEditData();
      closeAddNoteForm();
      return;
    }
    add({ data: data, visible: true });
    setData({ title: "", description: "" });
    closeAddNoteForm();
  };

  const isExists = (note) => {
    return note.data.title.toLowerCase() === data.title.toLowerCase();
  };

  const add = (note) => {
    //setNotes([...notes, note]);
    addToDatabase(note);
    console.log(note);
  };

  const addToDatabase = (note) => {
    const t_Id = new Date().getTime().toString();
    console.log(t_Id);
    db.collection("notes")
      .doc(t_Id)
      .set(note)
      .then(() => {
        console.log("Note successfully stored!");
      })
      .catch((error) => {
        console.error("Error storing note: ", error);
      });
  };

  const updateToDatabase = () => {
    db.collection("notes")
      .doc(editId)
      .set({
        data: data,
        visible: true,
      })
      .then(() => {
        console.log("Note successfully updated!");
      })
      .catch((error) => {
        console.error("Error updating note: ", error);
      });
  };

  useEffect(() => {
    if (Object.keys(editItem).length === 0) {
      setData({ title: "", description: "" });
    } else {
      setData(editItem);
    }
  }, [editItem]);

  return (
    <div className="container">
      <form className="form" onSubmit={onSubmitHandler}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Type a title"
            value={data.title}
            onChange={onchangeHandler("title")}
            className="form-input"
          />
          <label htmlFor="title" className="form-label">
            Title
          </label>
        </div>
        <div className="form-group">
          <textarea
            placeholder="Type a description"
            value={data.description}
            onChange={onchangeHandler("description")}
            className="form-input"
          ></textarea>
          <label htmlFor="description" className="form-label">
            Description
          </label>
        </div>
        <button className="btn">Add Note</button>
      </form>
    </div>
  );
}

export default AddNote;
