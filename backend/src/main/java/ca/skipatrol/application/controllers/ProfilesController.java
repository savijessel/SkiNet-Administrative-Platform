package ca.skipatrol.application.controllers;

import ca.skipatrol.application.Interfaces.ProfileServices;
import ca.skipatrol.application.models.*;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.ArrayList;
import java.util.Map;
import java.util.UUID;

@RestController
public class ProfilesController {

    @Autowired
    ProfileServices profileServices;

    @RequestMapping(value = "/customapi/profile/uniform", method = RequestMethod.GET)
    public ResponseEntity<Object> getUniform(
            @RequestParam UUID uniformID,
            @RequestParam(required = false) boolean getVests,
            @RequestParam(required = false) boolean getJackets,
            @RequestParam(required = false) boolean getPacks) {
        Uniform uniform = profileServices.retrieveUniform(uniformID, getVests, getJackets, getPacks);
        return new ResponseEntity<>(uniform, HttpStatus.OK);
    }

    @RequestMapping(value = "/customapi/profile/user/TrainingAndEvaluation", method = RequestMethod.GET)
    public ResponseEntity<Object> getUserTrainingAndEvaluation(
            @RequestParam UUID userID,
            @RequestParam(required = false) boolean getEvalTrainings,
            @RequestParam(required = false) boolean getOpTrainings,
            @RequestParam(required = false) boolean getOnSnowEvals) {
        User user = profileServices.retrieveUserTrainingAndEvaluation(userID, getEvalTrainings, getOpTrainings,
                getOnSnowEvals);
        if (user != null)
            return new ResponseEntity<>(user, HttpStatus.OK);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(value = "/customapi/profile/user/EmergencyContacts", method = RequestMethod.GET)
    public ResponseEntity<Object> getUserEmergencyContacts(
            @RequestParam UUID userID) {
        User user = profileServices.retrieveUserEmergencyContacts(userID);

        if (user != null)
            return new ResponseEntity<>(user, HttpStatus.OK);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(value = "/customapi/profile/user/PatrolCommitments", method = RequestMethod.GET)
    public ResponseEntity<Object> getUserPatrolCommitments(
            @RequestParam UUID userID) {
        User user = profileServices.retrieveUserPatrolCommitments(userID);

        if (user != null)
            return new ResponseEntity<>(user, HttpStatus.OK);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(value = "/customapi/profile/user/Awards", method = RequestMethod.GET)
    public ResponseEntity<Object> getUserAwards(
            @RequestParam UUID userID) {
        User user = profileServices.retrieveUserAwards(userID);

        if (user != null)
            return new ResponseEntity<>(user, HttpStatus.OK);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(value = "/customapi/profile/user/Uniform", method = RequestMethod.GET)
    public ResponseEntity<Object> retrieveUserUniform(
            @RequestParam UUID userID) {
        User user = profileServices.retrieveUserUniform(userID);

        if (user != null)
            return new ResponseEntity<>(user, HttpStatus.OK);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(value = "/customapi/profile/user/Role", method = RequestMethod.GET)
    public ResponseEntity<Object> retrieveUserRoles(
            @RequestParam UUID userID) {
        User user = profileServices.retrieveUserRole(userID);

        if (user != null)
            return new ResponseEntity<>(user, HttpStatus.OK);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(value = "/customapi/profile/user", method = RequestMethod.GET)
    public ResponseEntity<Object> retrieveUserAll(
            @RequestParam UUID userID) {
        User user = profileServices.retrieveUserAll(userID);

        if (user != null)
            return new ResponseEntity<>(user, HttpStatus.OK);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(value = "customapi/profile/vest", method = RequestMethod.PUT)
    public ResponseEntity<Object> UpdateVest(@RequestBody String vestString) {

        int code = 500;
        JsonObject vestJSON = JsonParser.parseString(vestString).getAsJsonObject();
        Vest vest = profileServices.ParseVestJson(vestJSON);

        if (vest != null)
            code = profileServices.UpdateVest(vest);

        if (code == 200)
            return ResponseEntity.status(HttpStatus.OK).build();
        else
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

    @RequestMapping(value = "customapi/profile/jacket", method = RequestMethod.PUT)
    public ResponseEntity<Object> UpdateJacket(@RequestBody String jacketString) {

        int code = 500;
        JsonObject jacketJSON = JsonParser.parseString(jacketString).getAsJsonObject();
        Jacket jacket = profileServices.ParseJacketJson(jacketJSON);

        if (jacket != null)
            code = profileServices.UpdateJacket(jacket);

        if (code == 200)
            return ResponseEntity.status(HttpStatus.OK).build();
        else
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

    @RequestMapping(value = "customapi/profile/pack", method = RequestMethod.PUT)
    public ResponseEntity<Object> UpdatePack(@RequestBody String packString) {

        int code = 500;
        JsonObject packJSON = JsonParser.parseString(packString).getAsJsonObject();
        Pack pack = profileServices.ParsePackJson(packJSON);

        if (pack != null)
            code = profileServices.UpdatePack(pack);

        if (code == 200)
            return ResponseEntity.status(HttpStatus.OK).build();
        else
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

    @RequestMapping(value = "customapi/profile/patrolCommitment", method = RequestMethod.PUT)
    public ResponseEntity<Object> UpdatePatrolCommitment(@RequestBody String patrolCommitmentString) {

        int code = 500;
        JsonObject patrolCommitmentJSON = JsonParser.parseString(patrolCommitmentString).getAsJsonObject();
        PatrolCommitment patrolCommitment = profileServices.ParsePatrolCommitmentJson(patrolCommitmentJSON);

        if (patrolCommitment != null)
            code = profileServices.UpdatePatrolCommitment(patrolCommitment);

        if (code == 200)
            return ResponseEntity.status(HttpStatus.OK).build();
        else
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

    @RequestMapping(value = "customapi/profile/personAward", method = RequestMethod.PUT)
    public ResponseEntity<Object> UpdatePersonAward(@RequestBody String personAwardString) {

        int code = 500;
        JsonObject personAwardJSON = JsonParser.parseString(personAwardString).getAsJsonObject();
        PersonAward personAward = profileServices.ParsePersonAwardJson(personAwardJSON);

        if (personAward != null)
            code = profileServices.UpdatePersonAward(personAward);

        if (code == 200)
            return ResponseEntity.status(HttpStatus.OK).build();
        else
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

    @RequestMapping(value = "customapi/profile/uniform/returnedLeaseSigned", method = RequestMethod.PUT)
    public ResponseEntity<Object> UpdateUniformReturnedLeaseSigned(@RequestBody String uniformString) {

        int code = 500;
        JsonObject personAwardJSON = JsonParser.parseString(uniformString).getAsJsonObject();

        if (personAwardJSON != null)
            code = profileServices.UpdateUniformReturnedLeaseSigned(personAwardJSON);

        if (code == 200)
            return ResponseEntity.status(HttpStatus.OK).build();
        else
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

    @RequestMapping(value = "customapi/profile/changePassword", method = RequestMethod.PUT)
    public ResponseEntity<Object> UpdateChangePassword(@RequestParam UUID userID, @RequestParam String newPassword) {

        String encodedPassword = profileServices.ChangePassword(userID, newPassword);

        if (encodedPassword != null)
            return new ResponseEntity<>(encodedPassword, HttpStatus.OK);
        else
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
    @RequestMapping(value = "customapi/profile/changeGeneral", method = RequestMethod.PATCH)
    public ResponseEntity<Object> UpdateUserGeneral(@RequestParam UUID userID, @RequestBody Map<String, String> userInfo) {

        boolean rV = profileServices.updateUserGeneral(userID, userInfo.get("email"), userInfo.get("phone"),
                userInfo.get("trainer"), userInfo.get("trainee"), userInfo.get("firstName"), userInfo.get("lastName"));

        if (rV)
            return new ResponseEntity<>("User Information Updated successfully", HttpStatus.OK);

        return new ResponseEntity<>("Error updating user information", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @RequestMapping(value = "/customapi/profile/user/PatrolCommitments/deleteInBatch", method = RequestMethod.DELETE)
    public ResponseEntity<Object> deletePatrolCommitmentsInBatch(@RequestParam ArrayList<UUID> ids) {
        boolean returnVal = profileServices.deletePatrolCommitmentsInBatch(ids);

        if (returnVal)
            return new ResponseEntity<>("Patrol Commitments deleted correctly", HttpStatus.OK);

        return new ResponseEntity<>("Error deleting conditions", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @RequestMapping(value = "/customapi/profile/user/EvalTrainings/deleteInBatch", method = RequestMethod.DELETE)
    public ResponseEntity<Object> deleteEvalTrainingsInBatch(@RequestParam ArrayList<UUID> ids) {
        boolean returnVal = profileServices.deleteEvalTrainingsInBatch(ids);

        if (returnVal)
            return new ResponseEntity<>("Eval Trainings deleted correctly", HttpStatus.OK);

        return new ResponseEntity<>("Error deleting conditions", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @RequestMapping(value = "/customapi/profile/user/OperationalTrainings/deleteInBatch", method = RequestMethod.DELETE)
    public ResponseEntity<Object> deleteOperationalTrainingsInBatch(@RequestParam ArrayList<UUID> ids) {
        boolean returnVal = profileServices.deleteOperationalTrainingsInBatch(ids);

        if (returnVal)
            return new ResponseEntity<>("Operational Trainings Evals deleted correctly", HttpStatus.OK);

        return new ResponseEntity<>("Error deleting conditions", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @RequestMapping(value = "/customapi/profile/user/OnSnowEvals/deleteInBatch", method = RequestMethod.DELETE)
    public ResponseEntity<Object> deleteOnSnowEvalsInBatch(@RequestParam ArrayList<UUID> ids) {
        boolean returnVal = profileServices.deleteOnSnowEvalsInBatch(ids);

        if (returnVal)
            return new ResponseEntity<>("On Snow Evals deleted correctly", HttpStatus.OK);

        return new ResponseEntity<>("Error deleting conditions", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @RequestMapping(value = "/customapi/profile/user/Packs/deleteInBatch", method = RequestMethod.DELETE)
    public ResponseEntity<Object> deletePacksInBatch(@RequestParam ArrayList<UUID> ids) {
        boolean returnVal = profileServices.deletePacksInBatch(ids);

        if (returnVal)
            return new ResponseEntity<>("Packs deleted correctly", HttpStatus.OK);

        return new ResponseEntity<>("Error deleting packs", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @RequestMapping(value = "/customapi/profile/user/Jackets/deleteInBatch", method = RequestMethod.DELETE)
    public ResponseEntity<Object> deleteJacketsInBatch(@RequestParam ArrayList<UUID> ids) {
        boolean returnVal = profileServices.deleteJacketsInBatch(ids);

        if (returnVal)
            return new ResponseEntity<>("Jackets deleted correctly", HttpStatus.OK);

        return new ResponseEntity<>("Error deleting jackets", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @RequestMapping(value = "/customapi/profile/user/Vests/deleteInBatch", method = RequestMethod.DELETE)
    public ResponseEntity<Object> deleteVestsInBatch(@RequestParam ArrayList<UUID> ids) {
        boolean returnVal = profileServices.deleteVestsInBatch(ids);

        if (returnVal)
            return new ResponseEntity<>("Vests deleted correctly", HttpStatus.OK);

        return new ResponseEntity<>("Error deleting vests", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @RequestMapping(value = "/customapi/profile/user/Roles/deleteInBatch", method = RequestMethod.DELETE)
    public ResponseEntity<Object> deleteRolesInBatch(@RequestParam ArrayList<UUID> ids) {
        boolean returnVal = profileServices.deleteRolesInBatch(ids);

        if (returnVal)
            return new ResponseEntity<>("Roles deleted correctly", HttpStatus.OK);

        return new ResponseEntity<>("Error deleting roles", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @RequestMapping(value = "/customapi/profile/user/Awards/deleteInBatch", method = RequestMethod.DELETE)
    public ResponseEntity<Object> deleteAwardsInBatch(@RequestParam ArrayList<UUID> ids) {
        boolean returnVal = profileServices.deleteAwardsInBatch(ids);

        if (returnVal)
            return new ResponseEntity<>("Awards deleted correctly", HttpStatus.OK);

        return new ResponseEntity<>("Error deleting awards", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @RequestMapping(value = "/customapi/profile/user/CreateNewUser", method = RequestMethod.POST)
    public ResponseEntity<Object> createNewUser(
            @RequestBody Map<String, String> userInfo) {
        
                User user = profileServices.createNewUser(userInfo.get("username"), userInfo.get("password"),
                userInfo.get("firstName"), userInfo.get("lastName"), userInfo.get("email"), userInfo.get("phoneNumber"),
                userInfo.get("eventRole"), Boolean.parseBoolean(userInfo.get("trainer")));

        if (user != null)
            return new ResponseEntity<>(user, HttpStatus.OK);

        return new ResponseEntity<>("Error Creating User", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @RequestMapping(value = "/customapi/profile/user/OnSnowEvals/Edit", method = RequestMethod.PUT)
    public ResponseEntity<Object> editOnSnowEvals(@RequestParam UUID id, @RequestBody Map<String, String> evalInfo){
        boolean returnVal = profileServices.editOnSnowEvals(id, evalInfo.get("discipline"), evalInfo.get("evaluatedBy"), evalInfo.get("evaluationDate"));

        if (returnVal)
            return new ResponseEntity<>("On-Snow evaluation updated successfully", HttpStatus.OK);

        return new ResponseEntity<>("Error Editing On Snow Evaluation", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @RequestMapping(value = "/customapi/profile/user/OperationalTraining/Edit", method = RequestMethod.PUT)
    public ResponseEntity<Object> editOperationalTraining(@RequestParam UUID id, @RequestBody Map<String, String> evalInfo){
        boolean returnVal = profileServices.editOperationalTrainings(id, evalInfo.get("operationalEvent"), evalInfo.get("completedDate"));

        if (returnVal)
            return new ResponseEntity<>("Operational Training updated successfully", HttpStatus.OK);

        return new ResponseEntity<>("Error Editing Operational Training", HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
