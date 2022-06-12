import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Container,
  Button,
  ButtonPadding,
  Input,
  InfoSec,
  InfoRow,
  InfoColumn,
  TextWrapper,
  TopLine,
  Heading,
  Subtitle,
  ImgWrapper,
  Img,
} from "../../components/Elements/Elements";
import "./SignIn.css";
import {Modal} from "react-bootstrap"

const SignIn = ({ session }) => {
  const history = useHistory();
  const [hasError, setHasError] = useState(false);

  function verifyCredentials(username, password) {
    const authorization = "Basic " + window.btoa(username + ":" + password);
    const payload = {
      username: username,
    };
    const params = new URLSearchParams(payload);
    session.set_login(authorization);
    console.log(params.toString());

    session
      .get("users/search/findByUsername?" + params.toString(), {}, {})
      .then((response) => {
        if (response.status === 200) {
          const basicUserDetails = {
            username: response.data.username,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            userID: response.data.userID,
            user_type: response.data.userType,
            email: response.data.email,
            phoneNumber: response.data.phoneNumber,
            trainer: response.data.trainer,
          };
          console.log(response);
          console.log(basicUserDetails);
          session.set_session_data(basicUserDetails);
          history.push("/news");
          window.location.reload();
        }
      })
      .catch((err) => {
        setHasError(true);
      });
  }

  //Displays message above login button whether login was succesful or not
  // if credenials are correct,
  // document.getElementById('loginMessageID').innerHTML = "Login in succesful"; //This displays "Login in succesful" above the login button
  // else
  // document.getElementById('loginMessageID').innerHTML = "Login failed. Invalid username or password"; //This displays "Login failed. Invalid username or password" above the login button
  // function LoginSuccess(props) {
  //   const isLoggedIn = props.isLoggedIn;
  //   if (login === "Not Attempted") {
  //     return <Subtitle>Not attempted</Subtitle>;
  //   } else if (login === "Unsuccessful") {
  //     return <Subtitle>Sign In Un-Successful</Subtitle>;
  //   }
  //   return <Subtitle></Subtitle>;
  // }

  // useEffect(() => {
  //   //TODO redirect if login is successful
  //   if (login === "Successful") {
  //     history.push("/roster/start");
  //   }
  // }, [login]);

  const handleKeyPress = (event, type) => {
    if (event.code === "Enter" || event.code === "NumpadEnter") {
      if (type === "Username") {
        document.getElementById("passwordInput").focus();
      }

      if (type === "Password") {
        verifyCredentials(
          document.getElementById("usernameInput").value,
          document.getElementById("passwordInput").value
        );
      }
    }
  };

  return (
    <div className="container-bg">
      <Modal
        show={hasError}
        onHide={() => {
          setHasError(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Login Unsuccessful!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          
          One or more of the sign-in fields is incorrect!
        </Modal.Body>
      </Modal>
      <InfoSec lightBg="false">
        <Container>
          <InfoRow imgStart="start">
            <InfoColumn>
              <div className=" signin-card bg-transparent">
                {" "}
                {/* change to bg-white if needed */}
                <div className="card-body signin-card">
                  <TextWrapper>
                    <TopLine lightTopLine="true">
                      Lake Louise CSP User Portal
                    </TopLine>
                    <Heading lightText={false}>
                      Sign in to access the Lake Louise CSP User Portal
                    </Heading>
                    <Input
                      type="text"
                      placeholder="Username"
                      id="usernameInput"
                      autoFocus="autofocus"
                      onKeyPress={(e) => handleKeyPress(e, "Username")}
                    />
                    <div />
                    <Input
                      type="text"
                      type="password"
                      placeholder="Password"
                      id="passwordInput"
                      onKeyPress={(e) => handleKeyPress(e, "Password")}
                    />
                    <p className="loginMessage" id="loginMessageID"></p>
                    {/* <Link to="/sign-up">
                  <Button big fontBig primary="true">
                    {"Sign Up"}
                  </Button>
                </Link> */}
                    <button
                      className="btn btn-lg signin-button"
                      onClick={() => {
                        console.log(
                          document.getElementById("usernameInput").value
                        );
                        verifyCredentials(
                          document.getElementById("usernameInput").value,
                          document.getElementById("passwordInput").value
                        );
                      }}
                    >
                      Sign In
                    </button>
                  </TextWrapper>
                </div>
              </div>
            </InfoColumn>
            <InfoColumn>
              {/* <ImgWrapper start="start">
                 <Img
                  src={require("../../images/LLSS Roster Page.jpg").default}
                /> 
              </ImgWrapper> */}
            </InfoColumn>
            <InfoColumn></InfoColumn>
          </InfoRow>
        </Container>
      </InfoSec>
    </div>
  );
};

export default SignIn;
