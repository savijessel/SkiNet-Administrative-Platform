import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Modal, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import "./UserProfileEdit.css";
import $ from "jquery";

const LakeLouiseRoles = ({ session, userID, allowed }) => {
  // Change this to be roles, once the roles DB is set up.
  const [discipline, setDisciplines] = useState([]);
  const [editPrompted, setEditPrompted] = useState(false);
  const [role, setRoles] = useState([]);
  const [user, setUsers] = useState([]);

  const [userRoles, setUserRoles] = useState([]);
  const [rolesArray, setRolesArray] = useState([]);

  const prettyRoles = {
    cismTeamMember: "CISM Team Member",
    pl: "Patrol Leader",
    apl: "Active Patrol Leader",
    hl: "HL",
    active: "Active User",
    newUser: "New User",
    trainingEventLead: "Training Event Lead",
    onSnowEvaluator: "On-Snow Evaluator",
    orienteerer: "Orienteer",
    recruitmentLead: "Recruitment Lead",
    p0Lead: "P0/Lead",
  };

  function promptEditOpen() {
    setEditPrompted(true);
  }

  function promptEditCancel() {
    setEditPrompted(false);
  }

  function editRoles() {
    let temp = role;
    const tempArray = Object.keys(prettyRoles);
    for (const x in tempArray) {
      temp[tempArray[x]] = $("#" + String(tempArray[x])).is(":checked");
    }
    // for (const x in rolesArray) {
    //   temp[rolesArray[x]] = $("#" + String(rolesArray[x])).is(":checked");
    // }
    console.log("Tx", temp);
    setRoles(temp);
    session.put("roles/" + role.roleID, temp, {}, false).then((resp) => {
      if (resp.status === 200 || resp.status === 201) {
        console.log("Rx", resp.data);
        setRoles(resp.data);
      }
    });
    promptEditCancel();
  }

  function readUserRoles() {
    const tempArray = Object.keys(role);

    tempArray.shift();
    tempArray.pop();
    console.log("Aasdfs", tempArray);
    console.log("here", role);
    setRolesArray(tempArray);
    const rolesVals = [];
    for (let i = 0; i < tempArray.length; ++i) {
      if (role[tempArray[i]]) {
        rolesVals.push(tempArray[i]);
      }
    }
    setUserRoles(rolesVals);
  }

  useEffect(() => {
    session.get("disciplines").then((resp) => {
      if (resp.status === 200) {
        setDisciplines(resp.data._embedded.disciplines);
      }
    });
    session.get("users/" + userID).then((resp) => {
      if (resp.status === 200) {
        setUsers(resp.data);
      }
    });

    session.get("users/" + userID + "/role").then((resp) => {
      if (resp.status === 200) {
        setRoles(resp.data);
        const fuck = Object.keys(resp.data);
        console.log("fuck", fuck);
      }
    });
  }, []);

  useEffect(() => {
    readUserRoles();
  }, [role]);

  return (
    <>
      <div className="card">
        <div className="card-header">
          <h4>
            <b>Lake Louise Roles</b>
          </h4>
        </div>
        <div className="card-body">
          <form className="mb-0.5">
            <ul className="list-group mb-3">
              {userRoles.map((row, index) => (
                <li className="list-group-item">{prettyRoles[row]}</li>
              ))}
            </ul>
            {allowed && (
              <button
                className="btn greyButton m-1"
                type="button"
                onClick={promptEditOpen}
              >
                Edit
              </button>
            )}
          </form>
        </div>
      </div>

      <Modal
        className="ProfileModal"
        show={editPrompted}
        onHide={promptEditCancel}
      >
        <Modal.Header closeButton>
          <Modal.Title>Editing Roles</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-check mb-3">
            {rolesArray.map((row, index) => (
              <div className="form-group">
                <input
                  className="form-check-input"
                  type="checkbox"
                  defaultChecked={role[row]}
                  id={row}
                />
                <label className="form-check-label">{prettyRoles[row]}</label>
              </div>
            ))}
          </div>

          <button className="btn greyButton" onClick={editRoles}>
            Submit
          </button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default LakeLouiseRoles;
