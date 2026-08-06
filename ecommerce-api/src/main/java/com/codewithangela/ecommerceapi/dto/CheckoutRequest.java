package com.codewithangela.ecommerceapi.dto;

import com.codewithangela.ecommerceapi.constants.DeliveryOption;

import java.time.Instant;

public record CheckoutRequest(
        String street,
        String city,
        String state,
        String zip,
        String instructions,
        DeliveryOption deliveryOption,
        Instant scheduledTime,
        String cardBrand,
        String last4
) {}