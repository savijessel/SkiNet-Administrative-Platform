package ca.skipatrol.application.repositories;

import ca.skipatrol.application.models.OnSnowEval;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface OnSnowEvalRepository extends JpaRepository<OnSnowEval, UUID> {
}
