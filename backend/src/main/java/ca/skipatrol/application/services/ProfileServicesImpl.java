package ca.skipatrol.application.services;

import ca.skipatrol.application.Interfaces.LookupServices;
import ca.skipatrol.application.Interfaces.ProfileServices;
import ca.skipatrol.application.models.*;
import ca.skipatrol.application.repositories.*;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.util.*;

@Service
@Transactional
public class ProfileServicesImpl implements ProfileServices {

    // region Repository Declarations
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
    @Autowired
    OperationalTrainingRepository operationalTrainingRepository;
    @Autowired
    DisciplineRepository disciplineRepository;
    @Autowired
    BrandRepository brandRepository;
    @Autowired
    ConditionsRepository conditionsRepository;
    @Autowired
    SizeRepository sizeRepository;
    @Autowired
    SeasonRepository seasonRepository;
    @Autowired
    AwardRepository awardRepository;
    // endregion

    // region Service Declarations
    @Autowired
    LookupServices lookupServices;
    // endregion

    // region Uniform-related API Calls
    boolean createUniformAll(Uniform uniform) {
        // Add checks for vest, jacket, pack, user, etc. where needed

        uniformRepository.save(uniform);

        return true;
    }

    public Uniform retrieveUniform(UUID uniformID, boolean getVests, boolean getJackets, boolean getPacks) {

        Uniform uniform = uniformRepository.getById(uniformID);

        Uniform returnVal = new Uniform(
                uniform.getUniformID(),
                uniform.getLeaseSigned(),
                uniform.getReturned(),
                uniform.getUser());

        if (getVests) {
            Hibernate.initialize(uniform.getVests().size());
            returnVal.setVests(uniform.getVests());
        }
        if (getJackets) {
            Hibernate.initialize(uniform.getJackets().size());
            returnVal.setJackets(uniform.getJackets());
        }
        if (getPacks) {
            Hibernate.initialize(uniform.getPacks().size());
            returnVal.setPacks(uniform.getPacks());
        }

        return returnVal;
    }
    // endregion

    // region User-related API Calls
    public User retrieveUserTrainingAndEvaluation(UUID userID, boolean getEvalTrainings, boolean getOpTrainings,
            boolean getOnSnowEvals) {
        Optional<User> userEntity = userRepository.findById(userID);

        if (userEntity.isPresent()) {
            User user = userEntity.get();
            User returnVal = new User(user.getUserID(),
                    user.getUsername(),
                    user.getPassword(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getEmail(),
                    user.getPhoneNumber(),
                    user.getUserType(),
                    user.getTrainer(),
                    user.getTrainee());

            if (getEvalTrainings) {
                Hibernate.initialize(user.getEvalTrainings().size());
                returnVal.setEvalTrainings(user.getEvalTrainings());
            }
            if (getOpTrainings) {
                Hibernate.initialize(user.getOperationalTrainings().size());
                returnVal.setOperationalTrainings(user.getOperationalTrainings());
            }
            if (getOnSnowEvals) {
                Hibernate.initialize(user.getOnSnowEvals().size());
                returnVal.setOnSnowEvals(user.getOnSnowEvals());
            }

            return returnVal;
        }
        return null;
    }

    public User retrieveUserEmergencyContacts(UUID userID) {
        Optional<User> userEntity = userRepository.findById(userID);

        if (userEntity.isPresent()) {
            User user = userEntity.get();

            User returnVal = new User(user.getUserID(),
                    user.getUsername(),
                    user.getPassword(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getEmail(),
                    user.getPhoneNumber(),
                    user.getUserType(),
                    user.getTrainer(),
                    user.getTrainee());

            Hibernate.initialize(user.getEmergencyContacts().size());
            returnVal.setEmergencyContacts(user.getEmergencyContacts());

            return returnVal;
        }
        return null;
    }

    public User retrieveUserPatrolCommitments(UUID userID) {
        Optional<User> userEntity = userRepository.findById(userID);

        if (userEntity.isPresent()) {
            User user = userEntity.get();

            User returnVal = new User(user.getUserID(),
                    user.getUsername(),
                    user.getPassword(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getEmail(),
                    user.getPhoneNumber(),
                    user.getUserType(),
                    user.getTrainer(),
                    user.getTrainee());

            Hibernate.initialize(user.getPatrolCommitments().size());
            returnVal.setPatrolCommitments(user.getPatrolCommitments());

            return returnVal;
        }
        return null;
    }

    public User retrieveUserAwards(UUID userID) {
        Optional<User> userEntity = userRepository.findById(userID);

        if (userEntity.isPresent()) {
            User user = userEntity.get();

            User returnVal = new User(user.getUserID(),
                    user.getUsername(),
                    user.getPassword(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getEmail(),
                    user.getPhoneNumber(),
                    user.getUserType(),
                    user.getTrainer(),
                    user.getTrainee());

            Hibernate.initialize(user.getPersonAwards().size());
            returnVal.setPersonAwards(user.getPersonAwards());

            return returnVal;
        }
        return null;
    }

    public User retrieveUserUniform(UUID userID) {
        Optional<User> userEntity = userRepository.findById(userID);

        if (userEntity.isPresent()) {
            User user = userEntity.get();

            User returnVal = new User(user.getUserID(),
                    user.getUsername(),
                    user.getPassword(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getEmail(),
                    user.getPhoneNumber(),
                    user.getUserType(),
                    user.getTrainer(),
                    user.getTrainee());

            List<Uniform> uniforms = new ArrayList<Uniform>();

            if (user.getUniforms().size() > 0) {
                for (Uniform uniform : user.getUniforms()) {
                    Uniform returnUniform = retrieveUniform(uniform.getUniformID(), true, true, true);

                    uniforms.add(returnUniform);
                }
            }
            returnVal.setUniforms(uniforms);

            return returnVal;
        }
        return null;
    }

    public User retrieveUserRole(UUID userID) {
        Optional<User> userEntity = userRepository.findById(userID);

        if (userEntity.isPresent()) {
            User user = userEntity.get();

            User returnVal = new User(user.getUserID(),
                    user.getUsername(),
                    user.getPassword(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getEmail(),
                    user.getPhoneNumber(),
                    user.getUserType(),
                    user.getTrainer(),
                    user.getTrainee());

            returnVal.setRole(user.getRole());

            return returnVal;
        }
        return null;
    }

    public User retrieveUserAll(UUID userID) {
        Optional<User> userEntity = userRepository.findById(userID);

        if (userEntity.isPresent()) {
            User user = userEntity.get();

            User returnVal = new User(user.getUserID(),
                    user.getUsername(),
                    user.getPassword(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getEmail(),
                    user.getPhoneNumber(),
                    user.getUserType(),
                    user.getTrainer(),
                    user.getTrainee());

            Hibernate.initialize(user.getEvalTrainings().size());
            returnVal.setEvalTrainings(user.getEvalTrainings());
            Hibernate.initialize(user.getOperationalTrainings().size());
            returnVal.setOperationalTrainings(user.getOperationalTrainings());
            Hibernate.initialize(user.getOnSnowEvals().size());
            returnVal.setOnSnowEvals(user.getOnSnowEvals());
            Hibernate.initialize(user.getEmergencyContacts().size());
            returnVal.setEmergencyContacts(user.getEmergencyContacts());
            Hibernate.initialize(user.getPatrolCommitments().size());
            returnVal.setPatrolCommitments(user.getPatrolCommitments());
            Hibernate.initialize(user.getPersonAwards().size());
            returnVal.setPersonAwards(user.getPersonAwards());
            returnVal.setRole(user.getRole());

            return returnVal;
        }
        return null;
    }

    public User retrieveUserBasic(UUID userID) {
        Optional<User> userEntity = userRepository.findById(userID);

        if (userEntity.isPresent()) {
            User user = userEntity.get();

            User returnVal = new User(
                    user.getUserID(),
                    user.getUsername(),
                    user.getPassword(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getEmail(),
                    user.getPhoneNumber(),
                    user.getUserType(),
                    user.getTrainer(),
                    user.getTrainee());

            return returnVal;
        }
        return null;
    }

    // endregion


    @Override
    public Vest ParseVestJson(JsonObject vestJSON)
    {
        Gson gson = new Gson();
        Vest vest = new Vest();

        vest.setVestID(gson.fromJson(vestJSON.get("vestID"), UUID.class));
        vest.setNumber(gson.fromJson(vestJSON.get("number"), String.class));

        String brandDescription = gson.fromJson(vestJSON.get("brand"), String.class);
        if(brandDescription != null && !brandDescription.isEmpty())
            vest.setBrand(brandRepository.findByDescription(brandDescription).get());

        String sizeDescription = gson.fromJson(vestJSON.get("size"), String.class);
        if(sizeDescription != null && !sizeDescription.isEmpty())
            vest.setSize(sizeRepository.findByDescription(sizeDescription).get());

        String conditionDescription = gson.fromJson(vestJSON.get("condition"), String.class);
        if(conditionDescription != null && !conditionDescription.isEmpty())
            vest.setCondition(conditionsRepository.findByDescription(conditionDescription).get());

        UUID uniformID = gson.fromJson(vestJSON.get("uniform"), UUID.class);
        if(uniformID != null)
            vest.setUniform(uniformRepository.findById(uniformID).get());

        return vest;
    }

    @Override
    public Jacket ParseJacketJson(JsonObject vestJSON)
    {
        Gson gson = new Gson();
        Jacket jacket = new Jacket();

        jacket.setJacketID(gson.fromJson(vestJSON.get("jacketID"), UUID.class));
        jacket.setNumber(gson.fromJson(vestJSON.get("number"), String.class));

        String brandDescription = gson.fromJson(vestJSON.get("brand"), String.class);
        if(brandDescription != null && !brandDescription.isEmpty())
            jacket.setBrand(brandRepository.findByDescription(brandDescription).get());

        String sizeDescription = gson.fromJson(vestJSON.get("size"), String.class);
        if(sizeDescription != null && !sizeDescription.isEmpty())
            jacket.setSize(sizeRepository.findByDescription(sizeDescription).get());

        String conditionDescription = gson.fromJson(vestJSON.get("condition"), String.class);
        if(conditionDescription != null && !conditionDescription.isEmpty())
            jacket.setCondition(conditionsRepository.findByDescription(conditionDescription).get());

        UUID uniformID = gson.fromJson(vestJSON.get("uniform"), UUID.class);
        if(uniformID != null)
            jacket.setUniform(uniformRepository.findById(uniformID).get());

        return jacket;
    }

    @Override
    public Pack ParsePackJson(JsonObject vestJSON)
    {
        Gson gson = new Gson();
        Pack pack = new Pack();

        pack.setPackID(gson.fromJson(vestJSON.get("packID"), UUID.class));
        pack.setNumber(gson.fromJson(vestJSON.get("number"), String.class));

        String brandDescription = gson.fromJson(vestJSON.get("brand"), String.class);
        if(brandDescription != null && !brandDescription.isEmpty())
            pack.setBrand(brandRepository.findByDescription(brandDescription).get());

        String conditionDescription = gson.fromJson(vestJSON.get("condition"), String.class);
        if(conditionDescription != null && !conditionDescription.isEmpty())
            pack.setCondition(conditionsRepository.findByDescription(conditionDescription).get());

        UUID uniformID = gson.fromJson(vestJSON.get("uniform"), UUID.class);
        if(uniformID != null)
            pack.setUniform(uniformRepository.findById(uniformID).get());

        return pack;
    }

    @Override
    public PatrolCommitment ParsePatrolCommitmentJson(JsonObject patrolCommitmentJSON)
    {
        Gson gson = new Gson();
        PatrolCommitment patrolCommitment = new PatrolCommitment();

        patrolCommitment.setPatrolCommitmentID(gson.fromJson(patrolCommitmentJSON.get("patrolCommitmentID"), UUID.class));
        patrolCommitment.setAchieved(gson.fromJson(patrolCommitmentJSON.get("achieved"), Boolean.class));
        patrolCommitment.setDays(gson.fromJson(patrolCommitmentJSON.get("days"), Integer.class));
        patrolCommitment.setNotes(gson.fromJson(patrolCommitmentJSON.get("notes"), String.class));

        UUID seasonID = gson.fromJson(patrolCommitmentJSON.get("season"), UUID.class);
        if(seasonID != null)
            patrolCommitment.setSeason(seasonRepository.getById(seasonID));

        UUID userID = gson.fromJson(patrolCommitmentJSON.get("user"), UUID.class);
        if(userID != null)
            patrolCommitment.setUser(userRepository.getById(userID));

        return patrolCommitment;
    }

    @Override
    public PersonAward ParsePersonAwardJson(JsonObject personAwardJSON)
    {
        Gson gson = new Gson();
        PersonAward personAward = new PersonAward();

        personAward.setPersonAwardID(gson.fromJson(personAwardJSON.get("personAwardID"), UUID.class));
        personAward.setComments(gson.fromJson(personAwardJSON.get("comments"), String.class));

        UUID awardID = gson.fromJson(personAwardJSON.get("award"), UUID.class);
        if(awardID != null)
            personAward.setAward(awardRepository.getById(awardID));

        UUID seasonID = gson.fromJson(personAwardJSON.get("season"), UUID.class);
        if(seasonID != null)
            personAward.setSeason(seasonRepository.getById(seasonID));

        UUID userID = gson.fromJson(personAwardJSON.get("user"), UUID.class);
        if(seasonID != null)
            personAward.setUser(userRepository.getById(userID));

        return personAward;
    }

    @Override
    public int UpdateVest(Vest vest)
    {
        vestRepository.save(vest);
        return 200;
    }

    @Override
    public int UpdateJacket(Jacket jacket)
    {
        jacketRepository.save(jacket);
        return 200;
    }

    @Override
    public int UpdatePack(Pack pack)
    {
        packRepository.save(pack);
        return 200;
    }

    @Override
    public int UpdatePatrolCommitment(PatrolCommitment patrolCommitment)
    {
        patrolCommitmentRepository.save(patrolCommitment);
        return 200;
    }

    @Override
    public int UpdatePersonAward(PersonAward personAward)
    {
        personAwardRepository.save(personAward);
        return 200;
    }

    @Override
    public int UpdateUniformReturnedLeaseSigned(JsonObject uniformJSON)
    {
        Gson gson = new Gson();

        UUID uniformID = gson.fromJson(uniformJSON.get("uniformID"), UUID.class);
        Boolean leaseSigned = gson.fromJson(uniformJSON.get("leaseSigned"), Boolean.class);
        Boolean returned = gson.fromJson(uniformJSON.get("returned"), Boolean.class);

        Uniform uniform = uniformRepository.getById(uniformID);
        uniform.setLeaseSigned(leaseSigned);
        uniform.setReturned(returned);

        return 200;
    }

    public String ChangePassword(UUID userID, String newPassword)
    {
        try
        {
            User user = userRepository.getById(userID);
            String encodedPassword = new BCryptPasswordEncoder().encode(newPassword);
            user.setPassword(encodedPassword);

            return encodedPassword;
        }
        catch(Exception ex)
        {
            return null;
        }
    }

    public boolean updateUserGeneral(UUID userID, String email, String phone, String trainer, String trainee, String firstName, String lastName){
        try{
            User user = userRepository.getById(userID);

            user.setEmail(email);
            user.setPhoneNumber(phone);
            user.setTrainer(trainer.equalsIgnoreCase("true"));
            user.setTrainee(trainee.equalsIgnoreCase("true"));
            user.setFirstName(firstName);
            user.setLastName(lastName);
            return true;
        }
        catch(Exception ex)
        {
            return false;
        }
    }

    public boolean deletePatrolCommitmentsInBatch(ArrayList<UUID> patrolCommitmentIDs) {
        try {
            patrolCommitmentRepository.deleteAllByIdInBatch(patrolCommitmentIDs);
            for (UUID patrolCommitmentID : patrolCommitmentIDs) {
                assert (patrolCommitmentRepository.findById(patrolCommitmentID).isEmpty());
            }
            return true;
        } catch (Exception ex) {
            return false;
        }
    }

    public boolean deleteEvalTrainingsInBatch(ArrayList<UUID> evalTrainingIDs) {
        try {
            evalTrainingRepository.deleteAllByIdInBatch(evalTrainingIDs);
            for (UUID evalTrainingID : evalTrainingIDs) {
                assert (evalTrainingRepository.findById(evalTrainingID).isEmpty());
            }
            return true;
        } catch (Exception ex) {
            return false;
        }
    }

    public boolean deleteOperationalTrainingsInBatch(ArrayList<UUID> operationalTrainingIDs) {
        try {
            operationalTrainingRepository.deleteAllByIdInBatch(operationalTrainingIDs);
            for (UUID operationalTrainingID : operationalTrainingIDs) {
                assert (operationalTrainingRepository.findById(operationalTrainingID).isEmpty());
            }
            return true;
        } catch (Exception ex) {
            return false;
        }
    }

    public boolean deleteOnSnowEvalsInBatch(ArrayList<UUID> onSnowEvalIDs) {
        try {
            onSnowEvalRepository.deleteAllByIdInBatch(onSnowEvalIDs);
            for (UUID onSnowEvalID : onSnowEvalIDs) {
                assert (onSnowEvalRepository.findById(onSnowEvalID).isEmpty());
            }
            return true;
        } catch (Exception ex) {
            return false;
        }
    }

    public boolean deletePacksInBatch(ArrayList<UUID> packIDs) {
        try {
            packRepository.deleteAllByIdInBatch(packIDs);
            for (UUID packID : packIDs) {
                assert (packRepository.findById(packID).isEmpty());
            }
            return true;
        } catch (Exception ex) {
            return false;
        }
    }

    public boolean deleteJacketsInBatch(ArrayList<UUID> jacketIDs) {
        try {
            jacketRepository.deleteAllByIdInBatch(jacketIDs);
            for (UUID jacketID : jacketIDs) {
                assert (jacketRepository.findById(jacketID).isEmpty());
            }
            return true;
        } catch (Exception ex) {
            return false;
        }
    }

    public boolean deleteVestsInBatch(ArrayList<UUID> vestIDs) {
        try {
            vestRepository.deleteAllByIdInBatch(vestIDs);
            for (UUID vestID : vestIDs) {
                assert (vestRepository.findById(vestID).isEmpty());
            }
            return true;
        } catch (Exception ex) {
            return false;
        }
    }

    public boolean deleteRolesInBatch(ArrayList<UUID> roleIDs) {
        try {
            roleRepository.deleteAllByIdInBatch(roleIDs);
            for (UUID roleID : roleIDs) {
                assert (roleRepository.findById(roleID).isEmpty());
            }
            return true;
        } catch (Exception ex) {
            return false;
        }
    }

    public boolean deleteAwardsInBatch(ArrayList<UUID> personAwardIDs) {
        try {
            personAwardRepository.deleteAllByIdInBatch(personAwardIDs);
            for (UUID personAwardID : personAwardIDs) {
                assert (personAwardRepository.findById(personAwardID).isEmpty());
            }
            return true;
        } catch (Exception ex) {
            return false;
        }
    }

    public User createNewUser(String username,
            String password,
            String firstName,
            String lastName,
            String email,
            String phoneNumber,
            String eventRole,
            Boolean trainer) {

        Optional<User> userLookup = this.userRepository.findByUsername(username);
        if (!userLookup.isEmpty()) {
            return null;
        }
        userLookup = this.userRepository.findByEmail(email);
        if (!userLookup.isEmpty()) {
            return null;
        }

        User myUser = new User(username, new BCryptPasswordEncoder().encode(password), firstName, lastName, email,
                phoneNumber, EventRole.valueOf(eventRole), trainer, false);

        this.userRepository.save(myUser);
        Optional<User> userEntity = userRepository.findByUsername(username);
        User user = userEntity.get();

        Uniform uniform = new Uniform(false, false, user);
        uniformRepository.save(uniform);
        emergencyContactRepository.save(new EmergencyContact("", "", "", user));
        Role role = new Role(false, false, false, false,
                false, true, false,
                false, false, false, false, user);
        this.roleRepository.save(role);
        userEntity = userRepository.findByUsername(username);
        user = userEntity.get();
        User returnVal = new User(user.getUserID(),
                user.getUsername(),
                user.getPassword(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getUserType(),
                user.getTrainer(),
                user.getTrainee());

        return returnVal;

    }

    public boolean editOnSnowEvals(UUID evalID, String discipline, String evaluatedBy, String evaluationDate){
        LocalDate theDate = LocalDate.parse(evaluationDate);

        Optional<Discipline> disciplineSearch = disciplineRepository.findByDescription(discipline);

        if(disciplineSearch.isEmpty()){
            return false;
        }

        Optional<OnSnowEval> onSnowEvalSearch = onSnowEvalRepository.findById(evalID);
        if(onSnowEvalSearch.isEmpty()){
            return false;
        }

        OnSnowEval myEval = onSnowEvalSearch.get();
        myEval.setDiscipline(disciplineSearch.get());
        myEval.setEvaluationDate(theDate);
        myEval.setEvaluatedBy(evaluatedBy);

        return true;
    }

    public boolean editOperationalTrainings(UUID evalID, String operationalEvent, String evaluationDate ){
        LocalDate theDate = LocalDate.parse(evaluationDate);

        Optional<OperationalEvent> opEventSearch = operationalEventRepository.findByDescription(operationalEvent);

        if(opEventSearch.isEmpty()){
            return false;
        }

        Optional<OperationalTraining> opTrainingSearch = operationalTrainingRepository.findById(evalID);
        if(opTrainingSearch.isEmpty()){
            return false;
        }

        OperationalTraining myTraining = opTrainingSearch.get();
        myTraining.setOperationalEvent(opEventSearch.get());
        myTraining.setCompletedDate(theDate);
        return true;
    }
}
