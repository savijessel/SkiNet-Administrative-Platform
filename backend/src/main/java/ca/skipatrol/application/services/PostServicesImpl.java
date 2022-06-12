package ca.skipatrol.application.services;

import ca.skipatrol.application.Interfaces.PostServices;
import ca.skipatrol.application.models.cms.Post;
import ca.skipatrol.application.repositories.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.Expression;
import java.util.Collections;
import java.util.List;

@Service
public class PostServicesImpl implements PostServices {

    @Autowired
    PostRepository repository;

    private Specification<Post> titleContains(String searchWord) {
        return (root, query, builder) -> {
            Expression<String> titleLowerCase = builder.lower(root.get("title"));
            return builder.like(titleLowerCase, "%" + searchWord.toLowerCase() + "%");
        };
    }

    private Specification<Post> bodyContains(String searchWord) {
        return (root, query, builder) -> {
            Expression<String> titleLowerCase = builder.lower(root.get("body"));
            return builder.like(titleLowerCase, "%" + searchWord.toLowerCase() + "%");
        };
    }

    public List<Post> getPostsWhereTitleOrBodyContainsAnyWord(List<String> words) {
        if(words.isEmpty()) {
            return Collections.emptyList();
        }

        Specification<Post> specification = null;
        for(String word : words) {
            Specification<Post> titleSpecification = titleContains(word);
            if(specification == null) {
                specification = titleSpecification;
            } else {
                specification = specification.or(titleSpecification);
            }

            Specification<Post> bodySpecification = bodyContains(word);
            if(specification == null) {
                specification = titleSpecification;
            } else {
                specification = specification.or(bodySpecification);
            }
        }

        return repository.findAll(specification);
    }

    public int DeletePost(Long postID)
    {
        try
        {
            // put S3 file delete code here

            repository.deleteById(postID);
            return 200;
        }
        catch(Exception exception) {
            return 500;
        }
    }

}
