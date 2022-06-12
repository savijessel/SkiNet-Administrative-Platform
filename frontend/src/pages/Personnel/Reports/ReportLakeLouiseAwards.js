import { map } from "jquery";
import React, { useState, useEffect, useContext } from "react";
import { Form } from "react-bootstrap";
import FilterContext from "./ReportFilterContext";

export default function ReportLakeLouiseRoles({ session }) {
  const [checked, setChecked] = useState([]);
  const [awards, setAwards] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [sortedSeasons, setSortedSeasons] = useState([]);

  const [state, setState] = useContext(FilterContext);

  function updateAwards(awardsChecked) {
    var reportedAwards = [];
    for (let i = 0; i < Object.keys(awardsChecked).length; i++) {
      if (awardsChecked[i] === true) {
        reportedAwards.push(awards[i].description);
      }
    }

    setState((state) => ({
      ...state,
      awards: Object.keys(reportedAwards).length === 0 ? null : reportedAwards,
    }));

    setChecked(awardsChecked);
  }

  const toggleCheck = (inputName) => {
    setChecked((prevState) => {
      const newState = { ...prevState };
      newState[inputName] = !prevState[inputName];
      return newState;
    });
  };

  useEffect(() => {
    session.get("awards").then((resp) => {
      if (resp.status === 200) {
        setAwards(resp.data._embedded.awards);
      }
    });

    session.get("seasons").then((resp) => {
      if (resp.status === 200) {
        setSeasons(resp.data._embedded.seasons);
      }
    });
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

  useEffect(() => {
    setChecked(Array(awards.length).fill(false)); //
  }, [awards]);

  return (
    <>
      <div class="card">
        <a
          class="card-header btn "
          data-bs-toggle="collapse"
          href="#LLAwards"
          role="button"
          aria-expanded="false"
          aria-controls="LLAwards"
        >
          Lake Louise Awards
        </a>

        <div class="collapse" id="LLAwards">
          <div class="card-body">
            <h5>
              <b>Award(s):</b>
            </h5>
            <form>
              <div class="form-check">
                <div class="row row-cols-1">
                  {awards.map((row, index) => (
                    <div class="col">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        name="nr1"
                        onChange={() => {
                          /** On change, toggle checked array */

                          const temp = { ...checked };
                          temp[index] = !temp[index];
                          updateAwards(temp);
                        }}
                        checked={checked[index]}
                        id="selectAwards"
                      />
                      <label>{row.description}</label>
                    </div>
                  ))}
                </div>
              </div>
            </form>
            {/* <div class="mt-3">
              <h5>
                <b>Season:</b>
              </h5>
              <div class="input-group mb-2">
                <div class="input-group-prepend">
                  <label class="input-group-text" for="inputGroupSelect01">
                    From
                  </label>
                </div>

                <Form.Control
                  as="select"
                  custom
                  onChange={OnChangeVal.bind(this)}
                >
                  <option
                    class="text-center"
                    selected
                    value="asdfasdfasdfasdf1"
                  >
                    -
                  </option>

                  {sortedSeasons.map((row) => (
                    <option class="text-center" value={row}>
                      {row.description}
                    </option>
                  ))}
                </Form.Control>
                <label class="input-group-text" for="inputGroupSelect01">
                  To
                </label>
                <Form.Control
                  as="select"
                  custom
                  onChange={OnChangeVal.bind(this)}
                >
                  <option
                    class="text-center"
                    selected
                    value="asdfasdfasdfasdf2"
                  >
                    -
                  </option>
                  {sortedSeasons.map((row) => (
                    <option class="text-center" value={row}>
                      {row.description}
                    </option>
                  ))}
                </Form.Control>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}
