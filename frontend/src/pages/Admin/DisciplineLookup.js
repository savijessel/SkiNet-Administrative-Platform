import React, { useState, useEffect } from "react";
import $ from "jquery";
import "./Lookups.css";
import { Button, Modal } from "react-bootstrap";

const DisciplineLookup = ({ session, error }) => {
  const [discipline, setDiscipline] = useState(new Map());
  const [deletePrompted, setDeletePrompted] = useState(false);
  const [creationPrompted, setCreatePrompted] = useState(false);

  function getDisciplines() {
    session.get("disciplines").then((resp) => {
      if (resp.status === 200) {
        var updatedDisciplines = new Map();
        resp.data._embedded.disciplines.map((b) => {
          updatedDisciplines.set(b.disciplineID, {
            description: b.description,
            selected: false,
          });
        });
        setDiscipline(new Map(updatedDisciplines));
      }
    });
  }

  useEffect(() => {
    getDisciplines();
  }, []);

  function promptDeleteOpen() {
    setDeletePrompted(true);
  }

  function promptDeleteCancel() {
    setDeletePrompted(false);
  }

  function promptDeleteExecute() {
    const params = new URLSearchParams();
    discipline.forEach((v, k) => {
      if (v.selected) {
        params.append("ids", k);
      }
    });
    session
      .delete(
        "lookups/discipline/deleteInBatch?" + params.toString(),
        {},
        {},
        true
      )
      .then((response) => {
        if (response.status == 200) {
          getDisciplines();
        }
      })
      .catch((e) => {
        error(true);
        console.log(e);
      });
    setDeletePrompted(false);
  }

  function promptCreateOpen() {
    setCreatePrompted(true);
  }

  function promptCreateCancel() {
    setCreatePrompted(false);
  }

  function promptCreateExecute() {
    const newDisciplineName = $("#discipline-name").val();
    session
      .post("disciplines", { description: newDisciplineName }, {}, false)
      .then((response) => {
        if (response.status == 201) {
          getDisciplines();
        }
      })
      .catch((e) => {
        console.log(e);
      });
    setCreatePrompted(false);
  }

  return (
    <div className="col-4 p-3">
      <h5>Discipline</h5>
      <div className="overflow-auto" data-spy="scroll">
        <ul className="list-group scrollableList ">
          {Array.from(discipline).map((kv) => {
            const k = kv[0];
            const v = kv[1].description;
            const selected = kv[1].selected;
            return (
              <li
                key={k}
                onClick={() => {
                  var selectedDisciplineItem = discipline.get(k);
                  discipline.set(k, {
                    description: selectedDisciplineItem.description,
                    selected: !selectedDisciplineItem.selected,
                  });
                  setDiscipline(new Map(discipline));
                }}
                className={"list-group-item " + (selected ? "active" : "")}
              >
                {v}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="d-flex flex-row-reverse mt-1">
        <div className="btn-group" role="group" aria-label="Basic example">
          <button
            type="button"
            onClick={promptDeleteOpen}
            className="btn redButton"
          >
            Delete
          </button>
          <button
            type="button"
            onClick={promptCreateOpen}
            className="btn navyButton"
          >
            Add
          </button>
        </div>
      </div>

      <Modal show={deletePrompted} onHide={promptDeleteCancel}>
        <Modal.Header closeButton>
          <Modal.Title>
            Are you sure you want to delete these items?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul className="list-group">
            {Array.from(discipline).map((vk) => {
              if (vk[1].selected) {
                return (
                  <li className="list-group-item" key={vk[0]}>
                    {vk[1].description}
                  </li>
                );
              }
            })}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn navyButton" onClick={promptDeleteExecute}>
            Save Changes
          </button>
          {/* <Button variant="secondary" onClick={promptDeleteCancel}>
            Close
          </Button> */}
        </Modal.Footer>
      </Modal>

      <Modal show={creationPrompted} onHide={promptCreateCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Create a look-up item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label htmlFor="discipline-name" className="col-form-label">
                Discipline Name:
              </label>
              <input
                type="text"
                className="form-control"
                id="discipline-name"
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn navyButton" onClick={promptCreateExecute}>
            Save Changes
          </button>
          {/* <Button variant="secondary" onClick={promptCreateCancel}>
            Close
          </Button> */}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DisciplineLookup;
