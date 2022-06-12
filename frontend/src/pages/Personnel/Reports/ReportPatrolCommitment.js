import React, { useState, useEffect, useContext } from "react";
import { Form } from "react-bootstrap";
import $ from "jquery";

import FilterContext from "./ReportFilterContext";

export default function ReportPatrolCommitment({
  session,
  patComResult,
  setPatComResult,
}) {
  const [seasons, setSeasons] = useState([]);
  const [sortedSeasons, setSortedSeasons] = useState([]);
  const [state, setState] = useContext(FilterContext);

  function readValues() {
    let patCom = {};

    try {
      const achieved = $("#selectCommitmentAchieved").val();
      const seasonFrom = $("#selectSeasonFrom").val();
      //const seasonTo = $("#selectSeasonTo").val();
      // const notes = $("#selectNotes").val(); // || notes === "-1"
      const days = $("#selectDays").val();

      if (achieved === "-1" || seasonFrom === -1 || days === null) {
        throw "incorrect input";
      }

      console.log(
        "Achieved: ",
        achieved,
        "season From: ",
        sortedSeasons[seasonFrom].description,
        "days: ",
        days
      );

      patCom = {
        commitmentAchieved: achieved === "Yes" ? true : false,
        numberofCommitmentDays: parseInt(days),
        season: sortedSeasons[seasonFrom].description,
      };
      setPatComResult(patCom);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    $("#selectCommitmentAchieved").on("change", function (e) {
      const selected = $(e.currentTarget).val();
      // setState((state) => ({
      //   ...state,
      //   hasEmergencyContact: !state.hasEmergencyContact,
      // }));
      setState((state) => ({
        ...state,
        commitmentAchieved:
          selected === "Yes" || selected === "No" ? selected === "Yes" : null,
      }));
    });

    $("#selectSeasonFrom").on("change", function (e) {
      const selected = $(e.currentTarget).val();
      // setState((state) => ({
      //   ...state,
      //   hasEmergencyContact: !state.hasEmergencyContact,
      // }));
      // console.log("asdasda", selected);
      setState((state) => ({
        ...state,
        //wont work- placeholder  ----- Should work now maybe?
        season: selected === "-1" ? null : selected,
      }));
    });

    $("#selectDaysMin").on("change", function (e) {
      const selected = $(e.currentTarget).val();
      // setState((state) => ({
      //   ...state,
      //   hasEmergencyContact: !state.hasEmergencyContact,
      // }));
      // console.log("asdasda", selected);
      setState((state) => ({
        ...state,
        //wont work- placeholder  ----- Should work now maybe?
        commitmentDaysLower:
          selected === "-1" || selected === null ? null : selected,
      }));
    });

    $("#selectDaysMax").on("change", function (e) {
      const selected = $(e.currentTarget).val();
      // setState((state) => ({
      //   ...state,
      //   hasEmergencyContact: !state.hasEmergencyContact,
      // }));
      // console.log("asdasda", selected);
      setState((state) => ({
        ...state,
        //wont work- placeholder  ----- Should work now maybe?
        commitmentDaysUpper:
          selected === "-1" || selected === null ? null : selected,
      }));
    });

    $("#hasNotes").on("change", function (e) {
      const selected = $(e.currentTarget).val();

      setState((state) => ({
        ...state,
        hasNotes:
          selected === "Yes" || selected === "No" ? selected === "Yes" : null,
      }));
    });
  }, []);

  function OnChangeVal(event) {
    //setType(event.target.value);
    console.log("fuck you");
  }

  useEffect(() => {
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
    // console.log("asdasda", sortedSeasons);
  }, [seasons]);

  return (
    <>
      <div class="card">
        <a
          class="card-header btn "
          data-bs-toggle="collapse"
          href="#PatrCom"
          role="button"
          aria-expanded="false"
          aria-controls="PatrCom"
        >
          Patrol Commitment
        </a>

        <div class="collapse" id="PatrCom">
          <div class="card-body">
            <div class="mt-3">
              <div class="input-group mb-2">
                <div class="input-group-prepend">
                  <label class="input-group-text" for="inputGroupSelect01">
                    Commitment Achieved:
                  </label>
                </div>
                <Form.Control as="select" custom id="selectCommitmentAchieved">
                  <option class="text-center" value="-1" selected>
                    -
                  </option>
                  <option class="text-center" value="Yes">
                    Yes
                  </option>
                  <option class="text-center" value="No">
                    No
                  </option>
                  <option class="text-center" value="Inactive">
                    Inactive
                  </option>
                </Form.Control>
              </div>

              <div class="input-group mb-2">
                <div class="input-group-prepend">
                  <label class="input-group-text" for="inputGroupSelect01">
                    Commitment Days
                  </label>
                </div>
                <input
                  class="text-center form-control"
                  type="number"
                  id="selectDaysMin"
                  min="-1"
                  placeholder="-"
                  data-bind="value:selectDaysMin"
                />
                <label class="input-group-text" for="inputGroupSelect01">
                  to
                </label>
                <input
                  class="text-center form-control"
                  type="number"
                  id="selectDaysMax"
                  min="-1"
                  placeholder="-"
                  data-bind="value:selectDaysMax"
                />
              </div>

              <div class="input-group mb-2">
                <div class="input-group-prepend">
                  <label class="input-group-text" for="inputGroupSelect01">
                    Season
                  </label>
                </div>

                <Form.Control
                  id="selectSeasonFrom"
                  as="select"
                  custom
                  onChange={OnChangeVal.bind(this)}
                >
                  <option class="text-center" selected value={-1}>
                    -
                  </option>

                  {sortedSeasons.map((row) => (
                    <option class="text-center" value={row.description}>
                      {row.description}
                    </option>
                  ))}
                </Form.Control>
                {/* <label class="input-group-text" for="inputGroupSelect01">
                  To
                </label>
                <Form.Control
                  id="selectSeasonTo"
                  as="select"
                  custom
                  onChange={OnChangeVal.bind(this)}
                >
                  <option
                    class="text-center"
                    selected
                    value={-1}
                  >
                    -
                  </option>
                  {sortedSeasons.map((row, index) => (
                    <option class="text-center" value={index}>
                      {row.description}
                    </option>
                  ))}
                </Form.Control> */}
              </div>

              {/* <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <label class="input-group-text" for="inputGroupSelect01">
                    Contains Notes
                  </label>
                </div>
                <Form.Control as="select" custom id="selectNotes">
                  <option class="text-center" selected value="-1">
                    -
                  </option>
                  <option class="text-center" value="Yes">
                    Yes
                  </option>
                  <option class="text-center" value="No">
                    No
                  </option>
                </Form.Control>
              </div> */}
              <div class="row">
                <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    <label class="input-group-text" for="inputGroupSelect01">
                      Has Notes
                    </label>
                  </div>
                  <select class="form-select" id="hasNotes">
                    <option class="text-center selected" value="-1" selected>
                      -
                    </option>
                    <option class="text-center" value="Yes">
                      Yes
                    </option>
                    <option class="text-center" value="No">
                      No
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
