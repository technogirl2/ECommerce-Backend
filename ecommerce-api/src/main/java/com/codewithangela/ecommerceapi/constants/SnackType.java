package com.codewithangela.ecommerceapi.constants;

public enum SnackType {
    COOKIES_PASTRIES("Cookies & Pastries"),
    CANDIES_CHOCOLATES("Candies & Chocolates"),
    JELLY_DRIED_FRUIT("Jelly & Dried Fruit"),
    CHIPS("Chips"),
    CRACKERS("Crackers"),
    NUTS("Nuts"),
    BEVERAGES("Beverages"),
    POWDERED_BREWED_DRINKS("Powdered & Brewed Drinks");

    private final String label;

    SnackType(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}