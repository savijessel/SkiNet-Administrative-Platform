import React, { useState } from "react";
import { Route, Link, useHistory } from "react-router-dom";
import CSPLogo from "../../images/Re-colored-logo.svg";
// import CSPLogo from "../../CSP Logo Text right of logo.jpg"; // OTHER IMAGE OPTION
import "./Header.css";

const Header = ({ session }) => {
  const history = useHistory();

  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);

  const logOut = () => {
    session.log_out();
    history.push("/");
    window.location.reload();
  };

  const renderLoggedInNavigation = () => {
    return (
      <>
        <div className="navbar-collapse" id="navbarSupportedContent">
          {" "}
          {/* Used to be className="collapse navbar-collapse" BTW */}
          <ul className="navbar-nav mr-auto">
            <Route path="/news">
              {({ match }) => (
                <li className={match ? "nav-item active" : "nav-item"}>
                  <Link className="nav-link" to="/news">
                    Information
                  </Link>
                </li>
              )}
            </Route>
            <Route path="/personnel">
              {({ match }) => (
                <li className={match ? "nav-item active" : "nav-item"}>
                  <Link className="nav-link" to="/personnel/users">
                    Membership
                  </Link>
                </li>
              )}
            </Route>
            <Route path="/roster">
              {({ match }) => (
                <li className={match ? "nav-item active" : "nav-item"}>
                  <Link className="nav-link" to="/roster/calendar">
                    Schedule
                  </Link>
                </li>
              )}
            </Route>

            <Route path="/admin">
              {({ match }) =>
                session.session_data() !== null &&
                session.session_data().user_type === "SYSTEM_ADMIN" && (
                  <li className={match ? "nav-item active" : "nav-item"}>
                    <Link className="nav-link" to="/admin/lookups">
                      Admin
                    </Link>
                  </li>
                )
              }
            </Route>
          </ul>
        </div>

        <div>
          <button
            className="btn btn-outline-light my-2 my-sm-0 userButton"
            onClick={() => {
              if (session.session_data().userID) {
                window.location.href =
                  "/personnel/user/" + session.session_data().userID;
              }
            }}
          >
            {session.session_data() !== null &&
              session.session_data().firstName +
                " " +
                session.session_data().lastName}
          </button>
        </div>
        <div>
          <button className="btn my-2 my-sm-0 signOutButton" onClick={logOut}>
            Sign Out
          </button>
        </div>
      </>
    );
  };

  const renderLoggedOutNavigation = () => {
    return (
      <>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto"></ul>
        </div>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        {/* <button
          className="btn btn-light my-2 my-sm-0"
          onClick={() => {
            history.push("/sign-in");
          }}
        >
          Sign In
        </button> */}
      </>
    );
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <a className="navbar-brand" href="#">
          <img className="myImage" src={CSPLogo} width="175px" />
          <span>
            {/* <font face="Arial narrow" size="30px">
              {" "}
              <b>CSP</b> - Lake Louise
            </font> */}
          </span>
        </a>
        {session.logged_in()
          ? renderLoggedInNavigation()
          : renderLoggedOutNavigation()}
      </nav>

      <Route path="/personnel">
        {({ match }) =>
          match ? (
            <nav className="navbar navbar-expand-lg sticky-top navbar-light bg-secondary">
              <div className="container">
                <ul className="navbar-nav mr-auto">
                  <Route path="/personnel/users" exact>
                    {({ match }) => (
                      <li className={match ? "nav-item active" : "nav-item"}>
                        <Link className="nav-link" to="/personnel/users">
                          Users
                        </Link>
                      </li>
                    )}
                  </Route>
                  <Route path="/personnel/reports" exact>
                    {({ match }) =>
                      session.session_data() !== null &&
                      session.session_data().user_type === "SYSTEM_ADMIN" && (
                        <li className={match ? "nav-item active" : "nav-item"}>
                          {
                            <Link className="nav-link" to="/personnel/reports">
                              Reports
                            </Link>
                          }
                        </li>
                      )
                    }
                  </Route>
                </ul>
              </div>
            </nav>
          ) : null
        }
      </Route>

      <Route path="/roster">
        {({ match }) =>
          match ? (
            <nav className="navbar navbar-expand-lg sticky-top navbar-light bg-secondary">
              <div className="container">
                <ul className="navbar-nav mr-auto">
                  <Route path="/roster/calendar" exact>
                    {({ match }) => (
                      <li className={match ? "nav-item active" : "nav-item"}>
                        <Link className="nav-link" to="/roster/calendar">
                          Calendar
                        </Link>
                      </li>
                    )}
                  </Route>
                  {/* <Route path="/roster/reports" exact>
                    {({ match }) => (
                      <li className={match ? "nav-item active" : "nav-item"}>
                        <Link className="nav-link" to="/roster/reports">
                          Reports
                        </Link>
                      </li>
                    )}
                  </Route> */}
                </ul>
              </div>
            </nav>
          ) : null
        }
      </Route>

      <Route path="/admin">
        {({ match }) =>
          match ? (
            <nav className="navbar navbar-expand-lg sticky-top navbar-light bg-secondary">
              <div className="container">
                <ul className="navbar-nav mr-auto">
                  <Route path="/admin/lookups" exact>
                    {({ match }) => (
                      <li className={match ? "nav-item active" : "nav-item"}>
                        <Link className="nav-link" to="/admin/lookups">
                          Lookups
                        </Link>
                      </li>
                    )}
                  </Route>
                  <Route path="/admin/newUser" exact>
                    {({ match }) => (
                      <li className={match ? "nav-item active" : "nav-item"}>
                        <Link className="nav-link" to="/admin/newUser">
                          Create New User
                        </Link>
                      </li>
                    )}
                  </Route>
                </ul>
              </div>
            </nav>
          ) : null
        }
      </Route>
    </>
  );
};

export default Header;
