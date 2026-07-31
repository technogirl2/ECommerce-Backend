package com.codewithangela.ecommerceapi.controller;

import com.codewithangela.ecommerceapi.service.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
public class MediaController {
    private final MediaService mediaService;

    @PostMapping("/upload-product-images")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file,
                                               @RequestParam("folder") String folder) {
        String key = mediaService.uploadFile(file, folder);
        return ResponseEntity.ok(key);
    }
}
