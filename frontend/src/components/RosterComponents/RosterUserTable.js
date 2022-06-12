import React, { useEffect } from "react";
import AssignArea from "../Modal/AssignArea";
import Attendance from "../Modal/Attendance";
import Comment from "../Modal/Comment";
import RemoveUser from "./RemoveUser";
import RequestSub from "./RequestSub";
import { Subtitle, TableCard } from "../Elements/Elements";
import "./Table.css";

import { Button, Table } from "reactstrap";
import { Link, Route } from "react-router-dom";

const RosterUserTable = ({
  currentShift,
  setCurrentShift,
  setProxySelect,
  rosteredList,
  session_data,
  session,
  shiftInfo,
}) => {
  const rosteredUsersToRender = () => {
    let i = 0;
    return rosteredList.map((rosteredUser) => (
      <tr key={i++}>
        <td className="userText">
          {/* TODO: set up user links */}
          <Link to={"/personnel/user/" + rosteredUser.user.userID}>
            {rosteredUser.user.firstName + " " + rosteredUser.user.lastName}
          </Link>
        </td>
        <td className="userText">
          {rosteredUser.area === null
            ? "Area Not Set"
            : rosteredUser.area.areaname}
        </td>
        <td className="userText">{rosteredUser.user.trainer ? "✓" : " "}</td>
        {session_data.username === rosteredUser.user.username ? (
          <>
            <td>
              <div class="btn-group">
                <button
                  type="button"
                  class="btn dropdown-toggle navyButton"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Actions
                </button>
                <ul class="dropdown-menu">
                  <Comment
                    currentShift={currentShift}
                    setProxySelect={setProxySelect}
                    user={rosteredUser}
                    session={session}
                  />

                  <RequestSub
                    currentShift={currentShift}
                    setProxySelect={setProxySelect}
                    user={rosteredUser}
                    username={session_data.username}
                    session={session}
                  />
                </ul>
              </div>
            </td>
          </>
        ) : (
          <td></td>
        )}
        {session_data.user_type === "SYSTEM_ADMIN" ||
        session_data.user_type === "HILL_ADMIN" ? (
          <>
            <td>
              <div class="btn-group">
                <button
                  type="button"
                  class="btn dropdown-toggle redButton"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Admin Actions
                </button>
                <ul class="dropdown-menu">
                  {/* <div style={{ display: "flex" }}> */}
                  <AssignArea
                    currentShift={currentShift}
                    setCurrentShift={setCurrentShift}
                    setProxySelect={setProxySelect}
                    user={rosteredUser}
                    username={session_data.username}
                    session={session}
                    shiftInfo={shiftInfo}
                  />
                  <Attendance
                    currentShift={currentShift}
                    setCurrentShift={setCurrentShift}
                    setProxySelect={setProxySelect}
                    user={rosteredUser}
                    username={session_data.username}
                    session={session}
                    shiftInfo={shiftInfo}
                  />
                  <Comment
                    currentShift={currentShift}
                    setProxySelect={setProxySelect}
                    user={rosteredUser}
                    username={session_data.username}
                    session={session}
                    session_data={session.session_data()}
                    shiftInfo={shiftInfo}
                  />
                  <RemoveUser
                    currentShift={currentShift}
                    setProxySelect={setProxySelect}
                    user={rosteredUser}
                    username={session_data.username}
                    session={session}
                    session_data={session.session_data()}
                    shiftInfo={shiftInfo}
                  />
                </ul>
              </div>
            </td>
          </>
        ) : (
          <></>
        )}
        <td className="userText">
          {rosteredUser.comment === null ? "" : rosteredUser.comment}
        </td>
        <td className="userText">
          {rosteredUser.timestampSubrequest !== "1970-01-01T00:00:01"
            ? "✓"
            : " "}
        </td>
        <td className="userText">
          {rosteredUser.attendance === null
            ? "Attendance Not Recorded"
            : rosteredUser.attendance}
        </td>
      </tr>
    ));
  };
  //will update calendar if the Add Roster Modal changes
  useEffect(() => {}, [rosteredList, currentShift]);

  return (
    <>
      <div className="tableFixHeader">
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Area</th>
              <th>Trainer</th>
              <th>Actions</th>
              {session_data.user_type === "SYSTEM_ADMIN" ||
              session_data.user_type === "HILL_ADMIN" ? (
                <>
                  <th>Admin</th>
                </>
              ) : (
                <></>
              )}
              <th>Comment</th>
              <th>SubRequest</th>
              <th>Attendance</th>
            </tr>
          </thead>
          <tbody>{rosteredUsersToRender()}</tbody>
        </Table>
      </div>
    </>
  );
};

export default RosterUserTable;
