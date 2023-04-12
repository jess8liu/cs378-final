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


  const [search, setSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);



  // ----------------------------------------------------------------------
  // FUNCTIONS
  // Shows the list of notes
  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if (user) {
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
      map: false
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

  // Return from the editing page
  const handleExitEdit = (e) => {
    setEditingState(false);
    setMapEditingState(false);
  }

  const toggleSideBar = () => {
    setSidebar(!sidebar);
  }

  // filters the display to show the search results
  const handleSearch = () => {
    setSearchResults([])
    for (let x = 0; x < listOfNotes.length; x++) {
      if (listOfNotes[x].content.includes(search) || listOfNotes[x].title.includes(search)) {
        setSearchResults((oldArray) => [...oldArray, listOfNotes[x]]);
      }
    }
    if (search === '') {
      setIsSearching(false);
    } else {
      setIsSearching(true);
    }
    // setSearch('');
  };

  const resetSearch = () => {
    setSearch('');
    setIsSearching(false);
  }

  // filters the display to show the notes with the tag that the user clicked on
  const handleTag = (tag) => {
    setSearchResults([]);
    if (tag === 'character') {
      for (let x = 0; x < listOfNotes.length; x++) {
        if (listOfNotes[x].character) {
          setSearchResults((oldArray) => [...oldArray, listOfNotes[x]]);
        }
      }
    } else if (tag === 'lore') {
      for (let x = 0; x < listOfNotes.length; x++) {
        if (listOfNotes[x].lore) {
          setSearchResults((oldArray) => [...oldArray, listOfNotes[x]]);
        }
      }
    } else if (tag === 'map') {
      for (let x = 0; x < listOfNotes.length; x++) {
        if (listOfNotes[x].map) {
          setSearchResults((oldArray) => [...oldArray, listOfNotes[x]]);
        }
      }
    }
    setIsSearching(true);

  };

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
            <textarea className="searchbar" value={search} onChange={(e) => setSearch(e.target.value)} rows="1" placeholder="Search...">
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
          <button className="note_editor_btn" onClick={writeToDatabase}>
            Add Note
          </button>
          {/* <button className="note_editor_btn" onClick={toggleSideBar}>
            Collapse
          </button> */}
        </div>

        {/* ------------------------------------------------------------------- */}
        {/* List of Notes */}
        <div className="note_list box">
          <div>
            {/* Show the notes if person is not currently editing the notes */}

            {!isEditing && !isMapEditing ? (
              // de
              <>
                {!isSearching ? (
                  <>
                    <div className="home_box">
                      <h3>All Notes</h3>
                    </div>

                    <MapNote
                      title="Forest Encampment"
                      src="https://cdn.shopify.com/s/files/1/0585/4239/1348/products/ForestEncampment_digital_day_grid.jpg?v=1676584019"
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
                          All Notes
                        </h3>
                      </div>
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
                  isMapEditing &&
                  <MapEditPage
                    title="Forest Encampment"
                    src="https://cdn.shopify.com/s/files/1/0585/4239/1348/products/ForestEncampment_digital_day_grid.jpg?v=1676584019"
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
