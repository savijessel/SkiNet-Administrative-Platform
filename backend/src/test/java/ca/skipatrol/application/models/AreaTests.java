package ca.skipatrol.application.models;

import ca.skipatrol.application.repositories.AreaRepository;
import org.assertj.core.internal.bytebuddy.utility.RandomString;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class AreaTests {

    @Autowired
    AreaRepository areaRepository;

    String areaName = RandomString.make(12);
    String areaName2 = "test";


    Area testArea = new Area(areaName);
    Area testArea2 = new Area(areaName2);

    @BeforeAll
    public void setup() {areaRepository.save(testArea);
    }

    @Test
    void testFindAreaByAreaname() {
        assertTrue(areaRepository.findByAreaname(areaName).isPresent());
    }

    void testSave() {
        areaRepository.save(testArea2);
        areaRepository.save(testArea);
        assertTrue(areaRepository.findByAreaname(areaName).isPresent());
        assertTrue(areaRepository.findByAreaname(areaName2).isPresent());
    }

    @AfterAll
    public void done() {
        areaRepository.delete(testArea);
    }

}
