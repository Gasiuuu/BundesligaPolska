package com.gasiuu.backend.services;

import com.gasiuu.backend.domain.dto.PostDto;
import com.gasiuu.backend.domain.entities.PostEntity;
import com.gasiuu.backend.domain.entities.UserEntity;
import com.gasiuu.backend.repositories.PostRepository;
import com.gasiuu.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;


    public PostDto createPost(PostDto postDto) {

        UserEntity author = userRepository.findByEmail(postDto.getAuthor().getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        PostDto response = new PostDto();

        try {
            PostEntity post = PostEntity.builder()
                    .title(postDto.getTitle())
                    .content(postDto.getContent())
                    .publishedDate(new Date())
                    .author(author)
//                    .likes(0)
//                    .dislikes(0)
//                    .comments(0)
                    .build();

            PostEntity savedPost = postRepository.save(post);

            if(savedPost.getId() > 0) {
                response.setPostEntity(savedPost);
                response.setMessage("Post successfully created");
                response.setStatusCode(200);
            }

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setError(e.getMessage());
        }
        return response;
    }

    public PostDto getAllPosts() {
        PostDto response = new PostDto();

        try {
            List<PostEntity> posts = postRepository.findAll();
            if(!posts.isEmpty()) {
                response.setPostEntityList(posts);
                response.setStatusCode(200);
                response.setMessage("Posts successfully retrieved");
            } else {
                response.setStatusCode(404);
                response.setMessage("No posts found");
            }
            return response;
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setError(e.getMessage());
            return response;
        }
    }

    public PostDto getPostById(Long id) {
        PostDto response = new PostDto();

        try {
            Optional<PostEntity> post = postRepository.findById(id);
            if(post.isPresent()) {
                response.setPostEntity(post.get());
                response.setStatusCode(200);
                response.setMessage("Post successfully retrieved");
            } else {
                response.setStatusCode(404);
                response.setMessage("No post found");
            }
            return response;
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setError(e.getMessage());
            return response;
        }
    }

    public PostDto updatePost(Long id, PostDto postDto) {
        PostDto response = new PostDto();

        try {
            Optional<PostEntity> postOptional = postRepository.findById(id);

            if(postOptional.isPresent()) {

                PostEntity existingPost = postOptional.get();
                existingPost.setTitle(postDto.getTitle());
                existingPost.setContent(postDto.getContent());
                existingPost.setPublishedDate(postDto.getPublishedDate());

                PostEntity updatedPost = postRepository.save(existingPost);
                response.setPostEntity(updatedPost);
                response.setStatusCode(200);
                response.setMessage("Post successfully updated");
            } else {
                response.setStatusCode(404);
                response.setMessage("No post found");
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setError("An error occurred while updating post: " + e.getMessage());
        }
        return response;
    }


    public PostDto deletePost(Long id) {
        PostDto response = new PostDto();

        try {
            Optional<PostEntity> post = postRepository.findById(id);
            if(post.isPresent()) {
                postRepository.delete(post.get());
                response.setStatusCode(200);
                response.setMessage("Post successfully deleted");
            } else {
                response.setStatusCode(404);
                response.setMessage("No post found");
            }
            return response;
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setError(e.getMessage());
            return response;
        }
    }


}
