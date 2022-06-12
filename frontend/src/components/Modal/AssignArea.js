import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import { Form, FormGroup, Label, Input } from "reactstrap";
import { Modal as ReactBootStrapModal } from "react-bootstrap";

const AssignArea = ({
  currentShift,
  setProxySelect,
  user,
  username,
  session,
  shiftInfo,
}) => {
  //state template
  const [successModal, setSuccessModal] = useState(false);
  const successModalShow = () => setSuccessModal(true);
  const successModalClose = () => setSuccessModal(false);

  const [failModal, setFailModal] = useState(false);
  const failModalShow = () => setFailModal(true);
  const failModalClose = () => setFailModal(false);

  const [Areas, setAreas] = useState(false);
  const [AssignAreaModal, setAssignAreaModal] = useState(false); // for Edit Shift

  const [eventInfo, setEventInfo] = useState({
    event_id: currentShift ? currentShift.event.id : "",
    username: user ? user.username : "",
    selectedArea: user ? user.area : "",
  });

  const toggle = (e) => {
    if (user && currentShift) {
      setEventInfo({
        event_id: currentShift ? currentShift.event.id : "",
        username: user ? user.username : "",
        selectedArea: user ? user.area : "",
      });
      //Setting on and off of pop up
      setAssignAreaModal(e);
    }
  };

  const onChange = (e) => {
    //setting dictionary with of previous values + the new value. The dictionary will overwrite the existing e.target.name since you cannot have duplicates
    setEventInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const editArea = (e) => {
    e.preventDefault();

    const article = {
      area: Areas[eventInfo.selectedArea]._links.area.href,
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
    if (Areas.length !== 0 && Areas) {
      let userOptionRender = [];

      for (let i = 0; i < Areas.length; i++) {
        userOptionRender.push(<option value={i}>{Areas[i].areaname}</option>);
      }
      return userOptionRender;
    } else return;
  };

  useEffect(() => {
    if (AssignAreaModal) {
      session
        .get("areas")
        .then((response) => {
          // If request is good...
          setAreas(response.data._embedded.areas);
        })
        .catch((error) => {
          console.log("error " + error);
        });
    }
  }, [AssignAreaModal, session]);

  const openBtn = (
    <a color="primary" className="dropdown-item" onClick={() => toggle(true)}>
      Assign Area
    </a>
  ); //<Button color="primary">ADD TO TRAINEE</Button>{' '}
  const closeBtn = (
    <Button className="close" onClick={() => toggle(false)}>
      Close
    </Button>
  );

  return (
    //put UI objects here
    <div>
      {openBtn}
      <Modal isOpen={AssignAreaModal} toggle={() => toggle(false)} className="">
        <ModalHeader close={closeBtn}>Assign Area</ModalHeader>
        <ModalBody onSubmit={(e) => editArea(e)}>
          <Form>
            <FormGroup>
              <Label for="selectedArea">{}</Label>
              <Input
                type="select"
                name="selectedArea"
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
            Area Assignment Success!
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
            Error Assigning Area
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

export default AssignArea;
