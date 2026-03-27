package com.buildit.store.catalog.infrastructure;

import com.buildit.store.catalog.application.CatalogService;
import com.buildit.store.catalog.application.ProductResponse;
import com.buildit.store.catalog.domain.ProductCategory;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/products")
public class CatalogController {

    private final CatalogService catalogService;

    public CatalogController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @GetMapping
    public List<ProductResponse> allProducts() {
        return catalogService.findAllProducts();
    }

    @GetMapping("/categories")
    public Map<ProductCategory, List<ProductResponse>> productsByCategory() {
        return catalogService.findProductsByCategory();
    }
}
