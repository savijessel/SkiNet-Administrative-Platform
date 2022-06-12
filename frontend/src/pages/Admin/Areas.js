import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { Container } from "react-bootstrap";
import $ from "jquery";
import "./Areas.css";

const AreasPage = ({ session }) => {
  const [areas, setAreas] = useState([]);
  const [adding, setAdding] = useState(true);

  function addNewArea() {
    const areaName = $("#addArea").val();
    console.log("new area name: ", areaName);
  }

  useEffect(() => {
    session.get("areas").then((resp) => {
      if (resp.status === 200) {
        setAreas(resp.data._embedded.areas);
      }
    });
  }, []);

  return (
    <>
      {/* <table class="table">
        <thead>
          <tr>
            <th scope="col">Area Name</th>
          </tr>
        </thead>
        <tbody>
          {areas.map((row) => (
            <tr key={row.areaname}>
              <th>{row.areaname}</th>
            </tr>
          ))}
        </tbody>
      </table> */}
      <div className="row cardRow">
        {adding ? (
          <div
            onClick={() => {
              setAdding(false);
            }}
            className="card text-center areaCard col"
          >
            <div className="card-body">
              <div>
                <FaPlus className="giantPlusSign" size="100px" />
              </div>
            </div>
          </div>
        ) : (
          <div className="card areaCard col">
            <div className="card-body">
              <h5 className="card-title"> Add New Area: </h5>
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <label className="input-group-text" for="inputGroupSelect01">
                    Area Name:
                  </label>
                </div>
                <input
                  type="text"
                  className="form-control"
                  id="addArea"
                  name="myEvalInput"
                  aria-describedby="emailHelp"
                />
              </div>
              <button
                onClick={() => {
                  setAdding(true);
                  addNewArea();
                }}
                className="btn btn-primary"
              >
                Save
              </button>
            </div>
          </div>
        )}

        {areas.map((row) => (
          <div className="card areaCard col">
            <div className="card-body">
              <h5 className="card-title"> {row.areaname}</h5>
              <p>Area information</p>
              <button className="btn btn-primary">Edit</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default AreasPage;
