import React, { useState, useEffect } from "react";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import ClockIcon from "../../images/Clock.png";
import OneAvatarIcon from "../../images/OneAvatar.png";
import LetterPMultipleAvatarsIcon from "../../images/LetterPMultipleAvatars.png";
import LetterTMultipleAvatarsIcon from "../../images/LetterTMultipleAvatars.png";
import $ from "jquery";

import {
  Container,
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  Modal,
  Button,
  Form,
  FloatingLabel,
} from "react-bootstrap";

//Services
import {
  createShiftHandler,
  getCalendarData,
  selectShiftHandler,
  linkShiftHandler,
  dragDropShift,
} from "./RosterServices";

import {
  MainAddEvent,
  EditShift,
  DeleteShift,
  AddRoster,
  AddTrainee,
  AddUnavailable,
  ShiftInfo,
  SignUpShift,
  UnavailableShift,
  RosterUserTable,
  TraineeUserTable,
  UserTable,
  ActionTable,
  AddShadow,
  ShadowUserTable,
  DeleteBulk,
  EditBulk,
  printSignInSheet,
} from "../../components";
import { GiTurtleShell } from "react-icons/gi";
import { FaLastfmSquare } from "react-icons/fa";

const RosterPlanner = ({ session }) => {
  const [activeDateTitle, setActiveDateTitle] = useState("");
  const [calendarReadyState, setCalendarReadyState] = useState(false);
  const [currentEvents, setCurrentEvents] = useState([]); // Holds events for the current month in view
  const [eventDetailsVisibility, setEventDetailsVisibility] = useState(false);
  const [currentEventDetails, setCurrentEventDetails] = useState({});

  //used for updating information
  const [Updater, setUpdater] = useState(true); // for Add
  const updateCalendar = () => setUpdater(true);
  const [proxySelect, setProxySelect] = useState(false); // for Add
  const [resetter, setResetter] = useState(false); // for Add -- TODO: Find out what this does specifically
  const [dragDropEnable, setDragDropEnable] = useState("first"); // for Add

  const [rosteredList, setRosteredList] = useState([]);
  const [traineeList, setTraineeList] = useState([]);
  const [waitlist, setWaitlist] = useState([]);
  const [unavailList, setUnavailList] = useState([]);
  const [shadowList, setShadowList] = useState([]);
  const [actionLog, setActionLog] = useState([]);
  const [list, setList] = useState([]);

  //Used for showing info in the "Shift Info" section
  const [currentShift, setCurrentShift] = useState(null); // current selected shift set to nothing currently
  const [totalShifts, setTotalShifts] = useState([]); // current selected shift set to nothing currently
  const [selectedRostered, setSelectedRostered] = useState(null); // current selected shift set to nothing currently
  const [selectedTrainee, setSelectedTrainee] = useState(null); // current selected shift set to nothing currently
  const [shiftInfo, setShiftInfo] = useState({
    hl: "",
    min_pat: "",
    max_pat: "",
    current_ros: "",
    max_trainee: "",
    event_name: "",
    all_day: "",
    startStr: "",
  });

  //Pop Up States
  const [selectedDate, setSelectedDate] = useState(null); // for Add
  const [EventAddModal, setEventAddModal] = useState(false); // for Add
  const [EditShiftModal, setEditShiftModal] = useState(false); // for Edit Shift
  const [EventDeleteModal, setEventDeleteModal] = useState(false); // for Add
  const [AssignAreaModal, setAssignAreaModal] = useState(false); // for Edit Shift
  const [AssignShadowModal, setAssignShadowModal] = useState(false); // for Edit Shift
  const [AddRosterModal, setAddRosterModal] = useState(false); // for Edit Shift
  const [AddTraineeModal, setAddTraineeModal] = useState(false); // for Edit Shift
  const [AddUnavailableModal, setAddUnavailableModal] = useState(false); // for Edit Shift
  const [AddShadowModal, setAddShadowModal] = useState(false);
  const [BulkEventDeleteModal, setBulkEventDeleteModal] = useState(false);
  const [BulkEditModal, setBulkEditModal] = useState(false);

  const [AddEventDetailsVisibility, setAddEventDetailsVisibility] =
    useState(false);

  const calendarRef = React.createRef();

  function getCalendarApi() {
    return calendarRef.current.getApi();
  }

  useEffect(() => {
    setCalendarReadyState(true);
    setActiveDateTitle(
      getCalendarApi().currentDataManager.getCurrentData().viewTitle
    );
  }, []);

  //will update calendar if the Add Roster Modal changes
  useEffect(() => {
    if (Updater) {
      setUpdater(false);
    }
    if (proxySelect) {
      selectShiftHandler(
        proxySelect,
        setCurrentShift,
        currentShift,
        dragDropEnable,
        setDragDropEnable,
        setShiftInfo,
        setRosteredList,
        setUnavailList,
        setTraineeList,
        setWaitlist,
        setUpdater,
        setShadowList,
        setList,
        setActionLog,
        session
      );
      setProxySelect(false);
    }
  }, [Updater, proxySelect, currentShift, dragDropEnable, session]);

  function renameKeys(obj, newKeys) {
    const keyValues = Object.keys(obj).map((key) => {
      const newKey = newKeys[key] || key;
      return { [newKey]: obj[key] };
    });
    return Object.assign({}, ...keyValues);
  }

  function refreshEvents(args, successCb, failureCb) {
    if (args === undefined) return;
    if (Updater) {
      const startDate = args.start;
      const endDate = args.end;

      //Used To Solve Bug where event at beginning Is not fetched. this is a backend oversight.
      var hackyStartDate = new Date(startDate);
      hackyStartDate.setHours(-6);
      hackyStartDate.setMinutes(-1);

      const params = new URLSearchParams({
        startDate: hackyStartDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      session
        .get("events/search/findByStartDateBetween", {}, params.toString())
        .then((response) => {
          if (response.status === 200) {
            var events = [];
            const newKeyNames = {
              startDate: "start",
              endDate: "end",
              eventName: "title",
            };

            session
              .get(
                "roster/retrieveEventIDsUser?userID=" +
                session.session_data().userID,
                {},
                {},
                true
              )
              .then((EventIDsResponse) => {
                if (EventIDsResponse.status === 200) {
                  response.data._embedded.events.forEach((event) => {
                    let backgroundColor = "#1c3f78";

                    let currentDate = new Date();
                    let eventDate = new Date(event.startDate);

                    if (eventDate < currentDate) {
                      backgroundColor = "#696969";
                    } else {
                      EventIDsResponse.data.every((eventID) => {
                        if (event.eventID === eventID) {
                          backgroundColor = "#228B22";
                          return false;
                        }
                        return true;
                      });
                    }
                    event["backgroundColor"] = backgroundColor;
                    events = [...events, renameKeys(event, newKeyNames)];
                    setTotalShifts(events);
                    successCb(events);
                  });
                }
              })
              .catch((error) => {
                console.log(error);
              });
          } else {
            failureCb(response.status);
          }
        })
        .catch((e) => {
          failureCb(e);
        });
    }
  }

  function onDateSetEvent(dateSetEvent) {
    if (calendarReadyState) {
      setActiveDateTitle(
        getCalendarApi().currentDataManager.getCurrentData().viewTitle
      );

      setUpdater(true);
    }
  }

  return (
    <>
      <MainAddEvent
        EventAddModal={EventAddModal}
        setEventAddModal={setEventAddModal}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        setUpdater={setUpdater}
        session={session}
      />

      <Container fluid className="p-3 w-70">
        <Row>
          <Col lg={8}>
            {/* Imported Over Old Calendar Setup From Previous Capstone */}
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, interactionPlugin]}
              headerToolbar={
                window.innerWidth > 760
                  ? {
                    left: "prev,next",
                    center: "title",
                    right: "dayGridMonth,dayGridWeek",
                  }
                  : {
                    left: "title",
                    right: "prev,next",
                  }
              }
              footerToolbar={
                window.innerWidth > 760
                  ? {
                    /** Empty */
                  }
                  : { center: "dayGridMonth,dayGridWeek" }
              }
              initialView={
                window.innerWidth > 760 ? "dayGridMonth" : "dayGridWeek"
              }
              dayHeaderFormat={
                window.innerWidth > 760
                  ? {
                    weekday: "short",
                  }
                  : {
                    month: "numeric",
                    day: "numeric",
                  }
              }
              editable={true}
              eventStartEditable={true}
              selectable={true} //Enables ability to select dates
              selectMirror={true} //To do: I couldn't figure out what this does. I tried changing it to false and nothing changed on the UI
              dayMaxEvents={true} //Enables it so that only 4 shifts can be fit in one date. Additional dates will be shown in "+# more", where # is the additional numbers of shifts
              eventResizableFromStart={false}
              datesSet={onDateSetEvent}
              events={
                Updater
                  ? (args, successCb, failureCb) =>
                    refreshEvents(args, successCb, failureCb)
                  : totalShifts
              }
              eventClick={(e) => {
                selectShiftHandler(
                  e,
                  setCurrentShift,
                  currentShift,
                  dragDropEnable,
                  setDragDropEnable,
                  setShiftInfo,
                  setRosteredList,
                  setUnavailList,
                  setTraineeList,
                  setWaitlist,
                  setUpdater,
                  setShadowList,
                  setList,
                  setActionLog,
                  session
                ); //Specifies the handler that is called when an shift is clicked//Specifies the handler that is called when an shift is clicked
              }}
              select={(e) =>
                createShiftHandler(
                  e,
                  session.session_data(),
                  setSelectedDate,
                  setEventAddModal,
                  setCurrentShift,
                  setResetter
                )
              }
            />
          </Col>

          <Col sm={4}>
            <div className="card w-auto">
              <div class="card-body">
                <div class="row">
                  <div class="col">
                    {session.session_data() !== null &&
                      session.session_data().user_type === "SYSTEM_ADMIN" && (
                        <>
                          <div className="row">
                            <div className="col">
                              <EditBulk
                                currentShift={currentShift}
                                BulkEditModal={BulkEditModal}
                                setBulkEditModal={setBulkEditModal}
                                setProxySelect={setProxySelect}
                                setUpdater={setUpdater}
                                shiftInfo={shiftInfo}
                                setCurrentShift={setCurrentShift}
                                session={session}
                              />
                              <DeleteBulk
                                BulkEventDeleteModal={BulkEventDeleteModal}
                                setBulkEventDeleteModal={
                                  setBulkEventDeleteModal
                                }
                                currentShift={currentShift}
                                setUpdater={setUpdater}
                                session={session}
                              />
                            </div>
                          </div>
                        </>
                      )}
                  </div>
                </div>
                {shiftInfo !== null && currentShift ? (
                  <>
                    <ShiftInfo
                      currentShift={currentShift}
                      shiftInfo={shiftInfo}
                    />

                    <div className="ShiftButtons">
                      <SignUpShift
                        currentShift={currentShift}
                        setList={setList}
                        setShiftInfo={setShiftInfo}
                        setRosteredList={setRosteredList}
                        setUnavailList={setUnavailList}
                        setTraineeList={setTraineeList}
                        setWaitlist={setWaitlist}
                        setShadowList={setShadowList}
                        session={session}
                        setProxySelect={setProxySelect}
                        shiftInfo={shiftInfo}
                      />
                      <UnavailableShift
                        currentShift={currentShift}
                        setProxySelect={setProxySelect}
                        name={
                          session.session_data().firstName +
                          " " +
                          session.session_data().lastName
                        }
                        username={session.session_data().username}
                        user_type={session.session_data().user_type}
                        session={session}
                        setList={setList}
                        setUnavailList={setUnavailList}
                        setShiftInfo={setShiftInfo}
                        shiftInfo={shiftInfo}
                      />

                      {session.session_data() !== null &&
                        (session.session_data().user_type === "SYSTEM_ADMIN" ||
                          session.session_data().user_type ===
                          "HILL_ADMIN") && (
                          <>
                            <button
                              type="button"
                              className="btn greyButton rosterButton float-start"
                              // className="myButton btn btn-secondary float-start d-flex-inline"
                              onClick={() =>
                                printSignInSheet(currentShift, list, session)
                              }
                            >
                              Attendance(PDF)
                            </button>
                          </>
                        )}

                      {session.session_data() !== null &&
                        (session.session_data().user_type === "SYSTEM_ADMIN" ||
                          session.session_data().user_type ===
                          "HILL_ADMIN") && (
                          <>
                            <EditShift
                              currentShift={currentShift}
                              EditShiftModal={EditShiftModal}
                              setEditShiftModal={setEditShiftModal}
                              setProxySelect={setProxySelect}
                              setUpdater={setUpdater}
                              shiftInfo={shiftInfo}
                              setCurrentShift={setCurrentShift}
                              session={session}
                            />
                            <DeleteShift
                              EventDeleteModal={EventDeleteModal}
                              setEventDeleteModal={setEventDeleteModal}
                              currentShift={currentShift}
                              setUpdater={setUpdater}
                              setResetter={setResetter}
                              session={session}
                            />
                          </>
                        )}
                    </div>
                  </>
                ) : (
                  <h3>
                    <b>No Event Selected</b>
                  </h3>
                )}
              </div>
            </div>
            <div className="card ShiftInfo w-auto">
              <div className="card-header">
                <nav>
                  <div class="nav nav-tabs" id="nav-tab" role="tablist">
                    <button
                      class="nav-link active"
                      id="nav-Rostered-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#nav-Rostered"
                      type="button"
                      role="tab"
                      aria-controls="nav-Rostered"
                      aria-selected="true"
                    >
                      Rostered
                    </button>
                    <button
                      class="nav-link"
                      id="nav-Trainee-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#nav-Trainee"
                      type="button"
                      role="tab"
                      aria-controls="nav-Trainee"
                      aria-selected="false"
                    >
                      Trainee
                    </button>
                    <button
                      class="nav-link"
                      id="nav-Waitlist-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#nav-Waitlist"
                      type="button"
                      role="tab"
                      aria-controls="nav-Waitlist"
                      aria-selected="false"
                    >
                      Waitlist
                    </button>
                    <button
                      class="nav-link"
                      id="nav-Unavailable-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#nav-Unavailable"
                      type="button"
                      role="tab"
                      aria-controls="nav-Unavailable"
                      aria-selected="true"
                    >
                      Unavailable
                    </button>
                    <button
                      class="nav-link"
                      id="nav-Shadow-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#nav-Shadow"
                      type="button"
                      role="tab"
                      aria-controls="nav-Shadow"
                      aria-selected="false"
                    >
                      Shadow
                    </button>

                    {session.session_data().user_type === "SYSTEM_ADMIN" ||
                          session.session_data().user_type === "HILL_ADMIN" ? (
                            <button
                            class="nav-link"
                            id="nav-actionLog-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#nav-actionLog"
                            type="button"
                            role="tab"
                            aria-controls="nav-actionLog"
                            aria-selected="false"
                          >
                            Action Log
                          </button>
                        ) : (
                          <></>
                        )}
                   
                  </div>
                </nav>
              </div>
              <div className="card-body ShiftInfo">
                <div class="tab-content" id="nav-tabContent">
                  <div
                    class="tab-pane fade show active"
                    id="nav-Rostered"
                    role="tabpanel"
                    aria-labelledby="nav-Rostered-tab"
                  >
                    <Row>
                      <Col sm="12">
                        <RosterUserTable
                          currentShift={currentShift}
                          setCurrentShift={setCurrentShift}
                          AssignAreaModal={AssignAreaModal}
                          setAssignAreaModal={setAssignAreaModal}
                          setProxySelect={setProxySelect}
                          rosteredList={rosteredList}
                          session_data={session.session_data()}
                          session={session}
                          shiftInfo={shiftInfo}
                        />
                        {/** ACCESS FOR ADMINS ONLY */}
                        {session.session_data().user_type === "SYSTEM_ADMIN" ||
                          session.session_data().user_type === "HILL_ADMIN" ? (
                          <AddRoster
                            currentShift={currentShift}
                            setCurrentShift={setCurrentShift}
                            AddRosterModal={AddRosterModal}
                            setAddRosterModal={setAddRosterModal}
                            setProxySelect={setProxySelect}
                            session={session}
                            shiftInfo={shiftInfo}
                          />
                        ) : (
                          <></>
                        )}
                      </Col>
                    </Row>
                  </div>
                  <div
                    class="tab-pane fade"
                    id="nav-Trainee"
                    role="tabpanel"
                    aria-labelledby="nav-Trainee-tab"
                  >
                    <Row>
                      <Col sm="12">
                        <TraineeUserTable
                          currentShift={currentShift}
                          setCurrentShift={setCurrentShift}
                          AssignAreaModal={AssignAreaModal}
                          setAssignAreaModal={setAssignAreaModal}
                          setProxySelect={setProxySelect}
                          traineeList={traineeList}
                          session_data={session.session_data()}
                          session={session}
                          shiftInfo={shiftInfo}
                          rosteredList={rosteredList}
                        />
                        {/** ACCESS FOR ADMINS ONLY */}
                        {session.session_data().user_type === "SYSTEM_ADMIN" ||
                          session.session_data().user_type === "HILL_ADMIN" ? (
                          <AddTrainee
                            currentShift={currentShift}
                            setCurrentShift={setCurrentShift}
                            AddTraineeModal={AddTraineeModal}
                            setAddTraineeModal={setAddTraineeModal}
                            setProxySelect={setProxySelect}
                            session={session}
                            shiftInfo={shiftInfo}
                          />
                        ) : (
                          <></>
                        )}
                      </Col>
                    </Row>
                  </div>
                  <div
                    class="tab-pane fade"
                    id="nav-Waitlist"
                    role="tabpanel"
                    aria-labelledby="nav-Waitlist-tab"
                  >
                    <Row>
                      <Col sm="12">
                        <UserTable
                          currentShift={currentShift}
                          userlist={waitlist}
                          setProxySelect={setProxySelect}
                          name="Waitlist"
                          session_data={session.session_data()}
                          session={session}
                        />
                      </Col>
                    </Row>
                  </div>
                  <div
                    class="tab-pane fade show"
                    id="nav-Unavailable"
                    role="tabpanel"
                    aria-labelledby="nav-Unavailable-tab"
                  >
                    <Col sm="12">
                      <UserTable
                        currentShift={currentShift}
                        userlist={unavailList}
                        setProxySelect={setProxySelect}
                        name="Unavaiable"
                        session_data={session.session_data()}
                        session={session}
                      />
                      {/** ACCESS FOR ADMINS ONLY */}
                      {session.session_data().user_type === "SYSTEM_ADMIN" ||
                          session.session_data().user_type === "HILL_ADMIN" ? (
                        <AddUnavailable
                          currentShift={currentShift}
                          setCurrentShift={setCurrentShift}
                          AddUnavailableModal={AddUnavailableModal}
                          setAddUnavailableModal={setAddUnavailableModal}
                          setProxySelect={setProxySelect}
                          session={session}
                          shiftInfo={shiftInfo}
                        />
                      ) : (
                        <></>
                      )}
                    </Col>
                  </div>
                  <div
                    class="tab-pane fade"
                    id="nav-Shadow"
                    role="tabpanel"
                    aria-labelledby="nav-Shadow-tab"
                  >
                    <Row>
                      <Col sm="12">
                        <ShadowUserTable
                          currentShift={currentShift}
                          setCurrentShift={setCurrentShift}
                          setProxySelect={setProxySelect}
                          shadowList={shadowList}
                          session_data={session.session_data()}
                          session={session}
                          shiftInfo={shiftInfo}
                          rosteredList={rosteredList}
                          traineeList={traineeList}
                        />
                        {/** ACCESS FOR ADMINS ONLY */}
                        {session.session_data().user_type === "SYSTEM_ADMIN" ||
                          session.session_data().user_type === "HILL_ADMIN" ? (
                          <AddShadow
                            currentShift={currentShift}
                            setCurrentShift={setCurrentShift}
                            AddShadowModal={AddShadowModal}
                            setAddShadowModal={setAddShadowModal}
                            setProxySelect={setProxySelect}
                            session={session}
                            shiftInfo={shiftInfo}
                          />
                        ) : (
                          <></>
                        )}
                      </Col>
                    </Row>
                  </div>
                  <div
                    class="tab-pane fade"
                    id="nav-actionLog"
                    role="tabpanel"
                    aria-labelledby="nav-actionLog-tab"
                  >
                    <Row>
                      <Col sm="12">
                        {/** ACCESS FOR ADMINS ONLY */}
                        {session.session_data().user_type === "SYSTEM_ADMIN" ||
                          session.session_data().user_type === "HILL_ADMIN" ? (
                          <ActionTable
                            currentShift={currentShift}
                            actionLog={actionLog}
                          />
                        ) : (
                          <></>
                        )}

                      </Col>
                    </Row>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        <Modal
          show={eventDetailsVisibility}
          onHide={() => {
            setEventDetailsVisibility(false);
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>{currentEventDetails.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ul className="list-group">
              <li className="list-group-item" aria-current="true">
                <div className="d-flex w-100 justify-content-between">
                  <h5 className="mb-1">All Day</h5>
                </div>
                <p className="mb-1">
                  {currentEventDetails.allDay ? "Yes" : "No"}
                </p>
              </li>
              {currentEventDetails.extendedProps !== undefined && (
                <>
                  <li className="list-group-item" aria-current="true">
                    <div className="d-flex w-100 justify-content-between">
                      <h5 className="mb-1">Maximum Patrollers</h5>
                    </div>
                    <p className="mb-1">
                      {currentEventDetails.extendedProps.maxPatrollers}
                    </p>
                  </li>
                  <li className="list-group-item">
                    <div className="d-flex w-100 justify-content-between">
                      <h5 className="mb-1">Minimum Patrollers</h5>
                    </div>
                    <p className="mb-1">
                      {currentEventDetails.extendedProps.minPatrollers}
                    </p>
                  </li>
                </>
              )}
            </ul>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={() => {
                setEventDetailsVisibility(false);
              }}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default RosterPlanner;
