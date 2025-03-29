package com.gasiuu.backend.domain.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.gasiuu.backend.domain.entities.NewsEntity;
import lombok.Data;

import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class NewsDto {

    private int statusCode;
    private String error;
    private String message;
    private Long id;
    private String title;
    private String content;
    private String author;
    private String date;
    private NewsEntity newsEntity;
    private List<NewsEntity> newsEntityList;
}
