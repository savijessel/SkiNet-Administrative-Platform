package ca.skipatrol.application;

import ca.skipatrol.application.Interfaces.AttachmentStorageServices;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class Application {

    public static final String API_VERSION = "0.0.1";

    @Bean
    CommandLineRunner init(AttachmentStorageServices storageService) {
        return (args) -> storageService.init();
    }

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

}
