package org.ufop.web.events.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventDTO {
    private UUID id;
    private String title;
    private String description;
    private String location;
    private String category;
    private LocalDateTime eventDate;
    private LocalDateTime endDate;
    private Double price;
    private Integer totalTickets;
    private Integer availableTickets;
    private String imageUrl;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}