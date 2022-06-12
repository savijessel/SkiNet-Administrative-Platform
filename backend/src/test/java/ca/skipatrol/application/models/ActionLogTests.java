package ca.skipatrol.application.models;
import ca.skipatrol.application.repositories.ActionLogRepository;
import ca.skipatrol.application.repositories.EventRepository;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDateTime;
import java.time.Month;
import java.util.List;

@SpringBootTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class ActionLogTests {

    @Autowired
    ActionLogRepository actionLogRepository;

    @Autowired
    EventRepository eventRepository;

    LocalDateTime startDate_1 = LocalDateTime.of(2021, Month.JANUARY, 1, 12, 0, 0);
    LocalDateTime endDate_1 = LocalDateTime.of(2021, Month.JANUARY, 12, 12, 1);
    Event testEvent = new Event("test_event", startDate_1, endDate_1, 1, 3, "yes", "yes", 1);


    LocalDateTime testDate = LocalDateTime.of(2021, Month.JANUARY, 12, 12, 1);
    ActionLog test = new ActionLog(testEvent, "testUsername", "testAction_User", "testResults", testDate);;


    @BeforeAll
    void setup(){
        eventRepository.save(testEvent);
        actionLogRepository.save(test);
    }


    @Test
    void testFindByEvent(){
        assertTrue(actionLogRepository.findByEvent(testEvent).isPresent());
    }

    @Test
    void testGetEvent(){
        List<ActionLog> testVal = actionLogRepository.findAllByEvent_eventID(testEvent.getEventID());
        assertTrue(testVal.size() > 0 );
    }

    @AfterAll
    public void done() {
        actionLogRepository.delete(test);
        eventRepository.delete(testEvent);
    }

}
