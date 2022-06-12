package ca.skipatrol.application.Interfaces;

import ca.skipatrol.application.models.cms.Post;

import java.util.List;

public interface PostServices {

    List<Post> getPostsWhereTitleOrBodyContainsAnyWord(List<String> words);
    int DeletePost(Long postID);
}
