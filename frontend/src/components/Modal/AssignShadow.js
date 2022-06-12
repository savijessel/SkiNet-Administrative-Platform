import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import { Form, FormGroup, Label, Input } from "reactstrap";
import { Modal as ReactBootStrapModal } from "react-bootstrap";

const AssignShadow = ({
  currentShift,
  setProxySelect,
  user,
  username,
  rosteredList,
  session,
  shiftInfo,
}) => {
  //state template

  const [Users, setUsers] = useState(false);
  const [AssignShadowModal, setAssignShadowModal] = useState(false); // for Edit Shift

  const [successModal, setSuccessModal] = useState(false);
  const successModalShow = () => setSuccessModal(true);
  const successModalClose = () => setSuccessModal(false);

  const [failModal, setFailModal] = useState(false);
  const failModalShow = () => setFailModal(true);
  const failModalClose = () => setFailModal(false);

  const [eventInfo, setEventInfo] = useState({
    event_id: currentShift ? currentShift.event.id : "",
    username: user ? user.username : "",
    selectedShadow: user ? user.shadowing : "",
  });

  const toggle = (e) => {
    if (currentShift) {
      setEventInfo({
        event_id: currentShift ? currentShift.event.id : "",
        username: user ? user.username : "",
        selectedShadow: user ? user.shadowing : "",
      });
      //Setting on and off of pop up
      setAssignShadowModal(e);
    }
  };

  const onChange = (e) => {
    //setting dictionary with of previous values + the new value. The dictionary will overwrite the existing e.target.name since you cannot have duplicates
    setEventInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const AddRoster = (e) => {
    // //Refer to
    // //https://www.w3schools.com/sql/sql_autoincrement.asp
    e.preventDefault();

    let shadowingUserEventLog = Users[eventInfo.selectedShadow];
    let shadowingUserLink =
      session._get_base_url() +
      "/api/users/" +
      shadowingUserEventLog.user.userID;

    const article = {
      shadowing: shadowingUserLink,
    };
    console.log(eventInfo.selectedArea);
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
          failModalShow();
        }
      })
      .catch((error) => {
        console.log("error " + error);
        failModalShow();
      });
  };

  const userRender = () => {
    //If it exists and it is greater than 0
    if (Users.length !== 0 && Users) {
      let userOptionRender = [];

      for (let i = 0; i < Users.length; i++) {
        userOptionRender.push(
          <option value={i}>
            {Users[i].user.firstName + " " + Users[i].user.lastName}
          </option>
        );
      }
      return userOptionRender;
    } else return;
  };

  useEffect(() => {
    if (AssignShadowModal) {
      setUsers(rosteredList);
    }
  }, [AssignShadowModal, rosteredList]);

  const openBtn = (
    <a className="dropdown-item" onClick={() => toggle(true)}>
      Shadow
    </a>
  ); //<Button color="primary">ADD TO ROSTER</Button>{' '}
  const closeBtn = (
    <Button className="close" onClick={() => toggle(false)}>
      Close
    </Button>
  );

  return (
    //put UI objects here
    <>
      {openBtn}
      <Modal
        isOpen={AssignShadowModal}
        toggle={() => toggle(false)}
        className=""
      >
        <ModalHeader close={closeBtn}>Assign User to Shadow:</ModalHeader>
        <ModalBody>
          <Form onSubmit={(e) => AddRoster(e)}>
            <FormGroup>
              <Label for="selectedShadow">Select</Label>
              <Input
                type="select"
                name="selectedShadow"
                id="exampleSelectMulti"
                onChange={onChange}
                size="5"
                required
              >
                {userRender()}
              </Input>
            </FormGroup>
            <Button>Submit</Button>
          </Form>
        </ModalBody>
      </Modal>

      <ReactBootStrapModal show={successModal} onHide={successModalClose}>
        <ReactBootStrapModal.Header closeButton>
          <ReactBootStrapModal.Title>
            Shadow Assignment Success!
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
            Error Assigning Shadow
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

export default AssignShadow;
