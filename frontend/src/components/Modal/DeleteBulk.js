import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import {
  CustomInput,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { UserDescription } from "../../components/Elements/Elements";
import { Modal as ReactBootStrapModal } from "react-bootstrap";

const DeleteShift = ({
  BulkEventDeleteModal,
  setBulkEventDeleteModal,
  currentShift,
  setUpdater,
  session,
}) => {
  //state template

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [eventsAltered, setEventsAltered] = useState([]);

  const [Sunday, setSunday] = useState(false);
  const [Monday, setMonday] = useState(false);
  const [Tuesday, setTuesday] = useState(false);
  const [Wednesday, setWednesday] = useState(false);
  const [Thursday, setThursday] = useState(false);
  const [Friday, setFriday] = useState(false);
  const [Saturday, setSaturday] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const successModalShow = () => setSuccessModal(true);
  const successModalClose = () => setSuccessModal(false);

  const [failModal, setFailModal] = useState(false);
  const failModalShow = () => setFailModal(true);
  const failModalClose = () => setFailModal(false);

  const [eventInfo, setEventInfo] = useState({});

  const toggle = (e) => {
    setEventInfo({});
    //Setting on and off of pop up
    setStartDate(new Date());
    setEndDate(new Date());
    setSunday(false);
    setMonday(false);
    setTuesday(false);
    setWednesday(false);
    setThursday(false);
    setFriday(false);
    setSaturday(false);
    setBulkEventDeleteModal(e);
  };

  const DeleteEvent = async (e) => {
    // //Refer to
    // //https://www.w3schools.com/sql/sql_autoincrement.asp
    e.preventDefault();

    let eventIDs = [];

    eventsAltered.forEach((event) => {
      eventIDs.push(event.eventID);
    });

    let article = {
      eventIDs,
    };

    session
      .put("roster/bulkDeleteEvents", article, {}, true)
      .then((response) => {
        //if error from database
        if (response.status === 200) {
          successModalShow();
          setUpdater(true);
        } else {
          console.log("Error in DB");
          failModalShow();
        }
      })
      .catch((error) => {
        failModalShow();
        console.log(error);
      });
  };

  const eventRender = () => {
    //If it exists and it is greater than 0
    if (eventsAltered.length !== 0 && eventsAltered) {
      let eventOptionRender = [];

      for (let i = 0; i < eventsAltered.length; i++) {
        eventOptionRender.push(
          <option key={i}>
            {eventsAltered[i].eventName}:{" "}
            {eventsAltered[i].startDate.toString().split("T")[0]}
          </option>
        );
      }
      return eventOptionRender;
    } else return;
  };

  useEffect(() => {
    const weekDays = [];

    if (Monday) {
      weekDays.push("Monday");
    }

    if (Tuesday) {
      weekDays.push("Tuesday");
    }

    if (Wednesday) {
      weekDays.push("Wednesday");
    }

    if (Thursday) {
      weekDays.push("Thursday");
    }

    if (Friday) {
      weekDays.push("Friday");
    }

    if (Saturday) {
      weekDays.push("Saturday");
    }

    if (Sunday) {
      weekDays.push("Sunday");
    }

    startDate.setHours(0, 0, 0);
    endDate.setHours(0, 0, 0);

    //Used To Solve Bug where event at beginning Is not fetched. this is a backend oversight.
    var hackyStartDate = new Date(startDate);
    hackyStartDate.setHours(-6);
    hackyStartDate.setMinutes(-1);

    const params = new URLSearchParams({
      startDate: hackyStartDate.toISOString(),
      endDate: endDate.toISOString(),
    });

    let article = {
      weekDays,
    };

    session
      .put("roster/retrieveEventsByWeekday", article, params.toString(), true)
      .then((response) => {
        //if error from database
        if (response.status === 200) {
          setEventsAltered(response.data);
        } else {
          console.log("Error in DB");
        }
      })
      .catch((error) => {
        setEventsAltered([]);
        console.log(error);
      });

    //Add CurrentShift?, eventInfo?, startDate?, endDate?
  }, [
    startDate,
    endDate,
    Sunday,
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday,
    session,
  ]);

  const openBtn = (
    <button
      className="btn redButton rosterButton float-start"
      onClick={() => toggle(true)}
    >
      Bulk Delete Shifts
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
        isOpen={BulkEventDeleteModal}
        toggle={() => toggle(false)}
        className=""
      >
        <ModalHeader close={closeBtn}> Bulk Delete </ModalHeader>
        <ModalBody>
          <Form onSubmit={(e) => DeleteEvent(e)}>
            <div>
              <UserDescription>From: </UserDescription>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
              />
            </div>
            <div>
              <UserDescription>To: </UserDescription>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
              />
            </div>
            <FormGroup check inline>
              <Label check>
                <Input
                  type="checkbox"
                  id="Sunday"
                  onChange={(e) => {
                    setSunday(e.target.checked);
                  }}
                />{" "}
                Sunday
              </Label>
            </FormGroup>
            <FormGroup check inline>
              <Label check>
                <Input
                  type="checkbox"
                  id="Monday"
                  onChange={(e) => {
                    setMonday(e.target.checked);
                  }}
                />{" "}
                Monday
              </Label>
            </FormGroup>
            <FormGroup check inline>
              <Label check>
                <Input
                  type="checkbox"
                  id="Tuesday"
                  onChange={(e) => {
                    setTuesday(e.target.checked);
                  }}
                />{" "}
                Tuesday
              </Label>
            </FormGroup>
            <FormGroup check inline>
              <Label check>
                <Input
                  type="checkbox"
                  id="Wednesday"
                  onChange={(e) => {
                    setWednesday(e.target.checked);
                  }}
                />{" "}
                Wednesday
              </Label>
            </FormGroup>
            <FormGroup check inline>
              <Label check>
                <Input
                  type="checkbox"
                  id="Thursday"
                  onChange={(e) => {
                    setThursday(e.target.checked);
                  }}
                />{" "}
                Thursday
              </Label>
            </FormGroup>
            <FormGroup check inline>
              <Label check>
                <Input
                  type="checkbox"
                  id="Friday"
                  onChange={(e) => {
                    setFriday(e.target.checked);
                  }}
                />{" "}
                Friday
              </Label>
            </FormGroup>
            <FormGroup check inline>
              <Label check>
                <Input
                  type="checkbox"
                  id="Saturday"
                  onChange={(e) => {
                    setSaturday(e.target.checked);
                  }}
                />{" "}
                Saturday
              </Label>
            </FormGroup>
            <div>
              <Input
                type="select"
                name="selectedShadow"
                id="exampleSelectMulti"
                readOnly={true}
                size="5"
                required
              >
                {eventRender()}
              </Input>
            </div>
            <Button>Delete Shifts?</Button>
          </Form>
        </ModalBody>
      </Modal>

      <ReactBootStrapModal show={successModal} onHide={successModalClose}>
        <ReactBootStrapModal.Header closeButton>
          <ReactBootStrapModal.Title>
            Bulk Delete Success!
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
            Error Deleting Events
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
