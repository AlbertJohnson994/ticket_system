package org.ufop.web.salesservice.sales.service;

import org.ufop.web.salesservice.sales.dto.PaymentRequestDTO;
import org.ufop.web.salesservice.sales.model.Payment;
import org.ufop.web.salesservice.sales.model.Sale;
import org.ufop.web.salesservice.sales.repository.PaymentRepository;
import org.ufop.web.salesservice.sales.repository.SaleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final SaleRepository saleRepository;
    private final SaleService saleService;

    @Transactional
    public Payment processCreditCardPayment(PaymentRequestDTO dto) {
        Sale sale = saleRepository.findById(dto.getSaleId())
                .orElseThrow(() -> new IllegalArgumentException("Sale not found"));

        if (sale.getSaleStatus() == Sale.SaleStatus.PAID) {
            throw new IllegalStateException("Sale is already paid");
        }

        // Simulate payment processing
        boolean paymentSuccessful = simulatePaymentProcessing(dto.getCardData());

        Payment payment = new Payment();
        payment.setId(UUID.randomUUID());
        payment.setSaleId(sale.getId());
        payment.setStatus(paymentSuccessful ? Payment.PaymentStatus.COMPLETED : Payment.PaymentStatus.FAILED);
        payment.setPaymentMethod(Payment.PaymentMethod.CREDIT_CARD);
        payment.setAmount(sale.getTotalAmount());
        payment.setTransactionId(generateTransactionId());
        payment.setCardLastFour(extractLastFour(dto.getCardData().getCardNumber()));
        payment.setCardBrand(detectCardBrand(dto.getCardData().getCardNumber()));
        payment.setInstallments(dto.getCardData().getInstallments());
        payment.setCreatedAt(LocalDateTime.now());
        payment.setProcessedAt(LocalDateTime.now());
        payment.setPaymentDetails("Credit card payment processed");

        Payment savedPayment = paymentRepository.save(payment);

        if (paymentSuccessful) {
            saleService.updateSaleStatus(sale.getId(), Sale.SaleStatus.PAID);
        }

        return savedPayment;
    }

    @Transactional
    public Payment processDebitCardPayment(PaymentRequestDTO dto) {
        Sale sale = saleRepository.findById(dto.getSaleId())
                .orElseThrow(() -> new IllegalArgumentException("Sale not found"));

        if (sale.getSaleStatus() == Sale.SaleStatus.PAID) {
            throw new IllegalStateException("Sale is already paid");
        }

        // Simulate payment processing
        boolean paymentSuccessful = simulatePaymentProcessing(dto.getCardData());

        Payment payment = new Payment();
        payment.setId(UUID.randomUUID());
        payment.setSaleId(sale.getId());
        payment.setStatus(paymentSuccessful ? Payment.PaymentStatus.COMPLETED : Payment.PaymentStatus.FAILED);
        payment.setPaymentMethod(Payment.PaymentMethod.DEBIT_CARD);
        payment.setAmount(sale.getTotalAmount());
        payment.setTransactionId(generateTransactionId());
        payment.setCardLastFour(extractLastFour(dto.getCardData().getCardNumber()));
        payment.setCardBrand(detectCardBrand(dto.getCardData().getCardNumber()));
        payment.setCreatedAt(LocalDateTime.now());
        payment.setProcessedAt(LocalDateTime.now());
        payment.setPaymentDetails("Debit card payment processed");

        Payment savedPayment = paymentRepository.save(payment);

        if (paymentSuccessful) {
            saleService.updateSaleStatus(sale.getId(), Sale.SaleStatus.PAID);
        }

        return savedPayment;
    }

    @Transactional
    public Payment generatePixPayment(PaymentRequestDTO dto) {
        Sale sale = saleRepository.findById(dto.getSaleId())
                .orElseThrow(() -> new IllegalArgumentException("Sale not found"));

        if (sale.getSaleStatus() == Sale.SaleStatus.PAID) {
            throw new IllegalStateException("Sale is already paid");
        }

        Payment payment = new Payment();
        payment.setId(UUID.randomUUID());
        payment.setSaleId(sale.getId());
        payment.setStatus(Payment.PaymentStatus.PENDING);
        payment.setPaymentMethod(Payment.PaymentMethod.PIX);
        payment.setAmount(sale.getTotalAmount());
        payment.setTransactionId(generateTransactionId());
        payment.setPixKey(dto.getPixKey() != null ? dto.getPixKey() : generateRandomPixKey());
        payment.setPixQrCode(generatePixQrCode(payment.getPixKey(), sale.getTotalAmount()));
        payment.setPixExpiration(LocalDateTime.now().plusMinutes(30));
        payment.setCreatedAt(LocalDateTime.now());
        payment.setPaymentDetails("PIX payment generated");

        return paymentRepository.save(payment);
    }

    @Transactional
    public Payment confirmPixPayment(UUID paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found"));

        if (payment.getStatus() != Payment.PaymentStatus.PENDING) {
            throw new IllegalStateException("Payment is not pending");
        }

        payment.setStatus(Payment.PaymentStatus.COMPLETED);
        payment.setProcessedAt(LocalDateTime.now());

        Payment updatedPayment = paymentRepository.save(payment);

        saleService.updateSaleStatus(payment.getSaleId(), Sale.SaleStatus.PAID);

        return updatedPayment;
    }

    @Transactional
    public Payment refundPayment(UUID paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found"));

        if (payment.getStatus() != Payment.PaymentStatus.COMPLETED) {
            throw new IllegalStateException("Only completed payments can be refunded");
        }

        payment.setStatus(Payment.PaymentStatus.REFUNDED);

        Payment refundedPayment = paymentRepository.save(payment);

        saleService.updateSaleStatus(payment.getSaleId(), Sale.SaleStatus.REFUNDED);

        return refundedPayment;
    }

    @Transactional(readOnly = true)
    public Optional<Payment> getPaymentBySaleId(UUID saleId) {
        return paymentRepository.findBySaleId(saleId);
    }

    @Transactional(readOnly = true)
    public Optional<Payment> getPaymentById(UUID id) {
        return paymentRepository.findById(id);
    }

    private boolean simulatePaymentProcessing(PaymentRequestDTO.CardDataDTO cardData) {
        // In a real application, this would integrate with a payment gateway
        // For simulation, we'll accept all payments
        log.info("Simulating payment processing for card ending in: {}",
                extractLastFour(cardData.getCardNumber()));
        return true;
    }

    private String generateTransactionId() {
        return "TXN" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private String extractLastFour(String cardNumber) {
        if (cardNumber == null || cardNumber.length() < 4) {
            return "****";
        }
        return cardNumber.replaceAll("\\s", "").substring(cardNumber.length() - 4);
    }

    private String detectCardBrand(String cardNumber) {
        String cleaned = cardNumber.replaceAll("\\s", "");

        if (cleaned.startsWith("4")) {
            return "VISA";
        } else if (cleaned.startsWith("5")) {
            return "MASTERCARD";
        } else if (cleaned.startsWith("34") || cleaned.startsWith("37")) {
            return "AMEX";
        } else if (cleaned.startsWith("6")) {
            return "DISCOVER";
        } else {
            return "UNKNOWN";
        }
    }

    private String generateRandomPixKey() {
        return "PIX-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private String generatePixQrCode(String pixKey, Double amount) {
        // In a real application, generate actual QR code
        // For simulation, return a data URL with a placeholder
        return "data:image/svg+xml;base64," +
                java.util.Base64.getEncoder().encodeToString(
                        ("<svg><text>PIX: " + pixKey + " - R$ " + amount + "</text></svg>").getBytes()
                );
    }
}