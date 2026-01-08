package org.ufop.web.salesservice.sales.controller;

import org.ufop.web.salesservice.sales.dto.CreateSaleDTO;
import org.ufop.web.salesservice.sales.model.Sale;
import org.ufop.web.salesservice.sales.service.SaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/seed")
@RequiredArgsConstructor
public class SeedController {

    private final SaleService saleService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> seedDatabase() {
        Map<String, Object> response = new HashMap<>();

        try {
            // Create sample sales
            List<String> userIds = Arrays.asList(
                    "user-001", "user-002", "user-003", "user-004", "user-005",
                    "user-006", "user-007", "user-008", "user-009", "user-010"
            );

            // Sample event IDs (these should exist in events service)
            List<UUID> eventIds = Arrays.asList(
                    UUID.fromString("f47ac10b-58cc-4372-a567-0e02b2c3d479"),
                    UUID.fromString("550e8400-e29b-41d4-a716-446655440000"),
                    UUID.fromString("6ba7b810-9dad-11d1-80b4-00c04fd430c8"),
                    UUID.fromString("6ba7b811-9dad-11d1-80b4-00c04fd430c8"),
                    UUID.fromString("6ba7b812-9dad-11d1-80b4-00c04fd430c8")
            );

            List<Sale.PaymentMethod> paymentMethods = Arrays.asList(
                    Sale.PaymentMethod.CREDIT_CARD,
                    Sale.PaymentMethod.DEBIT_CARD,
                    Sale.PaymentMethod.PIX,
                    Sale.PaymentMethod.CASH
            );

            Random random = new Random();

            for (int i = 0; i < 20; i++) {
                CreateSaleDTO dto = new CreateSaleDTO();
                dto.setUserId(userIds.get(random.nextInt(userIds.size())));
                dto.setEventId(eventIds.get(random.nextInt(eventIds.size())));
                dto.setQuantity(random.nextInt(4) + 1);
                dto.setSaleStatus(i % 3 == 0 ? Sale.SaleStatus.PENDING :
                        i % 5 == 0 ? Sale.SaleStatus.CANCELLED :
                                Sale.SaleStatus.PAID);
                dto.setPaymentMethod(paymentMethods.get(random.nextInt(paymentMethods.size())));
                dto.setNotes("Sample sale #" + (i + 1));

                saleService.createSale(dto);
            }

            response.put("success", true);
            response.put("message", "Database seeded successfully with 20 sample sales");
            response.put("timestamp", LocalDateTime.now().toString());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to seed database: " + e.getMessage());
            response.put("timestamp", LocalDateTime.now().toString());

            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "sales-service");
        response.put("timestamp", LocalDateTime.now().toString());
        response.put("database", "SQLite");
        return ResponseEntity.ok(response);
    }
}