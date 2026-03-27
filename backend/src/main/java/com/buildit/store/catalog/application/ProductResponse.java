package com.buildit.store.catalog.application;

import com.buildit.store.catalog.domain.Product;
import com.buildit.store.catalog.domain.ProductCategory;
import java.math.BigDecimal;

public record ProductResponse(
        Long id,
        String name,
        String shortDescription,
        String detailedDescription,
        String designStyle,
        String material,
        BigDecimal price,
        String imageUrl,
        ProductCategory category
) {
    public static ProductResponse from(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getShortDescription(),
                product.getDetailedDescription(),
                product.getDesignStyle(),
                product.getMaterial(),
                product.getPrice(),
                product.getImageUrl(),
                product.getCategory()
        );
    }
}
