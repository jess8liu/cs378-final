import React, { useState, useEffect } from "react";
import SettingList from "./SettingList";
import { set, ref, onValue, remove } from "firebase/database";
import { auth, database } from "./config.jsx";

function Note(props) {

  const [pin, setPin] = useState(props.note_info.is_pinned);
  const [setting, setSetting] = useState(props.note_info.setting);
  const [isEditing, setEditingState] = useState(false);
  const [edit_info, setEdit_Info] = useState('');


  const togglePin = (e) => {
    e.preventDefault();
    setPin(!pin);
    console.log("Pin: " + pin);
  };

  const toggleSetting = (e) => {
    e.preventDefault();
    setSetting(!setting);
  };

  // Deletes the note; probably add an alert before completely deleting note
  const handleDelete = (uid) => {
    // implement once database is running
    remove(ref(database, `/${auth.currentUser.uid}/${uid}`));
  };

  const handleEdit = props.edit_funct;


  const handleUpdate = (note) => {
    setEdit_Info(note);
    setEditingState(true);
    // Pass the uid and information to the editing page
  };

  return (
    <>
      <div className="singular_note">
        <div className="title_section">
          <div className="title">
            {props.note_info.title}
          </div>
          {/* <button className="save_btn" onClick={props.edit_funct}>
            Edit
          </button> */}
        </div>

        <div className="body_section">
          {/* Input Section (for notes) */}
          <p className="body_section textbox">{props.note_info.content}</p>
        </div>

        <div className="body_section">
          <button className="setting_btn" onClick={toggleSetting}>
            Settings
          </button>

          <button className="trash_btn" onClick={() => handleDelete(props.note_info.cur_uid)}>
            Trash
          </button>
        </div>

        {/* Settings List */}
        {
          setting &&
          <>
            <div className="dropdown_div">
              <SettingList
                edit_funct={props.edit_funct}
                trash_funct={() => handleDelete(props.note_info.cur_uid)} />
            </div>
          </>
        }
      </div>
    </>
  );
}

export default Note;