import React, { useEffect, useState } from "react";
import "./App.css";
import db from "./config/firebase.config";
import AddNote from "./mycomponent/AddNote";
import Footer from "./mycomponent/Footer";
import Header from "./mycomponent/Header";
import NoteList from "./mycomponent/NoteList";
import ViewNote from "./mycomponent/ViewNote";

function App() {
  const [openAddNote, setOpenAddNote] = useState(false);
  const [visibleNoteLIst, setVisibleNoteList] = useState(true);
  const [visibleAddIcon, setVisibleAddIcon] = useState(true);
  const [searchBox, setSearchBox] = useState(true);
  const [searchData, setSearchData] = useState("");
  const [notes, setNotes] = useState([]); // state for storing note with unique id and visible flag
  const [editId, setEditId] = useState(0); // state to identify which note should be edited
  const [editItem, setEditItem] = useState({});
  const [visibility, setVisibility] = useState(false); // state to maintain visibility of modal
  const [show, setShow] = useState({}); // state to hold particular note to display using modal

  function hideDeleteIcon() {
    setSearchData("");
  }

  function openAddNoteComponent() {
    setOpenAddNote(true);
  }

  function closeNoteList() {
    setVisibleNoteList(false);
  }

  function closeAddIcon() {
    setVisibleAddIcon(false);
  }

  function closeSearchBox() {
    setSearchBox(false);
  }

  function closeAddNoteForm() {
    setOpenAddNote(false);
    setVisibleNoteList(true);
    setVisibleAddIcon(true);
    setSearchBox(true);
  }

  function clearTempEditData(){
    setEditId(0);
    setEditItem({});
  }

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

  const del = (id) => {
    // setNotes([...notes.slice(0, index), ...notes.slice(index + 1)]);
    // setData({ title: "", description: "" });
    deleteNoteInDatabase(id);
  };

  const edit = (id) => {
    const { data } = notes.find((note) => {
      return note.id === id ? note : null;
    });
    setEditItem(data);
    console.log(editId);
    console.log(data);
    setEditId(id);
    console.log(editId);
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

  const deleteNoteInDatabase = (id) => {
    db.collection("notes").doc(id).delete();
  };

  const searchHandler = ({ target: { value } }) => {
    setSearchData(value);
  };

  useEffect(() => {
    const searchText = searchData.toLowerCase();
    setNotes(notes => notes.map((note) => {
      const title = note.data.title.toLowerCase();
      const flag = title.includes(searchText);
      return { ...note, visible: flag };
    }));
  }, [searchData]);
  
  return (
    <div className="App">
      <Header />
      {searchBox ? (
        <div className="search-bar">
          <svg
            className="search-icon"
            viewBox="0 0 512 512"
            width="95"
            title="search"
          >
            <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z" />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search Notes by Title"
            onChange={searchHandler}
            value={searchData}
          />
          <svg
            className="search-delete"
            viewBox="0 0 640 512"
            width="100"
            title="backspace"
            onClick={hideDeleteIcon}
          >
            <path d="M576 64H205.26A63.97 63.97 0 0 0 160 82.75L9.37 233.37c-12.5 12.5-12.5 32.76 0 45.25L160 429.25c12 12 28.28 18.75 45.25 18.75H576c35.35 0 64-28.65 64-64V128c0-35.35-28.65-64-64-64zm-84.69 254.06c6.25 6.25 6.25 16.38 0 22.63l-22.62 22.62c-6.25 6.25-16.38 6.25-22.63 0L384 301.25l-62.06 62.06c-6.25 6.25-16.38 6.25-22.63 0l-22.62-22.62c-6.25-6.25-6.25-16.38 0-22.63L338.75 256l-62.06-62.06c-6.25-6.25-6.25-16.38 0-22.63l22.62-22.62c6.25-6.25 16.38-6.25 22.63 0L384 210.75l62.06-62.06c6.25-6.25 16.38-6.25 22.63 0l22.62 22.62c6.25 6.25 6.25 16.38 0 22.63L429.25 256l62.06 62.06z" />
          </svg>
        </div>
      ) : null}
      {visibleNoteLIst ? (
        <NoteList
          list={notes}
          del={del}
          edit={edit}
          view={view}
          unhide={unhide}
          openAddNoteComponent={openAddNoteComponent}
          closeNoteList={closeNoteList}
          closeSearchBox={closeSearchBox}
          closeAddIcon={closeAddIcon}
        />
      ) : null}
      {visibleAddIcon ? (
        <div
          className="add-icon"
          onClick={() => {
            openAddNoteComponent();
            closeNoteList();
            closeAddIcon();
            closeSearchBox();
          }}
        >
          <svg
            height="448pt"
            viewBox="0 0 448 448"
            width="448pt"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="m408 184h-136c-4.417969 0-8-3.582031-8-8v-136c0-22.089844-17.910156-40-40-40s-40 17.910156-40 40v136c0 4.417969-3.582031 8-8 8h-136c-22.089844 0-40 17.910156-40 40s17.910156 40 40 40h136c4.417969 0 8 3.582031 8 8v136c0 22.089844 17.910156 40 40 40s40-17.910156 40-40v-136c0-4.417969 3.582031-8 8-8h136c22.089844 0 40-17.910156 40-40s-17.910156-40-40-40zm0 0" />
          </svg>
        </div>
      ) : null}
      <div className="icon-description">Create a note</div>
      {openAddNote ? (
        <AddNote notes={notes} editId={editId} editItem={editItem} closeAddNoteForm={closeAddNoteForm} clearTempEditData={clearTempEditData}/>
      ) : null}
      <ViewNote note={show} visibility={visibility} hide={hide} />
      <Footer />
    </div>
  );
}

export default App;
