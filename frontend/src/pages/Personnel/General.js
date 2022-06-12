import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Modal, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import "./UserProfileEdit.css";
import $ from "jquery";

const General = ({ session, userID, allowed, isAdmin }) => {
  const [editPrompted, setEditPrompted] = useState(false);
  const [user, setUser] = useState({});

  function promptEditOpen() {
    setEditPrompted(true);
  }

  function promptEditCancel() {
    setEditPrompted(false);
  }

  function editUserInfo() {
    let temp = {};
    let tempFirstName = $("#firstNameSelect").val();
    let tempLastName = $("#lastNameSelect").val();
    let tempEmail = $("#emailSelect").val();
    let tempPhone = $("#phoneSelect").val();
    let nameChanged = false;
    if (tempFirstName !== "") {
      temp.firstName = tempFirstName;
      nameChanged = true;
    } else {
      temp.firstName = user.firstName;
    }
    if (tempLastName !== "") {
      temp.lastName = tempLastName;
      nameChanged = true;
    } else {
      temp.lastName = user.lastName;
    }
    if (tempEmail !== "") {
      temp.email = tempEmail;
    } else {
      temp.email = user.email;
    }
    if (tempPhone !== "") {
      temp.phone = tempPhone;
    } else {
      temp.phone = user.phoneNumber;
    }
    if ($("#trainer").is(":checked")) {
      temp.trainer = "true";
    } else {
      temp.trainer = "false";
    }
    if ($("#trainee").is(":checked")) {
      temp.trainee = "true";
    } else {
      temp.trainee = "false";
    }

    session
      .patch("profile/changeGeneral?userID=" + userID, temp, {}, true)
      .then((resp) => {
        if (resp.status === 200 || resp.status === 201) {
          getUserInfo();
        }
      });
    if (nameChanged){
      window.location.reload();
    }
    promptEditCancel();
  }
  function getUserInfo() {
    session.get("users/" + userID).then((resp) => {
      if (resp.status === 200) {
        setUser(resp.data);
      }
    });
  }
  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <>
      <>
        <div className="card">
          <form className="mb-0.5">
            <div className="card-header">
              <h4>
                <b>General</b>
              </h4>
            </div>
            <div className="card-body">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <label
                    className="input-group-text"
                    htmlFor="inputGroupSelect01"
                  >
                    <b>Email</b>
                  </label>
                </div>
                <input
                  type="text"
                  className="form-control"
                  value={user.email} //this is not a good solution
                  disabled
                ></input>
              </div>
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <label
                    className="input-group-text"
                    htmlFor="inputGroupSelect01"
                  >
                    <b>Phone Number</b>
                  </label>
                </div>
                <input
                  type="text"
                  className="form-control"
                  value={user.phoneNumber}
                  disabled
                ></input>
              </div>

              {isAdmin && (
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <label
                      className="input-group-text"
                      htmlFor="inputGroupSelect01"
                    >
                      <b>Roster Role: </b>
                    </label>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    value={user.trainer ? "Trainer" : "Trainee"} //this is not a good solution
                    disabled
                  ></input>
                </div>
              )}

              {allowed && (
                <button
                  className="btn greyButton m-1"
                  type="button"
                  onClick={promptEditOpen}
                >
                  Edit
                </button>
              )}
            </div>
          </form>
        </div>

        <Modal
          className="ProfileModal"
          show={editPrompted}
          onHide={promptEditCancel}
        >
          <Modal.Header closeButton>
            <Modal.Title>Editing General Information</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* <div className="form-group">
            <h4>
              <b>User Information</b>
            </h4>
          </div> */}
            <div className="form-group">
              <h5>
                <b>User Information</b>
              </h5>

              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <label className="input-group-text" htmlFor="firstNameSelect">
                    First Name
                  </label>
                </div>
                <input
                  type="tel"
                  className="form-control"
                  id="firstNameSelect"
                  name="myEvalInput"
                  aria-describedby="emailHelp"
                  placeholder={user.firstName}
                />
              </div>

              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <label className="input-group-text" htmlFor="lastNameSelect">
                    Last Name
                  </label>
                </div>
                <input
                  type="tel"
                  className="form-control"
                  id="lastNameSelect"
                  name="myEvalInput"
                  aria-describedby="emailHelp"
                  placeholder={user.lastName}
                />
              </div>

              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <label className="input-group-text" htmlFor="emailSelect">
                    Email
                  </label>
                </div>
                <input
                  type="tel"
                  className="form-control"
                  id="emailSelect"
                  name="myEvalInput"
                  aria-describedby="emailHelp"
                  placeholder={user.email}
                />
              </div>

              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <label className="input-group-text" htmlFor="phoneSelect">
                    Phone Number
                  </label>
                </div>
                <input
                  type="tel"
                  className="form-control"
                  id="phoneSelect"
                  name="myEvalInput"
                  aria-describedby="emailHelp"
                  placeholder={user.phoneNumber}
                />
              </div>

              {isAdmin && (
                <>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="selectTraineeEdit"
                      defaultChecked={user.trainer}
                      id="trainer"
                    />
                    <label className="form-check-label">Trainer</label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="selectTraineeEdit"
                      defaultChecked={user.trainee}
                      id="trainee"
                    />
                    <label className="form-check-label">Trainee</label>
                  </div>
                </>
              )}

              <button className="btn greyButton" onClick={editUserInfo}>
                Submit
              </button>
            </div>
          </Modal.Body>
        </Modal>
      </>
    </>
  );
};

export default General;
