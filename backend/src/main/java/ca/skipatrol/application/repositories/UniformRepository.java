package ca.skipatrol.application.repositories;

import ca.skipatrol.application.models.Uniform;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UniformRepository extends JpaRepository<Uniform, UUID> {
}
