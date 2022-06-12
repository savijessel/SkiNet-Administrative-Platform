package ca.skipatrol.application.repositories;

import ca.skipatrol.application.models.PatrolCommitment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PatrolCommitmentRepository extends JpaRepository<PatrolCommitment, UUID> {
}
