package com.gasiuu.backend.controllers;

import com.gasiuu.backend.constant.Constant;
import com.gasiuu.backend.domain.dto.NewsDto;
import com.gasiuu.backend.services.NewsService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.gasiuu.backend.services.FileStorageService;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

import static com.gasiuu.backend.constant.Constant.PHOTO_DIR;
import static org.springframework.http.MediaType.IMAGE_PNG_VALUE;

@RestController
@AllArgsConstructor
public class NewsController {

    private final NewsService newsService;
    private final FileStorageService fileStorageService;

    @PostMapping("/admin/add-news")
    public ResponseEntity<NewsDto> createNews(@RequestParam("file") MultipartFile file, NewsDto newsDto) throws IOException {
        String imagePath = fileStorageService.StoreFile(file);
        return ResponseEntity.ok(newsService.create(imagePath, newsDto));
    }

    @GetMapping("/public/news")
    public ResponseEntity<NewsDto> getAllNews() {
        return ResponseEntity.ok(newsService.getAllNews());
    }

    @GetMapping("/public/news/{newsId}")
    public ResponseEntity<NewsDto> getNewsById(@PathVariable("newsId") Long newsId) {
        return ResponseEntity.ok(newsService.getNewsById(newsId));
    }

    @PutMapping("/admin/news/{newsId}")
    public ResponseEntity<NewsDto> editNews(@RequestParam(value = "file", required = false) MultipartFile file,
                                            @PathVariable("newsId") Long newsId,
                                            @RequestParam("title") String title,
                                            @RequestParam("content") String content,
                                            @RequestParam("author") String author) throws IOException {
        String imagePath = null;

        if (file != null && !file.isEmpty()) {
            imagePath = fileStorageService.StoreFile(file);
        }

        NewsDto newsDto = new NewsDto();
        newsDto.setTitle(title);
        newsDto.setContent(content);
        newsDto.setAuthor(author);


        NewsDto updatedNews = newsService.editNews(imagePath, newsDto, newsId);
        return ResponseEntity.status(updatedNews.getStatusCode()).body(updatedNews);
    }


    @DeleteMapping("/admin/news/{newsId}")
    public ResponseEntity<NewsDto> deleteNewsById(@PathVariable("newsId") Long newsId) {
        return ResponseEntity.ok(newsService.deleteNews(newsId));
    }

    @GetMapping(path="/public/news/image/{filename}", produces=IMAGE_PNG_VALUE)
    public byte[] getPhoto(@PathVariable("filename") String fileName) throws IOException {
        return Files.readAllBytes(Paths.get(PHOTO_DIR + fileName));
    }

}
