import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Modal, Button } from "react-bootstrap";
import $ from "jquery";
import Alert from "react-bootstrap/Alert";

export default function AreaLookup({ session, error }) {
  const [areas, setAreas] = useState(new Map());
  const [deletePrompted, setDeletePrompted] = useState(false);
  const [creationPrompted, setCreatePrompted] = useState(false);

  //   function addNewArea() {
  //     const areaName = $("#addArea").val();
  //     console.log("new area name: ", areaName);
  //   }

  function promptDeleteOpen() {
    setDeletePrompted(true);
  }

  function promptDeleteCancel() {
    setDeletePrompted(false);
  }

  function promptDeleteExecute() {
    const params = new URLSearchParams();
    areas.forEach((v, k) => {
      if (v.selected) {
        params.append("ids", k);
      }
    });
    session
      .delete("lookups/area/deleteInBatch?" + params.toString(), {}, {}, true)
      .then((response) => {
        if (response.status == 200) {
          getAreas();
        }
      })
      .catch((e) => {
        console.log(e);
        error(true);
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
    const newAreaName = $("#area-name").val();
    session
      .post("areas", { areaname: newAreaName }, {}, false)
      .then((response) => {
        if (response.status == 201) {
          getAreas();
        }
      })
      .catch((e) => {
        console.log(e);
      });
    setCreatePrompted(false);
  }

  function getAreas() {
    session.get("areas").then((resp) => {
      if (resp.status === 200) {
        var updatedAreas = new Map();
        console.log(resp.data._embedded.areas);
        resp.data._embedded.areas.map((b) => {
          updatedAreas.set(b.areaID, {
            description: b.areaname,
            selected: false,
          });
        });
        setAreas(new Map(updatedAreas));
      }
    });
  }

  useEffect(() => {
    getAreas();
  }, []);

  return (
    <div className="col-4 p-3">
      <h5>Areas</h5>
      <div className="overflow-auto" data-spy="scroll">
        <ul className="list-group scrollableList ">
          {Array.from(areas).map((kv) => {
            const k = kv[0];
            const v = kv[1].description;
            const selected = kv[1].selected;
            return (
              <li
                key={k}
                onClick={() => {
                  var selectedAreaItem = areas.get(k);
                  areas.set(k, {
                    description: selectedAreaItem.description,
                    selected: !selectedAreaItem.selected,
                  });
                  setAreas(new Map(areas));
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
            {Array.from(areas).map((vk) => {
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
          {/* <button className="btn redButton" onClick={promptDeleteCancel}>
            Close
          </button> */}
        </Modal.Footer>
      </Modal>

      <Modal show={creationPrompted} onHide={promptCreateCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Create a look-up item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label htmlFor="area-name" className="col-form-label">
                Area Name:
              </label>
              <input type="text" className="form-control" id="area-name" />
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
}
