package com.buildit.store.config;

import com.buildit.store.catalog.domain.Product;
import com.buildit.store.catalog.domain.ProductCategory;
import com.buildit.store.catalog.infrastructure.ProductRepository;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CatalogDataInitializer {

    @Bean
    CommandLineRunner initCatalog(ProductRepository productRepository) {
        return args -> {
            if (productRepository.count() > 0) {
                return;
            }

            List<Product> products = List.of(
                    new Product("Aurora Farmhouse Sink", "Deep ceramic sink for modern farmhouse kitchens.", "The Aurora Farmhouse Sink features a spacious single bowl, apron-front profile, and glazed finish that resists scratches and stains. It is designed for high-traffic kitchens where visual impact and easy cleaning matter.", "Farmhouse", "Fireclay", new BigDecimal("649.00"), "https://images.unsplash.com/photo-1564540574859-0dfb63985956?auto=format&fit=crop&w=900&q=80", ProductCategory.SINK),
                    new Product("Nova Undermount Sink", "Minimal stainless-steel sink for seamless countertops.", "Nova Undermount Sink blends into stone countertops for a clean look. Its sound-dampening pads reduce noise while the corrosion-resistant steel keeps the surface polished over time.", "Contemporary", "Stainless Steel", new BigDecimal("429.00"), "https://images.unsplash.com/photo-1617103996702-96ff29b1c467?auto=format&fit=crop&w=900&q=80", ProductCategory.SINK),
                    new Product("Calacatta Porcelain Tile", "Large-format marble-look tile for luxury spaces.", "Calacatta Porcelain Tile offers premium marble aesthetics with easier maintenance. Suitable for floors and walls, it features subtle veining and anti-slip performance for wet environments.", "Luxury", "Porcelain", new BigDecimal("69.00"), "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=900&q=80", ProductCategory.TILE),
                    new Product("Terra Textured Tile", "Natural-inspired textured tile for accent walls.", "Terra Textured Tile introduces depth through handcrafted-style ridges and warm tones. It is ideal for feature walls in kitchens and bathrooms where tactile character is desired.", "Organic", "Ceramic", new BigDecimal("54.00"), "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=900&q=80", ProductCategory.TILE),
                    new Product("Vertex Pull-Down Tap", "High-arc mixer tap with smooth pull-down spray.", "Vertex Pull-Down Tap combines elegant silhouette with practical flexibility. Switch between aerated stream and spray mode to handle rinsing, prep, and cleanup with precision.", "Modern", "Brass", new BigDecimal("289.00"), "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=900&q=80", ProductCategory.TAP),
                    new Product("Linea Wall-Mount Tap", "Wall-mounted tap for premium minimalist bathrooms.", "Linea Wall-Mount Tap saves counter space while delivering a refined look. Its ceramic cartridge technology ensures controlled water flow and long-term drip-free operation.", "Minimalist", "Brushed Nickel", new BigDecimal("329.00"), "https://images.unsplash.com/photo-1620825937374-87fc7d6bddc2?auto=format&fit=crop&w=900&q=80", ProductCategory.TAP),
                    new Product("RainSphere Shower Set", "Overhead rainfall shower with handheld wand.", "RainSphere Shower Set turns daily routines into spa-like moments with wide-angle water dispersion. The included handheld wand offers focused rinse control and versatile use.", "Spa", "Stainless Steel", new BigDecimal("599.00"), "https://images.unsplash.com/photo-1595514535415-dae3f41f8f9d?auto=format&fit=crop&w=900&q=80", ProductCategory.SHOWER),
                    new Product("Pulse Thermostatic Shower", "Smart thermostatic shower system with safety lock.", "Pulse Thermostatic Shower maintains constant temperature and includes anti-scald protection, making it ideal for family homes that require both comfort and safety.", "Smart", "Chrome", new BigDecimal("739.00"), "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80", ProductCategory.SHOWER)
            );

            productRepository.saveAll(products);
        };
    }
}
