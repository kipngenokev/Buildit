package com.buildit.store.cart.infrastructure;

import com.buildit.store.cart.domain.CartItem;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUserEmailOrderByIdAsc(String email);

    Optional<CartItem> findByUserEmailAndProductId(String email, Long productId);
}
