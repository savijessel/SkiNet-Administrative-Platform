package ca.skipatrol.application.controllers;

import ca.skipatrol.application.Interfaces.LookupServices;
import ca.skipatrol.application.models.Season;
import ca.skipatrol.application.models.Size;
import ca.skipatrol.application.repositories.AwardRepository;
import ca.skipatrol.application.repositories.BrandRepository;
import ca.skipatrol.application.repositories.DisciplineRepository;
import ca.skipatrol.application.repositories.SeasonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.UUID;

@RestController
public class LookupController {

    @Autowired
    LookupServices lookupServices;

    @Autowired
    BrandRepository brandRepository;

    @Autowired
    AwardRepository awardRepository;

    @Autowired
    SeasonRepository seasonRepository;

    @Autowired
    DisciplineRepository disciplineRepository;

    @RequestMapping(value = "/customapi/lookups/brand/deleteInBatch", method = RequestMethod.DELETE)
    public ResponseEntity<Object> deleteBrandInBatch(@RequestParam ArrayList<UUID> ids) {
        boolean returnVal = lookupServices.deleteBrandsInBatch(ids);

        if(returnVal)
            return new ResponseEntity<>("Brands deleted correctly", HttpStatus.OK);

        return new ResponseEntity<>("Error deleting brands", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @RequestMapping(value = "/customapi/lookups/award/deleteInBatch", method = RequestMethod.DELETE)
    public ResponseEntity<Object> deleteAwardInBatch(@RequestParam ArrayList<UUID> ids) {
        boolean returnVal = lookupServices.deleteAwardsInBatch(ids);

        if(returnVal)
            return new ResponseEntity<>("Awards deleted correctly", HttpStatus.OK);

        return new ResponseEntity<>("Error deleting awards", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @RequestMapping(value = "/customapi/lookups/season/deleteInBatch", method = RequestMethod.DELETE)
    public ResponseEntity<Object> deleteSeasonInBatch(@RequestParam ArrayList<UUID> ids) {
        boolean returnVal = lookupServices.deleteSeasonsInBatch(ids);

        if(returnVal)
            return new ResponseEntity<>("Seasons deleted correctly", HttpStatus.OK);

        return new ResponseEntity<>("Error deleting seasons", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @RequestMapping(value = "/customapi/lookups/discipline/deleteInBatch", method = RequestMethod.DELETE)
    public ResponseEntity<Object> deleteDisciplineInBatch(@RequestParam ArrayList<UUID> ids) {
        boolean returnVal = lookupServices.deleteDisciplineInBatch(ids);

        if(returnVal)
            return new ResponseEntity<>("Disciplines deleted correctly", HttpStatus.OK);

        return new ResponseEntity<>("Error deleting disciplines", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @RequestMapping(value = "/customapi/lookups/operationalEvent/deleteInBatch", method = RequestMethod.DELETE)
    public ResponseEntity<Object> deleteOperationalEventsInBatch(@RequestParam ArrayList<UUID> ids) {
        boolean returnVal = lookupServices.deleteOperationalEventsInBatch(ids);

        if(returnVal)
            return new ResponseEntity<>("Operational Events deleted correctly", HttpStatus.OK);

        return new ResponseEntity<>("Error deleting operational events", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @RequestMapping(value = "/customapi/lookups/size/deleteInBatch", method = RequestMethod.DELETE)
    public ResponseEntity<Object> deleteSizesInBatch(@RequestParam ArrayList<UUID> ids) {
        boolean returnVal = lookupServices.deleteSizesInBatch(ids);

        if(returnVal)
            return new ResponseEntity<>("Sizes deleted correctly", HttpStatus.OK);

        return new ResponseEntity<>("Error deleting sizes", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @RequestMapping(value = "/customapi/lookups/condition/deleteInBatch", method = RequestMethod.DELETE)
    public ResponseEntity<Object> deleteConditionsInBatch(@RequestParam ArrayList<UUID> ids) {
        boolean returnVal = lookupServices.deleteConditionsInBatch(ids);

        if(returnVal)
            return new ResponseEntity<>("Conditions deleted correctly", HttpStatus.OK);

        return new ResponseEntity<>("Error deleting conditions", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @RequestMapping(value = "/customapi/lookups/area/deleteInBatch", method = RequestMethod.DELETE)
    public ResponseEntity<Object> deleteAreasInBatch(@RequestParam ArrayList<UUID> ids) {
        boolean returnVal = lookupServices.deleteAreasInBatch(ids);

        if(returnVal)
            return new ResponseEntity<>("Areas deleted correctly", HttpStatus.OK);

        return new ResponseEntity<>("Error deleting Areas", HttpStatus.INTERNAL_SERVER_ERROR);
    }

}