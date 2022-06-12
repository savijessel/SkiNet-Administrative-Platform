package ca.skipatrol.application.services;

import ca.skipatrol.application.Interfaces.ReportsServices;
import ca.skipatrol.application.models.Award;
import ca.skipatrol.application.models.Brand;
import ca.skipatrol.application.models.Discipline;
import ca.skipatrol.application.models.EmergencyContact;
import ca.skipatrol.application.models.EvalTraining;
import ca.skipatrol.application.models.EventRole;
import ca.skipatrol.application.models.Jacket;
import ca.skipatrol.application.models.OnSnowEval;
import ca.skipatrol.application.models.OperationalEvent;
import ca.skipatrol.application.models.OperationalTraining;
import ca.skipatrol.application.models.Pack;
import ca.skipatrol.application.models.PatrolCommitment;
import ca.skipatrol.application.models.PersonAward;
import ca.skipatrol.application.models.Role;
import ca.skipatrol.application.models.Season;
import ca.skipatrol.application.models.Size;
import ca.skipatrol.application.models.Uniform;
import ca.skipatrol.application.models.User;
import ca.skipatrol.application.models.Vest;
import ch.qos.logback.core.joran.conditional.Condition;

import org.hibernate.Hibernate;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.transaction.Transactional;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

//Added Repository tag to service since it interacts with db
@Service
@Repository
@Transactional
public class ReportsServicesImpl implements ReportsServices {

    // Inject Entity Manager via PresistanceContext tag
    @PersistenceContext
    private EntityManager em;

    @Override
    public List<User> getReportData(JsonObject inputDataJSON) {

        // Deserialize JSON input into Java Attributes
        Gson gson = new Gson();

        // OnSnowEval
        String onSnowDisciplineType = gson.fromJson(inputDataJSON.get("onSnowDisciplineType"), String.class);
        String onSnowDateEvaluatedLowerJSON = gson.fromJson(inputDataJSON.get("onSnowDateEvaluatedLower"),
                String.class);
        String onSnowDateEvaluatedUpperJSON = gson.fromJson(inputDataJSON.get("onSnowDateEvaluatedUpper"),
                String.class);
        String onSnowEvaluatedBy = gson.fromJson(inputDataJSON.get("onSnowEvaluatedBy"), String.class);

        // EvalTraining
        String evalEventType = gson.fromJson(inputDataJSON.get("evalEventType"), String.class);
        String evalDateCompletedUpperJSON = gson.fromJson(inputDataJSON.get("evalDateCompletedUpper"), String.class);
        String evalDateCompletedLowerJSON = gson.fromJson(inputDataJSON.get("evalDateCompletedLower"), String.class);

        // Operational Training
        String patrollerEventType = gson.fromJson(inputDataJSON.get("patrollerEventType"), String.class);
        String patrollerDateCompletedUpperJSON = gson.fromJson(inputDataJSON.get("patrollerDateCompletedUpper"),
                String.class);
        String patrollerDateCompletedLowerJSON = gson.fromJson(inputDataJSON.get("patrollerDateCompletedLower"),
                String.class);

        // Patrol Commitment
        Boolean commitmentAchieved = gson.fromJson(inputDataJSON.get("commitmentAchieved"), Boolean.class);
        Integer commitmentDaysLower = gson.fromJson(inputDataJSON.get("commitmentDaysLower"), Integer.class);
        Integer commitmentDaysUpper = gson.fromJson(inputDataJSON.get("commitmentDaysUpper"), Integer.class);
        String season = gson.fromJson(inputDataJSON.get("season"), String.class);
        Boolean hasNotes = gson.fromJson(inputDataJSON.get("hasNotes"), Boolean.class);

        // Roles
        Boolean admin = gson.fromJson(inputDataJSON.get("admin"), Boolean.class);
        Boolean pl = gson.fromJson(inputDataJSON.get("pl"), Boolean.class);
        Boolean apl = gson.fromJson(inputDataJSON.get("apl"), Boolean.class);
        Boolean hl = gson.fromJson(inputDataJSON.get("hl"), Boolean.class);
        Boolean active = gson.fromJson(inputDataJSON.get("active"), Boolean.class);
        Boolean newUser = gson.fromJson(inputDataJSON.get("newUser"), Boolean.class);
        Boolean trainingEventLead = gson.fromJson(inputDataJSON.get("trainingEventLead"), Boolean.class);
        Boolean onSnowEvaluator = gson.fromJson(inputDataJSON.get("newUser"), Boolean.class);
        Boolean orienteerer = gson.fromJson(inputDataJSON.get("orienteerer"), Boolean.class);
        Boolean recruitmentLead = gson.fromJson(inputDataJSON.get("recruitmentLead"), Boolean.class);
        Boolean p0Lead = gson.fromJson(inputDataJSON.get("p0Lead"), Boolean.class);
        Boolean cismTeamMember = gson.fromJson(inputDataJSON.get("cismTeamMember"), Boolean.class);

        // Uniform and Equipment
        String jacketBrand = gson.fromJson(inputDataJSON.get("jacketBrand"), String.class);
        String jacketSize = gson.fromJson(inputDataJSON.get("jacketSize"), String.class);
        String jacketCondition = gson.fromJson(inputDataJSON.get("jacketCondition"), String.class);
        String jacketNumber = gson.fromJson(inputDataJSON.get("jacketNumber"), String.class);

        String vestNumber = gson.fromJson(inputDataJSON.get("vestNumber"), String.class);
        String vestBrand = gson.fromJson(inputDataJSON.get("vestBrand"), String.class);
        String vestSize = gson.fromJson(inputDataJSON.get("vestSize"), String.class);
        String vestCondition = gson.fromJson(inputDataJSON.get("vestCondition"), String.class);

        String packNumber = gson.fromJson(inputDataJSON.get("packNumber"), String.class);
        String packBrand = gson.fromJson(inputDataJSON.get("packBrand"), String.class);
        String packCondition = gson.fromJson(inputDataJSON.get("packCondition"), String.class);

        Boolean uniformLeaseSigned = gson.fromJson(inputDataJSON.get("uniformLeaseSigned"), Boolean.class);
        Boolean uniformReturned = gson.fromJson(inputDataJSON.get("uniformReturned"), Boolean.class);

        // Awards
        String[] awards = gson.fromJson(inputDataJSON.get("awards"), String[].class);

        // trainer
        Boolean trainer = gson.fromJson(inputDataJSON.get("trainer"), Boolean.class);

        // General Section -- Emergency Contact
        Boolean hasEmergencyContact = gson.fromJson(inputDataJSON.get("hasEmergencyContact"), Boolean.class);

        // Criteria API BoilerPlate
        CriteriaBuilder builder = em.getCriteriaBuilder();
        CriteriaQuery<User> query = builder.createQuery(User.class);

        // Define user as root class
        Root<User> user = query.from(User.class);

        // Predicate (Conditions) Array List
        ArrayList<Predicate> conditions = new ArrayList<>();

        // Booleans for DTO
        Boolean onSnowEval = false;
        Boolean evalTraining = false;
        Boolean operationalTraining = false;
        Boolean patrolCommitment = false;
        Boolean role = false;
        Boolean uniformAndEquip = false;
        Boolean vestsBool = false;
        Boolean jacketsBool = false;
        Boolean packsBool = false;
        Boolean awardsBool = false;
        Boolean emergencyContact = false;

        // Join OnSnow Eval tables
        if (onSnowDisciplineType != null || onSnowDateEvaluatedLowerJSON != null || onSnowDateEvaluatedUpperJSON != null
                || onSnowEvaluatedBy != null) {
            Join<User, OnSnowEval> onSnowEvalJoin = user.join("onSnowEvals");
            onSnowEval = true;

            if (onSnowDateEvaluatedLowerJSON != null && onSnowDateEvaluatedUpperJSON != null) {
                LocalDate onSnowDateEvaluatedLower = LocalDate.parse(onSnowDateEvaluatedLowerJSON);
                LocalDate onSnowDateEvaluatedUpper = LocalDate.parse(onSnowDateEvaluatedUpperJSON);
                conditions.add(builder.between(onSnowEvalJoin.get("evaluationDate"), onSnowDateEvaluatedLower,
                        onSnowDateEvaluatedUpper));
            }

            else if (onSnowDateEvaluatedLowerJSON == null && onSnowDateEvaluatedUpperJSON != null) {
                LocalDate onSnowDateEvaluatedUpper = LocalDate.parse(onSnowDateEvaluatedUpperJSON);
                conditions
                        .add(builder.lessThanOrEqualTo(onSnowEvalJoin.get("evaluationDate"), onSnowDateEvaluatedUpper));
            }

            else if (onSnowDateEvaluatedLowerJSON != null && onSnowDateEvaluatedUpperJSON == null) {
                LocalDate onSnowDateEvaluatedLower = LocalDate.parse(onSnowDateEvaluatedLowerJSON);
                conditions.add(
                        builder.greaterThanOrEqualTo(onSnowEvalJoin.get("evaluationDate"), onSnowDateEvaluatedLower));
            }

            if (onSnowEvaluatedBy != null) {
                conditions.add(builder.equal(onSnowEvalJoin.get("evaluatedBy"), onSnowEvaluatedBy));
            }

            if (onSnowDisciplineType != null) {
                Join<OnSnowEval, Discipline> disciplineJoin = onSnowEvalJoin.join("discipline");
                conditions.add(builder.equal(disciplineJoin.get("description"), onSnowDisciplineType));
            }

        }

        // Join Evaltraining -- Why do we have a single table for this whilst we have a
        // lookup for Operational Training for its Event description?
        if (evalEventType != null
                || evalDateCompletedUpperJSON != null || evalDateCompletedLowerJSON != null) {
            Join<User, EvalTraining> evalTrainingJoin = user.join("evalTrainings");
            evalTraining = true;

            if (evalEventType != null) {
                conditions.add(builder.equal(evalTrainingJoin.get("eventType"), evalEventType));
            }

            if (evalDateCompletedUpperJSON != null && evalDateCompletedLowerJSON != null) {
                LocalDate evalDateCompletedUpper = LocalDate.parse(evalDateCompletedUpperJSON);
                LocalDate evalDateCompletedLower = LocalDate.parse(evalDateCompletedLowerJSON);

                conditions.add(builder.between(evalTrainingJoin.get("completedDate"), evalDateCompletedLower,
                        evalDateCompletedUpper));
            }

            else if (evalDateCompletedLowerJSON == null && evalDateCompletedUpperJSON != null) {
                LocalDate evalDateCompletedUpper = LocalDate.parse(evalDateCompletedUpperJSON);
                conditions
                        .add(builder.lessThanOrEqualTo(evalTrainingJoin.get("completedDate"), evalDateCompletedUpper));
            }

            else if (evalDateCompletedLowerJSON != null && evalDateCompletedUpperJSON == null) {
                LocalDate evalDateCompletedLower = LocalDate.parse(evalDateCompletedLowerJSON);
                conditions.add(
                        builder.greaterThanOrEqualTo(evalTrainingJoin.get("completedDate"), evalDateCompletedLower));
            }
        }

        // Join OperationalTraining
        if (patrollerDateCompletedLowerJSON != null || patrollerDateCompletedUpperJSON != null
                || patrollerEventType != null) {
            Join<User, OperationalTraining> opTrainingJoin = user.join("operationalTrainings");
            operationalTraining = true;

            if (patrollerDateCompletedLowerJSON != null && patrollerDateCompletedUpperJSON != null) {
                LocalDate patrollerDateCompletedLower = LocalDate.parse(patrollerDateCompletedLowerJSON);
                LocalDate patrollerDateCompletedUpper = LocalDate.parse(patrollerDateCompletedUpperJSON);

                conditions.add(builder.between(opTrainingJoin.get("completedDate"), patrollerDateCompletedLower,
                        patrollerDateCompletedUpper));
            }

            else if (patrollerDateCompletedLowerJSON == null && patrollerDateCompletedUpperJSON != null) {
                LocalDate patrollerDateCompletedUpper = LocalDate.parse(patrollerDateCompletedUpperJSON);
                conditions.add(
                        builder.lessThanOrEqualTo(opTrainingJoin.get("completedDate"), patrollerDateCompletedUpper));
            }

            else if (patrollerDateCompletedLowerJSON != null && patrollerDateCompletedUpperJSON == null) {
                LocalDate patrollerDateCompletedLower = LocalDate.parse(patrollerDateCompletedLowerJSON);
                conditions.add(
                        builder.greaterThanOrEqualTo(opTrainingJoin.get("completedDate"), patrollerDateCompletedLower));
            }

            if (patrollerEventType != null) {
                Join<OperationalTraining, OperationalEvent> opEventJoin = opTrainingJoin.join("operationalEvent");
                conditions.add(builder.equal(opEventJoin.get("description"), patrollerEventType));
            }
        }

        // Join Patrol Commitment
        if (season != null || commitmentDaysLower != null || commitmentDaysUpper != null || commitmentAchieved != null
                || hasNotes != null) {
            Join<User, PatrolCommitment> patrolCommitJoin = user.join("patrolCommitments");
            patrolCommitment = true;

            if (commitmentDaysLower != null && commitmentDaysUpper != null) {
                conditions.add(builder.between(patrolCommitJoin.get("days"), commitmentDaysLower, commitmentDaysUpper));
            }

            else if (commitmentDaysLower == null && commitmentDaysUpper != null) {
                conditions.add(builder.lessThanOrEqualTo(patrolCommitJoin.get("days"), commitmentDaysUpper));
            }

            else if (commitmentDaysLower != null && commitmentDaysUpper == null) {
                conditions.add(builder.greaterThanOrEqualTo(patrolCommitJoin.get("days"), commitmentDaysLower));
            }

            if (commitmentAchieved != null) {
                conditions.add(builder.equal(patrolCommitJoin.get("achieved"), commitmentAchieved));
            }

            if (season != null) {
                Join<PatrolCommitment, Season> seasonJoin = patrolCommitJoin.join("season");
                conditions.add(builder.equal(seasonJoin.get("description"), season));
            }

            if (hasNotes != null) {

                if (hasNotes == true) {
                    conditions.add(builder.isNotNull(patrolCommitJoin.get("notes")));
                } else if (hasNotes == false) {
                    conditions.add(builder.isNull(patrolCommitJoin.get("notes")));
                }
            }
        }

        // Check for admin role

        if (admin != null) {
            conditions.add(builder.equal(user.get("userType"), EventRole.SYSTEM_ADMIN));
        }

        // Join Role
        if (pl != null || apl != null || hl != null || active != null || newUser != null
                || trainingEventLead != null || onSnowEvaluator != null || orienteerer != null
                || recruitmentLead != null || p0Lead != null || cismTeamMember != null) {
            Join<User, Role> roleJoin = user.join("role");
            role = true;
            ArrayList<Predicate> orRoles = new ArrayList<>(); // Needed to perform OR instead of AND operation for
                                                              // roles.

            if (pl != null) {
                orRoles.add(builder.equal(roleJoin.get("pl"), pl));
            }

            if (apl != null) {
                orRoles.add(builder.equal(roleJoin.get("apl"), apl));
            }

            if (hl != null) {
                orRoles.add(builder.equal(roleJoin.get("hl"), hl));
            }

            if (active != null) {
                orRoles.add(builder.equal(roleJoin.get("active"), active));
            }

            if (newUser != null) {
                orRoles.add(builder.equal(roleJoin.get("newUser"), newUser));
            }

            if (trainingEventLead != null) {
                orRoles.add(builder.equal(roleJoin.get("trainingEventLead"), trainingEventLead));
            }

            if (onSnowEvaluator != null) {
                orRoles.add(builder.equal(roleJoin.get("onSnowEvaluator"), onSnowEvaluator));
            }

            if (orienteerer != null) {
                orRoles.add(builder.equal(roleJoin.get("orienteerer"), orienteerer));
            }
            if (recruitmentLead != null) {
                orRoles.add(builder.equal(roleJoin.get("recruitmentLead"), recruitmentLead));
            }
            if (trainingEventLead != null) {
                orRoles.add(builder.equal(roleJoin.get("trainingEventLead"), trainingEventLead));
            }
            if (p0Lead != null) {
                orRoles.add(builder.equal(roleJoin.get("p0Lead"), p0Lead));
            }

            if (cismTeamMember != null) {
                orRoles.add(builder.equal(roleJoin.get("cismTeamMember"), cismTeamMember));
            }

            conditions.add(builder.or(orRoles.toArray(new Predicate[] {})));

        }

        // Join Uniform and Equipment

        if (jacketBrand != null || jacketSize != null || jacketCondition != null || jacketNumber != null
                || vestBrand != null || vestSize != null || vestCondition != null || vestNumber != null
                || packBrand != null || packCondition != null || packNumber != null
                || uniformLeaseSigned != null || uniformReturned != null) {

            Join<User, Uniform> uniformJoin = user.join("uniforms");
            uniformAndEquip = true;

            if (uniformLeaseSigned != null) {
                conditions.add(builder.equal(uniformJoin.get("leaseSigned"), uniformLeaseSigned));
            }

            if (uniformReturned != null) {
                conditions.add(builder.equal(uniformJoin.get("returned"), uniformReturned));
            }

            if (jacketBrand != null || jacketSize != null || jacketCondition != null || jacketNumber != null) {
                Join<Uniform, Jacket> jacketJoin = uniformJoin.join("jackets");
                jacketsBool = true;

                if (jacketBrand != null) {
                    Join<Jacket, Brand> brandJoin = jacketJoin.join("brand");
                    conditions.add(builder.equal(brandJoin.get("description"), jacketBrand));
                }

                if (jacketSize != null) {
                    Join<Jacket, Size> sizeJoin = jacketJoin.join("size");
                    conditions.add(builder.equal(sizeJoin.get("description"), jacketSize));
                }

                if (jacketCondition != null) {
                    Join<Jacket, Condition> conditionJoin = jacketJoin.join("condition");
                    conditions.add(builder.equal(conditionJoin.get("description"), jacketCondition));
                }

                if (jacketNumber != null) {
                    conditions.add(builder.equal(jacketJoin.get("number"), jacketNumber));
                }

            }

            if (vestBrand != null || vestSize != null || vestCondition != null || vestNumber != null) {
                Join<Uniform, Vest> vestJoin = uniformJoin.join("vests");
                vestsBool = true;

                if (vestBrand != null) {
                    Join<Vest, Brand> brandJoin = vestJoin.join("brand");
                    conditions.add(builder.equal(brandJoin.get("description"), vestBrand));
                }

                if (vestSize != null) {
                    Join<Vest, Size> sizeJoin = vestJoin.join("condition");
                    conditions.add(builder.equal(sizeJoin.get("description"), vestSize));
                }

                if (vestCondition != null) {
                    Join<Vest, Condition> conditionJoin = vestJoin.join("size");
                    conditions.add(builder.equal(conditionJoin.get("description"), vestCondition));
                }

                if (vestNumber != null) {
                    conditions.add(builder.equal(vestJoin.get("number"), vestNumber));
                }

            }

            if (packBrand != null || packCondition != null || packNumber != null) {
                Join<Uniform, Pack> packJoin = uniformJoin.join("packs");
                packsBool = true;

                if (packBrand != null) {
                    Join<Pack, Brand> brandJoin = packJoin.join("brand");
                    conditions.add(builder.equal(brandJoin.get("description"), packBrand));
                }

                if (packCondition != null) {
                    Join<Pack, Condition> conditionJoin = packJoin.join("condition");
                    conditions.add(builder.equal(conditionJoin.get("description"), packCondition));
                }

                if (packNumber != null) {
                    conditions.add(builder.equal(packJoin.get("number"), packNumber));
                }

            }
        }

        // Join Awards -- Only allowing a query by award Descriptions
        if (awards != null) {
            List<String> awardsList = Arrays.asList(awards);
            Join<User, PersonAward> personAwardJoin = user.join("personAwards");
            Join<PersonAward, Award> awardJoin = personAwardJoin.join("award");
            awardsBool = true;
            conditions.add(awardJoin.get("description").in(awardsList));

        }

        // Join Emergency Contacts
        if (hasEmergencyContact != null) {
            Join<User, EmergencyContact> emergencyContactJoin = user.join("emergencyContacts", JoinType.LEFT);
            emergencyContact = true;
            ArrayList<Predicate> emergContactArray = new ArrayList<>(); // Needed to perform OR operation for false

            if (hasEmergencyContact == true) {
                conditions.add(builder.notEqual(emergencyContactJoin.get("name"), ""));
                conditions.add(builder.notEqual(emergencyContactJoin.get("phone"), ""));
                conditions.add(builder.notEqual(emergencyContactJoin.get("relationship"), ""));

            } else if (hasEmergencyContact == false) {
                emergContactArray.add(builder.isEmpty(user.get("emergencyContacts")));
                emergContactArray.add(builder.equal(emergencyContactJoin.get("name"), ""));
                emergContactArray.add(builder.equal(emergencyContactJoin.get("phone"), ""));
                emergContactArray.add(builder.equal(emergencyContactJoin.get("relationship"), ""));

                conditions.add(builder.or(emergContactArray.toArray(new Predicate[] {})));

            }
        }

        if (trainer != null) {
            conditions.add(builder.equal(user.get("trainer"), trainer));
        }

        // Make Query
        List<User> results;
        ArrayList<User> returnResults = new ArrayList<User>();

        if (conditions.isEmpty()) {
            TypedQuery<User> typedQuery = em.createQuery(query.select(user));
            results = typedQuery.getResultList();
            for (User result : results) {

                returnResults.add(buildUserDTO(result, onSnowEval,
                        evalTraining,
                        operationalTraining,
                        patrolCommitment,
                        role,
                        uniformAndEquip,
                        jacketsBool,
                        vestsBool,
                        packsBool,
                        awardsBool,
                        emergencyContact));
            }

        } else {
            TypedQuery<User> typedQuery = em
                    .createQuery(query.select(user).where(conditions.toArray(new Predicate[] {})).distinct(true));
            results = typedQuery.getResultList();
            for (User result : results) {

                returnResults.add(buildUserDTO(result, onSnowEval,
                        evalTraining,
                        operationalTraining,
                        patrolCommitment,
                        role,
                        uniformAndEquip,
                        jacketsBool,
                        vestsBool,
                        packsBool,
                        awardsBool,
                        emergencyContact));
            }

        }

        // Return Results
        return returnResults;

    }

    // User Data Transfer Object - needed to avoid lazy loading errors
    public User buildUserDTO(User user, Boolean onSnowEval,
            Boolean evalTraining,
            Boolean operationalTraining,
            Boolean patrolCommitment,
            Boolean role,
            Boolean uniformAndEquip,
            Boolean jacketsBool,
            Boolean vestsBool,
            Boolean packsBool,
            Boolean awardsBool,
            Boolean emergencyContact) {
        if (user != null) {

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

            if (onSnowEval) {
                Hibernate.initialize(user.getOnSnowEvals().size());
                returnVal.setOnSnowEvals(user.getOnSnowEvals());
            }

            if (evalTraining) {
                Hibernate.initialize(user.getEvalTrainings().size());
                returnVal.setEvalTrainings(user.getEvalTrainings());

            }

            if (operationalTraining) {
                Hibernate.initialize(user.getOperationalTrainings().size());
                returnVal.setOperationalTrainings(user.getOperationalTrainings());

            }

            if (patrolCommitment) {
                Hibernate.initialize(user.getPatrolCommitments().size());
                returnVal.setPatrolCommitments(user.getPatrolCommitments());

            }

            if (role) {
                returnVal.setRole(user.getRole());
            }

            if (uniformAndEquip) {
                Hibernate.initialize(user.getUniforms().size());
                returnVal.setUniforms(user.getUniforms());

                if (jacketsBool) {
                    for (int i = 0; i < user.getUniforms().size(); i++) {
                        Hibernate.initialize(user.getUniforms().get(i).getJackets().size());
                        returnVal.getUniforms().get(i).setJackets(user.getUniforms().get(i).getJackets());
                    }

                }

                else {
                    for (int i = 0; i < user.getUniforms().size(); i++) {
                        returnVal.getUniforms().get(i).setJackets(null);
                    }

                }

                if (vestsBool) {
                    for (int i = 0; i < user.getUniforms().size(); i++) {
                        Hibernate.initialize(user.getUniforms().get(i).getVests().size());
                        returnVal.getUniforms().get(i).setVests(user.getUniforms().get(i).getVests());
                    }

                }

                else {
                    for (int i = 0; i < user.getUniforms().size(); i++) {
                        returnVal.getUniforms().get(i).setVests(null);
                    }

                }

                if (packsBool) {
                    for (int i = 0; i < user.getUniforms().size(); i++) {
                        Hibernate.initialize(user.getUniforms().get(i).getPacks().size());
                        returnVal.getUniforms().get(i).setPacks(user.getUniforms().get(i).getPacks());
                    }

                }

                else {
                    for (int i = 0; i < user.getUniforms().size(); i++) {
                        returnVal.getUniforms().get(i).setPacks(null);
                    }

                }

            }

            if (awardsBool) {

                Hibernate.initialize(user.getPersonAwards().size());
                returnVal.setPersonAwards(user.getPersonAwards());
            }

            if (emergencyContact) {
                Hibernate.initialize(user.getEmergencyContacts().size());
                returnVal.setEmergencyContacts(user.getEmergencyContacts());

            }

            return returnVal;
        }
        return null;
    }

}
