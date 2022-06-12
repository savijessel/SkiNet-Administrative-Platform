package ca.skipatrol.application.controllers;
import ca.skipatrol.application.models.User;



import ca.skipatrol.application.Interfaces.ReportsServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;


@RestController
@RequestMapping("/customapi/report")
public class ReportsController {

    @Autowired
    ReportsServices reportsServices;
    
    @RequestMapping(value = "/getReportData", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public List<User> getReportData(@RequestBody String reportData)
    {
        JsonObject reportJSONObject = JsonParser.parseString(reportData).getAsJsonObject();
        return reportsServices.getReportData(reportJSONObject);


    }




}
