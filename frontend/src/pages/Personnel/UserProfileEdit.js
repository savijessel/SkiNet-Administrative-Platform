import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Modal, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import TrainingAndEval from "./TrainingAndEval.js";
import PatrolCommitment from "./PatrolCommitment.js";
import LakeLouiseRoles from "./LakeLouiseRoles.js";
import PatrolUniformAndEquipment from "./PatrolUniformAndEquipment.js";
import LakeLouiseAwards from "./LakeLouiseAwards.js";
import General from "./General.js";
import Contact from "./EmergencyContact.js";
import Password from "./Password.js";
import "./UserProfileEdit.css";
import UserPerf from "./UserPerf.js";

const UserProfileEdit = ({ session }) => {
  let { id } = useParams();
  const [user, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [errHeading, setErrHeading] = useState("");
  const [errBody, setErrBody] = useState("");
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    session.get("users/" + id).then((resp) => {
      if (resp.status === 200) {
        setUsers(resp.data);
        console.log(resp.data);
      }
    });
    setIsAdmin(session.session_data().user_type === "SYSTEM_ADMIN");
  }, []);

  return (
    <>
      <Container>
        <h1>
          {user.firstName} {user.lastName}
        </h1>
        <h5>
          {isAdmin ? (user.trainer ? "Trainer - " : "Trainee - ") : ""}{" "}
          {user.username} - {user.phoneNumber} - {user.email}
        </h5>
        <div className="row">
          <div className="col">
            {(isAdmin || session.session_data().username === user.username) && (<UserPerf session={session} userID={id} allowed={isAdmin} />)}
          </div>
        </div>

        <div className="row">
          <div className="col-lg">
            <TrainingAndEval
              session={session}
              userID={id}
              allowed={isAdmin}
              error={hasError}
              setError={setHasError}
              setErrBody={setErrBody}
              setErrHeading={setErrHeading}
            />

            {(isAdmin || session.session_data().username === user.username) && (<PatrolCommitment
              session={session}
              userID={id}
              allowed={isAdmin}
              error={hasError}
              setError={setHasError}
              setErrBody={setErrBody}
              setErrHeading={setErrHeading}
            />)}

            <LakeLouiseRoles session={session} userID={id} allowed={isAdmin} />
            
            {(isAdmin || session.session_data().username === user.username) && (
              <Password
                session={session}
                userID={id}
                allowed={isAdmin}
                selfView={session.session_data().username === user.username}
              />
            )}
          </div>

          <div className="col-lg">
            {(isAdmin || session.session_data().username === user.username) && (<PatrolUniformAndEquipment
              session={session}
              userID={id}
              allowed={isAdmin}
              error={hasError}
              setError={setHasError}
              setErrBody={setErrBody}
              setErrHeading={setErrHeading}
            />)}

            <LakeLouiseAwards
              session={session}
              userID={id}
              allowed={isAdmin}
              error={hasError}
              setError={setHasError}
              setErrBody={setErrBody}
              setErrHeading={setErrHeading}
            />

            <Contact
              session={session}
              userID={id}
              allowed={
                isAdmin || session.session_data().username === user.username
              }
              isAdmin={isAdmin}
            />
            <General
              session={session}
              userID={id}
              isAdmin={isAdmin}
              allowed={
                isAdmin || session.session_data().username === user.username
              }
            />
          </div>
        </div>
      </Container>
      <Modal
        className="modal-whole"
        show={hasError}
        onHide={() => {
          setHasError(false);
        }}
      >
        <Modal.Header className="modal-error modal-dialog-centered" closeButton>
          <Modal.Title>
            <b className="modal-error-text">{errHeading}</b>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-error">
          <h6 className="modal-error-text">{errBody}</h6>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default UserProfileEdit;
