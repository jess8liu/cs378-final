import "../App.css";
import React, { useState, useEffect } from 'react'
import { uid } from 'uid';
import { auth, database } from "./config.jsx";
import { set, ref, onValue, remove, update } from "firebase/database";
// import Tooltip from '@mui/material/Tooltip';

const EditPage = ({ note_info }) => {

  const [note, setNote] = useState(note_info.content);
  const [title, setTitle] = useState(note_info.title);

  // tags to indicate for the note
  const [character, setCharacter] = useState(note_info.character);
  const [lore, setLore] = useState(note_info.lore);
  const [map, setMap] = useState(note_info.map);

  // deletes the entire post from the database
  const handleDelete = () => {
    alert('Note will be deleted')
    // implement fully once database is running 
    remove(ref(database, `/${auth.currentUser.uid}/${note_info.cur_uid}`));
  }

  // adds tag to the database
  const handleAddTags = () => {
    update(ref(database, `/${auth.currentUser.uid}/${note_info.cur_uid}`), {
      character: character,
      lore: lore,
      map: map
    });
  }

  // updates the note to the database
  const updateNote = () => {
    update(ref(database, `/${auth.currentUser.uid}/${note_info.cur_uid}`), {
      title: title,
      content: note,
      cur_uid: note_info.cur_uid,
    });
    alert('updating:', note)
  }

  const handleCharacter = () => {
    setCharacter(!character);
  }

  const handleLore = () => {
    setLore(!lore);
  }

  const handleMap = () => {
    setMap(!map);
  }

  return (
    <div>
      <div>
        <div className="title_input_box">
          <textarea className='title_input' rows='1' placeholder='Set Title' value={title} onChange={(e) => setTitle(e.target.value)}>
          </textarea>
        </div>
        <div className="tag_box">
          <button className={`edit_page_btns ${character ? 'selected btn' : 'unselected btn'}`} onClick={handleCharacter} title="Character Tag">
            Character
          </button>
          <button className={`edit_page_btns ${lore ? 'selected btn' : 'unselected btn'}`} onClick={handleLore} title="Lore Tag">
            Lore
          </button>
          <button className={`edit_page_btns ${map ? 'selected btn' : 'unselected btn'}`} onClick={handleMap} title="Map Tag">
            Map
          </button>
          <button className='edit_page_btns' onClick={handleAddTags} title="Save Tags">
            Save Tags
          </button>

        </div>
      </div>
      <div>
        <textarea className='note_input' placeholder="Put text here..." rows='15' value={note} onChange={(e) => { setNote(e.target.value) }}>
        </textarea>
        <button onClick={() => { updateNote(); }}> Save Changes </button>
      </div>
      <div>
        <button onClick={handleDelete} title="Delete">Trash</button>
      </div>
    </div>
  )
}

export default EditPage