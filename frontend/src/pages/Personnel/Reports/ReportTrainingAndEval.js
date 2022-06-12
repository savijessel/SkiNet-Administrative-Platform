import React, { useState, useContext, useEffect } from "react";
import { Container, Row, Col, Form, Modal, Button } from "react-bootstrap";
import FilterContext from "./ReportFilterContext";
import $ from "jquery";
export default function ReportTrainingAndEval({ session }) {
  const [discipline, setDisciplines] = useState([]);
  const [operationalEvent, setOperationalEvent] = useState([]);

  const [state, setState] = useContext(FilterContext);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    $("#OnSnowDisciplines").on("change", function (e) {
      const selected = $(e.currentTarget).val();
      setState((state) => ({
        ...state,
        onSnowDisciplineType: selected === "-1" ? null : selected,
      }));
    });

    $("#OnSnowTrainingDateFrom").on("change", function (e) {
      const selected = $(e.currentTarget).val();
      setState((state) => ({
        ...state,
        onSnowDateEvaluatedLower: selected === "" ? null : selected,
      }));
    });

    $("#OnSnowTrainingDateTo").on("change", function (e) {
      const selected = $(e.currentTarget).val();
      setState((state) => ({
        ...state,
        onSnowDateEvaluatedUpper: selected === "" ? null : selected,
      }));
    });

    $("#OnSnowEvalBy").on("change", function (e) {
      const selected = $(e.currentTarget).val();
      setState((state) => ({
        ...state,
        onSnowEvaluatedBy: selected === "" ? null : selected,
      }));
    });

    $("#EvalTrainingEvent").on("change", function (e) {
      const selected = $(e.currentTarget).val();
      setState((state) => ({
        ...state,
        evalEventType: selected === "" ? null : selected,
      }));
    });

    $("#EvalTrainingDateFrom").on("change", function (e) {
      const selected = $(e.currentTarget).val();
      setState((state) => ({
        ...state,
        evalDateCompletedLower: selected === "" ? null : selected,
      }));
    });

    $("#EvalTrainingDateTo").on("change", function (e) {
      const selected = $(e.currentTarget).val();
      setState((state) => ({
        ...state,
        evalDateCompletedUpper: selected === "" ? null : selected,
      }));
    });

    $("#OperationalTrainingEvent").on("change", function (e) {
      const selected = $(e.currentTarget).val();
      setState((state) => ({
        ...state,
        patrollerEventType: selected === "-1" ? null : selected,
      }));
    });

    $("#OpTrainingFrom").on("change", function (e) {
      const selected = $(e.currentTarget).val();
      setState((state) => ({
        ...state,
        patrollerDateCompletedLower: selected === "" ? null : selected,
      }));
    });

    $("#OpTrainingTo").on("change", function (e) {
      const selected = $(e.currentTarget).val();
      setState((state) => ({
        ...state,
        patrollerDateCompletedUpper: selected === "" ? null : selected,
      }));
    });
  }, []);

  return (
    <>
      <div class="card">
        <a
          class="card-header btn "
          data-bs-toggle="collapse"
          href="#TrAndEv"
          role="button"
          aria-expanded="false"
          aria-controls="TrAndEv"
        >
          Training and Evaluation
        </a>

        <div class="collapse" id="TrAndEv">
          <div class="card-body">
            <div class="card">
              <button
                class="card-header btn"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#onSnowEval"
                aria-expanded="false"
                aria-controls="onSnowEval"
              >
                On-Snow Evaluation
              </button>

              <div class="collapse" id="onSnowEval">
                <div class="card-body">
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <label class="input-group-text" for="inputGroupSelect01">
                        Discipline:
                      </label>
                    </div>

                    <select class="form-select w-auto" id="OnSnowDisciplines">
                      <option selected value={"-1"}>
                        -
                      </option>
                      {discipline.map((row, index) => (
                        <option value={row.description}>
                          {row.description}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <label class="input-group-text">From</label>
                    </div>

                    <Form.Control
                      type="date"
                      name="date_of_birth"
                      id="OnSnowTrainingDateFrom"
                    />
                  </div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <label class="input-group-text">To</label>
                    </div>

                    <Form.Control
                      type="date"
                      name="date_of_birth"
                      id="OnSnowTrainingDateTo"
                    />
                  </div>

                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <label class="input-group-text" for="inputGroupSelect01">
                        Evaluated by:
                      </label>
                    </div>
                    <input
                      type="text"
                      class="form-control"
                      id="OnSnowEvalBy"
                      name="myEvalInput"
                      aria-describedby="emailHelp"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="card">
              <button
                class="card-header btn"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#evalTraining"
                aria-expanded="false"
                aria-controls="evalTraining"
              >
                Evaluator Training
              </button>

              <div class="collapse" id="evalTraining">
                <div class="card-body">
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <label class="input-group-text" for="inputGroupSelect01">
                        Event Type
                      </label>
                    </div>
                    <input
                      type="text"
                      class="form-control"
                      id="EvalTrainingEvent"
                      name="myEvalInput"
                      aria-describedby="emailHelp"
                    />
                  </div>

                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <label class="input-group-text">From</label>
                    </div>

                    <Form.Control
                      type="date"
                      name="date_of_birth"
                      id="EvalTrainingDateFrom"
                    />
                  </div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <label class="input-group-text">To</label>
                    </div>

                    <Form.Control
                      type="date"
                      name="date_of_birth"
                      id="EvalTrainingDateTo"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="card">
              <button
                class="card-header btn"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#operationalTraining"
                aria-expanded="false"
                aria-controls="operationalTraining"
              >
                Operational Training
              </button>

              <div class="collapse" id="operationalTraining">
                <div class="card-body">
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <label class="input-group-text" for="inputGroupSelect01">
                        Event Type
                      </label>
                    </div>

                    <select class="form-select" id="OperationalTrainingEvent">
                      <option selected value={"-1"}>
                        -
                      </option>
                      {operationalEvent.map((row, index) => (
                        <option value={row.description}>
                          {row.description}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <label class="input-group-text">From</label>
                    </div>

                    <Form.Control
                      type="date"
                      name="date_of_birth"
                      id="OpTrainingFrom"
                    />
                  </div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <label class="input-group-text">To</label>
                    </div>

                    <Form.Control
                      type="date"
                      name="date_of_birth"
                      id="OpTrainingTo"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
