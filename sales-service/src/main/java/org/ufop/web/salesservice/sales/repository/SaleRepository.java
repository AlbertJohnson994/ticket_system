package org.ufop.web.salesservice.sales.repository;

import org.ufop.web.salesservice.sales.model.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SaleRepository extends JpaRepository<Sale, UUID> {

    List<Sale> findByUserId(String userId);

    List<Sale> findByEventId(UUID eventId);

    List<Sale> findBySaleStatus(Sale.SaleStatus status);

    @Query("SELECT s FROM Sale s WHERE s.saleStatus = 'PAID'")
    List<Sale> findPaidSales();

    @Query("SELECT COALESCE(SUM(s.totalAmount), 0) FROM Sale s WHERE s.saleStatus = 'PAID'")
    Double getTotalRevenue();

    @Query("SELECT COUNT(s) FROM Sale s WHERE s.saleStatus = 'PAID'")
    Long getPaidSalesCount();

    @Query("SELECT s.saleStatus, COUNT(s) FROM Sale s GROUP BY s.saleStatus")
    List<Object[]> getSalesByStatus();
}