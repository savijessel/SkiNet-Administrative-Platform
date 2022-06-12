package ca.skipatrol.application.repositories;

import ca.skipatrol.application.models.cms.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Optional;

public interface PostRepository extends PagingAndSortingRepository<Post, Long>, JpaSpecificationExecutor<Post> {
    Optional<Post> findByTitle(String title);
    Page<Post> findAllByOrderByPublishedDateDesc(Pageable p);
}
