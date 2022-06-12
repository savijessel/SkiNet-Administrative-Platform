import React, { useEffect } from "react";
import AssignArea from "../Modal/AssignArea";
import AssignTrainer from "../Modal/AssignTrainer";
import Comment from "../Modal/Comment";
import RemoveUser from "./RemoveUser";
import RequestSub from "./RequestSub";
import Attendance from "../Modal/Attendance";
import { Table } from "reactstrap";
import { Link } from "react-router-dom";
import { Subtitle, TableCard } from "../Elements/Elements";
import "./Table.css";

const TraineeUserTable = ({
  currentShift,
  setCurrentShift,
  setProxySelect,
  traineeList,
  session_data,
  session,
  shiftInfo,
  rosteredList,
}) => {
  const traineeUsersToRender = () => {
    let i = 0;
    return traineeList.map((traineeUser) => (
      <tr key={i++}>
        <td className="userText">
          <Link to={"/personnel/user/" + traineeUser.user.userID}>
            {traineeUser.user.firstName + " " + traineeUser.user.lastName}
          </Link>
        </td>
        <td className="userText">
          {traineeUser.area === null
            ? "Area Not Set"
            : traineeUser.area.areaname}
        </td>
        <td className="userText">
          {traineeUser.shadowing !== null
            ? traineeUser.shadowing.firstName +
              " " +
              traineeUser.shadowing.lastName
            : "Not Assigned"}
        </td>
        {session_data.username === traineeUser.user.username ? (
          <>
            <td>
              <button
                type="button"
                class="btn navyButton dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Actions
              </button>
              <ul class="dropdown-menu">
                <Comment
                  currentShift={currentShift}
                  setProxySelect={setProxySelect}
                  user={traineeUser}
                  username={session_data.username}
                  session={session}
                  session_data={session.session_data()}
                  shiftInfo={shiftInfo}
                />
                <RequestSub
                  currentShift={currentShift}
                  setProxySelect={setProxySelect}
                  user={traineeUser}
                  username={session_data.username}
                  session={session}
                />
              </ul>
            </td>
          </>
        ) : (
          <>
            <td></td>
          </>
        )}
        {session_data.user_type === "SYSTEM_ADMIN" ||
        session_data.user_type === "HILL_ADMIN" ? (
          <>
            <td>
              <button
                type="button"
                class="btn redButton dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Admin Actions
              </button>
              <ul class="dropdown-menu">
                <AssignArea
                  currentShift={currentShift}
                  setCurrentShift={setCurrentShift}
                  setProxySelect={setProxySelect}
                  user={traineeUser}
                  username={session_data.username}
                  session={session}
                  shiftInfo={shiftInfo}
                />
                <AssignTrainer
                  currentShift={currentShift}
                  setCurrentShift={setCurrentShift}
                  setProxySelect={setProxySelect}
                  user={traineeUser}
                  username={session_data.username}
                  session={session}
                  shiftInfo={shiftInfo}
                  rosteredList={rosteredList}
                />
                <Attendance
                  currentShift={currentShift}
                  setCurrentShift={setCurrentShift}
                  setProxySelect={setProxySelect}
                  user={traineeUser}
                  username={session_data.username}
                  session={session}
                  shiftInfo={shiftInfo}
                />
                <Comment
                  currentShift={currentShift}
                  setProxySelect={setProxySelect}
                  user={traineeUser}
                  username={session_data.username}
                  session={session}
                  session_data={session.session_data()}
                  shiftInfo={shiftInfo}
                />
                <RemoveUser
                  currentShift={currentShift}
                  setProxySelect={setProxySelect}
                  user={traineeUser}
                  username={session_data.username}
                  session={session}
                  session_data={session.session_data()}
                  shiftInfo={shiftInfo}
                />
              </ul>
            </td>
          </>
        ) : (
          <></>
        )}
        <td className="userText">
          {traineeUser.comment === null ? "" : traineeUser.comment}
        </td>
        <td className="userText">
          {traineeUser.timestampSubrequest !== "1970-01-01T00:00:01"
            ? "✓"
            : " "}
        </td>
        <td className="userText">{traineeUser.attendance}</td>
      </tr>
    ));
  };
  //will update calendar if the Add Roster Modal changes
  useEffect(() => {
    if (traineeList[0]) console.log("asdfa " + JSON.stringify(traineeList[0]));
  }, [traineeList, currentShift]);

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
          <tbody>{traineeUsersToRender()}</tbody>
        </Table>
      </div>
    </>
  );
};

export default TraineeUserTable;
