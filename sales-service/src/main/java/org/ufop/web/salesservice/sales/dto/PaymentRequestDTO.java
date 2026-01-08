package org.ufop.web.salesservice.sales.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class PaymentRequestDTO {
    @NotNull(message = "Sale ID is required")
    private UUID saleId;

    private CardDataDTO cardData;
    private String pixKey;

    @Data
    public static class CardDataDTO {
        @NotBlank(message = "Card number is required")
        private String cardNumber;

        @NotBlank(message = "Card holder name is required")
        private String cardHolder;

        @NotBlank(message = "Card expiry is required")
        private String cardExpiry;

        @NotBlank(message = "CVV is required")
        private String cardCvv;

        private Integer installments = 1;
    }
}