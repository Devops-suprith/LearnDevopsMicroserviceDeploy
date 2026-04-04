package com.devops.order.client;

import com.devops.order.dto.ProductDTO;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Component
public class ProductClient {

    private final WebClient webClient;

    public ProductClient(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("http://product-service:8084").build();
    }

    public ProductDTO getProduct(Long productId) {
        return webClient.get()
                .uri("/api/products/{id}", productId)
                .retrieve()
                .bodyToMono(ProductDTO.class)
                .block();
    }

    public boolean reduceStock(Long productId, int quantity) {
        Map<String, Boolean> result = webClient.put()
                .uri(uriBuilder -> uriBuilder
                        .path("/api/products/{id}/reduce-stock")
                        .queryParam("quantity", quantity)
                        .build(productId))
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        return result != null && Boolean.TRUE.equals(result.get("success"));
    }
}
