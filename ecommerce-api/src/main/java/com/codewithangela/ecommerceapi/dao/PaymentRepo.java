package com.codewithangela.ecommerceapi.dao;

import com.codewithangela.ecommerceapi.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepo extends JpaRepository<Payment, Integer> {
}