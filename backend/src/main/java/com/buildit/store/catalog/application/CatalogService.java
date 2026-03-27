package com.buildit.store.catalog.application;

import com.buildit.store.catalog.domain.ProductCategory;
import com.buildit.store.catalog.infrastructure.ProductRepository;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class CatalogService {

    private final ProductRepository productRepository;

    public CatalogService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<ProductResponse> findAllProducts() {
        return productRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(product -> product.getName().toLowerCase()))
                .map(ProductResponse::from)
                .toList();
    }

    public Map<ProductCategory, List<ProductResponse>> findProductsByCategory() {
        return findAllProducts()
                .stream()
                .collect(Collectors.groupingBy(ProductResponse::category));
    }
}
