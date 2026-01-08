package org.ufop.web.salesservice.sales.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.UUID;

@FeignClient(name = "events-service", url = "${events.service.url:http://localhost:5001}")
public interface EventsServiceClient {

    @GetMapping("/api/events/{id}")
    EventDTO getEventById(@PathVariable("id") UUID id);

    @GetMapping("/api/events/{id}/exists")
    Boolean checkEventExists(@PathVariable("id") UUID id);

    @PostMapping("/api/events/{id}/reserve-tickets")
    Boolean reserveTickets(@PathVariable("id") UUID id, @RequestParam("quantity") int quantity);
}
