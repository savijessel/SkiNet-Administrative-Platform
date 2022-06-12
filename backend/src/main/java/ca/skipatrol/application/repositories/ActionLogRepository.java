package ca.skipatrol.application.repositories;
import ca.skipatrol.application.models.ActionLog;
import ca.skipatrol.application.models.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ActionLogRepository extends JpaRepository<ActionLog, UUID> {

    Optional<ActionLog> findByEvent(Event event);

    List<ActionLog> findAllByEvent_eventID(UUID eventID);

}
