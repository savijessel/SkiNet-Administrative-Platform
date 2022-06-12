import React, { useEffect, useState } from "react";
import { Button } from "reactstrap";
import { Modal } from "react-bootstrap";

import "./Table.css";

const UnavailableShift = ({
  currentShift,
  setProxySelect,
  name,
  username,
  user_type,
  session,
  setUnavailList,
  setShiftInfo,
  setList,
  shiftInfo,
}) => {
  //state template
  const [successModal, setSuccessModal] = useState(false);
  const successModalShow = () => setSuccessModal(true);
  const successModalClose = () => setSuccessModal(false);

  const [failModal, setFailModal] = useState(false);
  const failModalShow = () => setFailModal(true);
  const failModalClose = () => setFailModal(false);

  const signUp = async (e) => {
    let session_data = session.session_data();

    if (currentShift) {
      const article = {
        event: currentShift.event.extendedProps.eventID,
        event_name: currentShift.event.title,
        user: session_data.userID,
        user_type: session_data.user_type,
        phone_number: session_data.phone_number,
        trainer: session_data.trainer,
        role: "UNAVAILABLE",
        comment: "",
        email: session_data.email,
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
          } else {
            console.log("No Shifts");
            failModalShow();
          }
        })
        .catch((error) => {
          console.log("error " + error);
          failModalShow();
        });
    } else {
      failModalShow();
    }
  };

  useEffect(() => {}, [currentShift]);

  // const unavailButton = <Button color="warning" onClick={() => signUp()}>Unavailable</Button>
  const unavailButton = (
    <button
      className="btn greyButton rosterButton float-start"
      onClick={() => signUp()}
    >
      Unavailable
    </button>
  );

  return (
    //put UI objects here
    <div>
      {unavailButton}

      <Modal show={successModal} onHide={successModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Added To Unavailable List</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="secondary" onClick={successModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={failModal} onHide={failModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Error Adding to Unavailable List</Modal.Title>
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

export default UnavailableShift;
