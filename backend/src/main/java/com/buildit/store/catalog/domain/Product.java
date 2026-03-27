package com.buildit.store.catalog.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, length = 240)
    private String shortDescription;

    @Column(nullable = false, length = 2000)
    private String detailedDescription;

    @Column(nullable = false)
    private String designStyle;

    @Column(nullable = false)
    private String material;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(nullable = false)
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ProductCategory category;

    protected Product() {
    }

    public Product(String name,
                   String shortDescription,
                   String detailedDescription,
                   String designStyle,
                   String material,
                   BigDecimal price,
                   String imageUrl,
                   ProductCategory category) {
        this.name = name;
        this.shortDescription = shortDescription;
        this.detailedDescription = detailedDescription;
        this.designStyle = designStyle;
        this.material = material;
        this.price = price;
        this.imageUrl = imageUrl;
        this.category = category;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getShortDescription() {
        return shortDescription;
    }

    public String getDetailedDescription() {
        return detailedDescription;
    }

    public String getDesignStyle() {
        return designStyle;
    }

    public String getMaterial() {
        return material;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public ProductCategory getCategory() {
        return category;
    }
}
