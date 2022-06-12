import React, { useState } from "react";
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import { Form, FormGroup, Label, Input } from "reactstrap";
import { Modal as ReactBootStrapModal } from "react-bootstrap";

import axios from "axios";
const Comment = ({
  currentShift,
  setProxySelect,
  user,
  session,
  session_data,
}) => {
  const [successModal, setSuccessModal] = useState(false);
  const successModalShow = () => setSuccessModal(true);
  const successModalClose = () => setSuccessModal(false);

  const [failModal, setFailModal] = useState(false);
  const failModalShow = () => setFailModal(true);
  const failModalClose = () => setFailModal(false);

  const [modal, setModal] = useState(false);
  const [eventInfo, setEventInfo] = useState({
    event_id: currentShift ? currentShift.event.id : "",
    username: user ? user.username : "",
    comment: user ? user.comment : "",
  });

  const toggle = (e) => {
    if (user && currentShift) {
      setEventInfo({
        event_id: currentShift ? currentShift.event.id : "",
        username: user ? user.username : "",
        comment: user ? user.comment : "",
      });
      //Setting on and off of pop up
      setModal(e);
    }
  };

  const onChange = (e) => {
    //setting dictionary with of previous values + the new value. The dictionary will overwrite the existing e.target.name since you cannot have duplicates
    setEventInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const editComment = (e) => {
    e.preventDefault();

    const article = {
      comment: eventInfo.comment,
    };
    session
      .patch("eventLogs/" + user.eventLogID, article, {}, false)
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

  // const openBtn = <Button color="success" className="mr-1 mt-1" onClick={() => toggle(true)}>Comment</Button>
  const openBtn1 = (
    <a className="dropdown-item ">
      <button className="btn btn-success" onClick={() => toggle(true)}>
        Comment
      </button>
    </a>
  );
  const openBtn = (
    <a className="dropdown-item" onClick={() => toggle(true)}>
      Add Comment
    </a>
  );
  const closeBtn = (
    <Button className="close" onClick={() => toggle(false)}>
      Close
    </Button>
  );

  return (
    <div>
      {openBtn}
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader close={closeBtn}>Edit Comment</ModalHeader>
        <ModalBody onSubmit={(e) => editComment(e)}>
          <p>Current Comment: {user ? user.comment : ""}</p>
          <Form>
            <FormGroup>
              <Label for="comment" className="col-form-label">
                Type to add to comment:
              </Label>
              <Input type="text" name="comment" onChange={onChange} />
            </FormGroup>
            <Button>Submit</Button>
          </Form>
        </ModalBody>
      </Modal>

      <ReactBootStrapModal show={successModal} onHide={successModalClose}>
        <ReactBootStrapModal.Header closeButton>
          <ReactBootStrapModal.Title>
            Comment Assignment Success!
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
            Error Assigning Comment
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

export default Comment;
