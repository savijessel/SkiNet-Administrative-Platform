package ca.skipatrol.application.Services;

import ca.skipatrol.application.Interfaces.LookupServices;
import ca.skipatrol.application.repositories.SeasonRepository;
import ca.skipatrol.application.models.Season;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class LookupServicesTests {

    @Autowired
    LookupServices lookupServices;
    @Autowired
    SeasonRepository seasonRepository;

    String testSeasonName1 = "WINTERsadsad";
    String testSeasonName2 = "SUMMERsadasd";
    String testSeasonName3 = "SPRINGsdsd";

    Season testSeason1 = new Season(testSeasonName1, 1);
    Season testSeason2 = new Season(testSeasonName2, 2);
    Season testSeason3 = new Season(testSeasonName3, 3);



    @BeforeAll
    public void setup() {
        //lookupServices.saveSeason(testSeason1);
        //lookupServices.saveSeason(testSeason2);
        //slookupServices.saveSeason(testSeason3);

    }

    @Test
    void testFindAll() {

        List<Season> testList = seasonRepository.findAll();
        assertTrue(testList.get(0).getSequence() == 1);
        assertTrue(testList.get(1).getSequence() == 2);
        assertTrue(testList.get(2).getSequence() == 3);
    }






}
