package ca.skipatrol.application.repositories;

import ca.skipatrol.application.models.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface RoleRepository extends JpaRepository<Role, UUID> {

    Optional<Role> findByUser_userID(UUID userID);

}
