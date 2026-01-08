package org.ufop.web.events.service;

import org.ufop.web.events.dto.CreateEventDTO;
import org.ufop.web.events.dto.EventDTO;
import org.ufop.web.events.model.Event;
import org.ufop.web.events.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;

    public EventDTO createEvent(CreateEventDTO dto) {
        Event event = new Event();
        event.setTitle(dto.getTitle());
        event.setDescription(dto.getDescription());
        event.setLocation(dto.getLocation());
        event.setCategory(dto.getCategory());
        event.setEventDate(dto.getEventDate());
        event.setEndDate(dto.getEndDate());
        event.setPrice(dto.getPrice());
        event.setTotalTickets(dto.getTotalTickets());
        event.setAvailableTickets(dto.getTotalTickets());
        event.setImageUrl(dto.getImageUrl());
        event.setStatus(Event.EventStatus.ACTIVE);

        Event savedEvent = eventRepository.save(event);
        return convertToDTO(savedEvent);
    }

    public List<EventDTO> getAllEvents() {
        return eventRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public EventDTO getEventById(UUID id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        return convertToDTO(event);
    }

    public List<EventDTO> getAvailableEvents() {
        return eventRepository.findAvailableEvents()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<EventDTO> getEventsByCategory(String category) {
        return eventRepository.findByCategory(category)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<EventDTO> getUpcomingEvents() {
        return eventRepository.findByEventDateAfter(LocalDateTime.now())
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public EventDTO updateEvent(UUID id, CreateEventDTO dto) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        event.setTitle(dto.getTitle());
        event.setDescription(dto.getDescription());
        event.setLocation(dto.getLocation());
        event.setCategory(dto.getCategory());
        event.setEventDate(dto.getEventDate());
        event.setEndDate(dto.getEndDate());
        event.setPrice(dto.getPrice());

        // Update total tickets carefully
        if (!dto.getTotalTickets().equals(event.getTotalTickets())) {
            int ticketDifference = dto.getTotalTickets() - event.getTotalTickets();
            event.setTotalTickets(dto.getTotalTickets());
            event.setAvailableTickets(event.getAvailableTickets() + ticketDifference);
        }

        event.setImageUrl(dto.getImageUrl());

        Event updatedEvent = eventRepository.save(event);
        return convertToDTO(updatedEvent);
    }

    public EventDTO updateEventStatus(UUID id, Event.EventStatus status) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        event.setStatus(status);

        if (status == Event.EventStatus.SOLD_OUT) {
            event.setAvailableTickets(0);
        }

        Event updatedEvent = eventRepository.save(event);
        return convertToDTO(updatedEvent);
    }

    public boolean reserveTickets(UUID eventId, int quantity) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (event.getAvailableTickets() < quantity) {
            return false;
        }

        event.setAvailableTickets(event.getAvailableTickets() - quantity);

        // Auto-update status if sold out
        if (event.getAvailableTickets() == 0) {
            event.setStatus(Event.EventStatus.SOLD_OUT);
        }

        eventRepository.save(event);
        return true;
    }

    public void releaseTickets(UUID eventId, int quantity) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        event.setAvailableTickets(event.getAvailableTickets() + quantity);

        // If tickets were released and event was sold out, make it active again
        if (event.getStatus() == Event.EventStatus.SOLD_OUT && event.getAvailableTickets() > 0) {
            event.setStatus(Event.EventStatus.ACTIVE);
        }

        eventRepository.save(event);
    }

    public void deleteEvent(UUID id) {
        if (!eventRepository.existsById(id)) {
            throw new RuntimeException("Event not found");
        }
        eventRepository.deleteById(id);
    }

    private EventDTO convertToDTO(Event event) {
        return new EventDTO(
                event.getId(),
                event.getTitle(),
                event.getDescription(),
                event.getLocation(),
                event.getCategory(),
                event.getEventDate(),
                event.getEndDate(),
                event.getPrice(),
                event.getTotalTickets(),
                event.getAvailableTickets(),
                event.getImageUrl(),
                event.getStatus().name(),
                event.getCreatedAt(),
                event.getUpdatedAt()
        );
    }
}