package com.codewithangela.ecommerceapi.service;


import com.codewithangela.ecommerceapi.dao.ProductRepo;
import com.codewithangela.ecommerceapi.model.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepo repo;

    @Autowired
    private MediaService mediaService;


    public List<Product> getAllProducts() {
        return repo.findAll();
    }

    public Optional<Product> getProductById(int id) {
        return repo.findById(id);
    }

    public void addProduct(Product product) {
        repo.save(product);
    }

    public void deleteProduct(int id) {
        repo.findById(id).ifPresent(product -> {
            if (product.getImageUrl() != null) {
                mediaService.deleteFile(product.getImageUrl());
            }
        });
        repo.deleteById(id);
    }

    public void updateProduct(Product product) {

        // JPA dp upsert operation, so save = update
        repo.save(product);
    }
}
