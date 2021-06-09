import React from "react";
import styles from '../css/ViewNote.module.css';

function ViewNote({ note, visibility , hide }) {
  const vis = visibility ? styles.bgmodal : styles.hide ;

  return (
    <div className={`${vis}`}>
      <div className={styles.content}>
        <div className={styles.close} onClick={hide}>+</div>
        <h1>{note.title}</h1>
        <p>{note.description}</p>
      </div>
    </div>
  );
}

export default ViewNote;
