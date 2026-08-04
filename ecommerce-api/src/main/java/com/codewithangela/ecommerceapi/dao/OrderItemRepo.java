package com.codewithangela.ecommerceapi.dao;

import com.codewithangela.ecommerceapi.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepo extends JpaRepository<OrderItem, Integer> {
}