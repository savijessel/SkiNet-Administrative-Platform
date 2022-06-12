package ca.skipatrol.application.controllers;

import ca.skipatrol.application.Interfaces.PostServices;
import ca.skipatrol.application.models.cms.Post;
import ca.skipatrol.application.models.cms.Topic;
import ca.skipatrol.application.repositories.PostRepository;
import ca.skipatrol.application.repositories.TopicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
public class PostsController {

    @Autowired
    PostServices postServices;

    @Autowired
    PostRepository postRepository;

    @Autowired
    TopicRepository topicRepository;

    @RequestMapping(value = "/customapi/posts/search", method = RequestMethod.POST, headers = "Content-Type=application/json")
    public ResponseEntity<Object> search(@RequestBody List<String> searchTerms) {
        return new ResponseEntity<>(postServices.getPostsWhereTitleOrBodyContainsAnyWord(searchTerms), HttpStatus.OK);
    }

    @RequestMapping(value = "/customapi/posts/associateTopic", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateUser(@RequestParam Long id, @RequestParam String topicId) {
        Optional<Post> existing = postRepository.findById(id);
        if (existing.isEmpty()) return ResponseEntity.badRequest().build();

        Post existingPost = existing.get();

        UUID topicUUID = UUID.fromString(topicId);

        Optional<Topic> foundTopic = topicRepository.findById(topicUUID);

        if (foundTopic.isEmpty()) return ResponseEntity.badRequest().build();

        existingPost.setTopic(foundTopic.get());

        postRepository.save(existingPost);

        return ResponseEntity.ok().build();
    }

}
