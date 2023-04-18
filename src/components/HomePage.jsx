import "../App.css";
import React, { useState, useEffect } from "react";
import { set, ref, onValue, remove } from "firebase/database";
import { auth, database } from "./config.jsx";
import { uid } from "uid";
import Note from "./Note"
import EditPage from "./EditPage";
import SideBar from "./SideBar";
import MapNote from "./MapNote";
import MapEditPage from "./MapEditPage";
import ImageNote from "./ImageNote";
import ImageEditPage from "./ImageEditPage"
// imports for the image upload
import { storage } from "./config.jsx";
import { ref as storageRef, uploadBytes, listAll, getDownloadURL, deleteObject, updateMetadata, uploadBytesResumable, getMetadata } from "firebase/storage";


export default function HomePage(props) {
  // ----------------------------------------------------------------------
  // VARIABLES
  const [title, setTitle] = useState('');
  const [listOfNotes, setListOfNotes] = useState([]);
  const [pin, setPin] = useState(false);
  const [content, setContent] = useState(props.content_dis)
  const [setting, setSetting] = useState(false);
  const [isEditing, setEditingState] = useState(false);
  const [isMapEditing, setMapEditingState] = useState(false);
  const [edit_info, setEdit_Info] = useState('');
  const [sidebar, setSidebar] = useState(true);

  // search result
  const [search, setSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const [imageSearchResults, setImageSearchResults] = useState([]);

  // image upload 
  const [imageUpload, setImageUpload] = useState(null);
  const [imageList, setImageList] = useState([]);
  const [isImageEditing, setIsImageEditing] = useState(false);

  const [tagSearched, setTagSearched] = useState('');
  const [isTagSearch, setIsTagSearch] = useState(false);

  // ----------------------------------------------------------------------
  // FUNCTIONS
  // Shows the list of notes
  useEffect(() => {
    auth.onAuthStateChanged(user => {

      if (user) {
        setImageList([]);
        listAll(storageRef(storage, `${auth.currentUser.uid}/`)).then((response) => {
          response.items.forEach((item) => {
            getDownloadURL(item).then((url) => {
              setImageList((prev) => [...prev, url]);
            });
          });
        });

        onValue(ref(database, `/${auth.currentUser.uid}`), (snapshot) => {
          setListOfNotes([]);
          const data = snapshot.val();
          if (data !== null) {
            Object.values(data).map((note) => {
              setListOfNotes((oldArray) => [...oldArray, note]);
            })
          }
        })
      }
    })
  }, []);

  // Writes to database
  const writeToDatabase = () => {
    const cur_uid = uid();
    set(ref(database, `/${auth.currentUser.uid}/${cur_uid}`), {
      title: "Unnamed",
      content: "",
      is_pinned: pin,
      cur_uid: cur_uid,
      character: false,
      lore: false,
      map: false,
    })
  };

  // ----------------------------------------------------------------------
  // NOTE FUNCTIONS
  // Pins notes to the top of note list
  const togglePin = (is_pinned) => {
    is_pinned.preventDefault();
    setPin(!is_pinned);
    console.log("Pin: " + is_pinned);
  };

  // Displays settings of notes
  const toggleSetting = (e) => {
    e.preventDefault();
    setSetting(!setting);
  };

  const handleUpdate = (note) => {
    setEdit_Info(note);
    setEditingState(true);
    // Pass the uid and information to the editing page
  }

  const handleMapUpdate = (e) => {
    setMapEditingState(true);
  }

  const handleImageUpdate = (url) => {
    setIsImageEditing(true);
    setEdit_Info(url);
  }

  // Return from the editing page
  const handleExitEdit = (e) => {
    setEditingState(false);
    setMapEditingState(false);
    setIsImageEditing(false);
  }

  const toggleSideBar = () => {
    setSidebar(!sidebar);
  }

  // filters the display to show the search results
  const handleSearch = () => {
    setSearchResults([]);
    setImageSearchResults([]);
    // checks the image list first
    for (let x = 0; x < imageList.length; x++) {
      const imageRef = storageRef(storage, imageList[x]);
      getMetadata(imageRef).then((metadata) => {
        if (metadata.customMetadata.noteTitle.toLowerCase().includes(search)) {
          setImageSearchResults((oldArray) => [...oldArray, imageList[x]]);
        }
      }).catch((error) => {
        alert(error);
      })
    }

    // checks the text notes list 
    for (let x = 0; x < listOfNotes.length; x++) {
      if (listOfNotes[x].content.toLowerCase().includes(search) || listOfNotes[x].title.toLowerCase().includes(search)) {
        setSearchResults((oldArray) => [...oldArray, listOfNotes[x]]);
      }
    }
    if (search === '') {
      setIsSearching(false);
      setIsTagSearch(false);
    } else {
      setIsSearching(true);
      setIsTagSearch(false);
    }
  };

  const resetSearch = () => {
    setSearch('');
    setIsSearching(false);
  }

  // filters the display to show the notes with the tag that the user clicked on
  const handleTag = (tag) => {
    setIsTagSearch(true);
    setImageSearchResults([])
    setSearchResults([]);

    if (tag === 'character') {
      // filters through the text notes
      for (let x = 0; x < listOfNotes.length; x++) {
        if (listOfNotes[x].character) {
          setSearchResults((oldArray) => [...oldArray, listOfNotes[x]]);
        }
      }
      for (let x = 0; x < imageList.length; x++) {
        const imageRef = storageRef(storage, imageList[x]);
        getMetadata(imageRef).then((metadata) => {
          if (metadata.customMetadata.character) {
            setImageSearchResults((oldArray) => [...oldArray, imageList[x]]);
          }
        }).catch((error) => {
          alert(error);
        })
      }
      setTagSearched('Characters');
    } else if (tag === 'lore') {
      for (let x = 0; x < listOfNotes.length; x++) {
        if (listOfNotes[x].lore) {
          setSearchResults((oldArray) => [...oldArray, listOfNotes[x]]);
        }
      }
      for (let x = 0; x < imageList.length; x++) {
        const imageRef = storageRef(storage, imageList[x]);
        getMetadata(imageRef).then((metadata) => {
          if (metadata.customMetadata.lore) {
            setImageSearchResults((oldArray) => [...oldArray, imageList[x]]);
          }
        }).catch((error) => {
          alert(error);
        })
      }
      setTagSearched('Lore');
    } else if (tag === 'map') {
      for (let x = 0; x < listOfNotes.length; x++) {
        if (listOfNotes[x].map) {
          setSearchResults((oldArray) => [...oldArray, listOfNotes[x]]);
        }
      }
      for (let x = 0; x < imageList.length; x++) {
        const imageRef = storageRef(storage, imageList[x]);
        getMetadata(imageRef).then((metadata) => {
          if (metadata.customMetadata.map) {
            setImageSearchResults((oldArray) => [...oldArray, imageList[x]]);
          }
        }).catch((error) => {
          alert(error);
        })
      }
      setTagSearched('Maps');
    }
    setIsSearching(true);
  };

  // uploads the image to firebase storage with its metadata
  const uploadImage = () => {
    if (imageUpload == null) {
      return;
    }
    const cur_uid = uid();
    const newMetaData = {
      customMetadata: {
        noteTitle: "Untitled",
      }
    }
    const imageRef = storageRef(storage, `${auth.currentUser.uid}/${cur_uid}`);
    uploadBytesResumable(imageRef, imageUpload, newMetaData).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImageList((prev) => [...prev, url]);
      });
    });
  };

  // is passed to MapNote as argument to delete the image from database
  const deleteImage = (url) => {
    const imageRef = storageRef(storage, url);
    deleteObject(imageRef).then(() => {
      alert("Image Deleted");
    })
    setImageList(imageList.filter(item => item !== url));
  }



  // ----------------------------------------------------------------------
  // DISPLAYED ON WEBSITE
  return (
    <>
      {
        sidebar &&
        <SideBar
          user={props.curr_username}
          logout_dis={props.logout_dis}
          handleTag={handleTag}
          resetSearch={resetSearch}
        />
      }

      <div className="notes_home">
        {/* ------------------------------------------------------------------- */}
        {/* Header on top of the page */}
        <div className="title_header">
          <div className="title_name">
            <h1>
              Parchment
            </h1>
          </div>

          {/* Search Bar */}
          <div className="search_box">
            <textarea className="searchbar" value={search} onChange={(e) => setSearch(e.target.value.toLowerCase())} rows="1" placeholder="Search...">
            </textarea>
            <button className="search_btn" onClick={handleSearch}>
              Search
            </button>
            <button className="search_btn" onClick={resetSearch}>
              Clear
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------------- */}
        {/* Subheader with buttons for notes homepage */}
        <div className="subheader">
          <div className="subheader_btns_box">
            <button className="note_editor_btn" onClick={writeToDatabase}>
              Add Note
            </button>
            {/* Image Upload */}
            <button className="note_editor_btn" onClick={uploadImage}>
              Upload Image
            </button>
            <input
              className="images_input"
              type="file"
              onChange={(event) => { setImageUpload(event.target.files[0]) }}>
            </input>
          </div>
        </div>

        {/* ------------------------------------------------------------------- */}
        {/* List of Notes */}
        <div className="note_list box">
          <div>
            {/* Show the notes if person is not currently editing the notes */}

            {!isEditing && !isMapEditing && !isImageEditing ? (
              // de
              <>
                {!isSearching ? (
                  <>
                    <div className="home_box">
                      <h3>
                        All Notes
                      </h3>
                    </div>

                    {imageList.map((url) => (
                      <>
                        <ImageNote
                          src={url}
                          edit_funct={() => handleImageUpdate(url)}
                          deleteImage={deleteImage}
                        ></ImageNote>
                      </>
                    ))}

                    <MapNote
                      title="Forest Camp"
                      src="https://i.pinimg.com/originals/ca/35/48/ca3548a64c848549747bd88a1e5a14bc.png"
                      edit_funct={handleMapUpdate}
                    />

                    {listOfNotes.map(note => (
                      <>
                        <Note
                          note_info={note}
                          edit_funct={() => { handleUpdate(note) }}
                        />
                      </>
                    ))}
                  </>
                )
                  :
                  // IF user is searching 
                  (
                    <>
                      <div className="home_box">
                        <h3>
                          {isTagSearch ? (
                            <>
                            {tagSearched}
                            </>
                          ) : (
                            <>
                            Search Results for '{search}'
                            </>
                          )}
                          
                        </h3>
                      </div>

                      {/* displays the searched image notes */}
                      {imageSearchResults.map((url) => (
                        <>
                          <ImageNote
                            src={url}
                            edit_funct={() => handleImageUpdate(url)}
                            deleteImage={deleteImage}
                          ></ImageNote>
                        </>
                      ))
                      }

                      {/* // displays the searched text note */}
                      {searchResults.map(note => (
                        <>
                          <Note
                            note_info={note}
                            edit_funct={() => { handleUpdate(note) }}
                          />
                        </>
                      ))}
                    </>
                  )}
              </>
            ) : (
              <>
                {/* Put the editing page here if edit is in order */}
                <button onClick={handleExitEdit}>
                  Exit
                </button>

                {
                  isImageEditing &&
                  <ImageEditPage
                    src={edit_info}
                    edit_funct={() => handleImageUpdate(edit_info)}
                    deleteImage={deleteImage}
                    _ />
                }

                {
                  isMapEditing &&
                  <MapEditPage
                    title="Forest Camp"
                    edit_funct={handleMapUpdate} />
                }

                {
                  isEditing &&
                  <EditPage note_info={edit_info} />
                }
              </>
            )}
          </div>
        </div>
        {/* Save Button*/}
        <div className="btns_list"></div>
      </div >
    </>
  );
}
