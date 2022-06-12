import React, { useState, useEffect } from "react";
import "./UserProfileEdit.css";

export default function UserPerf({ session, userID, allowed }) {
  const [userPerf, setUserPerf] = useState([]);

  const [sortedPerf, setSortedPerf] = useState([]);

  useEffect(() => {
    session
      .get("roster/retrieveEventLogsUser?eventID=" + userID, {}, {}, true)
      .then((resp) => {
        if (resp.status === 200) {
          setUserPerf(resp.data);
        }
      });
  }, []);

  useEffect(() => {
    let temp = [...userPerf];
    temp
      .sort(function (a, b) {
        return new Date(a.event.startDate) - new Date(b.event.startDate);
      })
      .reverse();
    setSortedPerf(temp);
  }, [userPerf]);

  return (
    <>
      <div className="card">
        <div className="card-header">
          <h4>
            <b>Roster Performance</b>
          </h4>
        </div>
        <div className="card-body">
          <div className="cardTable">
            <table className="table table-bordered hover rosterTable">
              <thead className="sticky">
                <tr>
                  <th className="tdbreak" scope="col">
                    Event Name
                  </th>
                  <th className="tdbreak" scope="col">
                    Area Name
                  </th>
                  <th className="tdbreak" scope="col">
                    Date
                  </th>
                  <th className="tdbreak" scope="col">
                    Role
                  </th>
                  <th className="tdbreak" scope="col">
                    Time Rostered
                  </th>
                  <th className="tdbreak" scope="col">
                    Attendance
                  </th>
                </tr>
              </thead>

              <tbody>
                {sortedPerf.map((row) => (
                  <tr>
                    <td className="tdbreak">{row.event.eventName}</td>
                    <td className="tdbreak">
                      {row.area === null ? "Unassigned" : row.area.areaname}
                    </td>
                    <td className="tdbreak">
                      {row.event.startDate.substring(0, 10)}
                    </td>
                    <td className="tdbreak">{row.role}</td>
                    <td className="tdbreak">
                      {row.timestampRostered.substring(0, 10)}
                    </td>
                    <td className="tdbreak">
                      {row.attendance === null
                        ? "Not specified"
                        : row.attendance}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
