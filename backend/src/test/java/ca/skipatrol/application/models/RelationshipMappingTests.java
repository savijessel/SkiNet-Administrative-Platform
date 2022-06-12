package ca.skipatrol.application.models;


import ca.skipatrol.application.repositories.*;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import javax.persistence.EntityManager;
import javax.transaction.Transactional;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class RelationshipMappingTests {

    @Autowired
    UserRepository userRepository;
    EntityManager entityManager;

    //region Lookup Repository Declarations
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
    //endregion

    //region Uniform Relationship Tables
    @Autowired
    VestRepository vestRepository;
    @Autowired
    JacketRepository jacketRepository;
    @Autowired
    PackRepository packRepository;
    @Autowired
    UniformRepository uniformRepository;
    //endregion

    Brand testBrand;
    Size testSize;
    Conditions testCondition;
    Uniform testUniform;
    User testUser;

    @BeforeAll
    public void setup() {
        testBrand = brandRepository.findAll().get(0);
        testSize = sizeRepository.findAll().get(0);
        testCondition = conditionsRepository.findAll().get(0);
//        testUser = userRepository.findByUsername("username").get();

        testUniform = new Uniform(false, false, null);
        uniformRepository.save(testUniform);
    }

    @AfterAll
    public void teardown() {
        uniformRepository.deleteById(testUniform.getUniformID());
    }

    //region Vest Relational Mapping Tests
    @Test
    void testSaveDeleteVest() {
        Vest testVest = new Vest("testNumber", testBrand, testSize, testCondition, null);
        vestRepository.save(testVest);
        assertTrue(vestRepository.existsById(testVest.getVestID()));
        vestRepository.delete(testVest);
        assertFalse(vestRepository.existsById(testVest.getVestID()));
    }

    @Test
    void testLazyLoadForVest() {
        Vest testVest = new Vest("testNumber2", testBrand, testSize, testCondition, testUniform);
        vestRepository.save(testVest);
        Vest returnVest = vestRepository.getById(testVest.getVestID());
        assertEquals(returnVest.getBrand(), testBrand);
        assertEquals(returnVest.getCondition(), testCondition);
        assertEquals(returnVest.getSize(), testSize);
        assertEquals(returnVest.getUniform(), testUniform);
        vestRepository.delete(testVest);
    }

    //endregion

    //region Jacket Relational Mapping Tests
    @Test
    void testSaveDeleteJacket() {
        Jacket testJacket = new Jacket("testNumber", testBrand, testSize, testCondition, null);
        jacketRepository.save(testJacket);
        assertTrue(jacketRepository.existsById(testJacket.getJacketID()));
        jacketRepository.delete(testJacket);
        assertFalse(jacketRepository.existsById(testJacket.getJacketID()));
    }

    @Test
    void testLazyLoadForJacket() {
        Jacket testJacket = new Jacket("testNumber2", testBrand, testSize, testCondition, testUniform);
        jacketRepository.save(testJacket);
        Jacket returnJacket = jacketRepository.getById(testJacket.getJacketID());
        assertEquals(returnJacket.getBrand(), testBrand);
        assertEquals(returnJacket.getCondition(), testCondition);
        assertEquals(returnJacket.getSize(), testSize);
        assertEquals(returnJacket.getUniform(), testUniform);
        jacketRepository.delete(testJacket);
    }

    //endregion

    //region Pack Relational Mapping Tests
    @Test
    void testSaveDeletePack() {
        Pack testPack = new Pack("testNumber", testBrand, testCondition, null);
        packRepository.save(testPack);
        assertTrue(packRepository.existsById(testPack.getPackID()));
        packRepository.delete(testPack);
        assertFalse(packRepository.existsById(testPack.getPackID()));
    }

    @Test
    void testLazyLoadForPack() {
        Pack testPack = new Pack("testNumber2", testBrand, testCondition, testUniform);
        packRepository.save(testPack);
        Pack returnPack = packRepository.getById(testPack.getPackID());
        assertEquals(returnPack.getBrand(), testBrand);
        assertEquals(returnPack.getCondition(), testCondition);
        assertEquals(returnPack.getUniform(), testUniform);
        packRepository.delete(testPack);
    }

    //endregion

    //region Uniform Relational Mapping Tests
    @Test
    void testSaveDeleteUniform() {
        Uniform testUniform  = new Uniform(false, false, null);
        uniformRepository.save(testUniform);
        assertTrue(uniformRepository.existsById(testUniform.getUniformID()));
        uniformRepository.delete(testUniform);
        assertFalse(uniformRepository.existsById(testUniform.getUniformID()));
    }

    @Test
    void testLazyLoadForUniform() {
        Vest testVest = new Vest("testNumber3", testBrand, testSize, testCondition, testUniform);
        Pack testPack = new Pack("testNumber3", testBrand, testCondition, testUniform);
        Jacket testJacket = new Jacket("testNumber3", testBrand, testSize, testCondition, testUniform);
        Uniform testUniform  = new Uniform(false, false, null);
        testUniform.setVests(Arrays.asList(testVest));
        testUniform.setJackets(Arrays.asList(testJacket));
        testUniform.setPacks(Arrays.asList(testPack));

        uniformRepository.save(testUniform);
        vestRepository.save(testVest);

        Uniform returnUniform = uniformRepository.getById(testUniform.getUniformID());

        assertEquals(returnUniform.getVests().get(0), testVest);
        assertEquals(returnUniform.getJackets().get(0), testJacket);
        assertEquals(returnUniform.getPacks().get(0), testPack);

        uniformRepository.delete(testUniform);
        vestRepository.delete(testVest);
    }
    //endregion

}