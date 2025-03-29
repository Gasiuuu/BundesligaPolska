package com.gasiuu.backend.domain.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.gasiuu.backend.domain.entities.PostEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostDto {

    private int statusCode;
    private String error;
    private String message;
    private Long id;
    private String title;
    private String content;
    private Date publishedDate;
    private UserDto author;
    private int likes;
    private int dislikes;
    private int comments;
    private PostEntity postEntity;
    private List<PostEntity> postEntityList;
}
