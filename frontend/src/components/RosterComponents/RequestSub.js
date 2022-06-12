import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "reactstrap";
import { Modal as ReactBootStrapModal } from "react-bootstrap";

const RequestSub = ({
  currentShift,
  setProxySelect,
  user,
  username,
  session,
}) => {
  //state template
  const [successModal, setSuccessModal] = useState(false);
  const successModalShow = () => setSuccessModal(true);
  const successModalClose = () => setSuccessModal(false);

  const [failModal, setFailModal] = useState(false);
  const failModalShow = () => setFailModal(true);
  const failModalClose = () => setFailModal(false);

  const RequestSub = async (e) => {
    let article = {
      area: user.area !== null ? user.area.areaID : null,
      attendance: user.attendance,
      comment: user.comment,
      email: user.email,
      event: user.event.eventID,
      eventLogID: user.eventLogID,
      phoneNumber: user.user.phoneNumber,
      role: user.role,
      trainer: user.trainer,
      user: user.user.userID,
      shadowing: user.shadowing !== null ? user.shadowing.userID : null,
    };
    session
      .put("roster/addSubRequest", article, {}, true)
      .then((response) => {
        //if error from database
        if (response.status === 200) {
          //** PROXY SELECT ** /
          let storeShift = {
            event: {
              proxy: "yes",
              extendedProps: {
                hlUser: user.event.hlUser,
                minPatrollers: user.event.minPatrollers,
                maxPatrollers: user.event.maxPatrollers,
                maxTrainees: user.event.maxTrainees,
                eventID: user.event.eventID,
              },
              allDay: user.event.allDay,
              title: user.event.eventName,
              startStr: currentShift.event.startStr,
            },
          };

          //update Shift infos
          setProxySelect(storeShift);
          successModalShow();
        } else {
          failModalShow();
        }
      })
      .catch((error) => {
        console.log("error " + error);
        failModalShow();
      });
  };

  useEffect(() => {}, [currentShift]);

  const removeButton = (
    <a color="danger" className="dropdown-item" onClick={() => RequestSub()}>
      SubReq
    </a>
  );

  return (
    //put UI objects here
    <div>
      {removeButton}

      <ReactBootStrapModal show={successModal} onHide={successModalClose}>
        <ReactBootStrapModal.Header closeButton>
          <ReactBootStrapModal.Title>
            Sub Request Success!
          </ReactBootStrapModal.Title>
        </ReactBootStrapModal.Header>
        <ReactBootStrapModal.Footer>
          <Button variant="secondary" onClick={successModalClose}>
            Close
          </Button>
        </ReactBootStrapModal.Footer>
      </ReactBootStrapModal>

      <ReactBootStrapModal show={failModal} onHide={failModalClose}>
        <ReactBootStrapModal.Header closeButton>
          <ReactBootStrapModal.Title>
            Error Assigning Sub Request
          </ReactBootStrapModal.Title>
        </ReactBootStrapModal.Header>
        <ReactBootStrapModal.Footer>
          <Button variant="secondary" onClick={failModalClose}>
            Close
          </Button>
        </ReactBootStrapModal.Footer>
      </ReactBootStrapModal>
    </div>
  );
};

export default RequestSub;
