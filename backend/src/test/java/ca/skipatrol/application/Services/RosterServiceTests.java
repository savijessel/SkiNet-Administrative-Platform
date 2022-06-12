package ca.skipatrol.application.Services;

import ca.skipatrol.application.Interfaces.RosterServices;
import ca.skipatrol.application.models.*;
import ca.skipatrol.application.repositories.*;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import javax.transaction.Transactional;
import java.time.LocalDateTime;

@SpringBootTest
@Transactional
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class RosterServiceTests {

    @Autowired
    RosterServices rosterServices;
    @Autowired
    EventLogRepository eventLogRepository;
    @Autowired
    EventRepository eventRepository;
    @Autowired
    UserRepository userRepository;

    User testUser;
    Event testEvent;

    @BeforeAll
    public void setup() {
        testUser = userRepository.findByUsername("username").get();
        testEvent = eventRepository.findByEventName("testEventName").get();

    }

    @AfterAll
    public void teardown()
    {
    }

    @Test
    public void testAddToEventLog()
    {
        EventLog testEventLog = new EventLog(testEvent,
                testUser,
                null,
                EventRole.ROSTERED,
                null,
                null,
                LocalDateTime.now(),
                LocalDateTime.MIN,
                "testComment",
                "testEmail",
                null,
                "123-123-1234",
                false);

        rosterServices.AddToEventLog(testEventLog, testUser);




    }


}
