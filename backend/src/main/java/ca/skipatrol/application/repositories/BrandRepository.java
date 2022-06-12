package ca.skipatrol.application.repositories;

import ca.skipatrol.application.models.Brand;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface BrandRepository extends JpaRepository<Brand, UUID> {

    Optional<Brand> findByDescription(String name);

}
