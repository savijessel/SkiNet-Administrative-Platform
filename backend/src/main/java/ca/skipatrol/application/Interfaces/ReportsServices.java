package ca.skipatrol.application.Interfaces;
import ca.skipatrol.application.models.User;


import java.util.List;

import com.google.gson.JsonObject;

public interface ReportsServices {

    List<User> getReportData(JsonObject inputDataJSON);

    
    
    

}
