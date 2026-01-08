package org.ufop.web.salesservice.sales.client;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class EventDTO {
    private UUID id;
    private String description;
    private Integer type;
    private String typeName;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime date;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime startSales;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime endSales;

    private Double price;
    private Integer availableTickets;
    private Integer soldTickets;
}
