package ca.skipatrol.application.repositories;

import ca.skipatrol.application.models.OperationalTraining;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface OperationalTrainingRepository extends JpaRepository<OperationalTraining, UUID> {
}
