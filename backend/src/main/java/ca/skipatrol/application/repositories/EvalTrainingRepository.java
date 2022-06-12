package ca.skipatrol.application.repositories;

import ca.skipatrol.application.models.EvalTraining;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface EvalTrainingRepository extends JpaRepository<EvalTraining, UUID> {
}
