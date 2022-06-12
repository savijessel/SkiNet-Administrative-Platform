package ca.skipatrol.application.services;

import ca.skipatrol.application.Interfaces.AttachmentStorageServices;
import ca.skipatrol.application.models.cms.Attachment;
import ca.skipatrol.application.models.cms.Post;
import ca.skipatrol.application.repositories.AttachmentRepository;
import ca.skipatrol.application.repositories.PostRepository;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.auth.BasicSessionCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;
import java.util.UUID;

@Service
@Primary
public class S3StorageServiceImpl implements AttachmentStorageServices {

    @Autowired
    private AttachmentRepository attachmentRepository;

    @Autowired
    private PostRepository postRepository;

    private final Path attachmentsUploadStagingDirectory = Paths.get("/tmp/csp/attachments/staging/upload");

    private final Path attachmentsDownloadStagingDirectory = Paths.get("/tmp/csp/attachments/staging/download");

    // TODO: Replace with environment variables--only for testing purposes!
    private final BasicAWSCredentials credentials = new BasicAWSCredentials("AKIAQA7UPADTKXE4AG5N", "UDw9a10H8hwXxwxTu3aZevuY0PPr4aVOSeGdzdRS");

    private final AmazonS3 s3 = AmazonS3ClientBuilder.standard().withCredentials(new AWSStaticCredentialsProvider(credentials)).withRegion(Regions.US_EAST_2).build();

    private final String BUCKET_NAME = "csp-attachment-bucket";

    private final Logger logger = LoggerFactory.getLogger(S3StorageServiceImpl.class);

    @Override
    public void init() throws IOException {
        if (!Files.exists(attachmentsUploadStagingDirectory)) {
            Files.createDirectories(attachmentsUploadStagingDirectory);
        }

        if (!Files.exists(attachmentsDownloadStagingDirectory)) {
            Files.createDirectories(attachmentsDownloadStagingDirectory);
        }

        logger.info("Initialized S3StorageService!");
    }

    @Override
    public Optional<UUID> store(Long postId, MultipartFile file) throws IOException {
        Optional<Post> post = postRepository.findById(postId);

        if (post.isPresent()) {
            Attachment attachment = new Attachment();
            attachment.setOriginalFileName(file.getOriginalFilename());
            attachment.setPost(post.get());

            attachmentRepository.save(attachment);

            Path storedPath = Paths.get(attachmentsUploadStagingDirectory.toString(), attachment.getId().toString());
            file.transferTo(storedPath.toFile());

            s3.putObject(BUCKET_NAME, attachment.getId().toString(), storedPath.toFile());

            logger.info(String.format("Stored attachment for postId: %d as identifier: %s", postId, attachment.getId().toString()));

            return Optional.of(attachment.getId());
        } else {
            throw new IOException("Could not find attached post");
        }
    }

    @Override
    public Resource load(String identifier) throws IOException {
        final int BUFFER_SIZE = 1024;

        Path storedPath = Paths.get(attachmentsDownloadStagingDirectory.toString(), identifier);

        S3Object o = s3.getObject(BUCKET_NAME, identifier);
        S3ObjectInputStream s3is = o.getObjectContent();
        FileOutputStream fos = new FileOutputStream(storedPath.toFile());
        byte[] read_buf = new byte[BUFFER_SIZE];
        int read_len = 0;
        while ((read_len = s3is.read(read_buf)) > 0) {
            fos.write(read_buf, 0, read_len);
        }
        s3is.close();
        fos.close();

        logger.info(String.format("Loaded attachment for identifier: %s", identifier));

        return new FileSystemResource(storedPath);
    }

}
