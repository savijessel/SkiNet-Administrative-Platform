package ca.skipatrol.application.repositories;

import ca.skipatrol.application.models.Brand;
import ca.skipatrol.application.models.Vest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface VestRepository extends JpaRepository<Vest, UUID> {

    Optional<Vest> findByBrand(Brand brand);
    Optional<Vest> findByBrand_BrandID(UUID brandID);
}
