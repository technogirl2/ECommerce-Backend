package com.codewithangela.ecommerceapi.controller;

import com.codewithangela.ecommerceapi.model.Product;
import com.codewithangela.ecommerceapi.service.ProductService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static java.util.List.*;

@RestController
public class ProductController {
    @Autowired
    private ProductService productService;

    @GetMapping ("products")
    public List<Product> getProducts() {

        return productService.getAllProducts();
    }

    @PostMapping("add-product")
    public void addProduct(@RequestBody Product product) {
        productService.addProduct(product);
    }

    @DeleteMapping("delete-product/{id}")
    public void deleteProducts(@PathVariable int id) {
        productService.deleteProduct(id);
    }

    @PostMapping("update-product")
    public void updateProduct(@RequestBody Product product) {
        productService.updateProduct(product);
    }

}
