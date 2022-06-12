import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Table,
  Modal,
  Button,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import "./UserProfileEdit.css";
import $ from "jquery";
import Alert from "react-bootstrap/Alert";

const PatrolCommitment = ({
  session,
  userID,
  allowed,
  error,
  setError,
  setErrBody,
  setErrHeading,
}) => {
  const [discipline, setDisciplines] = useState([]);
  const [patrolCommit, setPatrolCommit] = useState([]);
  const [user, setUser] = useState([]);
  // const [error, setError] = useState(false);

  const [AddPrompted, setAddPrompted] = useState(false);
  const [editPrompted, setEditPrompted] = useState(false);
  const [deletePrompted, setDeletePrompted] = useState(false);
  const [selectedVal, setSelectedVal] = useState("-1");

  const [seasons, setSeasons] = useState([]);
  const [sortedSeasons, setSortedSeasons] = useState([]);

  function promptDeleteCancel() {
    setDeletePrompted(false);
  }

  function editEvent(event) {
    let temp = event.target.value;
    setSelectedVal(String(temp));
  }

  function deletePatrolCommit() {
    const params = new URLSearchParams();
    let temp = [];
    for (const x in patrolCommit) {
      temp.push($("#" + String(x)).is(":checked"));
    }
    for (const y in patrolCommit) {
      if (temp[y]) {
        params.append("ids", patrolCommit[y].patrolCommitmentID);
      }
    }

    session
      .delete(
        "profile/user/PatrolCommitments/deleteInBatch?" + params.toString(),
        {},
        {},
        true
      )
      .then((response) => {
        if (response.status == 200) {
          readNewPatrolCommitments();
        }
      })
      .catch((e) => {});
    setDeletePrompted(false);
  }

  function editPatrolCommitment() {
    try {
      if (setSelectedVal === "-1") throw "ERROR: No Value selected";

      const mySeason = $("#seasonSelectEdit").val();
      const myNotes = $("#notesSelectEdit").val();
      const myDays = $("#daysSelectEdit").val();
      const achieved = $("#commitmentAchievedEdit").val();

      let temp = {
        patrolCommitmentID:
          patrolCommit[parseInt(selectedVal)].patrolCommitmentID,
        achieved: achieved,
        days: myDays,
        notes:
          myNotes.length === 0
            ? patrolCommit[parseInt(selectedVal)].notes
            : myNotes,
        season: sortedSeasons[parseInt(mySeason)].seasonID,
        user: userID,
      };

      if (myDays.length == 0) {
        temp.days = patrolCommit[parseInt(selectedVal)].days.toString();
      }

      session.put("profile/patrolCommitment", temp, {}, true).then((resp) => {
        if (resp.status === 200 || resp.status === 201) {
          readNewPatrolCommitments();
        }
      });
      promptEditCancel();
    } catch (e) {
      setError(true);
    }
  }

  function promptAddCancel() {
    setAddPrompted(false);
    setError(false);
  }

  function addPatrolCommit() {
    try {
      const mySeason = $("#seasonSelect").val();
      const myNotes = $("#notesSelect").val();
      const myDays = $("#daysSelect").val();
      const achieved = $("#commitmentAchieved").val();

      if (
        myDays.length === 0 ||
        achieved < 0 ||
        myDays === null ||
        mySeason === -1
      ) {
        throw "One or more of the fields is empty or not selected. Please ensure that all fields are filled correctly.";
      }
      const achievedBool = achieved === "1" ? true : false;

      session
        .post(
          "patrolCommitments",
          {
            achieved: achievedBool,
            days: myDays,
            notes: myNotes.length === 0 ? null : myNotes,
            season: sortedSeasons[mySeason]._links.self.href,
            user: user._links.self.href,
          },
          {},
          false
        )
        .then(() => {
          readNewPatrolCommitments();
        });
      promptAddCancel();
    } catch (err) {
      console.log(err);
      setErrHeading("Input Error");
      setErrBody(err);
      setError(true);
    }
  }

  function readNewPatrolCommitments() {
    var id = userID;
    var url = "userID=" + id;

    session
      .get("profile/user/PatrolCommitments?" + url, {}, {}, true)
      .then((resp) => {
        if (resp.status === 200) {
          setPatrolCommit(resp.data.patrolCommitments);
        }
      });
  }

  useEffect(() => {
    session.get("users/" + userID).then((resp) => {
      if (resp.status === 200) {
        setUser(resp.data);
      }
    });
    session.get("seasons").then((resp) => {
      if (resp.status === 200) {
        setSeasons(resp.data._embedded.seasons);
      }
    });

    readNewPatrolCommitments();
  }, []);

  useEffect(() => {
    let tempSeasons = [...seasons];
    tempSeasons
      .sort(function (a, b) {
        return a.sequence - b.sequence;
      })
      .reverse();
    setSortedSeasons(tempSeasons);
  }, [seasons]);

  function promptAddOpen() {
    setAddPrompted(true);
  }

  function promptDeleteOpen() {
    setDeletePrompted(true);
  }

  function promptAddCancel() {
    setAddPrompted(false);
  }

  function promptEditOpen() {
    setEditPrompted(true);
  }

  function promptEditCancel() {
    setEditPrompted(false);
    setError(false);
  }

  return (
    <>
      <div className="card">
        <form className="mb-0.5">
          <div className="card-header">
            <h4>
              <b>Commitment Achieved</b>
            </h4>
          </div>

          <div className="card-body">
            <table className="table table-bordered hover myMiniTable">
              <thead>
                <tr>
                  <th className="tdbreak">Season</th>
                  <th className="tdbreak">Days Committed</th>
                  <th className="tdbreak">Commitment Achieved</th>
                  <th className="tdbreak">Notes</th>
                </tr>
              </thead>
              <tbody>
                {patrolCommit.map((row) => (
                  <tr>
                    <td className="tdbreak">{row.season.description}</td>
                    <td className="tdbreak">{row.days}</td>
                    <td className="tdbreak">{row.achieved ? "Yes" : "No"}</td>
                    <td className="tdbreak">{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>{" "}
            {allowed && (
              <button
                className="btn navyButton m-1"
                type="button"
                onClick={promptAddOpen}
              >
                Add
              </button>
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
            {allowed && (
              <button
                className="btn redButton m-1"
                type="button"
                onClick={promptDeleteOpen}
              >
                Delete
              </button>
            )}
          </div>
        </form>
      </div>
      <Modal
        className="ProfileModal"
        show={deletePrompted}
        onHide={promptDeleteCancel}
      >
        <Modal.Header closeButton>
          <Modal.Title>Deleting Patrol Commitment(s)</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-check mb-3">
            {patrolCommit.map((row, index) => (
              <div className="form-group">
                <input
                  className="form-check-input"
                  type="checkbox"
                  defaultChecked={false}
                  id={index}
                />
                <label className="form-check-label">
                  {"Season: " +
                    row.season.description +
                    ", Days: " +
                    row.days +
                    ", Achieved: " +
                    (row.achieved ? "Yes" : "No")}
                </label>
              </div>
            ))}
          </div>
          <button className="btn redButton" onClick={deletePatrolCommit}>
            Submit
          </button>
        </Modal.Body>
      </Modal>

      <Modal
        className="ProfileModal"
        show={AddPrompted}
        onHide={promptAddCancel}
      >
        <Modal.Header closeButton>
          <Modal.Title>Adding Patrol Commitment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="input-group mb-2">
            <div className="input-group-prepend">
              <label className="input-group-text" for="inputGroupSelect01">
                Commitment Achieved:
              </label>
            </div>
            <Form.Control as="select" custom id="commitmentAchieved">
              <option className="text-center" selected value={-1}>
                -
              </option>
              <option className="text-center" value={1}>
                Yes
              </option>
              <option className="text-center" value={0}>
                No
              </option>
              <option className="text-center" value={-2}>
                Inactive
              </option>
            </Form.Control>
          </div>

          <div className="input-group mb-2">
            <div className="input-group-prepend">
              <label className="input-group-text" for="daysSelect">
                Commitment Days
              </label>
            </div>
            <input
              className="text-center form-control"
              type="number"
              id="daysSelect"
              min="0"
              placeholder={0}
              data-bind="value:daysSelect"
            ></input>
          </div>

          <div className="input-group mb-2">
            <div className="input-group-prepend">
              <label className="input-group-text" for="seasonSelect">
                Season:
              </label>
            </div>

            <Form.Control as="select" custom id="seasonSelect">
              <option className="text-center" selected value={-1}>
                -
              </option>

              {sortedSeasons.map((row, index) => (
                <option className="text-center" value={index}>
                  {row.description}
                </option>
              ))}
            </Form.Control>
          </div>

          <div className="input-group mb-2">
            <span className="input-group-text">Notes</span>
            <textarea
              className="form-control"
              aria-label="With textarea"
              id="notesSelect"
            ></textarea>
          </div>

          <button className="btn navyButton" onClick={addPatrolCommit}>
            Submit
          </button>
        </Modal.Body>
      </Modal>
      <Modal
        className="ProfileModal"
        show={editPrompted}
        onHide={promptEditCancel}
      >
        <Modal.Header closeButton>
          <Modal.Title>Editing Patrol Commitments</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-check mb-3">
            {patrolCommit.map((row, index) => (
              <div className="form-group">
                <input
                  className="form-check-input"
                  type="radio"
                  name="selectJacketEdit"
                  checked={selectedVal === String(index)}
                  value={String(index)}
                  onChange={editEvent}
                />
                <label className="form-check-label">
                  {"Season: " +
                    row.season.description +
                    ", Days: " +
                    row.days +
                    ", Achieved: " +
                    (row.achieved ? "Yes" : "No")}
                </label>
              </div>
            ))}
          </div>
          {selectedVal !== "-1" ? (
            <>
              <div className="input-group mb-2">
                <div className="input-group-prepend">
                  <label className="input-group-text" for="inputGroupSelect01">
                    Commitment Achieved:
                  </label>
                </div>
                <Form.Control as="select" custom id="commitmentAchievedEdit">
                  {patrolCommit[parseInt(selectedVal)].achieved ? (
                    <>
                      <option selected className="text-center" value={true}>
                        Yes
                      </option>
                      <option className="text-center" value={false}>
                        No
                      </option>
                    </>
                  ) : (
                    <>
                      <option className="text-center" value={true}>
                        Yes
                      </option>
                      <option selected className="text-center" value={false}>
                        No
                      </option>
                    </>
                  )}
                </Form.Control>
              </div>

              <div className="input-group mb-2">
                <div className="input-group-prepend">
                  <label className="input-group-text" for="daysSelectEdit">
                    Commitment Days
                  </label>
                </div>
                <input
                  className="text-center form-control"
                  type="number"
                  id="daysSelectEdit"
                  min="0"
                  placeholder={patrolCommit[parseInt(selectedVal)].days}
                  data-bind="value:daysSelect"
                ></input>
              </div>
              <div className="input-group mb-2">
                <div className="input-group-prepend">
                  <label
                    className="input-group-text"
                    htmlFor="inputGroupSelect01"
                  >
                    Season
                  </label>
                </div>

                <select className="form-select" id="seasonSelectEdit">
                  {sortedSeasons.map((row, index) =>
                    row.description ===
                    patrolCommit[parseInt(selectedVal)].season.description ? (
                      <option selected value={index}>
                        {row.description} (Current Value)
                      </option>
                    ) : (
                      <option value={index}>{row.description}</option>
                    )
                  )}
                </select>
              </div>
              <div className="input-group mb-2">
                <span className="input-group-text">Notes</span>
                <textarea
                  className="form-control"
                  aria-label="With textarea"
                  id="notesSelectEdit"
                  placeholder={patrolCommit[parseInt(selectedVal)].notes}
                ></textarea>
              </div>
            </>
          ) : (
            <div>
              <b>
                <i>Select a Patrol Commitment to Update</i>
              </b>
            </div>
          )}
          <button
            className="btn greyButton"
            type="button"
            onClick={editPatrolCommitment}
          >
            Edit
          </button>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default PatrolCommitment;
