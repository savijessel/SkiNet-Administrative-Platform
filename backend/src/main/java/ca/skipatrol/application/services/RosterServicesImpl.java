package ca.skipatrol.application.services;

import ca.skipatrol.application.Interfaces.ProfileServices;
import ca.skipatrol.application.Interfaces.RosterServices;
import ca.skipatrol.application.models.*;
import ca.skipatrol.application.repositories.*;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriBuilder;

import javax.transaction.Transactional;
import java.net.URI;
import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class RosterServicesImpl implements RosterServices {
    @Autowired
    AreaRepository areaRepository;
    @Autowired
    EventLogRepository eventLogRepository;
    @Autowired
    EventRepository eventRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    ActionLogRepository actionLogRepository;
    @Autowired
    ProfileServices profileServices;

    static LocalDateTime minDate = LocalDateTime.of(1970,1,1,0,0, 1);

    @Override
    public EventLog ParseEventLogJson(JsonObject eventLogJSON)
    {
        Gson gson = new Gson();
        EventLog eventLog = new EventLog();

        eventLog.setComment(gson.fromJson(eventLogJSON.get("comment"), String.class));
        eventLog.setEmail(gson.fromJson(eventLogJSON.get("email"), String.class));
        eventLog.setPhoneNumber(gson.fromJson(eventLogJSON.get("phoneNumber"), String.class));
        eventLog.setTrainer(gson.fromJson(eventLogJSON.get("trainer"), Boolean.class));
        eventLog.setRole(gson.fromJson(eventLogJSON.get("role"), EventRole.class));
        eventLog.setAttendance(gson.fromJson(eventLogJSON.get("attendance"), EventAttendance.class));
        eventLog.setName(gson.fromJson(eventLogJSON.get("name"), String.class));


        UUID eventID = ParseLastURIPartToUUID(gson.fromJson(eventLogJSON.get("event"), String.class));
        eventLog.setEvent((Event) Hibernate.unproxy(eventRepository.getById(eventID)));
        String userIDString = gson.fromJson(eventLogJSON.get("user"), String.class);
        if (userIDString != null && !userIDString.isEmpty()) {
            UUID userID = ParseLastURIPartToUUID(userIDString);
            eventLog.setUser((User) Hibernate.unproxy(userRepository.getById(userID)));
        }

        String areaURI = gson.fromJson(eventLogJSON.get("area"), String.class);
        if(areaURI != null && !areaURI.isEmpty())
            eventLog.setArea((Area) Hibernate.unproxy(areaRepository.getById(ParseLastURIPartToUUID(areaURI))));

        String shadowingURI = gson.fromJson(eventLogJSON.get("shadowing"), String.class);
        if(shadowingURI != null && !shadowingURI.isEmpty())
            eventLog.setShadowing((User) Hibernate.unproxy(userRepository.getById(ParseLastURIPartToUUID(shadowingURI))));

        return eventLog;
    }

    @Override
    public int AddToEventLog(EventLog eventLog, User actionUser)
    {
        eventLog.setTimestampRostered(LocalDateTime.now());
        eventLog.setTimestampSubrequest(minDate);
        List<EventLog> existingEventLogs = eventLogRepository.findAllByEvent_eventID(eventLog.getEvent().getEventID());
        Event event = eventRepository.getById(eventLog.getEvent().getEventID());

        // check if event is in the past
        if (event.getStartDate().toLocalDate().isBefore(LocalDateTime.now().toLocalDate()))
            return 401;

        //check if user exists and await result
        if (eventLog.getUser() != null) {
            Optional<EventLog> existing = existingEventLogs.stream().filter(x -> x.getUser() != null && x.getUser().getUserID().equals(eventLog.getUser().getUserID())).findFirst();
            if (existing.isPresent()) {
                if (existing.get().getRole() == EventRole.UNAVAILABLE) {
                    AddActionToActionLog(actionUser.getUsername() + " is marked as unavailable. Could not add.", actionUser, event);
                    return 405;
                }
                else {
                    AddActionToActionLog(actionUser.getUsername() + " already in table. No action.", actionUser, event);
                    return 200;
                }
            }
        }

        //adding a shadow or unavailable no questions
        if (eventLog.getRole().equals(EventRole.SHADOW) || eventLog.getRole() == EventRole.UNAVAILABLE) {
            eventLogRepository.save(eventLog);
            return 200;
        }
        else //need to insert
        {
            //get current Assigned Count
            int maxVal = (eventLog.getRole() == EventRole.TRAINEE)?event.getMaxTrainees():event.getMaxPatrollers();
            long currentCount = existingEventLogs.stream().filter(x -> x.getRole() == eventLog.getRole()).count();

            if (currentCount < maxVal) {
                eventLogRepository.save(eventLog);
                AddActionToActionLog(eventLog.getUser().getUsername() + " inserted into " +
                    eventLog.getRole() + " table by " + actionUser.getUsername(),
                    actionUser, event);
            }
            else
            {
                //see if there are any people that request sub
                Optional<EventLog> transfer;
                if (eventLog.getRole() == EventRole.TRAINEE)
                    transfer = existingEventLogs.stream().filter(x -> x.getRole() == EventRole.TRAINEE &&
                            x.getUser().getUserType() == EventRole.TRAINEE &&
                            !x.getTimestampSubrequest().equals(minDate)).findFirst();
                else
                    transfer = existingEventLogs.stream().filter(x -> x.getRole() == eventLog.getRole() &&
                            x.getUser().getUserType() != EventRole.TRAINEE &&
                            !x.getTimestampSubrequest().equals(minDate)).findFirst();

                if (transfer.isPresent() && currentCount-1 < maxVal) //someone has sub request
                {
                    //see if there are any people waiting on waitlist
                    Optional<EventLog> waitPerson;
                    if (eventLog.getRole() == EventRole.TRAINEE)
                        waitPerson = existingEventLogs.stream().filter(x -> x.getRole() == EventRole.WAITLIST && x.getUser().getUserType() == EventRole.TRAINEE).findFirst();
                    else
                        waitPerson = existingEventLogs.stream().filter(x -> x.getRole() == EventRole.WAITLIST && x.getUser().getUserType() != EventRole.TRAINEE).findFirst();

                    //get person in waitlist first to rostered
                    if (waitPerson.isPresent())
                    {
                        // TODO: Need to review this logic!
                        EventLog update = existingEventLogs.stream().filter(x -> x.getUser().getUsername().equals(eventLog.getUser().getUsername())).findFirst().get();

                        update.setTimestampRostered(LocalDateTime.now());
                        update.setRole(update.getUser().getUserType());
                        update.setTimestampSubrequest(minDate);
                        eventLogRepository.save(update);

                        //deleting person we got that has sub request
                        eventLogRepository.delete(transfer.get());
                        AddActionToActionLog("Sub Requested by " + transfer.get().getUser().getUsername() +
                                ". Replaced from Waitlist: " + waitPerson.get().getUser().getUsername(),
                                actionUser, event);
                    }
                    else // no one in waitlist so insert current person that wants to go as replacement
                    {
                        eventLogRepository.save(eventLog);

                        //deleting person we got that has sub request
                        eventLogRepository.delete(transfer.get());
                        AddActionToActionLog("Sub Requested by " + transfer.get().getUser().getUsername() +
                                ". Replaced with: " + eventLog.getUser().getUsername(),
                                actionUser, event);
                    }
                }
                else // put into waitlist
                {
                    eventLog.setRole(EventRole.WAITLIST);
                    eventLogRepository.save(eventLog);
                    AddActionToActionLog(eventLog.getUser().getUsername() + " inserted into Waitlist by " + actionUser.getUsername(), actionUser, event);
                    return 202;
                }
            }
        }

        return 200;
    }

    @Override
    public int AddSubRequest(EventLog eventLog, User actionUser)
    {
        List<EventLog> existingEventLogs = eventLogRepository.findAllByEvent_eventID(eventLog.getEvent().getEventID());
        Optional<EventLog> userEventLogReturn = existingEventLogs.stream().filter(x -> x.getUser().getUserID().equals(eventLog.getUser().getUserID())).findFirst();
        Event event = eventRepository.getById(eventLog.getEvent().getEventID());

        //check if user exists and await result
        if (userEventLogReturn.isEmpty())
            return 404;
        else
        {
            EventLog userEventLog = userEventLogReturn.get();
            // if already sub request they have to be de sub requested
            if (!userEventLog.getTimestampSubrequest().equals(minDate))
            {
                userEventLog.setTimestampSubrequest(minDate);
                eventLogRepository.save(userEventLog);
            }
            // add sub-request
            else
            {
                if (!eventLog.getRole().equals(EventRole.SHADOW) && !eventLog.getRole().equals(EventRole.WAITLIST))
                {
                    int maxVal = (eventLog.getRole() == EventRole.TRAINEE)?event.getMaxTrainees():event.getMaxPatrollers();
                    long currentCount = existingEventLogs.stream().filter(x -> x.getRole() == eventLog.getRole()).count();

                    //-1 is if the person potentially was removed from the table
                    if(currentCount - 1 < maxVal)
                    {
                        if (eventLog.getRole().equals(EventRole.ROSTERED) || eventLog.getRole().equals(EventRole.TRAINEE))
                        {
                            Optional<EventLog> transfer;
                            if (eventLog.getRole() == EventRole.TRAINEE)
                                transfer = existingEventLogs.stream().filter(x -> x.getRole() == EventRole.WAITLIST &&
                                        x.getUser().getUserType() == EventRole.TRAINEE).findFirst();
                            else
                                transfer = existingEventLogs.stream().filter(x -> x.getRole() == EventRole.WAITLIST &&
                                        x.getUser().getUserType() != EventRole.TRAINEE).findFirst();

                            if(transfer.isPresent())
                            {
                                EventLog transferEventLog = transfer.get();
                                transferEventLog.setTimestampRostered(LocalDateTime.now());
                                EventRole transferRole = transferEventLog.getUser().getUserType();
                                if(transferRole == EventRole.TRAINEE)
                                    transferEventLog.setRole(EventRole.TRAINEE);
                                else
                                    transferEventLog.setRole(EventRole.ROSTERED);

                                eventLogRepository.save(transferEventLog);

                                eventLogRepository.deleteById(existingEventLogs.stream().filter(x ->
                                        x.getUser().getUserID().equals(eventLog.getUser().getUserID())).findFirst().get().getEventLogID());

                                AddActionToActionLog("Sub Requested by"
                                        + actionUser.getUsername().toString()
                                        + ". Replaced from Waitlist: "
                                        + transfer.get().getUser().getUsername(),
                                        actionUser,
                                        event);

                            }
                            else //check if user exists and await result
                            {
                                userEventLog.setTimestampSubrequest(LocalDateTime.now());

                                AddActionToActionLog("Sub Requested by " + actionUser.getUsername().toString(), actionUser, event);
                            }
                            return 204;

                        }

                    }
                    AddActionToActionLog("Sub Requested by Shadow or Waitlist: Not supported", actionUser, event);
                    return 204;
                }

            }

        }

        return 500;
    }

    public int RemoveUserEventLog(EventLog eventLog, User actionUser)
    {
        List<EventLog> existingEventLogs = eventLogRepository.findAllByEvent_eventID(eventLog.getEvent().getEventID());
        Optional<EventLog> userEventLogReturn = existingEventLogs.stream().filter(x -> x.getUser() != null && x.getUser().getUserID().equals(eventLog.getUser().getUserID())).findFirst();
        Optional<EventLog> traineeShadow = existingEventLogs.stream().filter(x -> x.getShadowing() != null && x.getShadowing().getUserID().equals(eventLog.getUser().getUserID())).findFirst();
        Event event = eventRepository.getById(eventLog.getEvent().getEventID());

        if (userEventLogReturn.isEmpty())
            return 404;
        else if(traineeShadow.isPresent())
            return 405;
        else
        {
            eventLogRepository.deleteById(userEventLogReturn.get().getEventLogID());
            AddActionToActionLog(eventLog.getUser().getUsername() + "removed by " + actionUser.getUsername(),
                    actionUser,
                    event);

            if (!eventLog.getRole().equals(EventRole.SHADOW) && !eventLog.getRole().equals(EventRole.WAITLIST) && !eventLog.getRole().equals(EventRole.UNAVAILABLE))
            {
                int maxVal = (eventLog.getRole() == EventRole.TRAINEE) ? event.getMaxTrainees() : event.getMaxPatrollers();
                long currentVal = existingEventLogs.stream().filter(x -> x.getRole() == eventLog.getRole()).count();

                if(currentVal - 1 < maxVal)
                {
                    Optional<EventLog> transfer = null;
                    if (eventLog.getRole() == EventRole.TRAINEE)
                        transfer = existingEventLogs.stream().filter(x -> x.getRole() == EventRole.WAITLIST &&
                                x.getUser().getUserType() == EventRole.TRAINEE).findFirst();
                    else if (eventLog.getRole() == EventRole.ROSTERED)
                        transfer = existingEventLogs.stream().filter(x -> x.getRole().equals(EventRole.WAITLIST) &&
                                x.getUser().getUserType() != EventRole.TRAINEE).findFirst();

                    if (transfer.isPresent())
                    {
                        EventLog transferEventLog = transfer.get();
                        transferEventLog.setTimestampRostered(LocalDateTime.now());
                        EventRole transferRole = transferEventLog.getUser().getUserType();
                        if(transferRole == EventRole.TRAINEE)
                            transferEventLog.setRole(EventRole.TRAINEE);
                        else
                            transferEventLog.setRole(EventRole.ROSTERED);

                        eventLogRepository.save(transferEventLog);

                        AddActionToActionLog("Replaced from Waitlist" + transferEventLog.getUser().getUsername(), actionUser, event);

                        return 204;
                    }

                    return 204;
                }

            }
            return 204;
        }
    }

    public int DeleteEventFull(UUID eventID)
    {
        try
        {
            List<EventLog> eventLogs = eventLogRepository.findAllByEvent_eventID(eventID);
            List<UUID> eventLogIDs = eventLogs.stream().map(x -> x.getEventLogID()).collect(Collectors.toList());
            eventLogRepository.deleteAllByIdInBatch(eventLogIDs);

            List<ActionLog> actionLogs = actionLogRepository.findAllByEvent_eventID(eventID);
            List<UUID> actionLogIDs = actionLogs.stream().map(x -> x.getActionLogID()).collect(Collectors.toList());
            actionLogRepository.deleteAllByIdInBatch(actionLogIDs);

            eventRepository.deleteById(eventID);
            return 200;
        }
        catch(Exception exception) {
            return 500;
        }
    }

    public int BulkDeleteEventsFull(JsonObject requestBody)
    {
        Gson gson = new Gson();
        List<String> eventIDs = gson.fromJson(requestBody.get("eventIDs"), List.class);

        for(String eventID: eventIDs) {
            DeleteEventFull(UUID.fromString(eventID));
        }

        return 200;
    }

    public int UpdateEvent(Event event, User actionUser)
    {
        try
        {
            eventRepository.save(event);
            AddActionToActionLog("User " + actionUser.getUsername() + " updated event.", actionUser, event);

            return 200;
        }
        catch(Exception exception) {
            return 500;
        }
    }

    public List<Event> RetrieveEventsByDateFull(LocalDateTime startDate, LocalDateTime endDate, JsonObject weekDays)
    {
        List<Event> eventsReturn = new ArrayList();

        List<DayOfWeek> dayOfWeeks = ParseWeekdays(weekDays);

        List<Event> events = eventRepository.findByStartDateBetween(startDate, endDate);

        for (Event event: events)
        {
            if (dayOfWeeks.isEmpty() || dayOfWeeks.contains(event.getStartDate().getDayOfWeek()))
                eventsReturn.add(event);
        }

        return eventsReturn;
    }

    public int BulkUpdateEventsByDateFull(LocalDateTime startDate, LocalDateTime endDate, JsonObject requestBody, User actionUser)
    {
        Gson gson = new Gson();
        Event eventUpdate = gson.fromJson(requestBody.get("event"), Event.class);
        List<DayOfWeek> dayOfWeeks = ParseWeekdays(requestBody);

        List<Event> events = eventRepository.findByStartDateBetween(startDate, endDate);

        for (Event event: events)
        {
            if (dayOfWeeks.isEmpty() || dayOfWeeks.contains(event.getStartDate().getDayOfWeek()))
            {
                if (eventUpdate.getEventName() != null && !eventUpdate.getEventName().isEmpty())
                    event.setEventName((eventUpdate.getEventName()));
                if (eventUpdate.getHlUser() != null && !eventUpdate.getHlUser().isEmpty())
                    event.setHlUser(eventUpdate.getHlUser());

                event.setMinPatrollers(eventUpdate.getMinPatrollers());
                event.setMaxPatrollers(eventUpdate.getMaxPatrollers());
                event.setMaxTrainees(eventUpdate.getMaxTrainees());

                UpdateEvent(event, actionUser);
            }
        }

        return 200;
    }

    public List<EventLog> RetrieveEventLogsByEventID(UUID eventID)
    {
        List<EventLog> eventLogs = eventLogRepository.findAllByEvent_eventID(eventID);

        List<EventLog> returnEventLogs = new ArrayList<>();

        for (EventLog eventLog : eventLogs)
        {
            EventLog returnEventLog = new EventLog(
                    eventLog.getEventLogID(),
                    eventLog.getRole(),
                    eventLog.getAttendance(),
                    eventLog.getTimestampRostered(),
                    eventLog.getTimestampSubrequest(),
                    eventLog.getComment(),
                    eventLog.getEmail(),
                    eventLog.getName(),
                    eventLog.getPhoneNumber(),
                    eventLog.getTrainer()
            );

            Hibernate.initialize(eventLog.getEvent());
            Hibernate.initialize(eventLog.getArea());
            returnEventLog.setEvent(eventLog.getEvent());
            returnEventLog.setArea(eventLog.getArea());

            if(eventLog.getUser() != null)
                returnEventLog.setUser(profileServices.retrieveUserBasic(eventLog.getUser().getUserID()));
            if(eventLog.getShadowing() != null)
                returnEventLog.setShadowing(profileServices.retrieveUserBasic(eventLog.getShadowing().getUserID()));

            returnEventLogs.add(returnEventLog);
        }

        return returnEventLogs;
    }

    public List<EventLog> RetrieveEventLogsByUserID(UUID userID)
    {
        List<EventLog> eventLogs = eventLogRepository.findAllByUser_userID(userID);

        List<EventLog> returnEventLogs = new ArrayList<>();

        for (EventLog eventLog : eventLogs)
        {
            EventLog returnEventLog = new EventLog(
                    eventLog.getEventLogID(),
                    eventLog.getRole(),
                    eventLog.getAttendance(),
                    eventLog.getTimestampRostered(),
                    eventLog.getTimestampSubrequest(),
                    eventLog.getComment(),
                    eventLog.getEmail(),
                    eventLog.getName(),
                    eventLog.getPhoneNumber(),
                    eventLog.getTrainer()
            );

            Hibernate.initialize(eventLog.getEvent());
            Hibernate.initialize(eventLog.getArea());
            returnEventLog.setEvent(eventLog.getEvent());
            returnEventLog.setArea(eventLog.getArea());

            returnEventLogs.add(returnEventLog);
        }

        return returnEventLogs;
    }

    public HashSet<UUID> RetrieveEventIDsByUserID(UUID userID)
    {
        List<EventLog> eventLogs = eventLogRepository.findAllByUser_userID(userID);

        HashSet<UUID> returnEventIDs = new HashSet<UUID>();

        for (EventLog eventLog : eventLogs)
        {
            if(eventLog.getRole() != EventRole.UNAVAILABLE)
            {
                Hibernate.initialize(eventLog.getEvent());
                returnEventIDs.add(eventLog.getEvent().getEventID());
            }
            
        }
        

        return returnEventIDs;

    }


    private List<DayOfWeek> ParseWeekdays(JsonObject requestBody)
    {
        Gson gson = new Gson();
        List<String> weekDaysString = gson.fromJson(requestBody.get("weekDays"), List.class);

        List<DayOfWeek> dayOfWeeks = new ArrayList();
        if(weekDaysString != null)
        {
            for (String weekDay : weekDaysString)
                dayOfWeeks.add(DayOfWeek.valueOf(weekDay.toUpperCase(Locale.ROOT)));
        }
        return dayOfWeeks;
    }

    private void AddActionToActionLog(String actionString, User actionUser, Event event)
    {
        ActionLog actionLog = new ActionLog(event, actionUser.getUsername(), actionUser.getUserID().toString(), actionString, LocalDateTime.now());
        actionLogRepository.save(actionLog);
    }

    private UUID ParseLastURIPartToUUID(String uri)
    {
        String[] uriParts = uri.split("/");
        return UUID.fromString(uriParts[uriParts.length - 1]);
    }

}
