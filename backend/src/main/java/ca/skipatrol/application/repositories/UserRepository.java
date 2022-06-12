package ca.skipatrol.application.repositories;

import ca.skipatrol.application.models.EventRole;
import ca.skipatrol.application.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    List<User> findByUserType(EventRole userType);
    List<User> findByTrainer(Boolean trainer);
    List<User> findByTrainee(Boolean trainee);

}