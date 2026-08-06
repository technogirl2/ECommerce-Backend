package com.codewithangela.ecommerceapi.model;

import com.codewithangela.ecommerceapi.constants.SnackType;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name="product")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String name;
    private double price;
    private String imageUrl;
    private String brand;

    @Enumerated(EnumType.STRING)
    private SnackType snackType;
}
