package ca.skipatrol.application.repositories;

import ca.skipatrol.application.models.Pack;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PackRepository extends JpaRepository<Pack, UUID> {
}
