import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Modal, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import "./UserProfileEdit.css";
import $ from "jquery";

const Contact = ({ session, userID, allowed }) => {
  const [editPrompted, setEditPrompted] = useState(false);
  const [user, setUser] = useState([]);
  const [emergencyContact, setEmergencyContact] = useState({});

  function promptEditOpen() {
    setEditPrompted(true);
  }

  function promptEditCancel() {
    setEditPrompted(false);
  }

  function editEmergencyContact() {
    let temp = emergencyContact;
    temp.name = $("#nameSelect").val();
    temp.relationship = $("#relationshipSelect").val();
    temp.phone = $("#phoneSelect").val();
    let emergencyContactsID = emergencyContact.emergencyContactID;

    session
      .put("emergencyContacts/" + emergencyContactsID, temp, {}, false)
      .then((resp) => {
        if (resp === 200 || resp === 201) {
          setEmergencyContact(resp.data);
        }
      });
    promptEditCancel();
  }

  function readEmergencyContact() {
    session.get("users/" + userID + "/emergencyContacts").then((resp) => {
      if (resp.status === 200) {
        setEmergencyContact(resp.data._embedded.emergencyContacts[0]);
      }
    });
  }

  useEffect(() => {
    session.get("users/" + userID).then((resp) => {
      if (resp.status === 200) {
        setUser(resp.data);
      }
      readEmergencyContact();
    });
  }, []);

  return (
    <>
      <>
        <div className="card">
          <form className="mb-0.5">
            <div className="card-header">
              <h4>
                <b>Emergency Contact Information</b>
              </h4>
            </div>
            <div className="card-body">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <label
                    className="input-group-text"
                    htmlFor="inputGroupSelect01"
                  >
                    <b>Name</b>
                  </label>
                </div>
                <input
                  type="text"
                  className="form-control"
                  value={emergencyContact && emergencyContact.name}
                  disabled
                ></input>
              </div>
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <label
                    className="input-group-text"
                    htmlFor="inputGroupSelect01"
                  >
                    <b>Relationship</b>
                  </label>
                </div>
                <input
                  type="text"
                  className="form-control"
                  value={emergencyContact && emergencyContact.relationship} //this is not a good solution
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
                  value={emergencyContact && emergencyContact.phone}
                  disabled
                ></input>
              </div>

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
                <b>Emergency Contact Information</b>
              </h5>
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <label className="input-group-text" htmlFor="nameSelect">
                    Name
                  </label>
                </div>
                <input
                  type="tel"
                  className="form-control"
                  id="nameSelect"
                  name="myEvalInput"
                  aria-describedby="emailHelp"
                  placeholder={emergencyContact && emergencyContact.name}
                />
              </div>

              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <label
                    className="input-group-text"
                    htmlFor="relationshipSelect"
                  >
                    Relationship
                  </label>
                </div>
                <input
                  type="tel"
                  className="form-control"
                  id="relationshipSelect"
                  name="myEvalInput"
                  aria-describedby="emailHelp"
                  placeholder={
                    emergencyContact && emergencyContact.relationship
                  }
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
                  placeholder={emergencyContact && emergencyContact.phone}
                />
              </div>

              <button className="btn greyButton" onClick={editEmergencyContact}>
                Submit
              </button>
            </div>
          </Modal.Body>
        </Modal>
      </>
    </>
  );
};

export default Contact;
