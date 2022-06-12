package ca.skipatrol.application.repositories;

import ca.skipatrol.application.models.Size;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface SizeRepository extends JpaRepository<Size, UUID> {

    Optional<Size> findByDescription(String description);

}
