package ca.skipatrol.application.repositories;

import ca.skipatrol.application.models.Area;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;


public interface AreaRepository extends JpaRepository<Area, UUID> {

    Optional<Area> findByAreaname(String areaname);
}