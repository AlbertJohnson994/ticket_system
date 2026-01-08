package org.ufop.web.events.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CreateEventDTO {
    private String title;
    private String description;
    private String location;
    private String category;
    private LocalDateTime eventDate;
    private LocalDateTime endDate;
    private Double price;
    private Integer totalTickets;
    private String imageUrl;
}