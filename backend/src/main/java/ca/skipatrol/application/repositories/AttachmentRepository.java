package ca.skipatrol.application.repositories;

import ca.skipatrol.application.models.cms.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AttachmentRepository extends JpaRepository<Attachment, UUID> {
}
