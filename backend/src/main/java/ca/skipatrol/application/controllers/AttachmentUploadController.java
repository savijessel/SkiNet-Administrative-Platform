package ca.skipatrol.application.controllers;

import ca.skipatrol.application.Interfaces.AttachmentStorageServices;
import ca.skipatrol.application.models.cms.Attachment;
import ca.skipatrol.application.repositories.AttachmentRepository;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

@Controller
public class AttachmentUploadController {

    private final AttachmentStorageServices storageService;

    @Autowired
    private AttachmentRepository attachmentRepository;

    @Autowired
    public AttachmentUploadController(AttachmentStorageServices storageService) {
        this.storageService = storageService;
    }

    @GetMapping("/public/attachments/bingo")
    @ResponseBody
    public ResponseEntity<String> test() {
        return ResponseEntity.ok().body("asdf");
    }

    @GetMapping("/public/attachments/{identifier:.+}")
    @ResponseBody
    public ResponseEntity<Resource> serveFile(@PathVariable String identifier) throws IOException {
        Resource file = storageService.load(identifier);

        Optional<Attachment> sourcedAttachment = attachmentRepository.findById(UUID.fromString(identifier));

        if (sourcedAttachment.isPresent()) {
            String fileName = sourcedAttachment.get().getOriginalFileName();
            return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"").body(file);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/public/attachments/new/{postId}")
    public ResponseEntity<UUID> handleFileUpload(@RequestParam("file") MultipartFile file, @PathVariable String postId) throws IOException {
        Optional<UUID> storedId = storageService.store(Long.valueOf(postId), file);
        return storedId.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @ExceptionHandler(IOException.class)
    public ResponseEntity<?> handleStorageFileNotFound(IOException exc) {
        return ResponseEntity.notFound().build();
    }

}