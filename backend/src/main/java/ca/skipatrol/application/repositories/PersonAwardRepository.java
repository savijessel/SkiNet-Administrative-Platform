package ca.skipatrol.application.repositories;

import ca.skipatrol.application.models.PersonAward;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PersonAwardRepository extends JpaRepository<PersonAward, UUID> {
}
