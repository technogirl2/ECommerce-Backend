package com.codewithangela.ecommerceapi.controller;

import com.codewithangela.ecommerceapi.model.Product;
import com.codewithangela.ecommerceapi.service.MediaService;
import com.codewithangela.ecommerceapi.service.ProductService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
public class ProductController {
    @Autowired
    private ProductService productService;

    @Autowired
    private MediaService mediaService;

    @GetMapping ("products")
    public List<Product> getProducts() {

        return productService.getAllProducts();
    }

    @PostMapping(value = "add-product", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public void addProduct(@ModelAttribute Product product, @RequestParam("file") MultipartFile file) {
        product.setImageUrl(mediaService.uploadFile(file, "products"));
        productService.addProduct(product);
    }

    @GetMapping("products/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable int id) {
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("delete-product/{id}")
    public void deleteProducts(@PathVariable int id) {
        productService.deleteProduct(id);
    }

    @PostMapping(value = "update-product", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public void updateProduct(@ModelAttribute Product product,
                               @RequestParam(value = "file", required = false) MultipartFile file) {
        if (file != null && !file.isEmpty()) {
            product.setImageUrl(mediaService.uploadFile(file, "products"));
        } else {
            productService.getProductById(product.getId())
                    .ifPresent(existing -> product.setImageUrl(existing.getImageUrl()));
        }
        productService.updateProduct(product);
    }

}
