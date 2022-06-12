import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Modal, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import "./UserProfileEdit.css";
import $ from "jquery";
import Alert from "react-bootstrap/Alert";

const PatrolUniformAndEquipment = ({
  session,
  userID,
  allowed,
  error,
  setError,
  setErrBody,
  setErrHeading,
}) => {
  const [user, setUser] = useState([]);
  const [uniform, setUniform] = useState([]);

  const [brands, setBrands] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [conditions, setConditions] = useState([]);

  const [jackets, setJackets] = useState([]);
  const [vests, setVests] = useState([]);
  const [packs, setPacks] = useState([]);
  const [signed, setSigned] = useState(false);
  const [returned, setReturned] = useState(false);

  const [addPrompted, setAddPrompted] = useState(false);
  const [editPrompted, setEditPrompted] = useState(false);
  const [deletePrompted, setDeletePrompted] = useState(false);

  // const [error, setError] = useState(false);
  const [jacketSelectedVal, setJacketSelectedVal] = useState("-1");
  const [packSelectedVal, setPackSelectedVal] = useState("-1");
  const [vestSelectedVal, setVestSelectedVal] = useState("-1");

  function jacketEditEvent(event) {
    let temp = event.target.value;
    setJacketSelectedVal(String(temp));
  }

  function packEditEvent(event) {
    let temp = event.target.value;
    setPackSelectedVal(String(temp));
  }

  function vestEditEvent(event) {
    let temp = event.target.value;
    setVestSelectedVal(String(temp));
  }

  function editJackets() {
    try {
      if (jacketSelectedVal === "-1")
        throw "One or more of the fields is empty or not selected. Please ensure that all fields are filled correctly.";

      const myBrand = $("#jacketBrandSelectEdit").val();
      const mySize = $("#jacketSizeSelectEdit").val();
      const myCond = $("#jacketConditionSelectEdit").val();
      const myNum = $("#jacketNumberSelectEdit").val();

      let temp = {
        jacketID: jackets[parseInt(jacketSelectedVal)].jacketID,
        number: myNum,
        brand: brands[myBrand].description,
        condition: conditions[myCond].description,
        size: sizes[mySize].description,
        uniform: uniform.uniformID,
      };

      if (myNum.length == 0) {
        temp.number = jackets[parseInt(jacketSelectedVal)].number.toString();
      }

      session
        .put("profile/jacket", temp, {}, true)
        .then((resp) => {
          if (resp.status === 200 || resp.status === 201) {
            if (uniform) readNewUniform();
          }
        })
        .catch((e) => {
          setError(true);
          setErrHeading("Edit Attempt Failed");
          setErrBody("A jacket with this number is already being used.");
        });
      promptEditCancel();
    } catch (e) {
      setError(true);
      setErrHeading("Input Error");
      setErrBody(e);
    }
  }

  function editPacks() {
    try {
      if (packSelectedVal === "-1")
        throw "One or more of the fields is empty or not selected. Please ensure that all fields are filled correctly.";

      const myBrand = $("#packBrandSelectEdit").val();
      const myCond = $("#packConditionSelectEdit").val();
      const myNum = $("#packNumberSelectEdit").val();

      let temp = {
        packID: packs[parseInt(packSelectedVal)].packID,
        number: myNum,
        brand: brands[myBrand].description,
        condition: conditions[myCond].description,
        uniform: uniform.uniformID,
      };

      if (myNum.length == 0) {
        temp.number = packs[parseInt(packSelectedVal)].number.toString();
      }

      console.log("Sent to put req...", JSON.stringify(temp));

      session
        .put("profile/pack", temp, {}, true)
        .then((resp) => {
          if (resp.status === 200 || resp.status === 201) {
            console.log(resp);
            if (uniform) readNewUniform();
          }
        })
        .catch((e) => {
          setError(true);
          setErrHeading("Edit Attempt Failed");
          setErrBody("A Pack with this number is already being used.");
        });
      promptEditCancel();
    } catch (e) {
      setError(true);
      setErrHeading("Input Error");
      setErrBody(e);
    }
  }

  function editVests() {
    try {
      if (vestSelectedVal === "-1")
        throw "One or more of the fields is empty or not selected. Please ensure that all fields are filled correctly.";

      const myBrand = $("#vestBrandSelectEdit").val();
      const mySize = $("#vestSizeSelectEdit").val();
      const myCond = $("#vestConditionSelectEdit").val();
      const myNum = $("#vestNumberSelectEdit").val();

      let temp = {
        vestID: vests[parseInt(vestSelectedVal)].vestID,
        number: myNum,
        brand: brands[myBrand].description,
        condition: conditions[myCond].description,
        size: sizes[mySize].description,
        uniform: uniform.uniformID,
      };

      if (myNum.length == 0) {
        temp.number = vests[parseInt(vestSelectedVal)].number.toString();
      }

      console.log("Sent to put req...", JSON.stringify(temp));

      session
        .put("profile/vest", temp, {}, true)
        .then((resp) => {
          if (resp.status === 200 || resp.status === 201) {
            console.log(resp);
            if (uniform) readNewUniform();
          }
        })
        .catch((e) => {
          setError(true);
          setErrHeading("Edit Attempt Failed");
          setErrBody("A Vest with this number is already being used.");
        });
      promptEditCancel();
    } catch (e) {
      setError(true);
      setErrHeading("Input Error");
      setErrBody(e);
    }
  }

  function deletePacks() {
    const params = new URLSearchParams();
    let temp = [];
    for (const x in packs) {
      temp.push($("#" + packs[x].packID).is(":checked"));
    }
    for (const y in packs) {
      if (temp[y]) {
        params.append("ids", packs[y].packID);
      }
    }

    session
      .delete(
        "profile/user/Packs/deleteInBatch?" + params.toString(),
        {},
        {},
        true
      )
      .then((response) => {
        if (response.status == 200) {
          if (uniform) readNewUniform();
        }
      })
      .catch((e) => {
        console.log(e);
      });

    setDeletePrompted(false);
  }

  function deleteVests() {
    const params = new URLSearchParams();
    let temp = [];
    for (const x in vests) {
      temp.push($("#" + vests[x].vestID).is(":checked"));
    }
    for (const y in vests) {
      if (temp[y]) {
        params.append("ids", vests[y].vestID);
      }
    }

    session
      .delete(
        "profile/user/Vests/deleteInBatch?" + params.toString(),
        {},
        {},
        true
      )
      .then((response) => {
        if (response.status == 200) {
          if (uniform) readNewUniform();
        }
      })
      .catch((e) => {
        console.log(e);
      });

    setDeletePrompted(false);
  }

  function deleteJackets() {
    const params = new URLSearchParams();
    let temp = [];
    for (const x in jackets) {
      temp.push($("#" + jackets[x].jacketID).is(":checked"));
    }
    for (const y in jackets) {
      if (temp[y]) {
        params.append("ids", jackets[y].jacketID);
      }
    }

    session
      .delete(
        "profile/user/Jackets/deleteInBatch?" + params.toString(),
        {},
        {},
        true
      )
      .then((response) => {
        if (response.status == 200) {
          if (uniform) readNewUniform();
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
    setDeletePrompted(false);
  }

  function promptAddOpen() {
    setAddPrompted(true);
  }

  function promptAddCancel() {
    setAddPrompted(false);
  }

  function promptEditOpen() {
    setEditPrompted(true);
  }

  function promptEditOpen() {
    setEditPrompted(true);
  }

  function promptEditCancel() {
    setJacketSelectedVal("-1");
    setPackSelectedVal("-1");
    setVestSelectedVal("-1");
    setEditPrompted(false);
    setError(false);
  }

  function editLease() {
    let temp = { uniformID: uniform.uniformID };

    temp.returned = $("#LeaseReturnedEdit").is(":checked") ? "True" : "False";
    temp.leaseSigned = $("#LeaseSignedEdit").is(":checked") ? "True" : "False";

    session
      .put("profile/uniform/returnedLeaseSigned", temp, {}, true)
      .then((resp) => {
        if (resp.status === 200 || resp.status === 201) {
          if (uniform) readNewUniform();
        }
      });

    promptEditCancel();
  }

  function addNewJacket() {
    try {
      const myBrand = $("#jacketBrandSelect").val();
      const mySize = $("#jacketSizeSelect").val();
      const myCond = $("#jacketConditionSelect").val();
      const myNum = $("#jacketNumberSelect").val();

      if (
        myBrand === -1 ||
        mySize === -1 ||
        myCond === -1 ||
        myNum.length === 0
      ) {
        throw "One or more of the fields is empty or not selected. Please ensure that all fields are filled correctly.";
      }
      session
        .post(
          "jackets",
          {
            number: myNum.toString(),
            brand: brands[myBrand]._links.self.href,
            size: sizes[mySize]._links.self.href,
            condition: conditions[myCond]._links.self.href,
            uniform: uniform._links.self.href,
          },
          {},
          false
        )
        .then((resp) => {
          if (resp.status === 201) {
            if (uniform) readNewUniform();
            setError(false);
          }
        })
        .catch((e) => {
          setError(true);
          setErrHeading("Add Attempt Failed");
          setErrBody("A jacket with this number is already being used.");
        });
    } catch (e) {
      setError(true);
      setErrHeading("Input Error");
      setErrBody(e);
    }
  }

  function addNewVest() {
    try {
      const myBrand = $("#vestBrandSelect").val();
      const mySize = $("#vestSizeSelect").val();
      const myCond = $("#vestConditionSelect").val();
      const myNum = $("#vestNumberSelect").val();

      if (
        myBrand === -1 ||
        mySize === -1 ||
        myCond === -1 ||
        myNum.length === 0
      ) {
        throw "One or more of the fields is empty or not selected. Please ensure that all fields are filled correctly.";
      }

      session
        .post(
          "vests",
          {
            number: myNum.toString(),
            brand: brands[myBrand]._links.self.href,
            size: sizes[mySize]._links.self.href,
            condition: conditions[myCond]._links.self.href,
            uniform: uniform._links.self.href,
          },
          {},
          false
        )
        .then((resp) => {
          if (resp.status === 201) {
            if (uniform) readNewUniform();
            setError(false);
          }
        })
        .catch((e) => {
          setError(true);
          setErrHeading("Add Attempt Failed");
          setErrBody("A Vest with this number is already being used.");
        });
    } catch (e) {
      setError(true);
      setErrHeading("Input Error");
      setErrBody(e);
    }
  }

  function addNewPack() {
    try {
      const myBrand = $("#packBrandSelect").val();
      const myCond = $("#packConditionSelect").val();
      const myNum = $("#packNumberSelect").val();

      if (myBrand === -1 || myCond === -1 || myNum.length === 0) {
        throw "One or more of the fields is empty or not selected. Please ensure that all fields are filled correctly.";
      }

      session
        .post(
          "packs",
          {
            number: myNum.toString(),
            brand: brands[myBrand]._links.self.href,
            condition: conditions[myCond]._links.self.href,
            uniform: uniform._links.self.href,
          },
          {},
          false
        )
        .then((resp) => {
          if (resp.status === 201) {
            if (uniform) readNewUniform();
            setError(false);
          }
        })
        .catch((e) => {
          setError(true);
          setErrHeading("Add Attempt Failed");
          setErrBody("A Pack with this number is already being used.");
        });
    } catch (e) {
      setError(true);
      setErrHeading("Input Error");
      setErrBody(e);
    }
  }

  function readNewUniform() {
    var id = uniform.uniformID;
    var url =
      "uniformID=" + id + "&getVests=true&getJackets=true&getPacks=true";
    session.get("profile/uniform?" + url, {}, {}, true).then((resp) => {
      if (resp.status === 200) {
        setJackets(resp.data.jackets);
        setVests(resp.data.vests);
        setPacks(resp.data.packs);
        setSigned(resp.data.leaseSigned);
        setReturned(resp.data.returned);
      }
    });
  }

  useEffect(() => {
    if (uniform) {
      if (uniform.uniformID) readNewUniform();
    }
  }, [uniform]);

  useEffect(() => {
    session.get("users/" + userID + "/uniforms").then((resp) => {
      if (resp.status === 200) {
        setUniform(resp.data._embedded.uniforms[0]);
      }
    });

    session.get("users/" + userID).then((resp) => {
      if (resp.status === 200) {
        setUser(resp.data);
      }
    });

    session.get("brands").then((resp) => {
      if (resp.status === 200) {
        setBrands(resp.data._embedded.brands);
      }
    });

    session.get("sizes").then((resp) => {
      if (resp.status === 200) {
        setSizes(resp.data._embedded.sizes);
      }
    });

    session.get("conditionses").then((resp) => {
      if (resp.status === 200) {
        setConditions(resp.data._embedded.conditionses);
      }
    });
    //readNewUniform();
  }, []);

  return (
    <>
      <div className="card">
        <form className="mb-0.5">
          <div className="card-header">
            <h4>
              <b>Patrol Uniform and Equipment</b>
            </h4>
          </div>
          <div className="card-body">
            <div>
              <h5>
                <b>Jacket</b>
              </h5>
              <table
                className="table table-bordered hover myMiniTable"
                it="sortTable"
              >
                <thead>
                  <tr>
                    <th className="tdbreak" scope="col">
                      Brand
                    </th>
                    <th className="tdbreak" scope="col">
                      Size
                    </th>
                    <th className="tdbreak" scope="col">
                      Condition
                    </th>
                    <th className="tdbreak" scope="col">
                      Number
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {jackets &&
                    jackets.map((row, index) => (
                      <tr>
                        <td className="tdbreak">{row.brand.description}</td>
                        <td className="tdbreak">{row.size.description}</td>
                        <td className="tdbreak">{row.condition.description}</td>
                        <td className="tdbreak">{row.number}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div>
              <h5>
                <b>Pack</b>
              </h5>
              <table
                className="table table-bordered hover myMiniTable"
                it="sortTable"
              >
                <thead>
                  <tr>
                    <th className="tdbreak" scope="col">
                      Brand
                    </th>
                    <th className="tdbreak" scope="col">
                      Condition
                    </th>
                    <th className="tdbreak" scope="col">
                      Number
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {packs &&
                    packs.map((row, index) => (
                      <tr>
                        <td className="tdbreak">{row.brand.description}</td>
                        <td className="tdbreak">{row.condition.description}</td>
                        <td className="tdbreak">{row.number}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div>
              <h5>
                <b>Vest</b>
              </h5>
              <table
                className="table table-bordered hover myMiniTable"
                it="sortTable"
              >
                <thead>
                  <tr>
                    <th className="tdbreak" scope="col">
                      Brand
                    </th>
                    <th className="tdbreak" scope="col">
                      Size
                    </th>
                    <th className="tdbreak" scope="col">
                      Condition
                    </th>
                    <th className="tdbreak" scope="col">
                      Number
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {vests &&
                    vests.map((row, index) => (
                      <tr>
                        <td className="tdbreak">{row.brand.description}</td>
                        <td className="tdbreak">{row.size.description}</td>
                        <td className="tdbreak">{row.condition.description}</td>
                        <td className="tdbreak">{row.number}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div>
              <b>Lease Signed:</b> <i>{signed ? "Yes" : "No"}</i>
            </div>
            <div>
              <b>Returned:</b> <i>{returned ? "Yes" : "No"}</i>
            </div>

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
        show={addPrompted}
        onHide={promptAddCancel}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Patrol Uniform and Equipment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="card">
            <button
              className="card-header btn"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#jacket"
              aria-expanded="false"
              aria-controls="jacket"
            >
              <h5>Jacket</h5>
            </button>
            <div className="collapse" id="jacket">
              <div className="card-body">
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <label
                      className="input-group-text"
                      htmlFor="inputGroupSelect01"
                    >
                      Brand
                    </label>
                  </div>

                  <select className="form-select" id="jacketBrandSelect">
                    <option selected value={-1}>
                      -
                    </option>
                    {brands.map((row, index) => (
                      <option value={index}>{row.description}</option>
                    ))}
                  </select>
                </div>

                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <label
                      className="input-group-text"
                      htmlFor="inputGroupSelect01"
                    >
                      Size
                    </label>
                  </div>

                  <select className="form-select" id="jacketSizeSelect">
                    <option selected value={-1}>
                      -
                    </option>
                    {sizes.map((row, index) => (
                      <option value={index}>{row.description}</option>
                    ))}
                  </select>
                </div>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <label
                      className="input-group-text"
                      htmlFor="inputGroupSelect01"
                    >
                      Condition
                    </label>
                  </div>

                  <select className="form-select" id="jacketConditionSelect">
                    <option selected value={-1}>
                      -
                    </option>
                    {conditions.map((row, index) => (
                      <option value={index}>{row.description}</option>
                    ))}
                  </select>
                </div>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <label
                      className="input-group-text"
                      htmlFor="jacketNumberSelect"
                    >
                      Number
                    </label>
                  </div>
                  <input
                    className="text-center form-control"
                    type="number"
                    id="jacketNumberSelect"
                    min="0"
                    placeholder={0}
                    data-bind="value:numberSelect"
                  ></input>
                </div>
                <button
                  className="btn navyButton"
                  type="button"
                  onClick={addNewJacket}
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <div className="card">
            <button
              className="card-header btn"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#vest"
              aria-expanded="false"
              aria-controls="vest"
            >
              <h5>Vest</h5>
            </button>

            <div className="collapse" id="vest">
              <div className="card-body">
                <div className="input-group mt-3 mb-3">
                  <div className="input-group-prepend">
                    <label
                      className="input-group-text"
                      htmlFor="inputGroupSelect01"
                    >
                      Brand
                    </label>
                  </div>

                  <select className="form-select" id="vestBrandSelect">
                    <option selected value={-1}>
                      -
                    </option>
                    {brands.map((row, index) => (
                      <option value={index}>{row.description}</option>
                    ))}
                  </select>
                </div>

                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <label
                      className="input-group-text"
                      htmlFor="inputGroupSelect01"
                    >
                      Size
                    </label>
                  </div>

                  <select className="form-select" id="vestSizeSelect">
                    <option selected value={-1}>
                      -
                    </option>
                    {sizes.map((row, index) => (
                      <option value={index}>{row.description}</option>
                    ))}
                  </select>
                </div>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <label
                      className="input-group-text"
                      htmlFor="inputGroupSelect01"
                    >
                      Condition
                    </label>
                  </div>

                  <select className="form-select" id="vestConditionSelect">
                    <option selected value={-1}>
                      -
                    </option>
                    {conditions.map((row, index) => (
                      <option value={index}>{row.description}</option>
                    ))}
                  </select>
                </div>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <label
                      className="input-group-text"
                      htmlFor="vestNumberSelect"
                    >
                      Number
                    </label>
                  </div>
                  <input
                    className="text-center form-control"
                    type="number"
                    id="vestNumberSelect"
                    min="0"
                    placeholder={0}
                    data-bind="value:numberSelect"
                  ></input>
                </div>
                <button
                  className="btn navyButton"
                  type="button"
                  onClick={addNewVest}
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <div className="card">
            <button
              className="card-header btn"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#pack"
              aria-expanded="false"
              aria-controls="pack"
            >
              <h5>Pack</h5>
            </button>
            <div className="collapse" id="pack">
              <div className="card-body">
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <label
                      className="input-group-text"
                      htmlFor="inputGroupSelect01"
                    >
                      Brand
                    </label>
                  </div>

                  <select className="form-select" id="packBrandSelect">
                    <option selected value={-1}>
                      -
                    </option>
                    {brands.map((row, index) => (
                      <option value={index}>{row.description}</option>
                    ))}
                  </select>
                </div>

                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <label
                      className="input-group-text"
                      htmlFor="inputGroupSelect01"
                    >
                      Condition
                    </label>
                  </div>

                  <select className="form-select" id="packConditionSelect">
                    <option selected value={-1}>
                      -
                    </option>
                    {conditions.map((row, index) => (
                      <option value={index}>{row.description}</option>
                    ))}
                  </select>
                </div>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <label
                      className="input-group-text"
                      htmlFor="packNumberSelect"
                    >
                      Number
                    </label>
                  </div>
                  <input
                    className="text-center form-control"
                    type="number"
                    id="packNumberSelect"
                    min="0"
                    placeholder={0}
                    data-bind="value:numberSelect"
                  ></input>
                </div>
                <button
                  className="btn navyButton"
                  type="button"
                  onClick={addNewPack}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        className="ProfileModal"
        show={editPrompted}
        onHide={promptEditCancel}
      >
        <Modal.Header closeButton>
          <Modal.Title>Editing Patrol Uniform and Equipment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="card">
            <button
              className="card-header btn"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#jacketEdit"
              aria-expanded="false"
              aria-controls="jacketEdit"
            >
              <h5>Jacket</h5>
            </button>
            <div className="collapse" id="jacketEdit">
              <div className="card-body">
                <div className="form-check mb-3">
                  {jackets &&
                    jackets.map((row, index) => (
                      <div className="form-group">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="selectJacketEdit"
                          checked={jacketSelectedVal === String(index)}
                          value={String(index)}
                          onChange={jacketEditEvent}
                        />
                        <label className="form-check-label">
                          {"Brand: " +
                            row.brand.description +
                            ", Size: " +
                            row.size.description +
                            ", Condition: " +
                            row.condition.description +
                            ", Number: " +
                            row.number}
                        </label>
                      </div>
                    ))}
                </div>
                {jacketSelectedVal !== "-1" ? (
                  <>
                    <div className="input-group mb-3">
                      <div className="input-group-prepend">
                        <label
                          className="input-group-text"
                          htmlFor="inputGroupSelect01"
                        >
                          Brand
                        </label>
                      </div>

                      <select
                        className="form-select"
                        id="jacketBrandSelectEdit"
                      >
                        {brands.map((row, index) =>
                          row.description ===
                          jackets[parseInt(jacketSelectedVal)].brand
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
                        <label
                          className="input-group-text"
                          htmlFor="inputGroupSelect01"
                        >
                          Size
                        </label>
                      </div>

                      <select className="form-select" id="jacketSizeSelectEdit">
                        {sizes.map((row, index) =>
                          row.description ===
                          jackets[parseInt(jacketSelectedVal)].size
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
                        <label
                          className="input-group-text"
                          htmlFor="inputGroupSelect01"
                        >
                          Condition
                        </label>
                      </div>

                      <select
                        className="form-select"
                        id="jacketConditionSelectEdit"
                      >
                        {conditions.map((row, index) =>
                          row.description ===
                          jackets[parseInt(jacketSelectedVal)].condition
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
                        <label
                          className="input-group-text"
                          htmlFor="jacketNumberSelectEdit"
                        >
                          Number
                        </label>
                      </div>
                      <input
                        className="text-center form-control"
                        type="number"
                        id="jacketNumberSelectEdit"
                        min="0"
                        placeholder={
                          jackets[parseInt(jacketSelectedVal)].number
                        }
                        data-bind="value:numberSelect"
                      ></input>
                    </div>
                  </>
                ) : (
                  <div>
                    <b>
                      <i>Select a Jacket to Update</i>
                    </b>
                  </div>
                )}
                <button
                  className="btn greyButton"
                  type="button"
                  onClick={editJackets}
                >
                  Edit
                </button>
              </div>
            </div>
          </div>

          <div className="card">
            <button
              className="card-header btn"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#vestEdit"
              aria-expanded="false"
              aria-controls="vestEdit"
            >
              <h5>Vest</h5>
            </button>

            <div className="collapse" id="vestEdit">
              <div className="card-body">
                <div className="form-check mb-3">
                  {vests &&
                    vests.map((row, index) => (
                      <div className="form-group">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="selectVestEdit"
                          checked={vestSelectedVal === String(index)}
                          value={String(index)}
                          onChange={vestEditEvent}
                        />
                        <label className="form-check-label">
                          {"Brand: " +
                            row.brand.description +
                            ", Size: " +
                            row.size.description +
                            ", Condition: " +
                            row.condition.description +
                            ", Number: " +
                            row.number}
                        </label>
                      </div>
                    ))}
                </div>
                {vestSelectedVal !== "-1" ? (
                  <>
                    <div className="input-group mt-3 mb-3">
                      <div className="input-group-prepend">
                        <label
                          className="input-group-text"
                          htmlFor="inputGroupSelect01"
                        >
                          Brand
                        </label>
                      </div>

                      <select className="form-select" id="vestBrandSelectEdit">
                        {brands.map((row, index) =>
                          row.description ===
                          vests[parseInt(vestSelectedVal)].brand.description ? (
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
                        <label
                          className="input-group-text"
                          htmlFor="inputGroupSelect01"
                        >
                          Size
                        </label>
                      </div>

                      <select className="form-select" id="vestSizeSelectEdit">
                        {sizes.map((row, index) =>
                          row.description ===
                          vests[parseInt(vestSelectedVal)].size.description ? (
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
                        <label
                          className="input-group-text"
                          htmlFor="inputGroupSelect01"
                        >
                          Condition
                        </label>
                      </div>

                      <select
                        className="form-select"
                        id="vestConditionSelectEdit"
                      >
                        {conditions.map((row, index) =>
                          row.description ===
                          vests[parseInt(vestSelectedVal)].condition
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
                        <label
                          className="input-group-text"
                          htmlFor="vestNumberSelectEdit"
                        >
                          Number
                        </label>
                      </div>
                      <input
                        className="text-center form-control"
                        type="number"
                        id="vestNumberSelectEdit"
                        min="0"
                        placeholder={vests[parseInt(vestSelectedVal)].number}
                        data-bind="value:numberSelect"
                      ></input>
                    </div>
                  </>
                ) : (
                  <div>
                    <b>
                      <i>Select a Vest to Update</i>
                    </b>
                  </div>
                )}
                <button
                  className="btn greyButton"
                  type="button"
                  onClick={editVests}
                >
                  Edit
                </button>
              </div>
            </div>
          </div>

          <div className="card">
            <button
              className="card-header btn"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#packEdit"
              aria-expanded="false"
              aria-controls="packEdit"
            >
              <h5>Pack</h5>
            </button>
            <div className="collapse" id="packEdit">
              <div className="card-body">
                <div className="form-check mb-3">
                  {packs &&
                    packs.map((row, index) => (
                      <div className="form-group">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="selectPackEdit"
                          checked={packSelectedVal === String(index)}
                          value={String(index)}
                          onChange={packEditEvent}
                        />
                        <label className="form-check-label">
                          {"Brand: " +
                            row.brand.description +
                            ", Condition: " +
                            row.condition.description +
                            ", Number: " +
                            row.number}
                        </label>
                      </div>
                    ))}
                </div>

                {packSelectedVal !== "-1" ? (
                  <>
                    <div className="input-group mb-3">
                      <div className="input-group-prepend">
                        <label
                          className="input-group-text"
                          htmlFor="inputGroupSelect01"
                        >
                          Brand
                        </label>
                      </div>

                      <select className="form-select" id="packBrandSelectEdit">
                        {brands.map((row, index) =>
                          row.description ===
                          packs[parseInt(packSelectedVal)].brand.description ? (
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
                        <label
                          className="input-group-text"
                          htmlFor="inputGroupSelect01"
                        >
                          Condition
                        </label>
                      </div>

                      <select
                        className="form-select"
                        id="packConditionSelectEdit"
                      >
                        {conditions.map((row, index) =>
                          row.description ===
                          packs[parseInt(packSelectedVal)].condition
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
                        <label
                          className="input-group-text"
                          htmlFor="packNumberSelect"
                        >
                          Number
                        </label>
                      </div>
                      <input
                        className="text-center form-control"
                        type="number"
                        id="packNumberSelectEdit"
                        min="0"
                        placeholder={packs[parseInt(packSelectedVal)].number}
                        data-bind="value:numberSelect"
                      ></input>
                    </div>
                  </>
                ) : (
                  <div>
                    <b>
                      <i>Select a Pack to Update</i>
                    </b>
                  </div>
                )}
                <button
                  className="btn greyButton"
                  type="button"
                  onClick={editPacks}
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
          <div className="card">
            <button
              className="card-header btn"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#leaseEdit"
              aria-expanded="false"
              aria-controls="leaseEdit"
            >
              <h5>Lease Status</h5>
            </button>

            <div className="collapse" id="leaseEdit">
              <div className="card-body">
                <div className="form-group">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    defaultChecked={signed}
                    id="LeaseSignedEdit"
                  />
                  <label className="form-check-label">Lease Signed</label>
                </div>
                <div className="form-group">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    defaultChecked={returned}
                    id="LeaseReturnedEdit"
                  />
                  <label className="form-check-label">Returned</label>
                </div>
                <button
                  className="btn greyButton"
                  type="button"
                  onClick={editLease}
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        className="ProfileModal"
        show={deletePrompted}
        onHide={promptDeleteCancel}
      >
        <Modal.Header closeButton>
          <Modal.Title>Deleting Patrol Uniform and Equipment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="card">
            <button
              className="card-header btn"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#jacketDel"
              aria-expanded="false"
              aria-controls="jacketDel"
            >
              <h5>Jacket</h5>
            </button>
            <div className="collapse" id="jacketDel">
              <div className="card-body">
                <div className="form-check mb-3">
                  {jackets &&
                    jackets.map((row, index) => (
                      <div className="form-group">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          defaultChecked={false}
                          id={row.jacketID}
                        />
                        <label className="form-check-label">
                          {"Brand: " +
                            row.brand.description +
                            ", Size: " +
                            row.size.description +
                            ", Condition: " +
                            row.condition.description +
                            ", Number: " +
                            row.number}
                        </label>
                      </div>
                    ))}
                </div>
                <button
                  className="btn redButton"
                  type="button"
                  onClick={deleteJackets}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>

          <div className="card">
            <button
              className="card-header btn"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#vestDel"
              aria-expanded="false"
              aria-controls="vestDel"
            >
              <h5>Vest</h5>
            </button>

            <div className="collapse" id="vestDel">
              <div className="card-body">
                <div className="form-check mb-3">
                  {vests &&
                    vests.map((row, index) => (
                      <div className="form-group">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          defaultChecked={false}
                          id={row.vestID}
                        />
                        <label className="form-check-label">
                          {"Brand: " +
                            row.brand.description +
                            ", Size: " +
                            row.size.description +
                            ", Condition: " +
                            row.condition.description +
                            ", Number: " +
                            row.number}
                        </label>
                      </div>
                    ))}
                </div>
                <button
                  className="btn redButton"
                  type="button"
                  onClick={deleteVests}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>

          <div className="card">
            <button
              className="card-header btn"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#packDel"
              aria-expanded="false"
              aria-controls="packDel"
            >
              <h5>Pack</h5>
            </button>
            <div className="collapse" id="packDel">
              <div className="card-body">
                <div className="form-check mb-3">
                  {packs &&
                    packs.map((row, index) => (
                      <div className="form-group">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          defaultChecked={false}
                          id={row.packID}
                        />
                        <label className="form-check-label">
                          {"Brand: " +
                            row.brand.description +
                            ", Condition: " +
                            row.condition.description +
                            ", Number: " +
                            row.number}
                        </label>
                      </div>
                    ))}
                </div>
                <button
                  className="btn redButton"
                  type="button"
                  onClick={deletePacks}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PatrolUniformAndEquipment;
