package com.codewithangela.ecommerceapi.dao;

import com.codewithangela.ecommerceapi.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepo extends JpaRepository<Cart, Integer> {
    Optional<Cart> findByUserId(int userId);
}