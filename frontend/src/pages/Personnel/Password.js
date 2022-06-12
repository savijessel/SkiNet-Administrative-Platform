import React, { useState, useEffect } from "react";
import {
  Container,
  Alert,
  Row,
  Col,
  Form,
  Modal,
  Button,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import "./UserProfileEdit.css";
import $ from "jquery";

const Password = ({ session, userID, allowed, selfView }) => {
  const [prompt, setPrompt] = useState(false);
  const [user, setUser] = useState([]);
  const [myPassword, setMyPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  function openPrompt() {
    setPrompt(true);
  }

  function closePrompt() {
    setPrompt(false);
  }

  function changePassword() {
    if (myPassword.length === 0) {
      setError(true);
      setErrorMsg("Please enter a password");
      return;
    }
    session
      .put(
        "profile/changePassword?userID=" +
          userID +
          "&newPassword=" +
          myPassword,
        {},
        {},
        true
      )
      .then((resp) => {
        if (resp.status === 200 || resp.status === 201) {
          openPrompt();
          if (selfView) {
            window.setTimeout(function () {
              session.log_out();
              window.location.href = "/sign-in";
            }, 500);
          }
        }
      });
  }

  useEffect(() => {
    $("#newPW").on("change", function (e) {
      if ($(e.currentTarget)) setMyPassword($(e.currentTarget).val());
    });

    session.get("users/" + userID).then((resp) => {
      if (resp.status === 200) {
        setUser(resp.data);
      }
    });
  }, []);

  return (
    <>
      <>
        <Alert
          variant="danger"
          show={error}
          onClose={() => setError(false)}
          dismissible={true}
        >
          <Alert.Heading>Uh oh!</Alert.Heading>
          <p>{errorMsg}</p>
        </Alert>
        <div className="card">
          <form className="mb-0.5">
            <div className="card-header">
              <h4>
                <b>Change Password</b>
              </h4>
            </div>
            <div className="card-body">
              <div class="mb-3">
                <label for="newPW" class="form-label">
                  Password
                </label>
                <input type="text" class="form-control" id="newPW" />
              </div>

              {
                <button
                  className="btn greyButton m-1"
                  type="button"
                  onClick={changePassword}
                >
                  Change Password
                </button>
              }
            </div>
          </form>
        </div>

        <Modal className="ProfileModal" show={prompt} onHide={closePrompt}>
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>Password Changed Succesfully!</Modal.Body>
          <Modal.Footer>
            <button
              className="btn greyButton m-1"
              type="button"
              onClick={closePrompt}
            >
              Close
            </button>
          </Modal.Footer>
        </Modal>
      </>
    </>
  );
};

export default Password;
