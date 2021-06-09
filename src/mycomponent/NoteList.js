import React from 'react';
import styles from "../css/NoteList.module.css";
import NoteItem from './NoteItem';

function NoteList({list,del,edit,view,unhide, editItem, editId, openAddNoteComponent , closeNoteList, closeSearchBox, closeAddIcon}) {

    return (
        <div className={styles.list}>
            <ul className={`${styles.nonPadding} ${styles.wrapper} ${styles.container}`}>
                {
                    list.map((item,index) =>{
                        return <NoteItem key={item.id} item={item.data} visible={item.visible} del={del} i={index} edit={edit} id={item.id} view={view} unhide={unhide} editId={editId} editItem={editItem} openAddNoteComponent={openAddNoteComponent} closeNoteList={closeNoteList} closeSearchBox={closeSearchBox} closeAddIcon={closeAddIcon}/>
                    })

                }
               
            </ul>
        </div>
    )
}

export default NoteList
