package com.codewithangela.ecommerceapi.controller;

import com.codewithangela.ecommerceapi.dto.AddCartItemRequest;
import com.codewithangela.ecommerceapi.dto.UpdateCartItemRequest;
import com.codewithangela.ecommerceapi.model.Cart;
import com.codewithangela.ecommerceapi.model.User;
import com.codewithangela.ecommerceapi.service.CartService;
import com.codewithangela.ecommerceapi.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private UserService userService;

    @GetMapping("cart")
    public Cart getCart(Authentication authentication) {
        return cartService.getCartForUser(currentUser(authentication));
    }

    @PostMapping("cart/items")
    public ResponseEntity<Cart> addItem(Authentication authentication, @RequestBody AddCartItemRequest request) {
        return cartService.addItem(currentUser(authentication), request.productId(), request.quantity())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("cart/items/{itemId}")
    public ResponseEntity<Cart> updateItemQuantity(Authentication authentication, @PathVariable int itemId,
                                                     @RequestBody UpdateCartItemRequest request) {
        return cartService.updateItemQuantity(currentUser(authentication), itemId, request.quantity())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("cart/items/{itemId}")
    public ResponseEntity<Cart> removeItem(Authentication authentication, @PathVariable int itemId) {
        return cartService.removeItem(currentUser(authentication), itemId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    private User currentUser(Authentication authentication) {
        return userService.getUserByUsername(authentication.getName());
    }
}
