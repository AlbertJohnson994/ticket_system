package org.ufop.web.events.repository;

import org.ufop.web.events.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface EventRepository extends JpaRepository<Event, UUID> {

    List<Event> findByStatus(Event.EventStatus status);

    List<Event> findByCategory(String category);

    List<Event> findByEventDateAfter(LocalDateTime date);

    List<Event> findByEventDateBetween(LocalDateTime start, LocalDateTime end);

    List<Event> findByLocationContainingIgnoreCase(String location);

    List<Event> findByTitleContainingIgnoreCase(String title);

    @Query("SELECT e FROM Event e WHERE e.availableTickets > 0 AND e.status = 'ACTIVE'")
    List<Event> findAvailableEvents();

    @Query("SELECT COUNT(e) FROM Event e WHERE e.status = 'ACTIVE'")
    Long countActiveEvents();

    @Query("SELECT e.category, COUNT(e) FROM Event e GROUP BY e.category")
    List<Object[]> countEventsByCategory();
}