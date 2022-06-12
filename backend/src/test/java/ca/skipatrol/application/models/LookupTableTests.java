package ca.skipatrol.application.models;


import ca.skipatrol.application.repositories.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertFalse;

@SpringBootTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class LookupTableTests {

    @Autowired
    OperationalEventRepository operationalEventRepository;
    @Autowired
    DisciplineRepository disciplineRepository;
    @Autowired
    BrandRepository brandRepository;
    @Autowired
    SizeRepository sizeRepository;
    @Autowired
    ConditionsRepository conditionsRepository;
    @Autowired
    SeasonRepository seasonRepository;
    @Autowired
    AwardRepository awardRepository;


    //region Operational Event Lookup Table Tests
    @Test
    void testSaveDeleteOperationalEvent()
    {
        OperationalEvent testOperationalEvent = new OperationalEvent("TestDescription");
        operationalEventRepository.save(testOperationalEvent);
        assertTrue(operationalEventRepository.existsById(testOperationalEvent.getOperationalEventID()));
        operationalEventRepository.delete(testOperationalEvent);
        assertFalse(operationalEventRepository.existsById(testOperationalEvent.getOperationalEventID()));
    }

    @Test
    void testFindAllOperationalEvent()
    {
        List<OperationalEvent> allOperationalEvents = operationalEventRepository.findAll();
        assertTrue(operationalEventRepository.count() == allOperationalEvents.size());
    }

    @Test
    void testGetOperationalEventByDescription()
    {
        OperationalEvent testOperationalEvent = new OperationalEvent("TestDescription2");
        operationalEventRepository.save(testOperationalEvent);
        assertTrue(operationalEventRepository.findByDescription(testOperationalEvent.getDescription()).isPresent());
        operationalEventRepository.delete(testOperationalEvent);
    }

    //endregion

    //region Discipline Lookup Table Tests - still requires change from Long ID to UUID
    @Test
    void testSaveDeleteDiscipline()
    {
        Discipline testDiscipline = new Discipline("testDiscipline");
        disciplineRepository.save(testDiscipline);
        assertTrue(disciplineRepository.existsById(testDiscipline.getDisciplineID()));
        disciplineRepository.delete(testDiscipline);
        assertFalse(disciplineRepository.existsById(testDiscipline.getDisciplineID()));
    }

    @Test
    void testFindAllDiscipline()
    {
        List<Discipline> allDisciplines = disciplineRepository.findAll();
        assertTrue(disciplineRepository.count() == allDisciplines.size());
    }

    @Test
    void testGetDisciplineByDescription()
    {
        Discipline testDiscipline = new Discipline("testDisciplin2");
        disciplineRepository.save(testDiscipline);
        assertTrue(disciplineRepository.findByDescription(testDiscipline.getDescription()).isPresent());
        disciplineRepository.delete(testDiscipline);
    }
    //endregion

    //region Brand Lookup Table Tests - still requires change from Long ID to UUID
    @Test
    void testSaveDeleteBrand()
    {
        Brand testBrand = new Brand("testBrand");
        brandRepository.save(testBrand);
        assertTrue(brandRepository.existsById(testBrand.getBrandID()));
        brandRepository.delete(testBrand);
        assertFalse(brandRepository.existsById(testBrand.getBrandID()));
    }

    @Test
    void testFindAllBrand()
    {
        List<Brand> allBrands = brandRepository.findAll();
        assertTrue(brandRepository.count() == allBrands.size());
    }

    @Test
    void testGetBrandByDescription()
    {
        Brand testBrand = new Brand("testBrand2");
        brandRepository.save(testBrand);
        assertTrue(brandRepository.findByDescription(testBrand.getDescription()).isPresent());
        brandRepository.delete(testBrand);
    }

    //endregion

    //region Size Lookup Table Tests
    @Test
    void testSaveDeleteSize()
    {
        Size testSize = new Size("testSize", 99);
        sizeRepository.save(testSize);
        assertTrue(sizeRepository.existsById(testSize.getSizeID()));
        sizeRepository.delete(testSize);
        assertFalse(sizeRepository.existsById(testSize.getSizeID()));
    }

    @Test
    void testFindAllSize()
    {
        List<Size> allSizes = sizeRepository.findAll();
        assertTrue(sizeRepository.count() == allSizes.size());
    }

    @Test
    void testGetSizeByDescription()
    {
        Size testSize = new Size("testSize2", 99);
        sizeRepository.save(testSize);
        assertTrue(sizeRepository.findByDescription(testSize.getDescription()).isPresent());
        sizeRepository.delete(testSize);
    }

    //endregion


    //region Condition Lookup Table Tests
    @Test
    void testSaveDeleteConditions()
    {
        Conditions testCondition = new Conditions("testCondition");
        conditionsRepository.save(testCondition);
        assertTrue(conditionsRepository.existsById(testCondition.getConditionID()));
        conditionsRepository.delete(testCondition);
        assertFalse(conditionsRepository.existsById(testCondition.getConditionID()));
    }

    @Test
    void testFindAllConditions()
    {
        List<Conditions> allConditions = conditionsRepository.findAll();
        assertTrue(conditionsRepository.count() == allConditions.size());
    }

    @Test
    void testGetConditionsByDescription()
    {
        Conditions testCondition = new Conditions("testCondition2");
        conditionsRepository.save(testCondition);
        assertTrue(conditionsRepository.findByDescription(testCondition.getDescription()).isPresent());
        conditionsRepository.delete(testCondition);
    }

    //endregion


    //region Season Lookup Table Tests - still requires change from Long ID to UUID
    @Test
    void testSaveDeleteSeason()
    {
        Season testSeason  = new Season("testSeason", 99);
        seasonRepository.save(testSeason);
        assertTrue(seasonRepository.existsById(testSeason.getSeasonID()));
        seasonRepository.delete(testSeason);
        assertFalse(seasonRepository.existsById(testSeason.getSeasonID()));
    }

    @Test
    void testFindAllSeason()
    {
        List<Season> allConditions = seasonRepository.findAll();
        assertTrue(seasonRepository.count() == allConditions.size());
    }

    @Test
    void testGetSeasonByDescription()
    {
        Season testSeason  = new Season("testSeason2", 99);
        seasonRepository.save(testSeason);
        assertTrue(seasonRepository.findByDescription(testSeason.getDescription()).isPresent());
        seasonRepository.delete(testSeason);
    }

    //endregion


    //region Award Lookup Table Tests - still requires change from Long ID to UUID
    @Test
    void testSaveDeleteAward()
    {
        Award testAward = new Award("testAward");
        awardRepository.save(testAward);
        assertTrue(awardRepository.existsById(testAward.getAwardID()));
        awardRepository.delete(testAward);
        assertFalse(awardRepository.existsById(testAward.getAwardID()));
    }

    @Test
    void testFindAllAward()
    {
        List<Award> allAward = awardRepository.findAll();
        assertTrue(awardRepository.count() == allAward.size());
    }

    @Test
    void testGetAwardByDescription()
    {
        Award testAward = new Award("testAward2");
        awardRepository.save(testAward);
        assertTrue(awardRepository.findByDescription(testAward.getDescription()).isPresent());
        awardRepository.delete(testAward);
    }
    //endregion






}
