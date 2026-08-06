package com.codewithangela.ecommerceapi.model;

import com.codewithangela.ecommerceapi.constants.PaymentStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.time.Instant;

@Data
@Entity
@Table(name = "payment")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @JsonIgnore
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToOne
    @JoinColumn(name = "order_id", referencedColumnName = "id")
    private Order order;

    private String provider;
    private String providerPaymentId;
    private String cardBrand;
    private String last4;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

    private Instant createdAt = Instant.now();
}