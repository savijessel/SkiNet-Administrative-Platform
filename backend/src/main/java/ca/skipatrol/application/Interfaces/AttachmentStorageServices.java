package ca.skipatrol.application.Interfaces;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

public interface AttachmentStorageServices {

    void init() throws IOException;

    Optional<UUID> store(Long postId, MultipartFile file) throws IOException;

    Resource load(String identifier) throws IOException;

}