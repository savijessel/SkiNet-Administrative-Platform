import React, {useState, useEffect}  from 'react';
import axios from 'axios';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap'
import { CustomInput, Row, Col, Form, FormGroup, Label, Input } from 'reactstrap';
import{Modal as ReactBootStrapModal} from 'react-bootstrap';



const AddTrainee = ({AddTraineeModal , setAddTraineeModal, currentShift, setProxySelect, session, shiftInfo}) => {
    //state template

    const [successModal, setSuccessModal] = useState(false);
    const successModalShow = () => setSuccessModal(true);
    const successModalClose = () => setSuccessModal(false);

    const [waitListModal, setWaitListModal] = useState(false);
    const waitListModalShow = () => setWaitListModal(true);
    const waitListModalClose = () => setWaitListModal(false);

    const [unavailableModal, setunavailableModal] = useState(false);
    const unavailableModalShow = () => setunavailableModal(true);
    const unavailableModalClose = () => setunavailableModal(false);

    const [pastEventModal, setpastEventModal] = useState(false);
    const pastEventModalShow = () => setpastEventModal(true);
    const pastEventModalClose = () => setpastEventModal(false);

    const [failModal, setFailModal] = useState(false);
    const failModalShow = () => setFailModal(true);
    const failModalClose = () => setFailModal(false);
    const [Users, setUsers] = useState(false);

    const [eventInfo, setEventInfo] = useState(
        {
            event_id: currentShift?currentShift.event.id:"",
            event_name:  currentShift?currentShift.event.title:"",
            selectUser: "",
            role: "TRAINEE",
            comment: "",
            trainer: 0,
        }
    );

    const toggle = (e) => {
        if(currentShift)
        {
            setEventInfo(
                {
                    event_id: currentShift?currentShift.event.id:"",
                    event_name:  currentShift?currentShift.event.title:"",
                    selectUser: "",
                    role: "TRAINEE",
                    comment: "",
                    trainer: 0,
                }
            );
            //Setting on and off of pop up
            setAddTraineeModal(e);
        }
    }


    const onChange = (e) => {
        //setting dictionary with of previous values + the new value. The dictionary will overwrite the existing e.target.name since you cannot have duplicates
        setEventInfo(prev => (
            {
                ...prev,
                [e.target.name]: e.target.value,
            }
        ))

    }

    const AddTrainee = (e) => {
        // //Refer to
        // //https://www.w3schools.com/sql/sql_autoincrement.asp
        e.preventDefault();

        let user = Users[eventInfo.selectUser];



        const article = {
            event: currentShift.event.extendedProps.eventID,
            user: user.userID,
            phoneNumber: user.phoneNumber,
            trainer: user.trainer,
            role: "TRAINEE",
            comment: eventInfo.comment,
            email: user.email,
            attendance: "ON_TIME"
        };

        session
        .put("roster/addToEventLog", article, {}, true)
        .then(response => {
            //if error from database
            if (response.status === 200) {
                
                //** PROXY SELECT ** /
                let storeShift = {
                    event: {
                        proxy: 'yes',
                        extendedProps:
                        {
                            hlUser: shiftInfo.hl,
                            minPatrollers: shiftInfo.min_pat,
                            maxPatrollers: shiftInfo.max_pat,
                            maxTrainees: shiftInfo.max_trainee,
                            eventID: currentShift.event.extendedProps.eventID,




                        },
                        allDay: shiftInfo.all_day,
                        title: shiftInfo.event_name,
                        startStr: shiftInfo.startStr,

                    }
                }

                //update Shift infos
                setProxySelect(storeShift);


                successModalShow();


            }

            else if (response.status === 202) {
                        
                //** PROXY SELECT ** /
                let storeShift = {
                    event: {
                        proxy: 'yes',
                        extendedProps:
                        {
                            hlUser: shiftInfo.hl,
                            minPatrollers: shiftInfo.min_pat,
                            maxPatrollers: shiftInfo.max_pat,
                            maxTrainees: shiftInfo.max_trainee,
                            eventID: currentShift.event.extendedProps.eventID,




                        },
                        allDay: shiftInfo.all_day,
                        title: shiftInfo.event_name,
                        startStr: shiftInfo.startStr,

                    }
                }

                //update Shift infos
                setProxySelect(storeShift);


                waitListModalShow();


            }

            else {
                failModalShow();
            }
        })
        .catch((error) => {
            if (error.response.status === 405) {
                unavailableModalShow();
            }

            else if (error.response.status === 401) {
                pastEventModalShow();
            }

            else {
                console.log("error " + error);
                failModalShow();
            }
        });
    }

    const userRender = () => {
        //If it exists and it is greater than 0
        if(Users.length !== 0 && Users)
        {
            let userOptionRender = [];

            for(let i = 0; i< Users.length; i++)
            {
                userOptionRender.push(<option value={i}>{Users[i].firstName+" "+Users[i].lastName}</option>)
            }
            return userOptionRender;
        }
        else
            return;
    }


    useEffect(() => {
        if(AddTraineeModal)
        {
            session.get("users/search/findByTrainee?trainee=true")
                .then(response => {
                    // If request is good...
                    setUsers(response.data._embedded.users);
                })
                .catch((error) => {
                    console.log('error ' + error);
                });
        }

    }, [AddTraineeModal, session]);

    const openBtn = <button className="btn navyButton m1" onClick={() => toggle(true)}>Add Trainee</button> //<Button color="primary">ADD TO TRAINEE</Button>{' '}
    const closeBtn = <Button className="close" onClick = {() =>toggle(false)}>Close</Button>;

    return (

        //put UI objects here
        <>
            {openBtn}
            <Modal isOpen={AddTraineeModal} toggle={() => toggle(false)} className= "">
                <ModalHeader  close={closeBtn}>Add Trainee</ModalHeader>
                <ModalBody>
                    <Form  onSubmit = {(e) => AddTrainee(e)}>
                        <FormGroup>
                            <Label for="selectUser">Select Multiple</Label>
                            <Input type="select" name="selectUser" id="exampleSelectMulti" onChange={onChange} size="5" required>
                                {userRender()}
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="comment">Comment</Label>
                            <Input type="text" maxLength={999} name="comment" onChange={onChange} value={eventInfo.comment} />
                        </FormGroup>
                        <Button>Submit</Button>
                    </Form>
                </ModalBody>
            </Modal>

            <ReactBootStrapModal show={successModal} onHide={successModalClose}>
                <ReactBootStrapModal.Header closeButton>
                    <ReactBootStrapModal.Title>Trainee Sign Up Success!</ReactBootStrapModal.Title>
                </ReactBootStrapModal.Header>
                <ReactBootStrapModal.Footer>
                    <Button variant="secondary" onClick={successModalClose}>
                        Close
                    </Button>
                </ReactBootStrapModal.Footer>
            </ReactBootStrapModal>

            <ReactBootStrapModal show={unavailableModal} onHide={unavailableModalClose}>
                <ReactBootStrapModal.Header closeButton>
                    <ReactBootStrapModal.Title>Error: User in Unavailable List</ReactBootStrapModal.Title>
                </ReactBootStrapModal.Header>
                <ReactBootStrapModal.Footer>
                    <Button variant="secondary" onClick={unavailableModalClose}>
                        Close
                    </Button>
                </ReactBootStrapModal.Footer>
            </ReactBootStrapModal>

            <ReactBootStrapModal show={pastEventModal} onHide={pastEventModalClose}>
                <ReactBootStrapModal.Header closeButton>
                    <ReactBootStrapModal.Title>Error: Event Date has Passed</ReactBootStrapModal.Title>
                </ReactBootStrapModal.Header>
                <ReactBootStrapModal.Footer>
                    <Button variant="secondary" onClick={pastEventModalClose}>
                        Close
                    </Button>
                </ReactBootStrapModal.Footer>
            </ReactBootStrapModal>

            <ReactBootStrapModal show={waitListModal} onHide={waitListModalClose}>
                <ReactBootStrapModal.Header closeButton>
                    <ReactBootStrapModal.Title>Added to Waitlist!</ReactBootStrapModal.Title>
                </ReactBootStrapModal.Header>
                <ReactBootStrapModal.Footer>
                    <Button variant="secondary" onClick={waitListModalClose}>
                        Close
                    </Button>
                </ReactBootStrapModal.Footer>
            </ReactBootStrapModal>

            <ReactBootStrapModal show={failModal} onHide={failModalClose}>
                <ReactBootStrapModal.Header closeButton>
                    <ReactBootStrapModal.Title>Error Signing Up Trainee</ReactBootStrapModal.Title>
                </ReactBootStrapModal.Header>
                <ReactBootStrapModal.Footer>
                    <Button variant="secondary" onClick={failModalClose}>
                        Close
                    </Button>
                </ReactBootStrapModal.Footer>
            </ReactBootStrapModal>
        </>
    );

}


export default AddTrainee;
