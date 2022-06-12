import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Modal, Button } from "react-bootstrap";
import ReportGeneral from "./ReportGeneral";
import ReportLakeLouiseAwards from "./ReportLakeLouiseAwards";
import ReportLakeLouiseRoles from "./ReportLakeLouiseRoles";
import ReportPatrolCommitment from "./ReportPatrolCommitment";
import ReportPatrolUniformAndEquipment from "./ReportPatrolUniformAndEquipment";
import ReportTrainingAndEval from "./ReportTrainingAndEval";
import "./Reports.css";
import $ from "jquery";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import FilterContext from "./ReportFilterContext";
import { Link } from "react-router-dom";

// const ReportsChild = () => {
//   const [state, setState] = useContext(FilterContext);

//   return <div>
//     <b>{JSON.stringify(state)}</b>

//     <button onClick={() => { setState(state => ({ ...state, hasEmergencyContact: !state.hasEmergencyContact })) }}>red button</button>
//   </div>;
// };

// const Reports = ({ session }) => {
//   const [state, setState] = useState({
//     hasEmergencyContact: false
//   });
//   return <FilterContext.Provider value={[state, setState]}>
//     <ReportsChild />
//     <i>{JSON.stringify(state)}</i>

//     <button onClick={() => { setState(state => ({ ...state, hasEmergencyContact: !state.hasEmergencyContact })) }}>green button</button>
//   </FilterContext.Provider >;
// };

const Reports = ({ session }) => {
  const [reportResult, setReportResult] = useState([]);

  const prettyRoles = {
    cismTeamMember: "CISM Team Member",
    pl: "Patrol Leader",
    apl: "Active Patrol Leader",
    hl: "HL",
    active: "Active User",
    newUser: "New User",
    trainingEventLead: "Training Event Lead",
    onSnowEvaluator: "On-Snow Evaluator",
    orienteerer: "Orienteer",
    recruitmentLead: "Recruitment Lead",
    p0Lead: "P0/Lead",
  };
  const [state, setState] = useState({
    onSnowDisciplineType: null,
    onSnowDateEvaluatedLower: null,
    onSnowDateEvaluatedUpper: null,
    onSnowEvaluatedBy: null,

    evalEventType: null,
    evalDateCompletedUpper: null,
    evalDateCompletedLower: null,

    patrollerEventType: null,
    patrollerDateCompletedUpper: null,
    patrollerDateCompletedLower: null,
    hasNotes: null,

    commitmentAchieved: null,
    commitmentDaysLower: null,
    commitmentDaysUpper: null,
    season: null,

    cismTeamMember: null,
    pl: null,
    apl: null,
    hl: null,
    active: null,
    newUser: null,
    trainingEventLead: null,
    newUser: null,
    onSnowEvaluator: null,
    orienteerer: null,
    recruitmentLead: null,
    p0Lead: null,

    jacketBrand: null,
    jacketSize: null,
    jacketCondition: null,
    jacketNumber: null,

    vestNumber: null,
    vestBrand: null,
    vestSize: null,
    vestCondition: null,

    packNumber: null,
    packBrand: null,
    packSize: null,
    packCondition: null,

    uniformLeaseSigned: null,
    uniformReturned: null,

    awards: null,

    hasEmergencyContact: null,
  });
  const [reportString, setReportString] = useState("");
  const [selectedString, setSelectedString] = useState("");
  const [numCols, setNumCols] = useState(0);

  function updateColNum() {
    if (reportResult.length > 0) {
      let temp = 0;
      if (reportResult[0].onSnowEvals) {
        temp++;
      }
      if (reportResult[0].evalTrainings) {
        temp++;
      }
      if (reportResult[0].operationalTrainings) {
        temp++;
      }
      if (reportResult[0].patrolCommitments) {
        temp++;
      }
      if (reportResult[0].role) {
        temp++;
      }
      if (reportResult[0].uniforms) {
        temp++;
      }
      if (reportResult[0].uniforms && reportResult[0].uniforms[0].jackets) {
        temp++;
      }
      if (reportResult[0].uniforms && reportResult[0].uniforms[0].vests) {
        temp++;
      }
      if (reportResult[0].uniforms && reportResult[0].uniforms[0].packs) {
        temp++;
      }
      if (reportResult[0].personAwards) {
        temp++;
      }
      if (reportResult[0].emergencyContacts) {
        temp++;
      }
      console.log("HI ", temp);
      setNumCols(temp);
    }
  }

  function generateReport() {
    session.post("report/getReportData", state, {}, true).then((resp) => {
      if (resp.status === 200) {
        console.log("success");
        console.log(resp.data);
        session.set_report_data(state);
        setReportResult(resp.data);
      }
    });
    printReportParams();
  }

  function generateInitialReport() {
    session.post("report/getReportData", state, {}, true).then((resp) => {
      if (resp.status === 200) {
        console.log("success");
        console.log(resp.data);
        setReportResult(resp.data);
      }
    });

    printReportParams();
  }

  function printReportParams() {
    let result = JSON.stringify(
      state,
      (key, value) => {
        if (value !== null) return value;
      },
      null,
      4
    );
    result = result.substring(1, result.length - 1);
    result = result.replace(/[\:]/g, ": ");
    result = result.replace(/\,/g, ", ");
    result = result.replace(/["']/g, "");
    console.log(result);

    setReportString(result);
  }

  function printSelectedReportParams() {
    let result = JSON.stringify(
      state,
      (key, value) => {
        if (value !== null) return value;
      },
      null,
      4
    );
    result = result.substring(1, result.length - 1);
    result = result.replace(/[\:]/g, ": ");
    result = result.replace(/\,/g, ", ");
    result = result.replace(/["']/g, "");
    console.log(result);

    setSelectedString(result);
  }

  function loadPreviousReport() {
    if (session.report_data() != null) setState(session.report_data());
    console.log("sessions data: " + session.report_data());
  }

  useEffect(() => {
    printSelectedReportParams();
  }, [state]);

  useEffect(() => {
    generateInitialReport();
  }, []);
  useEffect(() => {
    updateColNum();
  }, [reportResult]);

  function refreshPage() {
    window.location.reload(false);
  }

  return (
    <FilterContext.Provider value={[state, setState]}>
      {session.session_data().user_type === "SYSTEM_ADMIN" && (
        <div>
          <h2 class="p-3">Reports</h2>
          {/* {<pre>{JSON.stringify(state)}</pre>} */}
          <div class="container-fluid">
            <div class="row justify-content-md-center">
              <div class="col col-lg-9 myPanel">
                <h6>CURRENT SELECTED PARAMETERS: {selectedString}</h6>
                <table
                  class="table myTable table-bordered myPanel"
                  id="table-to-xls"
                >
                  <thead class="myPanel">
                    <tr>
                      <th
                        colspan={5 + numCols}
                        class="table-active myPanel w-25 text-start text-wrap"
                      >
                        Report Generated on:{" "}
                        {new Date().toISOString().substring(0, 10)}
                        <br />
                        <div class="">
                          CURRENT REPORT PARAMETERS: {reportString}
                        </div>
                      </th>
                      {/* <th
                        colspan="100"
                        class="table-active w-1 myPanel text-start text-wrap"
                      >
                        <br />
                      </th> */}
                    </tr>
                  </thead>

                  <thead>
                    <tr>
                      <th scope="col">Username</th>
                      <th scope="col">First Name</th>
                      <th scope="col">Last Name</th>
                      <th scope="col">Email</th>
                      <th scope="col">Phone Number</th>
                      {/* <th scope="col">Status</th> */}
                      {reportResult.length > 0 && reportResult[0].onSnowEvals && (
                        <th scope="col" className=" text-start text-wrap">
                          On-Snow Evaluations
                        </th>
                      )}
                      {reportResult.length > 0 &&
                        reportResult[0].evalTrainings && (
                          <th scope="col" className="text-start text-wrap">
                            Evaluator Trainings
                          </th>
                        )}
                      {reportResult.length > 0 &&
                        reportResult[0].operationalTrainings && (
                          <th scope="col" className="text-start text-wrap">
                            Operational Training
                          </th>
                        )}
                      {reportResult.length > 0 &&
                        reportResult[0].patrolCommitments && (
                          <th scope="col" className="text-start text-wrap">
                            Patrol Commitments
                          </th>
                        )}
                      {reportResult.length > 0 && reportResult[0].role && (
                        <th scope="col" className="text-start text-wrap">
                          Roles
                        </th>
                      )}
                      {reportResult.length > 0 && reportResult[0].uniforms && (
                        <th scope="col" className="text-start text-wrap">
                          Uniform Lease Status
                        </th>
                      )}
                      {reportResult.length > 0 &&
                        reportResult[0].uniforms &&
                        reportResult[0].uniforms[0].jackets !== null && (
                          <th scope="col" className="text-start text-wrap">
                            Jackets
                          </th>
                        )}
                      {reportResult.length > 0 &&
                        reportResult[0].uniforms &&
                        reportResult[0].uniforms[0].vests !== null && (
                          <th scope="col" className="text-start text-wrap">
                            Vests
                          </th>
                        )}
                      {reportResult.length > 0 &&
                        reportResult[0].uniforms &&
                        reportResult[0].uniforms[0].packs !== null && (
                          <th scope="col" className="text-start text-wrap">
                            Packs
                          </th>
                        )}
                      {reportResult.length > 0 && reportResult[0].personAwards && (
                        <th scope="col" className="text-start text-wrap">
                          Awards
                        </th>
                      )}
                      {reportResult.length > 0 &&
                        reportResult[0].emergencyContacts && (
                          <th scope="col" className="text-start text-wrap">
                            Emergency Contacts
                          </th>
                        )}
                    </tr>
                  </thead>
                  {
                    <tbody>
                      {reportResult.map((row) => (
                        <tr>
                          <td>
                            <Link
                              className="link"
                              to={"/personnel/user/" + row.userID}
                              // style={{ color: "#000" }}
                            >
                              {row.username}
                            </Link>
                          </td>
                          <td>{row.firstName}</td>
                          <td>{row.lastName}</td>
                          <td>{row.email}</td>
                          <td>{row.phoneNumber}</td>
                          {/* <td>{row.userType}</td> */}
                          {reportResult.length > 0 &&
                            reportResult[0].onSnowEvals && (
                              <td>
                                {row.onSnowEvals.map((item) => (
                                  <>
                                    {item.discipline.description +
                                      " from " +
                                      item.evaluationDate +
                                      " evaluated by " +
                                      item.evaluatedBy}
                                    <br />
                                  </>
                                ))}
                              </td>
                            )}
                          {reportResult.length > 0 &&
                            reportResult[0].evalTrainings && (
                              <td>
                                {row.evalTrainings.map((item) => (
                                  <>
                                    {item.eventType +
                                      " on " +
                                      item.completedDate}{" "}
                                    <br />
                                  </>
                                ))}
                              </td>
                            )}

                          {reportResult.length > 0 &&
                            reportResult[0].operationalTrainings && (
                              <td>
                                {row.operationalTrainings.map((item) => (
                                  <>
                                    {item.operationalEvent.description +
                                      " on " +
                                      item.completedDate}
                                    <br />
                                  </>
                                ))}
                              </td>
                            )}
                          {reportResult.length > 0 &&
                            reportResult[0].patrolCommitments && (
                              <td>
                                {/* {JSON.stringify(row.patrolCommitments, null, 2)} */}
                                {row.patrolCommitments.map((item) => (
                                  <>
                                    {" "}
                                    {(item.achieved === true ? "✔" : "✘") +
                                      " - " +
                                      item.days +
                                      " days for " +
                                      item.season.description}
                                    <br />
                                  </>
                                ))}
                              </td>
                            )}
                          {reportResult.length > 0 && reportResult[0].role && (
                            <td>
                              {/* {JSON.stringify(row.role, null, 2)} */}
                              {Object.keys(row.role).map((item) =>
                                row.role[item] === true ? (
                                  <>
                                    {prettyRoles[item]} <br />
                                  </>
                                ) : (
                                  ""
                                )
                              )}
                            </td>
                          )}
                          {reportResult.length > 0 && reportResult[0].uniforms && (
                            <td>
                              {"Lease signed: " +
                                (reportResult[0].uniforms[0].leaseSigned
                                  ? "Yes"
                                  : "No")}
                              <br />
                              {"Returned: " +
                                (reportResult[0].uniforms[0].returned
                                  ? "Yes"
                                  : "No")}
                            </td>
                          )}
                          {reportResult.length > 0 &&
                            reportResult[0].uniforms &&
                            reportResult[0].uniforms[0].jackets && (
                              <td>
                                {/* {JSON.stringify(
                                  row.uniforms[0].jackets[0],
                                  null,
                                  2
                                )} */}
                                {row.uniforms[0].jackets.map((item) => (
                                  <>
                                    {"Jacket " +
                                      item.number +
                                      ": " +
                                      item.condition.description +
                                      " " +
                                      item.size.description +
                                      " " +
                                      item.brand.description +
                                      " "}
                                    <br />
                                  </>
                                ))}
                              </td>
                            )}
                          {reportResult.length > 0 &&
                            reportResult[0].uniforms &&
                            reportResult[0].uniforms[0].vests && (
                              <td>
                                {row.uniforms[0].vests.map((item) => (
                                  <>
                                    {"Vest " +
                                      item.number +
                                      ": " +
                                      item.condition.description +
                                      " " +
                                      item.size.description +
                                      " " +
                                      item.brand.description +
                                      " "}
                                    <br />
                                  </>
                                ))}
                              </td>
                            )}
                          {reportResult.length > 0 &&
                            reportResult[0].uniforms &&
                            reportResult[0].uniforms[0].packs && (
                              <td>
                                {row.uniforms[0].jackets.map((item) => (
                                  <>
                                    {"Pack " +
                                      item.number +
                                      ": " +
                                      item.condition.description +
                                      " " +
                                      item.brand.description +
                                      " "}
                                    <br />
                                  </>
                                ))}
                              </td>
                            )}
                          {reportResult.length > 0 &&
                            reportResult[0].personAwards && (
                              <td>
                                {/* {JSON.stringify(row.personAwards, null, 2)} */}
                                {row.personAwards.map((info) => (
                                  <>
                                    {info.award.description} <br />
                                  </>
                                ))}
                              </td>
                            )}
                          {reportResult.length > 0 &&
                            reportResult[0].emergencyContacts && (
                              <td>{row.emergencyContacts[0].name}</td>
                            )}
                        </tr>
                      ))}
                    </tbody>
                  }
                </table>
              </div>
              <div class="col col-sm" id="accordion">
                <div class="row">
                  <div class="col">
                    <ReactHTMLTableToExcel
                      id="test-table-xls-button"
                      className="download-table-xls-button myButton btn btn-success float-end d-flex-inline"
                      table="table-to-xls"
                      filename="ReportOutput"
                      sheet="tablexls"
                      buttonText="Export to Excel"
                    />
                    <button
                      type="button"
                      class="myButton btn redButton float-end d-flex-inline"
                      onClick={refreshPage}
                    >
                      Reset
                    </button>

                    <button
                      type="button"
                      className="myButton btn navyButton float-end d-flex-inline"
                      onClick={generateReport}
                    >
                      Generate Report
                    </button>
                    <button
                      type="button"
                      className="myButton btn greyButton float-end d-flex-inline"
                      onClick={loadPreviousReport}
                    >
                      Load Previous Report Parameters
                    </button>
                  </div>
                </div>

                <ReportTrainingAndEval session={session} />

                <ReportPatrolCommitment session={session} />

                <ReportLakeLouiseRoles session={session} />

                <ReportPatrolUniformAndEquipment session={session} />

                <ReportLakeLouiseAwards session={session} />

                <ReportGeneral session={session} />

                <div class="row">
                  <div class="col">
                    <button
                      type="button"
                      class="myButton btn navyButton float-end"
                      onClick={generateReport}
                    >
                      Generate Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </FilterContext.Provider>
  );
};
export default Reports;
