package ca.skipatrol.application.repositories;

import ca.skipatrol.application.models.Jacket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface JacketRepository extends JpaRepository<Jacket, UUID> {
}
