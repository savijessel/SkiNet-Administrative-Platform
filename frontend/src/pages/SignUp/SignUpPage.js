import { Component, useState, useEffect } from "react";
import { Modal, Alert, Button, Form, FormGroup } from "react-bootstrap";
import $ from "jquery";
import "./SignUpPage.css";

import React from "react";

export default function SignUpPage({ session }) {
  const [myUsername, setMyUsername] = useState("");
  const [myPassword, setMyPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [myEmail, setMyEmail] = useState("");

  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  function attemptSubmit() {
    // Check if email exists
    // ISSUE: CAN'T ACCESS THE API CALLS IF YOU'RE NOT A USER
    // NO AUTH
    let localError = false;
    session.get("users/search/findByEmail?email=" + myEmail).then((resp) => {
      if (resp.status === 200) {
        let temp = resp.data;

        if (temp.hasOwnProperty("email")) {
          setError(true);
          setErrorMsg("This email is already registered!");
          localError = true;
        }
      }
    });
    if (localError) {
      return;
    }

    if(myEmail.length === 0){
      setError(true);
      setErrorMsg("Missing Email Field!");
      localError = true;
    }
    if (myUsername.length === 0) {
      setError(true);
      setErrorMsg("Missing Username Field!");
      localError = true;
    }
    session
      .get("users/search/findByUsername?username=" + myUsername)
      .then((resp) => {
        if (resp.status === 200) {
          let temp = resp.data;
          console.log("wtf", temp);
          if (temp.hasOwnProperty("username")) {
            setError(true);
            setErrorMsg("This Username is already registered!");
            localError = true;
          }
        }
      });
    let pNumber = String($("#phoneSelect").val());
    if (pNumber.length === 0) {
      setError(true);
      setErrorMsg("Missing Phone Number Field!");
      localError = true;
    }
    let fName = String($("#firstNameInput").val());
    if (fName.length === 0) {
      setError(true);
      setErrorMsg("Missing First Name Field!");
      localError = true;
    }
    let lName = String($("#lastNameInput").val());
    if (lName.length === 0) {
      setError(true);
      setErrorMsg("Missing Last Name Field!");
      localError = true;
    }
    let er = $("#isAdmin").is(":checked") ? "SYSTEM_ADMIN" : "ROSTERED";
    if (localError) {
      return;
    }
    session
      .post(
        "profile/user/CreateNewUser",
        {
          username: myUsername,
          password: myPassword, //replace with password: window.btoa(myPassword),
          firstName: fName,
          lastName: lName,
          email: myEmail,
          phoneNumber: pNumber,
          eventRole: er,
        },
        {},
        true
      )
      .then((resp) => {
        window.location.href = "/personnel/user/" + resp.data.userID;
        console.log(resp.data.userID);
      });
  }

  useEffect(() => {
    $("#mainPW").on("change", function (e) {
      setMyPassword($(e.currentTarget).val());
    });

    $("#confirmedPW").on("change", function (e) {
      setConfirmedPassword($(e.currentTarget).val());
    });

    $("#usernameInput").on("change", function (e) {
      setMyUsername($(e.currentTarget).val());
    });

    $("#email").on("change", function (e) {
      setMyEmail($(e.currentTarget).val());
    });
  }, []);

  useEffect(() => {
    if (confirmedPassword !== myPassword) {
      setPasswordsMatch(false);
      console.log("not equal");
    } else {
      setPasswordsMatch(true);
    }
  }, [myPassword, confirmedPassword]);

  return (
    <div className="SignUpPage">
      <h2>Sign Up</h2>

      <Alert
        variant="danger"
        show={error}
        onClose={() => setError(false)}
        dismissible={true}
      >
        <Alert.Heading>Error!</Alert.Heading>
        <p>{errorMsg}</p>
      </Alert>

      <form>
        <div class="mb-3">
          <label for="email" class="form-label">
            Email address
          </label>
          <input
            type="email"
            class="form-control"
            id="email"
            aria-describedby="emailHelp"
          />
        </div>

        <div class="mb-3">
          <label class="tel" for="form-label">
            Phone Number
          </label>
          <input
            type="tel"
            class="form-control"
            id="phoneSelect"
            name="myEvalInput"
            aria-describedby="emailHelp"
          />
        </div>

        <div class="mb-3">
          <label for="usernameInput" class="form-label">
            Firstname
          </label>
          <input type="username" class="form-control" id="firstNameInput" />
        </div>

        <div class="mb-3">
          <label for="usernameInput" class="form-label">
            Lastname
          </label>
          <input type="username" class="form-control" id="lastNameInput" />
        </div>

        <div class="mb-3">
          <label for="usernameInput" class="form-label">
            Username
          </label>
          <input type="username" class="form-control" id="usernameInput" />
        </div>
        <div class="mb-3">
          <label for="mainPW" class="form-label">
            Password
          </label>
          <input type="password" class="form-control" id="mainPW" />
        </div>
        <div class="mb-3">
          <label for="confirmedPW" class="form-label">
            Confirm Password
          </label>
          <input type="password" class="form-control" id="confirmedPW" />
        </div>
        {!passwordsMatch && (
          <div className="text-danger">Passwords Don't Match!</div>
        )}
        <div class="mb-3 form-check">
          <input type="checkbox" class="form-check-input" id="isAdmin" />
          <label class="form-check-label" for="isAdmin">
            Is Admin
          </label>
        </div>

        <button class="btn navyButton" type="button" onClick={attemptSubmit}>
          Submit
        </button>
      </form>
    </div>
  );
}
