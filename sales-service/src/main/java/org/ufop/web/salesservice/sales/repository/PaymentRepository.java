package org.ufop.web.salesservice.sales.repository;

import org.ufop.web.salesservice.sales.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {

    Optional<Payment> findBySaleId(UUID saleId);

    Optional<Payment> findByTransactionId(String transactionId);
}