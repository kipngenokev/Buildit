package com.buildit.store.cart.application;

import com.buildit.store.auth.domain.User;
import com.buildit.store.auth.infrastructure.UserRepository;
import com.buildit.store.cart.domain.CartItem;
import com.buildit.store.cart.infrastructure.CartItemRepository;
import com.buildit.store.catalog.domain.Product;
import com.buildit.store.catalog.infrastructure.ProductRepository;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartService(CartItemRepository cartItemRepository,
                       ProductRepository productRepository,
                       UserRepository userRepository) {
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<CartItemResponse> getMyCart(String email) {
        return cartItemRepository.findByUserEmailOrderByIdAsc(email)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public List<CartItemResponse> addToCart(String email, AddToCartRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        CartItem item = cartItemRepository.findByUserEmailAndProductId(email, request.productId())
                .map(existing -> {
                    existing.increaseQuantity(request.quantity());
                    return existing;
                })
                .orElseGet(() -> new CartItem(user, product, request.quantity()));

        cartItemRepository.save(item);
        return getMyCart(email);
    }

    private CartItemResponse toResponse(CartItem item) {
        BigDecimal lineTotal = item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
        return new CartItemResponse(
                item.getId(),
                item.getProduct().getId(),
                item.getProduct().getName(),
                item.getProduct().getPrice(),
                item.getQuantity(),
                lineTotal
        );
    }
}
