package org.ufop.web.salesservice.sales.dto;

import org.ufop.web.salesservice.sales.model.Sale;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class CreateSaleDTO {
    @NotBlank(message = "User ID is required")
    private String userId;

    @NotNull(message = "Event ID is required")
    private UUID eventId;

    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity = 1;

    @NotNull(message = "Sale status is required")
    private Sale.SaleStatus saleStatus = Sale.SaleStatus.PENDING;

    @NotNull(message = "Payment method is required")
    private Sale.PaymentMethod paymentMethod = Sale.PaymentMethod.CREDIT_CARD;

    private String notes;
}