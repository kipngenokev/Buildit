package com.buildit.store.catalog.infrastructure;

import com.buildit.store.catalog.application.CatalogService;
import com.buildit.store.catalog.application.ProductResponse;
import com.buildit.store.catalog.domain.ProductCategory;
import io.swagger.v3.oas.annotations.Operation;
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

    @Operation(summary = "List all products")
    @GetMapping
    public List<ProductResponse> allProducts() {
        return catalogService.findAllProducts();
    }

    @Operation(summary = "List products grouped by category")
    @GetMapping("/categories")
    public Map<ProductCategory, List<ProductResponse>> productsByCategory() {
        return catalogService.findProductsByCategory();
    }
}
