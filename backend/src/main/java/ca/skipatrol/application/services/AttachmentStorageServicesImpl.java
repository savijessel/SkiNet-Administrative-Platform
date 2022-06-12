package ca.skipatrol.application.services;

import ca.skipatrol.application.Interfaces.AttachmentStorageServices;
import ca.skipatrol.application.models.cms.Attachment;
import ca.skipatrol.application.models.cms.Post;
import ca.skipatrol.application.repositories.AttachmentRepository;
import ca.skipatrol.application.repositories.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;
import java.util.UUID;

@Service
public class AttachmentStorageServicesImpl implements AttachmentStorageServices {

    @Autowired
    private AttachmentRepository attachmentRepository;

    @Autowired
    private PostRepository postRepository;

    private final Path attachmentsDirectory = Paths.get("/var/csp");

    @Override
    public void init() throws IOException {
        if (!Files.exists(attachmentsDirectory)) {
            Files.createDirectories(attachmentsDirectory);
        }
    }

    @Override
    public Optional<UUID> store(Long postId, MultipartFile file) throws IOException {
        Optional<Post> post = postRepository.findById(postId);

        if (post.isPresent()) {
            Attachment attachment = new Attachment();
            attachment.setOriginalFileName(file.getOriginalFilename());
            attachment.setPost(post.get());

            attachmentRepository.save(attachment);

            Path storedPath = Paths.get(attachmentsDirectory.toString(), attachment.getId().toString());

            file.transferTo(storedPath.toFile());

            return Optional.of(attachment.getId());
        } else {
            throw new IOException("Could not find attached post");
        }
    }

    @Override
    public Resource load(String identifier) {
        Path storedPath = Paths.get(attachmentsDirectory.toString(), identifier);
        return new FileSystemResource(storedPath);
    }
}
