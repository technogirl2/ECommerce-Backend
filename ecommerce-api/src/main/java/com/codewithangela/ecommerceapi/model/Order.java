package com.codewithangela.ecommerceapi.model;

import com.codewithangela.ecommerceapi.constants.DeliveryOption;
import com.codewithangela.ecommerceapi.constants.OrderStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @Enumerated(EnumType.STRING)
    private OrderStatus status = OrderStatus.PENDING;

    private String street;
    private String city;
    private String state;
    private String zip;
    private String instructions;

    @Enumerated(EnumType.STRING)
    private DeliveryOption deliveryOption;

    private Instant scheduledTime;

    private double subtotal;
    private double deliveryFee;
    private double tax;
    private double total;

    private Instant createdAt = Instant.now();

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private Payment payment;
}