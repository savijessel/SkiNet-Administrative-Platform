package ca.skipatrol.application.Interfaces;

import ca.skipatrol.application.models.*;
import com.google.gson.JsonObject;

import java.util.ArrayList;
import java.util.UUID;

public interface ProfileServices {

    Uniform retrieveUniform(UUID uniformID, boolean getVests, boolean getJackets, boolean getPacks);

    User retrieveUserTrainingAndEvaluation(UUID userID, boolean getEvalTrainings, boolean getOpTrainings,
            boolean getOnSnowEvals);

    User retrieveUserEmergencyContacts(UUID userID);

    User retrieveUserPatrolCommitments(UUID userID);

    User retrieveUserAwards(UUID userID);

    User retrieveUserUniform(UUID userID);

    User retrieveUserRole(UUID userID);

    User retrieveUserAll(UUID userID);

    User retrieveUserBasic(UUID userID);

    Vest ParseVestJson(JsonObject vestJSON);

    Jacket ParseJacketJson(JsonObject vestJSON);

    Pack ParsePackJson(JsonObject vestJSON);

    PatrolCommitment ParsePatrolCommitmentJson(JsonObject patrolCommitmentJSON);

    PersonAward ParsePersonAwardJson(JsonObject personAwardJSON);

    int UpdateVest(Vest vest);

    int UpdateJacket(Jacket jacket);

    int UpdatePack(Pack pack);

    int UpdatePatrolCommitment(PatrolCommitment patrolCommitment);

    int UpdatePersonAward(PersonAward personAward);

    int UpdateUniformReturnedLeaseSigned(JsonObject uniformJSON);

    String ChangePassword(UUID userID, String newPassword);

    boolean updateUserGeneral(UUID userID, String email, String phone, String trainer, String trainee, String firstName, String lastName);

    boolean deletePatrolCommitmentsInBatch(ArrayList<UUID> patrolCommitmentIDs);

    boolean deleteEvalTrainingsInBatch(ArrayList<UUID> evalTrainingIDs);

    boolean deleteOperationalTrainingsInBatch(ArrayList<UUID> operationalTrainingIDs);

    boolean deleteOnSnowEvalsInBatch(ArrayList<UUID> onSnowEvalIDs);

    boolean deletePacksInBatch(ArrayList<UUID> packIDs);

    boolean deleteJacketsInBatch(ArrayList<UUID> jacketIDs);

    boolean deleteVestsInBatch(ArrayList<UUID> vestIDs);

    boolean deleteRolesInBatch(ArrayList<UUID> roleIDs);

    boolean deleteAwardsInBatch(ArrayList<UUID> personAwardIDs);

    User createNewUser(String username,
        String password,
        String firstName,
        String lastName,
        String email,
        String phoneNumber,
        String eventRole,
        Boolean trainer);

    boolean editOnSnowEvals(UUID evalID, String discipline, String evaluatedBy, String evaluationDate );

    boolean editOperationalTrainings(UUID evalID, String operationalEvent, String evaluationDate );
}
