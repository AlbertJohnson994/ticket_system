package org.ufop.web.salesservice.sales.controller;

import org.ufop.web.salesservice.sales.dto.CreateSaleDTO;
import org.ufop.web.salesservice.sales.dto.SaleDTO;
import org.ufop.web.salesservice.sales.model.Sale;
import org.ufop.web.salesservice.sales.service.SaleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/sales")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SaleController {

    private final SaleService saleService;

    @PostMapping
    public ResponseEntity<SaleDTO> createSale(@Valid @RequestBody CreateSaleDTO dto) {
        SaleDTO createdSale = saleService.createSale(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdSale);
    }

    @GetMapping
    public ResponseEntity<List<SaleDTO>> getAllSales() {
        List<SaleDTO> sales = saleService.getAllSales();
        return ResponseEntity.ok(sales);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SaleDTO> getSaleById(@PathVariable UUID id) {
        SaleDTO sale = saleService.getSaleById(id);
        return ResponseEntity.ok(sale);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<SaleDTO> updateSaleStatus(
            @PathVariable UUID id,
            @RequestParam Sale.SaleStatus status) {
        SaleDTO updatedSale = saleService.updateSaleStatus(id, status);
        return ResponseEntity.ok(updatedSale);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSale(@PathVariable UUID id) {
        saleService.deleteSale(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SaleDTO>> getSalesByUserId(@PathVariable String userId) {
        List<SaleDTO> sales = saleService.getSalesByUserId(userId);
        return ResponseEntity.ok(sales);
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getSalesStats() {
        return ResponseEntity.ok(saleService.getSalesStats());
    }

    @GetMapping("/revenue")
    public ResponseEntity<Double> getTotalRevenue() {
        Double revenue = saleService.getTotalRevenue();
        return ResponseEntity.ok(revenue);
    }
}