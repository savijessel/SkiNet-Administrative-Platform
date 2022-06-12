import React, { useState, useEffect } from "react";
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import { CustomInput, Form, FormGroup, Label, Input } from "reactstrap";
import { Modal as ReactBootStrapModal } from "react-bootstrap";

const EditShift = ({
  EditShiftModal,
  setEditShiftModal,
  currentShift,
  setProxySelect,
  shiftInfo,
  setUpdater,
  setCurrentShift,
  session,
  calendarRef,
}) => {
  //state template
  const [successModal, setSuccessModal] = useState(false);
  const successModalShow = () => setSuccessModal(true);
  const successModalClose = () => setSuccessModal(false);

  const [failModal, setFailModal] = useState(false);
  const failModalShow = () => setFailModal(true);
  const failModalClose = () => setFailModal(false);

  const [failReselectModal, setFailReselectModal] = useState(false);
  const failReselectModalShow = () => setFailReselectModal(true);
  const failReselectModalClose = () => setFailReselectModal(false);

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
    if (currentShift) {
      setEditShiftModal(e);
      setEventInfo({
        event_name: shiftInfo ? shiftInfo.event_name : "",
        start_date: currentShift ? currentShift.event.startStr : "",
        end_date: currentShift ? currentShift.event.endStr : "",
        min_patrollers: shiftInfo ? shiftInfo.min_pat : "",
        max_patrollers: shiftInfo ? shiftInfo.max_pat : "",
        max_trainees: shiftInfo ? shiftInfo.max_trainee : "",
        selectUser: shiftInfo ? shiftInfo.hl : "",
        all_day: shiftInfo ? (shiftInfo.all_day === "1" ? true : false) : "",
      });
    }
  };

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
    // //Refer to
    // //https://www.w3schools.com/sql/sql_autoincrement.asp
    e.preventDefault();

    if (currentShift) {
      const article = {
        eventID: currentShift.event.extendedProps.eventID,
        eventName: eventInfo.event_name,
        allDay: eventInfo.all_day, //Specifies whether shift will be an all day shift (AKA urgent)
        minPatrollers: eventInfo.min_patrollers,
        maxPatrollers: eventInfo.max_patrollers,
        maxTrainees: eventInfo.max_trainees,
        groupID: currentShift.event.extendedProps.groupID,
        hlUser: currentShift.event.extendedProps.hlUser,
      };

      let startDate = currentShift ? currentShift.event.start : "";
      let endDate = currentShift ? currentShift.event.end : "";
      try {
        const params = new URLSearchParams({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        });

        //Custom Query with Action Log here
        session
          .put("roster/updateEvent", article, params.toString(), true)
          .then((response) => {
            //if success from database
            if (response.status === 200) {
              //Setting on and off of pop up
              toggle(false);
              //load events
              setUpdater(true);

              //PROXY SELECT FROM OLD GROUP - dont know what it is used for but kept as comment just in case

              //do this since to select a shift again in proxy and update we must have current.event.id != clickedInfo.event.id in Rostered services proxy select
              let storeShift = {
                event: {
                  proxy: "yes",
                  extendedProps: {
                    hlUser: article.hlUser,
                    minPatrollers: article.minPatrollers,
                    maxPatrollers: article.maxPatrollers,
                    maxTrainees: article.maxTrainees,
                    eventID: article.eventID,
                  },
                  allDay: article.allDay,
                  title: article.eventName,
                  startStr: currentShift.event.startStr,
                },
              };

              //update Shift infos
              setProxySelect(storeShift);

              successModalShow();
            } else {
              console.log("Error in DB");
              toggle(false);
              failModalShow();
            }
          })
          .catch((e) => {
            console.log(e);
            toggle(false);
            failModalShow();
          });
      } catch (err) {
        console.log(err);
        toggle(false);
        failReselectModalShow();
      }
    }
  };

  useEffect(() => {}, [EditShiftModal, currentShift, eventInfo]);

  const openBtn = (
    <button
      className="btn navyButton rosterButton"
      onClick={() => toggle(true)}
    >
      Edit Shift
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
      <Modal isOpen={EditShiftModal} toggle={() => toggle(false)} className="">
        <ModalHeader close={closeBtn}>
          Event Start: {EditShiftModal ? showDate("start") : ""} <br /> Event
          End: {EditShiftModal ? showDate("end") : ""}
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={(e) => EditEvent(e)}>
            <FormGroup>
              <Label for="eventName">Event Name</Label>
              <Input
                type="text"
                name="event_name"
                onChange={onChange}
                value={eventInfo.event_name}
                required
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

            <Button>Submit</Button>
          </Form>
        </ModalBody>
      </Modal>

      <ReactBootStrapModal show={successModal} onHide={successModalClose}>
        <ReactBootStrapModal.Header closeButton>
          <ReactBootStrapModal.Title>
            Editing Success!
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
            Error Editing Event
          </ReactBootStrapModal.Title>
        </ReactBootStrapModal.Header>
        <ReactBootStrapModal.Footer>
          <Button variant="secondary" onClick={failModalClose}>
            Close
          </Button>
        </ReactBootStrapModal.Footer>
      </ReactBootStrapModal>

      <ReactBootStrapModal
        show={failReselectModal}
        onHide={failReselectModalClose}
      >
        <ReactBootStrapModal.Header closeButton>
          <ReactBootStrapModal.Title>
            Please Reselect Event to Edit
          </ReactBootStrapModal.Title>
        </ReactBootStrapModal.Header>
        <ReactBootStrapModal.Footer>
          <Button variant="secondary" onClick={failReselectModalClose}>
            Close
          </Button>
        </ReactBootStrapModal.Footer>
      </ReactBootStrapModal>
    </div>
  );
};

export default EditShift;
