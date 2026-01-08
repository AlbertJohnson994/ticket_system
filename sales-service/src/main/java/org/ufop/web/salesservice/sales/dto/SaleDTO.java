package org.ufop.web.salesservice.sales.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import org.ufop.web.salesservice.sales.model.Sale;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SaleDTO {
    private UUID id;
    private String userId;
    private UUID eventId;
    private Integer quantity;
    private Double totalAmount;
    private Sale.SaleStatus saleStatus;
    private Sale.PaymentMethod paymentMethod;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime saleDate;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime paymentDate;

    private String notes;

    // Event details (populated from Events service)
    private String eventDescription;
    private LocalDateTime eventDate;
    private Double eventPrice;

    // User details (populated from Users service)
    private String userName;
    private String userEmail;
}