package ca.skipatrol.application.Services;

import ca.skipatrol.application.Interfaces.LookupServices;
import ca.skipatrol.application.Interfaces.ProfileServices;
import ca.skipatrol.application.models.*;
import ca.skipatrol.application.repositories.*;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import javax.transaction.Transactional;
import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;

@SpringBootTest
@Transactional
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class ProfileServiceTests {

    //region Repository Declarations
    @Autowired
    UniformRepository uniformRepository;
    @Autowired
    VestRepository vestRepository;
    @Autowired
    JacketRepository jacketRepository;
    @Autowired
    PackRepository packRepository;
    @Autowired
    PatrolCommitmentRepository patrolCommitmentRepository;
    @Autowired
    PersonAwardRepository personAwardRepository;
    @Autowired
    RoleRepository roleRepository;
    @Autowired
    EmergencyContactRepository emergencyContactRepository;
    @Autowired
    OnSnowEvalRepository onSnowEvalRepository;
    @Autowired
    OperationalEventRepository operationalEventRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    EvalTrainingRepository evalTrainingRepository;
    //endregion

    //region Lookup Table Repositories
    @Autowired
    BrandRepository brandRepository;
    @Autowired
    SizeRepository sizeRepository;
    @Autowired
    ConditionsRepository conditionsRepository;
    //endregion

    //region Service Declarations
    @Autowired
    LookupServices lookupServices;
    @Autowired
    ProfileServices profileServices;
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

    @Test
    void testRetrieveUniformFull()
    {
        Vest testVest = new Vest("testNumber1", testBrand, testSize, testCondition, testUniform);
        Pack testPack = new Pack("testNumber1", testBrand, testCondition, testUniform);
        Jacket testJacket = new Jacket("testNumber1", testBrand, testSize, testCondition, testUniform);
        Uniform testUniform  = new Uniform(false, false, null);
        testUniform.setVests(Arrays.asList(testVest));
        testUniform.setJackets(Arrays.asList(testJacket));
        testUniform.setPacks(Arrays.asList(testPack));

        uniformRepository.save(testUniform);
        vestRepository.save(testVest);
        packRepository.save(testPack);
        jacketRepository.save(testJacket);


        Uniform returnUniform = profileServices.retrieveUniform(testUniform.getUniformID(), false, false, false);
        assertEquals(returnUniform.getVests(), null);
        assertEquals(returnUniform.getJackets(), null);
        assertEquals(returnUniform.getPacks(), null);

        returnUniform = profileServices.retrieveUniform(testUniform.getUniformID(), true, false, false);
        assertNotEquals(returnUniform.getVests(), null);
        assertEquals(returnUniform.getJackets(), null);
        assertEquals(returnUniform.getPacks(), null);

        returnUniform = profileServices.retrieveUniform(testUniform.getUniformID(), false, true, false);
        assertEquals(returnUniform.getVests(), null);
        assertNotEquals(returnUniform.getJackets(), null);
        assertEquals(returnUniform.getPacks(), null);

        returnUniform = profileServices.retrieveUniform(testUniform.getUniformID(), false, false, true);
        assertEquals(returnUniform.getVests(), null);
        assertEquals(returnUniform.getJackets(), null);
        assertNotEquals(returnUniform.getPacks(), null);

        returnUniform = profileServices.retrieveUniform(testUniform.getUniformID(), true, true, true);
        assertNotEquals(returnUniform.getVests(), null);
        assertNotEquals(returnUniform.getJackets(), null);
        assertNotEquals(returnUniform.getPacks(), null);

        uniformRepository.delete(testUniform);
        vestRepository.delete(testVest);
        packRepository.delete(testPack);
        jacketRepository.delete(testJacket);
    }





}
