import React, { useState, useEffect } from 'react'
import { storage } from "./config.jsx";
import { ref as storageRef, uploadBytes, listAll, getDownloadURL, deleteObject, updateMetadata, uploadBytesResumable, getMetadata } from "firebase/storage";

import trash from "../images/trash.svg";

function ImageEditPage(props) {
  const [title, setTitle] = useState("");
  const imageRef = storageRef(storage, props.src);



  // tags to indicate for the note
  const [character, setCharacter] = useState(false);
  const [lore, setLore] = useState(false);
  const [map, setMap] = useState(false);


  const newMetaData = {
    customMetadata: {
      noteTitle: title,
      character: character,
      lore, lore,
      map, map,
    }
  }

  useEffect(() => {
    getMetadata(imageRef).then((metadata) => {
      setTitle(metadata.customMetadata.noteTitle);
      setCharacter(metadata.customMetadata.character);
      setLore(metadata.customMetadata.lore);
      setMap(metadata.customMetadata.map);
    }).catch((error) => {
      alert(error);
    })
  }, []);

  const updateNote = () => {
    updateMetadata(imageRef, newMetaData);
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
          <textarea
            className='title_input'
            rows='1'
            placeholder='Set Title'
            value={title}
            onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="tag_box">
          <button className={`edit_page_btns ${character ? 'selected btn' : 'unselected btn'}`} onClick={handleCharacter}>
            Character
          </button>
          <button className={`edit_page_btns ${lore ? 'selected btn' : 'unselected btn'}`} onClick={handleLore}>
            Lore
          </button>
          <button className={`edit_page_btns ${map ? 'selected btn' : 'unselected btn'}`} onClick={handleMap}>
            Map
          </button>
        </div>
      </div>
      <div>

        <div className='map' style={{
          background_size: 'contain'
        }}>
          <img className='full_img' src={props.src} />
        </div>
      </div>
      <div>
        <div>
          <button className='edit_save_btn' onClick={() => { updateNote(); }}> Save Changes </button>
        </div>

        <div>
          <button className="trash_edit_btn img_btn"
            onClick={() => props.deleteImage(props.src)}
            title="Delete">
            <img className="btn_img" src={trash} />
          </button>
        </div>

      </div>
    </div>
  )
}

export default ImageEditPage;