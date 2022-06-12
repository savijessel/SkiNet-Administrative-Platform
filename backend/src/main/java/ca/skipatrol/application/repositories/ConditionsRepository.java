package ca.skipatrol.application.repositories;

import ca.skipatrol.application.models.Conditions;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ConditionsRepository extends JpaRepository<Conditions, UUID> {

    Optional<Conditions> findByDescription(String description);
}
