package com.buildit.store.catalog.infrastructure;

import com.buildit.store.catalog.domain.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
