import React, { useEffect } from "react";
import AssignArea from "../Modal/AssignArea";
import AssignShadow from "../Modal/AssignShadow";
import Comment from "../Modal/Comment";
import RemoveUser from "./RemoveUser";
import { Subtitle, TableCard } from "../Elements/Elements";
import "./Table.css";

import { Table } from "reactstrap";

const ShadowUserTable = ({
  currentShift,
  setCurrentShift,
  setProxySelect,
  shadowList,
  session_data,
  session,
  shiftInfo,
  rosteredList,
  traineeList,
}) => {
  const shadowUsersToRender = () => {
    let i = 0;
    return shadowList.map((shadowUser) => (
      <tr key={i++}>
        <td className="userText">{shadowUser.name}</td>
        <td className="userText">{shadowUser.phoneNumber}</td>
        <td className="userText">{shadowUser.email}</td>
        <td className="userText">
          {shadowUser.area === null ? "Area Not Set" : shadowUser.area.areaname}
        </td>
        <td className="userText">
          {shadowUser.shadowing === null
            ? "Not Assigned"
            : shadowUser.shadowing.firstName +
              " " +
              shadowUser.shadowing.lastName}
        </td>

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
              user={shadowUser}
              username={session_data.username}
              session={session}
              session_data={session.session_data()}
              shiftInfo={shiftInfo}
            />
          </ul>
        </td>

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
                  user={shadowUser}
                  username={session_data.username}
                  session={session}
                  shiftInfo={shiftInfo}
                />
                <AssignShadow
                  currentShift={currentShift}
                  setCurrentShift={setCurrentShift}
                  setProxySelect={setProxySelect}
                  user={shadowUser}
                  username={session_data.username}
                  session={session}
                  shiftInfo={shiftInfo}
                  rosteredList={rosteredList}
                />
                <RemoveUser
                  currentShift={currentShift}
                  setProxySelect={setProxySelect}
                  user={shadowUser}
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
        <td className="userText">{shadowUser.comment}</td>
      </tr>
    ));
  };

  //will update calendar if the Add Roster Modal changes
  useEffect(() => {}, [shadowList, currentShift]);

  return (
    <>
      <div className="tableFixHeader">
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Area</th>
              <th>Shadowing</th>
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
            </tr>
          </thead>
          <tbody>{shadowUsersToRender()}</tbody>
        </Table>
      </div>
    </>
  );
};

export default ShadowUserTable;
