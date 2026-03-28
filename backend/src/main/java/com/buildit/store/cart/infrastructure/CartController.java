package com.buildit.store.cart.infrastructure;

import com.buildit.store.cart.application.AddToCartRequest;
import com.buildit.store.cart.application.CartItemResponse;
import com.buildit.store.cart.application.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cart")
@SecurityRequirement(name = "bearerAuth")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @Operation(summary = "Get current user's cart")
    @GetMapping
    public List<CartItemResponse> myCart(@AuthenticationPrincipal Jwt jwt) {
        return cartService.getMyCart(jwt.getSubject());
    }

    @Operation(summary = "Add product to current user's cart")
    @PostMapping
    public List<CartItemResponse> addToCart(@AuthenticationPrincipal Jwt jwt,
                                            @Valid @RequestBody AddToCartRequest request) {
        return cartService.addToCart(jwt.getSubject(), request);
    }
}
