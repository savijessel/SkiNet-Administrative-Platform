import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import {
  Form,
  FormGroup,
  Label,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
} from "reactstrap";
import { Modal as ReactBootStrapModal } from "react-bootstrap";

const Attendance = ({
  currentShift,
  setProxySelect,
  user,
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

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [attendanceModal, setAttendanceModal] = useState(false); // for Edit Shift
  const [attendance, setAttendance] = useState(user.attendance);

  const [eventInfo, setEventInfo] = useState({
    event_id: currentShift ? currentShift.event.id : "",
    username: user ? user.username : "",
    attendance: user ? user.attendance : "",
  });

  const dropToggle = () => setDropdownOpen((prevState) => !prevState);
  const toggle = (e) => {
    if (user && currentShift) {
      setEventInfo({
        event_id: currentShift ? currentShift.event.id : "",
        username: user ? user.username : "",
        attendance: user ? user.attendance : "",
      });
      changeAttendance("On Time");
      //Setting on and off of pop up
      setAttendanceModal(e);
    }
  };

  const changeAttendance = (e) => {
    //setting dictionary with of previous values + the new value. The dictionary will overwrite the existing e.target.name since you cannot have duplicates
    setAttendance(e);
    setEventInfo((prev) => ({
      ...prev,
      attendance: e,
    }));
  };

  const editAttendance = (e) => {
    e.preventDefault();

    const article = {
      attendance: attendance,
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

  useEffect(() => {}, [attendanceModal]);

  const openBtn = (
    <a color="secondary" className="dropdown-item" onClick={() => toggle(true)}>
      Attendance
    </a>
  ); //<Button color="primary">ADD TO TRAINEE</Button>{' '}
  // className="btn btn-primary rosterButton"
  const closeBtn = (
    <Button className="close" onClick={() => toggle(false)}>
      Close
    </Button>
  );

  return (
    //put UI objects here
    <div>
      {openBtn}
      <Modal isOpen={attendanceModal} toggle={() => toggle(false)} className="">
        <ModalHeader close={closeBtn}>Attendance</ModalHeader>
        <ModalBody onSubmit={(e) => editAttendance(e)}>
          <Form>
            <FormGroup>
              <Label for="attendance">Attendance</Label>
              <Dropdown isOpen={dropdownOpen} toggle={dropToggle}>
                <DropdownToggle caret>{attendance}</DropdownToggle>
                <DropdownMenu>
                  <DropdownItem
                    onClick={() => changeAttendance("ON_TIME")}
                    selected
                  >
                    On Time
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem onClick={() => changeAttendance("LATE")}>
                    Late
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem onClick={() => changeAttendance("NO_SHOW")}>
                    No Show
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem
                    onClick={() => changeAttendance("EXCUSED_ABSENCE")}
                  >
                    Excused Absence
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </FormGroup>
            <Button>Submit</Button>
          </Form>
        </ModalBody>
      </Modal>

      <ReactBootStrapModal show={successModal} onHide={successModalClose}>
        <ReactBootStrapModal.Header closeButton>
          <ReactBootStrapModal.Title>
            Attendance Assignment Success!
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
            Error Assigning Attendance
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

export default Attendance;
