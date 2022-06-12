package ca.skipatrol.application.controllers;

import ca.skipatrol.application.Application;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.Map;

@RestController
public class IndexController {

    @GetMapping("/")
    public Map<String, String> index() {
        return Collections.singletonMap("version", Application.API_VERSION);
    }

    @GetMapping("/favicon.ico")
    public void getFavicon() { }

}
