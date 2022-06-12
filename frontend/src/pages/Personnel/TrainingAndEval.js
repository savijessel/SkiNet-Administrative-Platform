import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Modal, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import $ from "jquery";
import "./UserProfileEdit.css";
import Alert from "react-bootstrap/Alert";

const TrainingAndEval = ({
  session,
  userID,
  allowed,
  error,
  setError,
  setErrBody,
  setErrHeading,
}) => {
  const [discipline, setDisciplines] = useState([]);

  const [onSnowEvals, setOnSnowEvals] = useState([]);
  const [operationalTraining, setOperationalTraining] = useState([]);
  const [operationalEvent, setOperationalEvent] = useState([]);
  const [evaluationTraining, setEvaluationTraining] = useState([]);

  const [user, setUser] = useState([]);

  const [addPrompted, setAddPrompted] = useState(false);
  const [editPrompted, setEditPrompted] = useState(false);
  const [deletePrompted, setDeletePrompted] = useState(false);

  const [date, setDate] = useState(null);
  const [theEventType, setTheEventType] = useState(null);
  // const [error, setError] = useState(false);
  const [type, setType] = useState("1");

  const [selectedVal, setSelectedVal] = useState("-1");

  function deleteOnSnowEvals() {
    const params = new URLSearchParams();
    let temp = [];
    for (const x in onSnowEvals) {
      temp.push($("#" + String(x)).is(":checked"));
    }
    for (const y in onSnowEvals) {
      if (temp[y]) {
        params.append("ids", onSnowEvals[y].onSnowEvalID);
      }
    }

    session
      .delete(
        "profile/user/OnSnowEvals/deleteInBatch?" + params.toString(),
        {},
        {},
        true
      )
      .then((response) => {
        if (response.status == 200) {
          readNewTrainingAndEvals();
        }
      })
      .catch((e) => {
        console.log(e);
      });

    setDeletePrompted(false);
  }

  function deleteOperationalTraining() {
    const params = new URLSearchParams();
    let temp = [];
    for (const x in operationalTraining) {
      temp.push($("#" + String(x)).is(":checked"));
    }
    for (const y in operationalTraining) {
      if (temp[y]) {
        params.append("ids", operationalTraining[y].operationalTrainingID);
      }
    }

    session
      .delete(
        "profile/user/OperationalTrainings/deleteInBatch?" + params.toString(),
        {},
        {},
        true
      )
      .then((response) => {
        if (response.status == 200) {
          readNewTrainingAndEvals();
        }
      })
      .catch((e) => {
        console.log(e);
      });

    setDeletePrompted(false);
  }

  function deleteEvalTraining() {
    const params = new URLSearchParams();
    let temp = [];
    for (const x in evaluationTraining) {
      temp.push($("#" + String(x)).is(":checked"));
    }
    for (const y in evaluationTraining) {
      if (temp[y]) {
        params.append("ids", evaluationTraining[y].evalTrainingID);
      }
    }

    session
      .delete(
        "profile/user/EvalTrainings/deleteInBatch?" + params.toString(),
        {},
        {},
        true
      )
      .then((response) => {
        if (response.status == 200) {
          readNewTrainingAndEvals();
        }
      })
      .catch((e) => {
        console.log(e);
      });

    setDeletePrompted(false);
  }

  function promptDeleteOpen() {
    setDeletePrompted(true);
  }

  function promptDeleteCancel() {
    setType("1");
    setDeletePrompted(false);
  }

  function promptAddOpen() {
    setAddPrompted(true);
  }

  function promptAddCancel() {
    setType("1");
    setAddPrompted(false);
    setError(false);
  }

  function editOnSnowEvals() {
    try {
      if (selectedVal === "-1")
        throw "an On Snow Eval is not properly selected. Please select an option before submitting,";
      if ($("#OnSnowTrainingDateEdit").val().length === 0) {
        throw "One or more of the fields is empty or not selected. Please ensure that all fields are filled correctly.";
      }
      const myDate = new Date($("#OnSnowTrainingDateEdit").val()).toISOString();
      const myDiscipline = $("#OnSnowDisciplinesEdit").val();
      const myEval = $("#OnSnowEvalByEdit").val();

      let temp = onSnowEvals[parseInt(selectedVal)];
      temp.evaluationDate = myDate.substring(0, 10);
      temp.discipline = discipline[parseInt(myDiscipline)].description;
      if (myEval.length > 0) {
        temp.evaluatedBy = myEval;
      }

      session
        .put(
          "profile/user/OnSnowEvals/Edit?id=" + temp.onSnowEvalID,
          temp,
          {},
          true
        )
        .then((resp) => {
          if (resp.status === 200 || resp.status === 201) {
            readNewTrainingAndEvals();
          }
        })
        .catch((e) => {
          setError(true);
          setErrHeading("Edit Attempt Failed");
          setErrBody(
            "There was an error while trying to edit this On-Snow Evaluation for this user."
          );
        });
      promptEditCancel();
    } catch (e) {
      setError(true);
      setErrHeading("Input Error");
      setErrBody(e);
    }
  }

  function editOperationalTraining() {
    try {
      if (selectedVal === "-1")
        throw "An operational training is not properly selected. Please select an option before submitting.";
      if ($("#OperationalTrainingDateEdit").val().length === 0) {
        throw "One or more of the fields is empty or not selected. Please ensure that all fields are filled correctly.";
      }
      const myDate = new Date(
        $("#OperationalTrainingDateEdit").val()
      ).toISOString();
      const myEvent = $("#OperationalTrainingEventEdit").val();

      let temp = operationalTraining[parseInt(selectedVal)];
      temp.completedDate = myDate.substring(0, 10);
      temp.operationalEvent = operationalEvent[parseInt(myEvent)].description;

      session
        .put(
          "profile/user/OperationalTraining/Edit?id=" +
            temp.operationalTrainingID,
          temp,
          {},
          true
        )
        .then((resp) => {
          if (resp.status === 200 || resp.status === 201) {
            readNewTrainingAndEvals();
          }
        })
        .catch((e) => {
          setError(true);
          setErrHeading("Edit Attempt Failed");
          setErrBody(
            "There was an error while trying to edit this Operational Training for this user."
          );
        });
      promptEditCancel();
    } catch (e) {
      setError(true);
      setErrHeading("Input Error");
      setErrBody(e);
    }
  }

  function editEvalTraining() {
    try {
      if (selectedVal === "-1")
        throw "An Evaluation training is not properly selected. Please select an option before submitting";

      if ($("#EvalTrainingDateEdit").val().length === 0) {
        throw "One or more of the fields is empty or not selected. Please ensure that all fields are filled correctly.";
      }
      const myDate = new Date($("#EvalTrainingDateEdit").val()).toISOString();
      const myEval = $("#EvalTrainingEventEdit").val();

      let temp = evaluationTraining[parseInt(selectedVal)];
      temp.completedDate = myDate.substring(0, 10);
      if (myEval.length > 0) {
        temp.eventType = myEval;
      }

      session
        .put("evalTrainings/" + temp.evalTrainingID, temp, {}, false)
        .then((resp) => {
          if (resp.status === 200 || resp.status === 201) {
            readNewTrainingAndEvals();
          }
        })
        .catch((e) => {
          setError(true);
          setErrHeading("Edit Attempt Failed");
          setErrBody(
            "There was an error while trying to edit this Evaluation Training for this user."
          );
        });
      promptEditCancel();
    } catch (e) {
      setError(true);
      setErrHeading("Input Error");
      setErrBody(e);
    }
  }

  function promptEditOpen() {
    setEditPrompted(true);
  }

  function promptEditCancel() {
    setType("1");
    setSelectedVal("-1");
    setEditPrompted(false);
    setError(false);
  }

  function OnChangeVal(event) {
    setType(event.target.value);
    setSelectedVal("-1");
  }

  function onSnowEvalEditEvent(event) {
    let temp = event.target.value;
    setSelectedVal(String(temp));
  }

  function evalTrainingEditEvent(event) {
    let temp = event.target.value;
    setSelectedVal(String(temp));
  }

  function operationalTrainingEditEvent(event) {
    let temp = event.target.value;
    setSelectedVal(String(temp));
  }

  function addOnSnowEval() {
    try {
      if ($("#OnSnowTrainingDate").val().length === 0) {
        throw "One or more of the fields is empty or not selected. Please ensure that all fields are filled correctly.";
      }
      const myDate = new Date($("#OnSnowTrainingDate").val()).toISOString();
      const myDiscipline = $("#OnSnowDisciplines").val();
      const myEval = $("#OnSnowEvalBy").val();
      console.log("asdfasdf" + myDate);
      if (myEval.length === 0 || parseInt(myDiscipline) === -1) {
        throw "One or more of the fields is empty or not selected. Please ensure that all fields are filled correctly.";
      }
      session
        .post(
          "onSnowEvals",
          {
            evaluationDate: myDate,
            discipline: discipline[parseInt(myDiscipline)]._links.self.href,
            evaluatedBy: myEval,
            user: user._links.self.href,
          },
          {},
          false
        )
        .then(() => {
          readNewTrainingAndEvals();
        })
        .catch((e) => {
          setError(true);
          setErrHeading("Add Attempt Failed");
          setErrBody(
            "There was an error while trying to add this evaluation for this user."
          );
        });
      promptAddCancel();
    } catch (err) {
      setError(true);
      setErrHeading("Input Error");
      setErrBody(err);
    }
  }

  function addEvalTraining() {
    try {
      if ($("#EvalTrainingDate").val().length === 0) {
        throw "One or more of the fields is empty or not selected. Please ensure that all fields are filled correctly.";
      }
      const myDate = new Date($("#EvalTrainingDate").val()).toISOString();
      const myEval = $("#EvalTrainingEvent").val();
      if (myEval.length === 0) {
        throw "One or more of the fields is empty or not selected. Please ensure that all fields are filled correctly.";
      }
      session
        .post(
          "evalTrainings",
          {
            eventType: myEval,
            completedDate: myDate,
            user: user._links.self.href,
          },
          {},
          false
        )
        .then(() => {
          readNewTrainingAndEvals();
        })
        .catch((e) => {
          setError(true);
          setErrHeading("Add Attempt Failed");
          setErrBody(
            "There was an error while trying to add this evaluation training for this user."
          );
        });
      promptAddCancel();
    } catch (err) {
      setError(true);
      setErrHeading("Input Error");
      setErrBody(err);
    }
  }

  function addOperationalTraining() {
    try {
      if ($("#OperationalTrainingDate").val().length === 0) {
        throw "One or more of the fields is empty or not selected. Please ensure that all fields are filled correctly.";
      }
      const myDate = new Date(
        $("#OperationalTrainingDate").val()
      ).toISOString();
      const myOperationalIndex = $("#OperationalTrainingEvent").val();

      if (myOperationalIndex === -1) {
        throw "One or more of the fields is empty or not selected. Please ensure that all fields are filled correctly.";
      }

      session
        .post(
          "operationalTrainings",
          {
            completedDate: myDate,
            operationalEvent:
              operationalEvent[myOperationalIndex]._links.self.href,
            user: user._links.self.href,
          },
          {},
          false
        )
        .then(() => {
          readNewTrainingAndEvals();
        })
        .catch((e) => {
          setError(true);
          setErrHeading("Add Attempt Failed");
          setErrBody(
            "There was an error while trying to add this operational training for this user."
          );
        });
      promptAddCancel();
    } catch (err) {
      setErrHeading("Input Error");
      setErrBody(err);
      setError(true);
    }
  }

  const AddEval = () => {
    if (type === "1") {
      return (
        <>
          <h5>Patroller On-Snow Evaluation</h5>

          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <label className="input-group-text" for="inputGroupSelect01">
                Discipline:
              </label>
            </div>

            <select className="form-select" id="OnSnowDisciplines">
              <option selected value={-1}>
                Choose...
              </option>
              {discipline.map((row, index) => (
                <option value={index}>{row.description}</option>
              ))}
            </select>
          </div>

          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <label className="input-group-text">Date Completed</label>
            </div>

            <Form.Control
              type="date"
              name="date_of_birth"
              id="OnSnowTrainingDate"
              // value={date}
              // onChange={(e) => {
              //   setDate(e.target.value);
              // }}
            />
          </div>

          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <label className="input-group-text" for="inputGroupSelect01">
                Evaluated by:
              </label>
            </div>
            <input
              type="text"
              className="form-control"
              id="OnSnowEvalBy"
              name="myEvalInput"
              aria-describedby="emailHelp"
            />
          </div>

          <button className="btn navyButton" onClick={addOnSnowEval}>
            Submit
          </button>
        </>
      );
    } else if (type === "2") {
      return (
        <>
          <h5>Evaluator Snow Training</h5>

          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <label className="input-group-text" for="inputGroupSelect01">
                Event Type
              </label>
            </div>
            <input
              type="text"
              className="form-control"
              id="EvalTrainingEvent"
              name="myEvalInput"
              aria-describedby="emailHelp"
            />
          </div>

          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <label className="input-group-text">Date Completed</label>
            </div>

            <Form.Control
              type="date"
              name="date_of_birth"
              id="EvalTrainingDate"
              // value={date}
              // onChange={(e) => {
              //   setDate(e.target.value);
              // }}
            />
          </div>
          <button className="btn navyButton" onClick={addEvalTraining}>
            Submit
          </button>
        </>
      );
    } else {
      return (
        <>
          <h5>Patroller Operational Training</h5>

          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <label className="input-group-text" for="inputGroupSelect01">
                Event Type
              </label>
            </div>

            <select className="form-select" id="OperationalTrainingEvent">
              <option selected value={-1}>
                Choose...
              </option>
              {operationalEvent.map((row, index) => (
                <option value={index}>{row.description}</option>
              ))}
            </select>
          </div>

          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <label className="input-group-text">Date Completed</label>
            </div>

            <Form.Control
              type="date"
              name="date_of_birth"
              id="OperationalTrainingDate"
              // value={date}
              // onChange={(e) => {
              //   setDate(e.target.value);
              // }}
            />
          </div>
          <button className="btn navyButton" onClick={addOperationalTraining}>
            Submit
          </button>
        </>
      );
    }
  };

  const DeleteEval = () => {
    if (type === "1") {
      return (
        <>
          <h5>Patroller On-Snow Evaluation</h5>
          <div className="form-check mb-3">
            {onSnowEvals.map((row, index) => (
              <div className="form-group">
                <input
                  className="form-check-input"
                  type="checkbox"
                  defaultChecked={false}
                  id={index}
                />
                <label className="form-check-label">
                  {"Discipline: " +
                    row.discipline.description +
                    ", Date Completed: " +
                    row.evaluationDate.substring(0, 10) +
                    ", Evaluated By: " +
                    row.evaluatedBy}
                </label>
              </div>
            ))}
          </div>
          <button className="btn redButton" onClick={deleteOnSnowEvals}>
            Submit
          </button>
        </>
      );
    } else if (type === "2") {
      return (
        <>
          <h5>Evaluator Snow Training</h5>
          <div className="form-check mb-3">
            {evaluationTraining.map((row, index) => (
              <div className="form-group">
                <input
                  className="form-check-input"
                  type="checkbox"
                  defaultChecked={false}
                  id={index}
                />
                <label className="form-check-label">
                  {"Event Type: " +
                    row.eventType +
                    ", Date Completed: " +
                    row.completedDate}
                </label>
              </div>
            ))}
          </div>
          <button className="btn redButton" onClick={deleteEvalTraining}>
            Submit
          </button>
        </>
      );
    } else {
      return (
        <>
          <h5>Patroller Operational Training</h5>
          <div className="form-check mb-3">
            {operationalTraining.map((row, index) => (
              <div className="form-group">
                <input
                  className="form-check-input"
                  type="checkbox"
                  defaultChecked={false}
                  id={index}
                />
                <label className="form-check-label">
                  {"Season: " +
                    row.operationalEvent.description +
                    ", Date Completed: " +
                    row.completedDate}
                </label>
              </div>
            ))}
          </div>
          <button className="btn redButton" onClick={deleteOperationalTraining}>
            Submit
          </button>
        </>
      );
    }
  };

  const EditEval = () => {
    if (type === "1") {
      return (
        <>
          <h5>Patroller On-Snow Evaluation</h5>
          <div className="form-check mb-3">
            {onSnowEvals.map((row, index) => (
              <div className="form-group">
                <input
                  className="form-check-input"
                  type="radio"
                  name="selectEdit"
                  checked={selectedVal === String(index)}
                  value={String(index)}
                  onChange={onSnowEvalEditEvent}
                />
                <label className="form-check-label">
                  {"Discipline: " +
                    row.discipline.description +
                    ", Date Completed: " +
                    row.evaluationDate.substring(0, 10) +
                    ", Evaluated By: " +
                    row.evaluatedBy}
                </label>
              </div>
            ))}
          </div>

          {selectedVal !== "-1" ? (
            <>
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <label className="input-group-text" for="inputGroupSelect01">
                    Discipline:
                  </label>
                </div>

                <select className="form-select" id="OnSnowDisciplinesEdit">
                  {discipline.map((row, index) =>
                    row.description ===
                    onSnowEvals[parseInt(selectedVal)].discipline
                      .description ? (
                      <option selected value={index}>
                        {row.description} (Current Value)
                      </option>
                    ) : (
                      <option value={index}>{row.description}</option>
                    )
                  )}
                </select>
              </div>

              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <label className="input-group-text">Date Completed</label>
                </div>

                <Form.Control
                  type="date"
                  name="date_of_birth"
                  id="OnSnowTrainingDateEdit"
                  defaultValue={
                    onSnowEvals[parseInt(selectedVal)].evaluationDate
                  }
                />
              </div>

              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <label className="input-group-text" for="inputGroupSelect01">
                    Evaluated by:
                  </label>
                </div>
                <input
                  type="text"
                  className="form-control"
                  id="OnSnowEvalByEdit"
                  name="myEvalInput"
                  placeholder={onSnowEvals[parseInt(selectedVal)].evaluatedBy}
                  aria-describedby="emailHelp"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <b>
                  <i>Select an On-Snow Evaluation to Update</i>
                </b>
              </div>
            </>
          )}

          <button className="btn greyButton" onClick={editOnSnowEvals}>
            Submit
          </button>
        </>
      );
    } else if (type === "2") {
      return (
        <>
          <h5>Evaluator Snow Training</h5>
          <div className="form-check mb-3">
            {evaluationTraining.map((row, index) => (
              <div className="form-group">
                <input
                  className="form-check-input"
                  type="radio"
                  name="selectEdit"
                  checked={selectedVal === String(index)}
                  value={String(index)}
                  onChange={evalTrainingEditEvent}
                />
                <label className="form-check-label">
                  {"Event Type: " +
                    row.eventType +
                    ", Date Completed: " +
                    row.completedDate}
                </label>
              </div>
            ))}
          </div>

          {selectedVal !== "-1" ? (
            <>
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <label className="input-group-text" for="inputGroupSelect01">
                    Event Type
                  </label>
                </div>
                <input
                  type="text"
                  className="form-control"
                  id="EvalTrainingEventEdit"
                  name="myEvalInput"
                  placeholder={
                    evaluationTraining[parseInt(selectedVal)].eventType
                  }
                  aria-describedby="emailHelp"
                />
              </div>

              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <label className="input-group-text">Date Completed</label>
                </div>

                <Form.Control
                  type="date"
                  name="date_of_birth"
                  id="EvalTrainingDateEdit"
                  defaultValue={
                    evaluationTraining[parseInt(selectedVal)].completedDate
                  }
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <b>
                  <i>Select an Evaluation Training to Update</i>
                </b>
              </div>
            </>
          )}

          <button className="btn greyButton" onClick={editEvalTraining}>
            Submit
          </button>
        </>
      );
    } else {
      return (
        <>
          <h5>Patroller Operational Training</h5>
          <div className="form-check mb-3">
            {operationalTraining.map((row, index) => (
              <div className="form-group">
                <input
                  className="form-check-input"
                  type="radio"
                  name="selectEdit"
                  checked={selectedVal === String(index)}
                  value={String(index)}
                  onChange={operationalTrainingEditEvent}
                />
                <label className="form-check-label">
                  {"Season: " +
                    row.operationalEvent.description +
                    ", Date Completed: " +
                    row.completedDate}
                </label>
              </div>
            ))}
          </div>

          {selectedVal !== "-1" ? (
            <>
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <label className="input-group-text" for="inputGroupSelect01">
                    Event Type
                  </label>
                </div>
                <select
                  className="form-select"
                  id="OperationalTrainingEventEdit"
                >
                  {operationalEvent.map((row, index) =>
                    row.description ===
                    operationalTraining[parseInt(selectedVal)].operationalEvent
                      .description ? (
                      <option selected value={index}>
                        {row.description} (Current Value){" "}
                      </option>
                    ) : (
                      <option value={index}>{row.description}</option>
                    )
                  )}
                </select>
              </div>

              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <label className="input-group-text">Date Completed</label>
                </div>

                <Form.Control
                  type="date"
                  name="date_of_birth"
                  id="OperationalTrainingDateEdit"
                  defaultValue={
                    operationalTraining[parseInt(selectedVal)].completedDate
                  }
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <b>
                  <i>Select an Operational Training to Update</i>
                </b>
              </div>
            </>
          )}
          <button className="btn greyButton" onClick={editOperationalTraining}>
            Submit
          </button>
        </>
      );
    }
  };

  function readNewTrainingAndEvals() {
    var id = userID;
    var url =
      "userID=" +
      id +
      "&getEvalTrainings=true&getOpTrainings=true&getOnSnowEvals=true";
    session
      .get("profile/user/TrainingAndEvaluation?" + url, {}, {}, true)
      .then((resp) => {
        if (resp.status === 200) {
          setOnSnowEvals(resp.data.onSnowEvals);
          setOperationalTraining(resp.data.operationalTrainings);
          setEvaluationTraining(resp.data.evalTrainings);
        }
      });
  }

  useEffect(() => {
    session.get("users/" + userID).then((resp) => {
      if (resp.status === 200) {
        setUser(resp.data);
      }
    });

    session.get("operationalEvents").then((resp) => {
      if (resp.status === 200) {
        setOperationalEvent(resp.data._embedded.operationalEvents);
      }
    });

    session.get("disciplines").then((resp) => {
      if (resp.status === 200) {
        setDisciplines(resp.data._embedded.disciplines);
      }
    });
    readNewTrainingAndEvals();
  }, []);

  return (
    <>
      <div className="card">
        <div className="card-header">
          <h4>
            <b>Training and Evaluation</b>
          </h4>
        </div>

        <div className="card-body">
          {onSnowEvals.length !== 0 && (
            <div>
              <h5>
                <b>Patroller On-Snow Evaluations</b>
              </h5>
              <table
                className="table table-bordered hover myMiniTable"
                it="sortTable"
              >
                <thead>
                  <tr>
                    <th className="tdbreak" scope="col">
                      Discipline
                    </th>
                    <th className="tdbreak" scope="col">
                      Evaluation Date
                    </th>
                    <th className="tdbreak" scope="col">
                      Evaluation By
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {onSnowEvals.map((row) => (
                    <tr>
                      <td className="tdbreak">{row.discipline.description}</td>
                      <td className="tdbreak">
                        {row.evaluationDate.substring(0, 10)}
                      </td>
                      <td className="tdbreak">{row.evaluatedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {evaluationTraining.length !== 0 && (
            <div>
              <h5>
                <b>Evaluator Training</b>
              </h5>
              <table
                className="table table-bordered hover myMiniTable"
                it="sortTable"
              >
                <thead>
                  <tr>
                    <th className="tdbreak" scope="col">
                      Event Type
                    </th>
                    <th className="tdbreak" scope="col">
                      Completion Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {evaluationTraining.map((row) => (
                    <tr>
                      <td className="tdbreak">{row.eventType}</td>
                      <td className="tdbreak">
                        {row.completedDate.substring(0, 10)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {operationalTraining.length !== 0 && (
            <div>
              <h5>
                <b>Patroller Operational Training</b>
              </h5>
              <table
                className="table table-bordered hover myMiniTable"
                it="sortTable"
              >
                <thead>
                  <tr>
                    <th className="tdbreak" scope="col">
                      Operational Event
                    </th>
                    <th className="tdbreak" scope="col">
                      Completion Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {operationalTraining.map((row) => (
                    <tr>
                      <td className="tdbreak">
                        {row.operationalEvent.description}
                      </td>
                      <td className="tdbreak">
                        {row.completedDate.substring(0, 10)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {allowed && (
            <button
              className="btn m-1 navyButton"
              type="button"
              onClick={promptAddOpen}
            >
              Add
            </button>
          )}

          {allowed && (
            <button
              className="btn m-1 greyButton"
              type="button"
              onClick={promptEditOpen}
            >
              Edit
            </button>
          )}

          {allowed && (
            <button
              className="btn m-1 redButton"
              type="button"
              onClick={promptDeleteOpen}
            >
              Delete
            </button>
          )}
        </div>

        <Modal
          className="ProfileModal"
          show={addPrompted}
          onHide={promptAddCancel}
        >
          <Modal.Header closeButton>
            <Modal.Title>Add New Training Evaluation Certification</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form className="mb-2">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <label className="input-group-text" for="inputGroupSelect01">
                    Training Type
                  </label>
                </div>
                <Form.Control
                  as="select"
                  custom
                  onChange={OnChangeVal.bind(this)}
                >
                  <option selected value="1">
                    Patroller On-Snow Evaluation
                  </option>
                  <option value="2">Evaluator Training</option>
                  <option value="3">Patroller Operational Training</option>
                </Form.Control>
              </div>
              <AddEval />
            </form>
          </Modal.Body>
        </Modal>

        <Modal
          className="ProfileModal"
          show={editPrompted}
          onHide={promptEditCancel}
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Training Evaluation Certification</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form className="mb-2">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <label className="input-group-text" for="inputGroupSelect01">
                    Training Type
                  </label>
                </div>
                <Form.Control
                  as="select"
                  custom
                  onChange={OnChangeVal.bind(this)}
                >
                  <option selected value="1">
                    Patroller On-Snow Evaluation
                  </option>
                  <option value="2">Evaluator Training</option>
                  <option value="3">Patroller Operational Training</option>
                </Form.Control>
              </div>
              <EditEval />
            </form>
          </Modal.Body>
        </Modal>

        <Modal
          className="ProfileModal"
          show={deletePrompted}
          onHide={promptDeleteCancel}
        >
          <Modal.Header closeButton>
            <Modal.Title>Delete Training Evaluation Certifications</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form className="mb-2">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <label className="input-group-text" for="inputGroupSelect01">
                    Training Type
                  </label>
                </div>
                <Form.Control
                  as="select"
                  custom
                  onChange={OnChangeVal.bind(this)}
                >
                  <option selected value="1">
                    Patroller On-Snow Evaluation
                  </option>
                  <option value="2">Evaluator Training</option>
                  <option value="3">Patroller Operational Training</option>
                </Form.Control>
              </div>
              <DeleteEval />
            </form>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default TrainingAndEval;
