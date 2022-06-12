package ca.skipatrol.application.controllers;

import ca.skipatrol.application.Interfaces.RosterServices;
import ca.skipatrol.application.models.Event;
import ca.skipatrol.application.models.EventLog;
import ca.skipatrol.application.repositories.UserRepository;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.security.Principal;
import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@RestController
public class RosterController {
    @Autowired
    RosterServices rosterServices;

    // Remove below reference once done implementing security logic: https://www.baeldung.com/get-user-in-spring-security
    @Autowired
    UserRepository userRepository;

    @RequestMapping(value = "customapi/roster/addToEventLog", method = RequestMethod.PUT)
    public ResponseEntity<Object> AddToEventLog(@RequestBody String eventLogString, Principal principal) {

        int code = 500;

        JsonObject eventLogJSON = JsonParser.parseString(eventLogString).getAsJsonObject();
        EventLog eventLog = rosterServices.ParseEventLogJson(eventLogJSON);

        if (principal != null)
            code = rosterServices.AddToEventLog(eventLog, userRepository.findByUsername(principal.getName()).get());

        if (code == 200)
            return ResponseEntity.status(HttpStatus.OK).build();
        else if (code == 202)
            return ResponseEntity.status(HttpStatus.ACCEPTED).build();
        else if (code == 401)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        else if (code == 405)
            return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).build();
        else
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

    @RequestMapping(value = "customapi/roster/addSubRequest", method = RequestMethod.PUT)
    public ResponseEntity<Object> AddSubRequest(@RequestBody String subRequestString, Principal principal) {

        int code = 500;

        JsonObject eventLogJSON = JsonParser.parseString(subRequestString).getAsJsonObject();
        EventLog eventLog = rosterServices.ParseEventLogJson(eventLogJSON);

        try {
            if (principal != null)
                code = rosterServices.AddSubRequest(eventLog, userRepository.findByUsername(principal.getName()).get());

            if (code == 204)
                return ResponseEntity.status(HttpStatus.OK).build();
            else if (code == 202)
                return ResponseEntity.status(HttpStatus.ACCEPTED).build();
            else
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
        catch (Exception ex)
        {
            return new ResponseEntity(ex.toString(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "customapi/roster/removeUserEventLog", method = RequestMethod.PUT)
    public ResponseEntity<Object> RemoveUserEventLog(@RequestBody String subRequestString, Principal principal) {

        int code = 500;

        JsonObject eventLogJSON = JsonParser.parseString(subRequestString).getAsJsonObject();
        EventLog eventLog = rosterServices.ParseEventLogJson(eventLogJSON);

        if (principal != null)
            code = rosterServices.RemoveUserEventLog(eventLog, userRepository.findByUsername(principal.getName()).get());

        if (code == 204)
            return ResponseEntity.status(HttpStatus.OK).build();
        if (code == 405)
            return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).build();
        else
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

    @RequestMapping(value = "customapi/roster/retrieveEventsByWeekday", method = RequestMethod.PUT)
    public ResponseEntity<Object> RetrieveEventsByDateFull(@RequestParam
                                                           @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
                                                           @RequestParam
                                                           @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
                                                           @RequestBody String weekDays)
    {
        JsonObject weekDaysJson = JsonParser.parseString(weekDays).getAsJsonObject();

        List<Event> events =  rosterServices.RetrieveEventsByDateFull(startDate, endDate, weekDaysJson);

        return new ResponseEntity(events, HttpStatus.OK);

    }

    @RequestMapping(value = "customapi/roster/deleteEvent", method = RequestMethod.PUT)
    public ResponseEntity<Object> DeleteEvent(@RequestParam UUID eventID) {

        int code = 500;

        code = rosterServices.DeleteEventFull(eventID);

        if (code == 200)
            return ResponseEntity.status(HttpStatus.OK).build();
        else
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

    @RequestMapping(value = "customapi/roster/bulkDeleteEvents", method = RequestMethod.PUT)
    public ResponseEntity<Object> BulkDeleteEventsFull(@RequestBody String requestBody) {

        int code = 500;

        JsonObject requestBodyJSON = JsonParser.parseString(requestBody).getAsJsonObject();
        code = rosterServices.BulkDeleteEventsFull(requestBodyJSON);

        if (code == 200)
            return ResponseEntity.status(HttpStatus.OK).build();
        else
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

    @RequestMapping(value = "customapi/roster/updateEvent", method = RequestMethod.PUT)
    public ResponseEntity<Object> UpdateEvent(@RequestParam
                                              @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
                                              @RequestParam
                                              @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
                                              @RequestBody Event event, Principal principal) {

        int code = 500;

        if (principal != null) {
            event.setStartDate(startDate);
            event.setEndDate(endDate);
            code = rosterServices.UpdateEvent(event, userRepository.findByUsername(principal.getName()).get());
        }

        if (code == 200)
            return ResponseEntity.status(HttpStatus.OK).build();
        else
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

    @RequestMapping(value = "customapi/roster/bulkUpdateEventsByDate", method = RequestMethod.PUT)
    public ResponseEntity<Object> BulkUpdateEventsByDateFull(@RequestParam
                                              @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
                                              @RequestParam
                                              @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
                                              @RequestBody String requestBody, Principal principal) {

        int code = 500;

        if (principal != null) {
            JsonObject requestBodyJSON = JsonParser.parseString(requestBody).getAsJsonObject();
            code = rosterServices.BulkUpdateEventsByDateFull(startDate, endDate, requestBodyJSON, userRepository.findByUsername(principal.getName()).get());
        }

        if (code == 200)
            return ResponseEntity.status(HttpStatus.OK).build();
        else
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

    @RequestMapping(value = "customapi/roster/retrieveEventLogs", method = RequestMethod.GET)
    public ResponseEntity<Object> RetrieveEventLogsByEventID(@RequestParam UUID eventID)
    {
        List<EventLog> eventLogs = rosterServices.RetrieveEventLogsByEventID(eventID);

        return new ResponseEntity(eventLogs, HttpStatus.OK);
    }

    @RequestMapping(value = "customapi/roster/retrieveEventLogsUser", method = RequestMethod.GET)
    public ResponseEntity<Object> RetrieveEventLogsByUserID(@RequestParam UUID eventID)
    {
        List<EventLog> eventLogs = rosterServices.RetrieveEventLogsByUserID(eventID);

        return new ResponseEntity(eventLogs, HttpStatus.OK);
    }

    @RequestMapping(value = "customapi/roster/retrieveEventIDsUser", method = RequestMethod.GET)
    public ResponseEntity<Object> RetrieveEventIDsByUserID(@RequestParam UUID userID)
    {
        HashSet<UUID> eventIDs = rosterServices.RetrieveEventIDsByUserID(userID);

        return new ResponseEntity(eventIDs, HttpStatus.OK);
    }


}
