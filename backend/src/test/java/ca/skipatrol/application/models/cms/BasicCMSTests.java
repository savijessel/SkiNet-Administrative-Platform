package ca.skipatrol.application.models.cms;

import ca.skipatrol.application.repositories.PostRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Objects;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class BasicCMSTests {

    @Autowired
    PostRepository postRepository;

    @Test
    void testListComments() {
        Post newPost = new Post();
        postRepository.save(newPost);

        Optional<Post> postResult = postRepository.findById(newPost.getId());
        assertTrue(postResult.isPresent());

        Post foundPost = postResult.get();
        postRepository.delete(foundPost);
    }

}
