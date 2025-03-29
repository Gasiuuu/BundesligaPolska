package com.gasiuu.backend.controllers;

import com.gasiuu.backend.services.CommentService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class CommentController {

    private final CommentService commentService;
}
