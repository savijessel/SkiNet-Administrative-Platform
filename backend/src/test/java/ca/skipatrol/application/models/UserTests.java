package ca.skipatrol.application.models;

import ca.skipatrol.application.repositories.UserRepository;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class UserTests {

    @Autowired
    UserRepository userRepository;

    User testUser = new User("testUser", "testPass", "Michael", "Scott", "test@email.com", "000-000-0000", EventRole.ROSTERED, true, false);

    @BeforeAll
    public void setup() {
        userRepository.save(testUser);
    }

    @Test
    void testFindUserByUsername() {
        assertTrue(userRepository.findByUsername("testUser").isPresent());
    }

    @AfterAll
    public void done() {
        userRepository.delete(testUser);
    }

}
