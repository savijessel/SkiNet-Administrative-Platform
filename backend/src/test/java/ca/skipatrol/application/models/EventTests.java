package ca.skipatrol.application.models;

import ca.skipatrol.application.repositories.EventRepository;
import org.assertj.core.internal.bytebuddy.utility.RandomString;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.*;
import java.util.ArrayList;
import java.util.List;

@SpringBootTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class EventTests {

    @Autowired
    EventRepository eventRepository;
    LocalDateTime startDate_1 = LocalDateTime.of(2021, Month.JANUARY, 1, 12, 0, 0);
    LocalDateTime endDate_1 = LocalDateTime.of(2021, Month.JANUARY, 12, 12, 1);
    LocalDateTime startDate_2 = LocalDateTime.of(2021, Month.OCTOBER, 1, 12, 1);
    LocalDateTime endDate_2 = LocalDateTime.of(2021, Month.OCTOBER, 12, 12, 1);

    Event test1 = new Event(RandomString.make(12), startDate_1, endDate_1, 1, 3, "yes", "yes", 1);

    Event test2 = new Event("delete_event", startDate_2, endDate_2, 1, 3, "yes", "yes", 1);

    @BeforeAll
    public void setup() {
        eventRepository.save(test1);
        eventRepository.save(test2);
    }

    @Test
    void testFindByStartDateBetween() {

        // Search Between January and April, Should return test1 from query
        LocalDateTime searchDatesStart = LocalDateTime.of(2021, Month.JANUARY, 1, 12, 0, 0);
        LocalDateTime searchDatesEnd = LocalDateTime.of(2021, Month.APRIL, 1, 12, 0, 0);

        List<Event> result = eventRepository.findByStartDateBetween(searchDatesStart, searchDatesEnd);
        List<Event> expected = new ArrayList<Event>();
        expected.add(test1);
        assertTrue(expected.get(0).equals(result.get(0)));
        expected.clear();
        result.clear();

        // Search Between July and November, Should return test2 from query.
        searchDatesStart = LocalDateTime.of(2021, Month.JULY, 1, 12, 0, 0);
        searchDatesEnd = LocalDateTime.of(2021, Month.NOVEMBER, 1, 12, 0, 0);
        result = eventRepository.findByStartDateBetween(searchDatesStart, searchDatesEnd);
        expected.add(test2);
        assertTrue(expected.get(0).equals(result.get(0)));

    }

    @Test
    public void testFindByEventName() {
        assertTrue(eventRepository.findByEventName("test_event").isPresent());
    }

    @AfterAll
    public void done() {
        eventRepository.delete(test1);
        eventRepository.delete(test2);
    }

}
