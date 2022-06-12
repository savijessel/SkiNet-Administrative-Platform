package ca.skipatrol.application.repositories;

import ca.skipatrol.application.models.Award;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface AwardRepository extends JpaRepository<Award, UUID> {

    Optional<Award> findByDescription(String description);

}
