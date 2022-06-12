import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import { Form, FormFeedback, FormGroup, Label, Input } from "reactstrap";
import { Modal as ReactBootStrapModal } from "react-bootstrap";

const AddShadow = ({
  AddShadowModal,
  setAddShadowModal,
  currentShift,
  setProxySelect,
  session,
  shiftInfo,
}) => {
  const [phonenumberValidation, setPhonenumberValidation] = useState(false);
  const [usernameAvailability, setUsernameAvailability] = useState(false);

  const [successModal, setSuccessModal] = useState(false);
  const successModalShow = () => setSuccessModal(true);
  const successModalClose = () => setSuccessModal(false);

  const [failModal, setFailModal] = useState(false);
  const failModalShow = () => setFailModal(true);
  const failModalClose = () => setFailModal(false);

  const [userInfo, setUserInfo] = useState({
    event_id: currentShift ? currentShift.event.id : "",
    event_name: currentShift ? currentShift.event.title : "",
    selectUser: "",
    shadow_name: "",
    shadow_phone_number: "",
    shadow_email: "",
    role: "Shadow",
    comment: "",
    user_type: "Not A User",
    trainer: "",
  });

  const toggle = (e) => {
    if (currentShift) {
      setUserInfo({
        event_id: currentShift ? currentShift.event.id : "",
        event_name: currentShift ? currentShift.event.title : "",
        shadow_name: "",
        shadow_phone_number: "",
        shadow_email: "",
        role: "Shadow",
        comment: "",
        user_type: "Not A User",
        trainer: "",
      });
      //Setting on and off of pop up
      setAddShadowModal(e);
    }
  };

  const onChange = (e) => {
    //setting dictionary with of previous values + the new value. The dictionary will overwrite the existing e.target.name since you cannot have duplicates
    setUserInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const formatPhoneNumber = (str) => {
    //Filter only numbers from the input
    let cleaned = (`` + str).replace(/\D/g, "");

    let match = "";
    if (cleaned.length === 1) match = cleaned.match(/^(\d{1})$/);
    if (cleaned.length === 2) match = cleaned.match(/^(\d{1})(\d{1})$/);
    if (cleaned.length === 3) match = cleaned.match(/^(\d{1})(\d{2})$/);
    if (cleaned.length === 4) match = cleaned.match(/^(\d{1})(\d{3})$/);
    if (cleaned.length === 5) match = cleaned.match(/^(\d{1})(\d{3})(\d{1})$/);
    if (cleaned.length === 6) match = cleaned.match(/^(\d{1})(\d{3})(\d{2})$/);
    if (cleaned.length === 7) match = cleaned.match(/^(\d{1})(\d{3})(\d{3})$/);
    if (cleaned.length === 8)
      match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{1})$/);
    if (cleaned.length === 9)
      match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{2})$/);
    if (cleaned.length === 10)
      match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{3})$/);
    if (cleaned.length === 11)
      match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{4})$/);

    if (cleaned.length === 1) {
      if (match) return `+` + String(match[1]);
      else return ``;
    } else if (2 <= cleaned.length && 4 >= cleaned.length) {
      if (match) return `+` + String(match[1]) + ` ` + String(match[2]);
      else return ``;
    } else if (5 <= cleaned.length && 7 >= cleaned.length) {
      if (match)
        return (
          `+` +
          String(match[1]) +
          ` ` +
          `(` +
          String(match[2]) +
          `) ` +
          String(match[3])
        );
      else return ``;
    } else {
      if (match)
        return (
          `+` +
          String(match[1]) +
          ` ` +
          `(` +
          String(match[2]) +
          `) ` +
          String(match[3]) +
          ` ` +
          String(match[4])
        );
      else return ``;
    }
  };

  const AddShadow = (e) => {
    e.preventDefault();

    const article = {
      event: currentShift.event.extendedProps.eventID,
      name: userInfo.shadow_name,
      phoneNumber: userInfo.shadow_phone_number,
      trainer: false,
      role: "SHADOW",
      comment: userInfo.comment,
      email: userInfo.shadow_email,
      attendance: "ON_TIME",
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
          failModalShow();
        }
      })
      .catch((error) => {
        console.log("error " + error);
        failModalShow();
      });
  };

  useEffect(() => {
    if (AddShadowModal) {
      //checking if username is available for creation
      if (userInfo.shadow_name !== "") {
        setUsernameAvailability(true);

        // axios.get('/checkAvailability/' + userInfo.shadow_name)
        //     .then(response =>
        //     {
        //         // If request is good...
        //         if(response.status === 204)
        //         {
        //         }
        //         else{
        //             setUsernameAvailability(false);
        //         }
        //     })
        //     .catch((error) => {
        //         setUsernameAvailability(false);
        //     });
      } else {
        setUsernameAvailability(false);
      }

      //checking if phone number is valid length
      if (userInfo.shadow_phone_number.length === 17) {
        setPhonenumberValidation(true);
      } else {
        setPhonenumberValidation(false);
      }
    }
  }, [userInfo, AddShadowModal]);

  const openBtn = (
    <button className="btn navyButton" onClick={() => toggle(true)}>
      Add Shadow
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
    <div>
      {openBtn}
      <Modal isOpen={AddShadowModal} toggle={() => toggle(false)} className="">
        <ModalHeader toggle={() => toggle(false)} close={closeBtn}>
          Add Shadow
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={(e) => AddShadow(e)}>
            <FormGroup>
              <Label for="first_">Name</Label>
              <Input
                valid={usernameAvailability}
                invalid={!usernameAvailability}
                type="text"
                name="shadow_name"
                onChange={onChange}
                value={userInfo.shadow_name}
                required
              />
              <FormFeedback valid>Username is Available</FormFeedback>
              <FormFeedback invalid>Invalid or Taken</FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label for="shadow_phone_number">Phone Number</Label>
              <Input
                invalid={!phonenumberValidation}
                type="text"
                maxLength={17}
                name="shadow_phone_number"
                onChange={onChange}
                value={formatPhoneNumber(userInfo.shadow_phone_number)}
              />
              <FormFeedback invalid>Phone number is invalid</FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label for="shadow_email">Email</Label>
              <Input
                placeholder="jo@gmail.gov"
                type="email"
                name="shadow_email"
                onChange={onChange}
                value={userInfo.shadow_email}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="comment">Comment</Label>
              <Input
                type="text"
                maxLength={999}
                name="comment"
                onChange={onChange}
                value={userInfo.comment}
              />
            </FormGroup>
            <Button disabled={!usernameAvailability || !phonenumberValidation}>
              Submit
            </Button>
          </Form>
        </ModalBody>
      </Modal>

      <ReactBootStrapModal show={successModal} onHide={successModalClose}>
        <ReactBootStrapModal.Header closeButton>
          <ReactBootStrapModal.Title>
            Shadow Sign Up Success!
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
            Error Signing Up Shadow
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

export default AddShadow;
