import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Modal, ModalHeader, ModalBody, Form } from "reactstrap";
import { Modal as ReactBootStrapModal } from "react-bootstrap";

const DeleteShift = ({
  EventDeleteModal,
  setEventDeleteModal,
  currentShift,
  setUpdater,
  setResetter,
  session,
}) => {
  //state template
  const [eventInfo, setEventInfo] = useState({});
  const [successModal, setSuccessModal] = useState(false);
  const successModalShow = () => setSuccessModal(true);
  const successModalClose = () => setSuccessModal(false);

  const [failModal, setFailModal] = useState(false);
  const failModalShow = () => setFailModal(true);
  const failModalClose = () => setFailModal(false);

  const toggle = (e) => {
    if (currentShift) {
      setEventInfo({});
      //Setting on and off of pop up
      setEventDeleteModal(e);
    }
  };

  const DeleteEvent = async (e) => {
    // //Refer to
    // //https://www.w3schools.com/sql/sql_autoincrement.asp
    e.preventDefault();

    const params = new URLSearchParams({
      eventID: currentShift.event.extendedProps.eventID,
    });

    session
      .put("roster/deleteEvent/", {}, params.toString(), true) //NEED CUSTOM CALL FOR THIS
      .then((response) => {
        //if error from database
        if (response.status === 200) {
          //shift info reset
          setResetter(true);
          //Rerender the Calendar
          setUpdater(true);
          //Setting on and off of pop up
          toggle(false);
          successModalShow();
        } else {
          console.log("Error in DB");
          failModalShow();
        }
      });
  };

  useEffect(() => {}, []);

  const openBtn = (
    <button
      className="btn redButton rosterButton"
      onClick={() => toggle(true)}
    >
      Delete Shift
    </button>
  );
  const closeBtn = (
    <Button className="close" onClick={() => toggle(false)}>
      Close
    </Button>
  );
  //<Form onSubmit={}>

  return (
    //put UI objects here
    <>
      {openBtn}
      <Modal
        isOpen={EventDeleteModal}
        toggle={() => toggle(false)}
        className=""
      >
        <ModalHeader close={closeBtn}>
          {" "}
          DELETE Event Name: {currentShift ? currentShift.event.title : ""}{" "}
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={(e) => DeleteEvent(e)}>
            <Button>Delete Shift(s)?</Button>
          </Form>
        </ModalBody>
      </Modal>

      <ReactBootStrapModal show={successModal} onHide={successModalClose}>
        <ReactBootStrapModal.Header closeButton>
          <ReactBootStrapModal.Title>Delete Success!</ReactBootStrapModal.Title>
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
            Error Deleting Event
          </ReactBootStrapModal.Title>
        </ReactBootStrapModal.Header>
        <ReactBootStrapModal.Footer>
          <Button variant="secondary" onClick={failModalClose}>
            Close
          </Button>
        </ReactBootStrapModal.Footer>
      </ReactBootStrapModal>
    </>
  );
};

export default DeleteShift;
