package ca.skipatrol.application.repositories;

import ca.skipatrol.application.models.Conditions;
import ca.skipatrol.application.models.cms.Topic;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface TopicRepository extends JpaRepository<Topic, UUID> {

    Optional<Topic> findByDescription(String description);

}
