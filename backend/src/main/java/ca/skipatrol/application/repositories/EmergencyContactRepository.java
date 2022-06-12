package ca.skipatrol.application.repositories;

import ca.skipatrol.application.models.EmergencyContact;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface EmergencyContactRepository extends JpaRepository<EmergencyContact, UUID> {
}
