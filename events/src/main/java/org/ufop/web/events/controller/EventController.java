package org.ufop.web.events.controller;

import org.ufop.web.events.dto.CreateEventDTO;
import org.ufop.web.events.dto.EventDTO;
import org.ufop.web.events.model.Event;
import org.ufop.web.events.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EventController {

    private final EventService eventService;

    @PostMapping
    public ResponseEntity<EventDTO> createEvent(@Valid @RequestBody CreateEventDTO dto) {
        EventDTO createdEvent = eventService.createEvent(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdEvent);
    }

    @GetMapping
    public ResponseEntity<List<EventDTO>> getAllEvents() {
        List<EventDTO> events = eventService.getAllEvents();
        return ResponseEntity.ok(events);
    }

    @GetMapping("/available")
    public ResponseEntity<List<EventDTO>> getAvailableEvents() {
        List<EventDTO> events = eventService.getAvailableEvents();
        return ResponseEntity.ok(events);
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<EventDTO>> getUpcomingEvents() {
        List<EventDTO> events = eventService.getUpcomingEvents();
        return ResponseEntity.ok(events);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<EventDTO>> getEventsByCategory(@PathVariable String category) {
        List<EventDTO> events = eventService.getEventsByCategory(category);
        return ResponseEntity.ok(events);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventDTO> getEventById(@PathVariable UUID id) {
        EventDTO event = eventService.getEventById(id);
        return ResponseEntity.ok(event);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventDTO> updateEvent(
            @PathVariable UUID id,
            @Valid @RequestBody CreateEventDTO dto) {
        EventDTO updatedEvent = eventService.updateEvent(id, dto);
        return ResponseEntity.ok(updatedEvent);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<EventDTO> updateEventStatus(
            @PathVariable UUID id,
            @RequestParam Event.EventStatus status) {
        EventDTO updatedEvent = eventService.updateEventStatus(id, status);
        return ResponseEntity.ok(updatedEvent);
    }

    @PostMapping("/{id}/reserve-tickets")
    public ResponseEntity<Boolean> reserveTickets(
            @PathVariable UUID id,
            @RequestParam int quantity) {
        boolean success = eventService.reserveTickets(id, quantity);
        return ResponseEntity.ok(success);
    }

    @GetMapping("/{id}/exists")
    public ResponseEntity<Boolean> checkEventExists(@PathVariable UUID id) {
        try {
            eventService.getEventById(id);
            return ResponseEntity.ok(true);
        } catch (Exception e) {
            return ResponseEntity.ok(false);
        }
    }

    @PostMapping("/{id}/release-tickets")
    public ResponseEntity<Void> releaseTickets(
            @PathVariable UUID id,
            @RequestParam int quantity) {
        eventService.releaseTickets(id, quantity);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable UUID id) {
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<EventDTO>> searchEvents(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String category) {
        // This is a simplified search - you would implement a proper search service
        List<EventDTO> allEvents = eventService.getAllEvents();

        List<EventDTO> filteredEvents = allEvents.stream()
                .filter(event ->
                        (title == null || event.getTitle().toLowerCase().contains(title.toLowerCase())) &&
                                (location == null || event.getLocation().toLowerCase().contains(location.toLowerCase())) &&
                                (category == null || event.getCategory().equalsIgnoreCase(category))
                )
                .collect(java.util.stream.Collectors.toList());

        return ResponseEntity.ok(filteredEvents);
    }
}