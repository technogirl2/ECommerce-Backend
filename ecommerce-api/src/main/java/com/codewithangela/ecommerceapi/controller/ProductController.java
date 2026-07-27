package com.codewithangela.ecommerceapi.controller;

import com.codewithangela.ecommerceapi.model.Product;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

import static java.util.List.*;

@RestController
public class ProductController {
    List<Product> products = new ArrayList<>(
            of(
            new Product(1, "Product 1", 10.0),
            new Product(2, "Product 2", 20.0),
            new Product(3, "Product 3", 30.0)
    ));

    @GetMapping("csrf-token")
    public CsrfToken csrfToken(HttpServletRequest request)
    {
        return (CsrfToken) request.getAttribute("_csrf");
    }
    @GetMapping ("products")
    public List<Product> getProducts() {

        return products;
    }

    @PostMapping("add-products")
    public void addProduct(@RequestBody Product product) {
        products.add(product);
    }

}
