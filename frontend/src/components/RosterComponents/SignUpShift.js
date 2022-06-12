import React, { useEffect, useState } from "react";
import { Button } from "reactstrap";
import { Modal } from "react-bootstrap";

const SignUpShift = ({
  currentShift,
  setList,
  setShiftInfo,
  setRosteredList,
  setUnavailList,
  setTraineeList,
  setWaitlist,
  setShadowList,
  session,
  setProxySelect,
  shiftInfo,
}) => {
  //state template
  const [successModal, setSuccessModal] = useState(false);
  const successModalShow = () => setSuccessModal(true);
  const successModalClose = () => setSuccessModal(false);

  const [waitListModal, setWaitListModal] = useState(false);
  const waitListModalShow = () => setWaitListModal(true);
  const waitListModalClose = () => setWaitListModal(false);

  const [unavailableModal, setunavailableModal] = useState(false);
  const unavailableModalShow = () => setunavailableModal(true);
  const unavailableModalClose = () => setunavailableModal(false);

  const [pastEventModal, setpastEventModal] = useState(false);
  const pastEventModalShow = () => setpastEventModal(true);
  const pastEventModalClose = () => setpastEventModal(false);

  const [failModal, setFailModal] = useState(false);
  const failModalShow = () => setFailModal(true);
  const failModalClose = () => setFailModal(false);

  const signUp = async (e) => {
    let session_data = session.session_data();

    if (currentShift) {
      const article = {
        event: currentShift.event.extendedProps.eventID,
        user: session_data.userID,
        phoneNumber: session_data.phoneNumber,
        trainer: session_data.trainer,
        role: session_data.trainer === false ? "TRAINEE" : "ROSTERED",
        comment: "",
        email: session_data.email,
        attendance: "ON_TIME",
      };

      session
        .put("roster/addToEventLog", article, {}, true)
        .then((response) => {
          //if error from database
          if (response.status === 200) {
            //** PROXY SELECT ** /
            let storeShift = {
              event: {
                proxy: "yes",
                extendedProps: {
                  hlUser: shiftInfo.hl,
                  minPatrollers: shiftInfo.min_pat,
                  maxPatrollers: shiftInfo.max_pat,
                  maxTrainees: shiftInfo.max_trainee,
                  eventID: currentShift.event.extendedProps.eventID,
                },
                allDay: shiftInfo.all_day,
                title: shiftInfo.event_name,
                startStr: shiftInfo.startStr,
              },
            };

            //update Shift infos
            setProxySelect(storeShift);

            successModalShow();
          }

          else if (response.status === 202) {

            //** PROXY SELECT ** /
            let storeShift = {
              event: {
                proxy: 'yes',
                extendedProps:
                {
                  hlUser: shiftInfo.hl,
                  minPatrollers: shiftInfo.min_pat,
                  maxPatrollers: shiftInfo.max_pat,
                  maxTrainees: shiftInfo.max_trainee,
                  eventID: currentShift.event.extendedProps.eventID,




                },
                allDay: shiftInfo.all_day,
                title: shiftInfo.event_name,
                startStr: shiftInfo.startStr,

              }
            }

            //update Shift infos
            setProxySelect(storeShift);


            waitListModalShow();


          }

          else {
            failModalShow();
          }
        })
        .catch((error) => {

          if(error.response.status === 405)
          {
            unavailableModalShow();
          }

          else if(error.response.status === 401)
          {
            pastEventModalShow();
          }

          else
          {
            console.log("error " + error);
            failModalShow();
          }
          
        });
    }
  };

  useEffect(() => { }, [currentShift]);

  // const signUpButton = <Button color="primary" onClick={() => signUp()}>Sign Up</Button>
  const signUpButton = (
    <button className="btn rosterButton navyButton" onClick={() => signUp()}>
      Sign Up
    </button>
  );
  //className="btn btn-warning m-0.5"
  return (
    //put UI objects here
    <div>
      {signUpButton}

      <Modal show={successModal} onHide={successModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Sign Up Success!</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="secondary" onClick={successModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={waitListModal} onHide={waitListModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Added to Waitlist!</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="secondary" onClick={waitListModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={unavailableModal} onHide={unavailableModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Error: User In Unavailable List</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="secondary" onClick={unavailableModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={pastEventModal} onHide={pastEventModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Error: Event Date has Passed</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="secondary" onClick={pastEventModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={failModal} onHide={failModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Error Signing Up</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="secondary" onClick={failModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SignUpShift;
