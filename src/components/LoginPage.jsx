import "../App.css";
import React, { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { auth } from "./config";

import HomePage from "../components/HomePage";

import person from "../images/owlguy.png";

export default function LoginPage() {
  // -------------------------------------------------------------------------------
  // STATE VARIABLES

  const [s_email, setS_Email] = useState("");
  const [s_password, setS_Password] = useState("");
  const [l_email, setL_Email] = useState("");
  const [l_password, setL_Password] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // -------------------------------------------------------------------------------
  // FUNCTION: SIGN UP

  function signup() {
    createUserWithEmailAndPassword(auth, s_email, s_password)
      .then(() => {
        alert('Account successfully created.');
      })
      .catch((error) => alert('Creating an account was not successful.'));
  }

  // -------------------------------------------------------------------------------
  // FUNCTION: LOG IN

  function login() {
    signInWithEmailAndPassword(auth, l_email, l_password)
      .then(() => {
        setIsLoggedIn(true);
        setL_Email('');
        setL_Password('');
      })
      .catch((error) => alert("Couldn't Sign in."));
  }

  // -------------------------------------------------------------------------------
  // FUNCTION: LOG OUT

  function logout(e) {
    e.preventDefault();
    signOut(auth)
      .then(() => {
        setIsLoggedIn(false);
      })
      .catch((error) => alert("Couldn't Log Out."));
  }

  return (
    <>
      {!isLoggedIn ? (
        <div id="root" className="login_container">

          {/*------------------------ LOGO ------------------------ */}

          <div className="login_logo">

            {/* Add logo image here */}
            <img className="login_img"
              src={require("../images/bitmap.png")}
              alt="Image of Parchment's logo." />

          </div>

          <div className="info">
            <br />
            <br />
            <div className="info_box">
              <h1>
                Welcome to Parchment!
              </h1>
              <h3>
                Keep note-taking in easy mode.
              </h3>

              <hr />

              <p>
                Keep track of characters, storylines, maps, and images here!
              </p>
            </div>

            <br />
            <br />
          </div>
          <div className="info_character">
              <img className="page_doll" src={person}/>
            </div>
          <br />
          <br />
          {/*----------------------- SIGN UP ----------------------- */}
          <div className="login_header">
            <p>
              Make an Account
            </p>
          </div>
          <div className="login_box">

            <input
              type="text"
              id="sign_email"
              placeholder="Email/Username"
              onChange={(e) => setS_Email(e.target.value)}
            />
            <br />
            <input
              type="password"
              id="sign_password"
              placeholder="Password"
              onChange={(e) => setS_Password(e.target.value)}
            />
            <button
              className="btn login"
              title="Make an account"
              onClick={(e) => {
                document.getElementById("sign_email").value = "";
                document.getElementById("sign_password").value = "";
                e.preventDefault();
                signup();
              }}
            >
              Sign Up
            </button>
          </div>

          <br />
          {/*----------------------- LOG IN ----------------------- */}
          <div className="login_header">
            <p>
              Login to Your Account
            </p>
          </div>
          <div className="login_box">
            <input
              type="text"
              placeholder="Email/Username"
              onChange={(e) => setL_Email(e.target.value)}
            />
            <br />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setL_Password(e.target.value)}
            />
            <button
              className="btn login"
              title="Log in"
              onClick={(e) => {
                e.preventDefault();
                login();
              }}
            >
              Log In
            </button>
          </div>

        </div>
      ) : (
        <></>
      )}

      {/*----------------------- REDIRECT PAGE ----------------------- */}

      {isLoggedIn ? (
        <>
          <div className="background">
            <div>
              <HomePage
                curr_username={auth.currentUser.email}
              />
            </div>
          </div>

          {/* Logout Button */}
          <div className="sidebar">
            <button
              className="btn logout"
              onClick={(e) => { logout(e); }}
            >
              Log Out
            </button>
          </div>
        </>
      ) : (
        <>

        </>
      )}
    </>
  );
}
