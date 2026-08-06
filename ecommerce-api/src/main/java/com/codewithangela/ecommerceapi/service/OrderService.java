package com.codewithangela.ecommerceapi.service;

import com.codewithangela.ecommerceapi.constants.DeliveryOption;
import com.codewithangela.ecommerceapi.constants.OrderStatus;
import com.codewithangela.ecommerceapi.constants.PaymentStatus;
import com.codewithangela.ecommerceapi.dao.OrderRepo;
import com.codewithangela.ecommerceapi.dto.CheckoutRequest;
import com.codewithangela.ecommerceapi.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class OrderService {

    @Autowired
    private OrderRepo orderRepo;

    @Autowired
    private CartService cartService;

    @Transactional
    public Optional<Order> checkout(User user, CheckoutRequest request) {
        Cart cart = cartService.getCartForUser(user);
        if (cart.getItems().isEmpty()) {
            return Optional.empty();
        }
        if (request.deliveryOption() == DeliveryOption.SCHEDULED && request.scheduledTime() == null) {
            return Optional.empty();
        }

        Order order = new Order();
        order.setUser(user);
        order.setStatus(OrderStatus.CONFIRMED);
        order.setStreet(request.street());
        order.setCity(request.city());
        order.setState(request.state());
        order.setZip(request.zip());
        order.setInstructions(request.instructions());
        order.setDeliveryOption(request.deliveryOption());
        order.setScheduledTime(request.deliveryOption() == DeliveryOption.SCHEDULED ? request.scheduledTime() : null);

        double subtotal = cart.getItems().stream()
                .mapToDouble(item -> item.getProduct().getPrice() * item.getQuantity())
                .sum();
        double deliveryFee = deliveryFeeFor(request.deliveryOption());
        double tax = round(subtotal * 0.08);

        order.setSubtotal(round(subtotal));
        order.setDeliveryFee(deliveryFee);
        order.setTax(tax);
        order.setTotal(round(subtotal + deliveryFee + tax));

        for (CartItem cartItem : cart.getItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setProductName(cartItem.getProduct().getName());
            orderItem.setUnitPrice(cartItem.getProduct().getPrice());
            orderItem.setQuantity(cartItem.getQuantity());
            order.getItems().add(orderItem);
        }

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setProvider("mock");
        payment.setProviderPaymentId(UUID.randomUUID().toString());
        payment.setCardBrand(request.cardBrand());
        payment.setLast4(request.last4());
        payment.setStatus(PaymentStatus.SUCCEEDED);
        order.setPayment(payment);

        Order savedOrder = orderRepo.save(order);
        cartService.clearCart(cart);

        return Optional.of(savedOrder);
    }

    public List<Order> getOrdersForUser(User user) {
        return orderRepo.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    public Optional<Order> getOrderForUser(User user, int orderId) {
        return orderRepo.findByIdAndUserId(orderId, user.getId());
    }

    private double deliveryFeeFor(DeliveryOption option) {
        return switch (option) {
            case STANDARD -> 4.99;
            case PRIORITY -> 9.99;
            case SCHEDULED -> 6.99;
        };
    }

    private double round(double value) {
        return Math.round(value * 100) / 100.0;
    }
}