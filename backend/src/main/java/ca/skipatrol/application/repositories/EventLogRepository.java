package ca.skipatrol.application.repositories;

import ca.skipatrol.application.models.EventLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface EventLogRepository extends JpaRepository<EventLog, UUID> {

    List<EventLog> findAllByEvent_eventID(UUID eventID);
    List<EventLog> findAllByUser_userID(UUID eventID);
}
