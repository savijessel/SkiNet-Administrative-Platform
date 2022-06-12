import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
} from "reactstrap";
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

const EditShift = ({
  BulkEditModal,
  setBulkEditModal,
  currentShift,
  setProxySelect,
  shiftInfo,
  setUpdater,
  setCurrentShift,
  session,
}) => {
  //state template
  const [Sunday, setSunday] = useState(false);
  const [Monday, setMonday] = useState(false);
  const [Tuesday, setTuesday] = useState(false);
  const [Wednesday, setWednesday] = useState(false);
  const [Thursday, setThursday] = useState(false);
  const [Friday, setFriday] = useState(false);
  const [Saturday, setSaturday] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [eventsAltered, setEventsAltered] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [successModal, setSuccessModal] = useState(false);
  const successModalShow = () => setSuccessModal(true);
  const successModalClose = () => setSuccessModal(false);

  const [failModal, setFailModal] = useState(false);
  const failModalShow = () => setFailModal(true);
  const failModalClose = () => setFailModal(false);

  const [eventInfo, setEventInfo] = useState({
    event_name: "",
    start_date: "",
    end_date: "",
    min_patrollers: "",
    max_patrollers: "",
    max_trainees: "",
    selectUser: "",
    all_day: false,
  });

  const toggle = (e) => {
    //Setting on and off of pop up
    setBulkEditModal(e);
    setEventInfo({
      event_name: "",
      start_date: "",
      end_date: "",
      min_patrollers: "",
      max_patrollers: "",
      max_trainees: "",
      selectUser: "",
      all_day: false,
    });
    // setStartDate(new Date()); // CurrentShift Check?
    // setEndDate(new Date()); //CurrentShift Check?
    setSunday(false);
    setMonday(false);
    setTuesday(false);
    setWednesday(false);
    setThursday(false);
    setFriday(false);
    setSaturday(false);
  };

  const dropToggle = () => setDropdownOpen((prevState) => !prevState);

  const onChange = (e) => {
    //setting dictionary with of previous values + the new value. The dictionary will overwrite the existing e.target.name since you cannot have duplicates
    setEventInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSwitch = (e) => {
    //setting dictionary with of previous values + the new value. The dictionary will overwrite the existing e.target.name since you cannot have duplicates
    setEventInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.checked,
    }));
  };

  const showDate = (e) => {
    if (currentShift) {
      if (e === "start") return currentShift.event.startStr;
      else return currentShift.event.endStr;
    }
  };

  const EditEvent = async (e) => {
    e.preventDefault();

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

    //Used To Solve Bug where event at beginning Is not fetched. this is a backend oversight.
    var hackyStartDate = new Date(startDate);
    hackyStartDate.setHours(-6);
    hackyStartDate.setMinutes(-1);

    const params = new URLSearchParams({
      startDate: hackyStartDate.toISOString(),
      endDate: endDate.toISOString(),
    });

    const event = {
      eventName: eventInfo.event_name,
      allDay: eventInfo.all_day, //Specifies whether shift will be an all day shift (AKA urgent)
      minPatrollers: eventInfo.min_patrollers,
      maxPatrollers: eventInfo.max_patrollers,
      maxTrainees: eventInfo.max_trainees,
      groupID: -1,
      hlUser: null,
    };

    let article = {
      weekDays,
      event,
    };

    session
      .put("roster/bulkUpdateEventsByDate", article, params.toString(), true)
      .then((response) => {
        //if error from database

        if (response.status === 200) {
          setUpdater(true);
          successModalShow();
        } else {
          failModalShow();
        }
      })
      .catch((error) => {
        setEventsAltered([]);
        console.log(error);
        failModalShow();
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
    BulkEditModal,
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
      className="btn navyButton rosterButton float-start"
      onClick={() => toggle(true)}
    >
      Bulk Edit Shifts
    </button>
  );
  const closeBtn = (
    <Button className="close" onClick={() => toggle()}>
      Close
    </Button>
  );
  //<Form onSubmit={}>

  return (
    //put UI objects here
    <div>
      {openBtn}
      <Modal isOpen={BulkEditModal} toggle={() => toggle(false)} className="">
        <ModalHeader close={closeBtn}>Bulk Edit</ModalHeader>
        <ModalBody>
          <Form onSubmit={(e) => EditEvent(e)}>
            <FormGroup>
              <Label for="eventName">Event Name</Label>
              <Input
                type="text"
                name="event_name"
                onChange={onChange}
                value={eventInfo.event_name}
              />
            </FormGroup>
            <FormGroup>
              <Label for="min_patrollers">Min Patrollers</Label>
              <Input
                min={0}
                max={eventInfo.max_patrollers}
                type="number"
                name="min_patrollers"
                onChange={onChange}
                value={eventInfo.min_patrollers}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="max_patrollers">Max Patrollers</Label>
              <Input
                min={0}
                type="number"
                name="max_patrollers"
                onChange={onChange}
                value={eventInfo.max_patrollers}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="max_trainees">Max Trainees</Label>
              <Input
                min={0}
                type="number"
                name="max_trainees"
                onChange={onChange}
                value={eventInfo.max_trainees}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="all_day" check>
                Urgent Day
                <br />
              </Label>
              <CustomInput
                type="switch"
                name="all_day"
                id="exampleCheck"
                onChange={onSwitch}
                checked={eventInfo.all_day}
              />
            </FormGroup>
            <FormGroup>
              <UserDescription>From: </UserDescription>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
              />
            </FormGroup>
            <FormGroup>
              <UserDescription>To: </UserDescription>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
              />
            </FormGroup>
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
            <FormGroup>
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
            </FormGroup>

            <Button>Submit</Button>
          </Form>
        </ModalBody>
      </Modal>

      <ReactBootStrapModal show={successModal} onHide={successModalClose}>
        <ReactBootStrapModal.Header closeButton>
          <ReactBootStrapModal.Title>
            Bulk Edit Success!
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
            Error Editing Events
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

export default EditShift;
