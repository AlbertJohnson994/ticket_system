package org.ufop.web.salesservice.sales.controller;

import org.ufop.web.salesservice.sales.dto.PaymentRequestDTO;
import org.ufop.web.salesservice.sales.model.Payment;
import org.ufop.web.salesservice.sales.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/credit-card")
    public ResponseEntity<Payment> processCreditCardPayment(@Valid @RequestBody PaymentRequestDTO dto) {
        Payment payment = paymentService.processCreditCardPayment(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(payment);
    }

    @PostMapping("/debit-card")
    public ResponseEntity<Payment> processDebitCardPayment(@Valid @RequestBody PaymentRequestDTO dto) {
        Payment payment = paymentService.processDebitCardPayment(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(payment);
    }

    @PostMapping("/pix/generate")
    public ResponseEntity<Payment> generatePixPayment(@Valid @RequestBody PaymentRequestDTO dto) {
        Payment payment = paymentService.generatePixPayment(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(payment);
    }

    @PostMapping("/pix/confirm/{paymentId}")
    public ResponseEntity<Payment> confirmPixPayment(@PathVariable UUID paymentId) {
        Payment payment = paymentService.confirmPixPayment(paymentId);
        return ResponseEntity.ok(payment);
    }

    @GetMapping("/pix/status/{paymentId}")
    public ResponseEntity<Payment> getPixPaymentStatus(@PathVariable UUID paymentId) {
        Optional<Payment> payment = paymentService.getPaymentById(paymentId);
        return payment.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/refund/{paymentId}")
    public ResponseEntity<Payment> refundPayment(@PathVariable UUID paymentId) {
        Payment payment = paymentService.refundPayment(paymentId);
        return ResponseEntity.ok(payment);
    }

    @GetMapping("/sale/{saleId}")
    public ResponseEntity<Payment> getPaymentBySaleId(@PathVariable UUID saleId) {
        Optional<Payment> payment = paymentService.getPaymentBySaleId(saleId);
        return payment.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable UUID id) {
        Optional<Payment> payment = paymentService.getPaymentById(id);
        return payment.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}