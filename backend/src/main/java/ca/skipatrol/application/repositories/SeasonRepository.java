package ca.skipatrol.application.repositories;


import ca.skipatrol.application.models.Season;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;


public interface SeasonRepository extends JpaRepository<Season, UUID> {

    Optional<Season> findByDescription(String description);

}