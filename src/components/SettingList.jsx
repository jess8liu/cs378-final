import React, { useState, useEffect } from "react";

function SettingList(props) {


  function alertFunction(content) {
    alert("Clicked " + content);
  }

  return (
    <>
      <div className="title_section dropdown">
        <DropdownItem
          setting_dis="Edit"
          // Can change function to whatever you define

          function={props.edit_funct}
        />
        {/* <DropdownItem
          setting_dis="Pin/Unpin"
          // Can change function to whatever you define
          function={() => alertFunction("Pin/Unpin Function")}
        /> */}
        <DropdownItem
          setting_dis="Trash"
          // Can change function to whatever you define
          function={props.trash_funct}
        />
        {/* <DropdownItem
          setting_dis="Rename"
          // Can change function to whatever you define
          function={() => alertFunction("Rename Function")}
        /> */}
        {/* <DropdownItem
          setting_dis="Tags"
          // Can change function to whatever you define
          function={() => alertFunction("Tags Function")}
        /> */}
      </div>
    </>
  );
}

export default SettingList;

function DropdownItem(props) {
  return (
    <>
      <div className="dropdownItem" onClick={props.function}>
        {props.setting_dis}
      </div>
    </>
  );
}
