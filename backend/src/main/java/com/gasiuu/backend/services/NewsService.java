package com.gasiuu.backend.services;

import com.gasiuu.backend.constant.Constant;
import com.gasiuu.backend.domain.dto.NewsDto;
import com.gasiuu.backend.domain.entities.NewsEntity;
import com.gasiuu.backend.repositories.NewsRepository;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NewsService {

    @Value("${BACKEND_URL}")
    private String BASE_URL;

    private final NewsRepository newsRepository;
    private final FileStorageService fileStorageService;


    public NewsDto create(String imagePath, NewsDto newsDto) {
        NewsDto response = new NewsDto();

        try {
            NewsEntity news = NewsEntity.builder()
                    .title(newsDto.getTitle())
                    .content(newsDto.getContent())
                    .author(newsDto.getAuthor())
                    .imageUrl(BASE_URL + "/public/news/image/" + imagePath)
                    .publishedDate(new Date())
                    .build();

            NewsEntity savedNews = newsRepository.save(news);

            if (savedNews.getId() > 0) {
                response.setNewsEntity((savedNews));
                response.setMessage("News succesfully added");
                response.setStatusCode(200);
            }

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setError(e.getMessage());
        }

        return response;
    }


    public NewsDto getAllNews() {
        NewsDto response = new NewsDto();

        try {
            List<NewsEntity> newsEntities = newsRepository.findAll();
            if(!newsEntities.isEmpty()) {
                response.setNewsEntityList(newsEntities);
                response.setStatusCode(200);
                response.setMessage("News succesfully retrieved");
            } else {
                response.setStatusCode(404);
                response.setMessage("News not found");
            }
            return response;
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setError(e.getMessage());
            return response;
        }
    }

    public NewsDto getNewsById(Long id) {
        NewsDto response = new NewsDto();

        try {
            Optional<NewsEntity> resultOptional = newsRepository.findById(id);

            if (resultOptional.isPresent()) {
                response.setNewsEntity(resultOptional.get());
            } else {
                response.setStatusCode(404);
                response.setError("News entity not found");
            }
            return response;
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setError(e.getMessage());
            return response;
        }
    }


    public NewsDto deleteNews(Long id) {
        NewsDto response = new NewsDto();

        try {
            Optional<NewsEntity> resultOptional = newsRepository.findById(id);

            if (resultOptional.isPresent()) {
                newsRepository.deleteById(id);
                response.setStatusCode(200);
                response.setMessage("News successfully deleted");
            } else {
                response.setStatusCode(404);
                response.setError("News entity not found");
            }
            return response;
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setError(e.getMessage());
            return response;
        }
    }

    public NewsDto editNews(String imagePath, NewsDto newsDto, Long newsId) {
        NewsDto response = new NewsDto();

        try {
            Optional<NewsEntity> resultOptional = newsRepository.findById(newsId);

            if (resultOptional.isPresent()) {
                NewsEntity existingNews = resultOptional.get();
                existingNews.setTitle(newsDto.getTitle());
                existingNews.setContent(newsDto.getContent());
                existingNews.setAuthor(newsDto.getAuthor());
                existingNews.setImageUrl(BASE_URL + "/public/news/image/" + imagePath);
                existingNews.setPublishedDate(new Date());

                NewsEntity savedNews = newsRepository.save(existingNews);
                response.setStatusCode(200);
                response.setMessage("News succesfully updated");
                response.setNewsEntity(savedNews);
            } else {
                response.setStatusCode(404);
                response.setError("News entity not found");
            }

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setError(e.getMessage());
        }

        return response;
    }

//    public NewsDto updateNews(Long id, NewsDto updatedNewsDto) {
//        NewsDto response = new NewsDto();
//
//        try {
//            Optional<NewsEntity> resultOptional = newsRepository.findById(id);
//
//            if (resultOptional.isPresent()) {
//                NewsEntity existingNews = resultOptional.get();
//                existingNews.setTitle(updatedNewsDto.getTitle());
//                existingNews.setContent(updatedNewsDto.getContent());
//                existingNews.setAuthor(updatedNewsDto.getAuthor());
//                if (updatedNewsDto.getImageUrl() != null) {
//                    existingNews.setImageUrl(updatedNewsDto.getImageUrl());
//                }
//                existingNews.setPublishedDate(new Date()); // Update the date to current
//
//                NewsEntity savedNews = newsRepository.save(existingNews);
//                response.setNewsEntity(savedNews);
//                response.setStatusCode(200);
//                response.setMessage("News successfully updated");
//            } else {
//                response.setStatusCode(404);
//                response.setError("News entity not found");
//            }
//            return response;
//        } catch (Exception e) {
//            response.setStatusCode(500);
//            response.setError(e.getMessage());
//            return response;
//        }
//    }

}
