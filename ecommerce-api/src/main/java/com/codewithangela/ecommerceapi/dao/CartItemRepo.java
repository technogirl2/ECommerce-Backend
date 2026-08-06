package com.codewithangela.ecommerceapi.dao;

import com.codewithangela.ecommerceapi.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepo extends JpaRepository<CartItem, Integer> {
}