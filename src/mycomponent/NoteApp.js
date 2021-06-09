import React, { useEffect, useState } from "react";
import db from "../config/firebase.config";
import styles from "../css/NoteApp.module.css";
import NoteList from "./NoteList";
import ViewNote from "./ViewNote";

function NoteApp() {
  const [data, setData] = useState({
    // state for maintaining controlled input
    title: "",
    description: "",
  });
  const [notes, setNotes] = useState([]); // state for storing note with unique id and visible flag
  const [editId, setEditId] = useState(0); // state to identify which note should be edited
  const [show, setShow] = useState({}); // state to hold particular note to display using modal
  const [visibility, setVisibility] = useState(false); // state to maintain visibility of modal

  const onchangeHandler = (name) => {
    return ({ target: { value } }) => {
      setData({ ...data, [name]: value });
    };
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (data.title === "" || data.description === "") {
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
      console.log(editId);
      setEditId(0);
      console.log(editId);
      return;
    }
    add({ data: data, visible: true });
    setData({ title: "", description: "" });
  };

  const isExists = (note) => {
    return note.data.title === data.title;
  };

  const add = (note) => {
    //setNotes([...notes, note]);
    addToDatabase(note);
  };

  const del = (id) => {
    // setNotes([...notes.slice(0, index), ...notes.slice(index + 1)]);
    setData({ title: "", description: "" });
    deleteNoteInDatabase(id);
  };

  const edit = (id) => {
    const { data } = notes.find((note) => {
      return note.id === id ? note : null;
    });
    setData({ title: data.title, description: data.description });
    console.log(editId);
    setEditId(id);
  };

  const view = (item) => {
    setShow(item);
  };

  const hide = () => {
    setVisibility(false);
  };

  const unhide = () => {
    setVisibility(true);
  };

  const searchHandler = ({ target: { value } }) => {
    const searchText = value.toLowerCase();
    const updatedList = notes.map((note) => {
      const title = note.data.title.toLowerCase();
      const flag = title.includes(searchText);
      return { ...note, visible: flag };
    });
    console.log(updatedList);
    setNotes(updatedList);
  };

  useEffect(() => {
    retrieveFromDatabase();
  }, []);

  const retrieveFromDatabase = () => {
    db.collection("notes").onSnapshot((snapshot) => {
      const notes = snapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data().data,
        visible: doc.data().visible,
      }));
      console.log(notes);
      setNotes(notes);
    });
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

  const deleteNoteInDatabase = (id) => {
    db.collection("notes").doc(id).delete();
  };

  return (
    <div>
      <form onSubmit={onSubmitHandler}>
        <input
          type="text"
          placeholder="TITLE"
          value={data.title}
          onChange={onchangeHandler("title")}
        />
        <textarea
          placeholder="DESCRIPTION"
          value={data.description}
          onChange={onchangeHandler("description")}
        ></textarea>
        <button className={styles.button}>Add Note</button>
      </form>
      <input
        type="search"
        className={styles.searchbar}
        placeholder="Search Notes by Title"
        onChange={searchHandler}
      />
      <NoteList
        list={notes}
        del={del}
        edit={edit}
        view={view}
        unhide={unhide}
      />
      <ViewNote note={show} visibility={visibility} hide={hide} />
    </div>
  );
}

export default NoteApp;
