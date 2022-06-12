import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const UsersListPage = ({ session }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    session.get("users").then((resp) => {
      if (resp.status === 200) {
        setUsers(resp.data._embedded.users);
      }
    });
  }, []);
  return (
    <>
      <table className="table table-bordered" it="sortTable">
        <thead>
          <tr>
            <th scope="col">Username</th>
            <th scope="col">Name</th>
            <th scope="col">Status</th>
            <th scope="col">Phone</th>
            <th scope="col">Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((row) => (
            <tr key={row.username}>
              <td>
                <Link className="link" to={"/personnel/user/" + row.userID}>
                  {row.username}
                </Link>
              </td>
              <td>{row.firstName + " " + row.lastName}</td>
              <td>{row.userType}</td>
              <td>{row.phoneNumber}</td>
              <td>{row.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default UsersListPage;
