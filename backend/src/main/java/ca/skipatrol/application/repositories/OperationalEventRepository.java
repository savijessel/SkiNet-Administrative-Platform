package ca.skipatrol.application.repositories;

import ca.skipatrol.application.models.OperationalEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface OperationalEventRepository extends JpaRepository<OperationalEvent, UUID> {

    Optional<OperationalEvent> findByDescription(String description);

}


