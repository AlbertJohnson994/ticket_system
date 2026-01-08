package org.ufop.web.salesservice.sales.service;


import org.ufop.web.salesservice.sales.client.EventDTO;
import org.ufop.web.salesservice.sales.client.EventsServiceClient;
import org.ufop.web.salesservice.sales.dto.CreateSaleDTO;
import org.ufop.web.salesservice.sales.dto.SaleDTO;
import org.ufop.web.salesservice.sales.model.Sale;
import org.ufop.web.salesservice.sales.repository.SaleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SaleService {

    private final SaleRepository saleRepository;
    private final EventsServiceClient eventsServiceClient;

    @Transactional
    public SaleDTO createSale(CreateSaleDTO dto) {
        log.info("Creating sale for user: {}, event: {}", dto.getUserId(), dto.getEventId());

        // Check if event exists
        Boolean eventExists = eventsServiceClient.checkEventExists(dto.getEventId());
        if (eventExists == null || !eventExists) {
            throw new IllegalArgumentException("Event not found with ID: " + dto.getEventId());
        }

        // Get event details
        var event = eventsServiceClient.getEventById(dto.getEventId());

        // Calculate total amount
        double totalAmount = event.getPrice() * dto.getQuantity();

        // Create sale
        Sale sale = new Sale();
        sale.setId(UUID.randomUUID());
        sale.setUserId(dto.getUserId());
        sale.setEventId(dto.getEventId());
        sale.setQuantity(dto.getQuantity());
        sale.setTotalAmount(totalAmount);
        sale.setSaleStatus(dto.getSaleStatus());
        sale.setPaymentMethod(dto.getPaymentMethod());
        sale.setSaleDate(LocalDateTime.now());
        sale.setNotes(dto.getNotes());

        if (dto.getSaleStatus() == Sale.SaleStatus.PAID) {
            boolean reserved = eventsServiceClient.reserveTickets(dto.getEventId(), dto.getQuantity());
            if (!reserved) {
                throw new IllegalStateException("Could not reserve tickets. They might have sold out.");
            }
            sale.setPaymentDate(LocalDateTime.now());
        }

        Sale savedSale = saleRepository.save(sale);

        return convertToDTO(savedSale, event);
    }

    @Transactional(readOnly = true)
    public List<SaleDTO> getAllSales() {
        return saleRepository.findAll().stream()
                .map(sale -> {
                    try {
                        var event = eventsServiceClient.getEventById(sale.getEventId());
                        return convertToDTO(sale, event);
                    } catch (Exception e) {
                        log.warn("Could not fetch event details for sale: {}", sale.getId(), e);
                        return convertToDTO(sale, null);
                    }
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SaleDTO getSaleById(UUID id) {
        Sale sale = saleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Sale not found with ID: " + id));

        try {
            var event = eventsServiceClient.getEventById(sale.getEventId());
            return convertToDTO(sale, event);
        } catch (Exception e) {
            log.warn("Could not fetch event details for sale: {}", sale.getId(), e);
            return convertToDTO(sale, null);
        }
    }

    @Transactional
    public SaleDTO updateSaleStatus(UUID id, Sale.SaleStatus newStatus) {
        Sale sale = saleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Sale not found with ID: " + id));

        sale.setSaleStatus(newStatus);

        if (newStatus == Sale.SaleStatus.PAID) {
            sale.setPaymentDate(LocalDateTime.now());
        } else if (newStatus == Sale.SaleStatus.CANCELLED) {
            sale.setCancellationDate(LocalDateTime.now());
        }

        Sale updatedSale = saleRepository.save(sale);

        try {
            var event = eventsServiceClient.getEventById(updatedSale.getEventId());
            return convertToDTO(updatedSale, event);
        } catch (Exception e) {
            log.warn("Could not fetch event details for sale: {}", updatedSale.getId(), e);
            return convertToDTO(updatedSale, null);
        }
    }

    @Transactional
    public void deleteSale(UUID id) {
        if (!saleRepository.existsById(id)) {
            throw new IllegalArgumentException("Sale not found with ID: " + id);
        }
        saleRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<SaleDTO> getSalesByUserId(String userId) {
        return saleRepository.findByUserId(userId).stream()
                .map(sale -> {
                    try {
                        var event = eventsServiceClient.getEventById(sale.getEventId());
                        return convertToDTO(sale, event);
                    } catch (Exception e) {
                        log.warn("Could not fetch event details for sale: {}", sale.getId(), e);
                        return convertToDTO(sale, null);
                    }
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Double getTotalRevenue() {
        return saleRepository.getTotalRevenue();
    }

    @Transactional(readOnly = true)
    public Object getSalesStats() {
        return new Object() {
            public final Long totalSales = saleRepository.count();
            public final Long paidSales = saleRepository.getPaidSalesCount();
            public final Double totalRevenue = saleRepository.getTotalRevenue();
            public final Object salesByStatus = saleRepository.getSalesByStatus().stream()
                    .collect(Collectors.toMap(
                            arr -> arr[0].toString(),
                            arr -> arr[1]
                    ));
        };
    }

    private SaleDTO convertToDTO(Sale sale, EventDTO event) {
        SaleDTO dto = new SaleDTO();
        dto.setId(sale.getId());
        dto.setUserId(sale.getUserId());
        dto.setEventId(sale.getEventId());
        dto.setQuantity(sale.getQuantity());
        dto.setTotalAmount(sale.getTotalAmount());
        dto.setSaleStatus(sale.getSaleStatus());
        dto.setPaymentMethod(sale.getPaymentMethod());
        dto.setSaleDate(sale.getSaleDate());
        dto.setPaymentDate(sale.getPaymentDate());
        dto.setNotes(sale.getNotes());

        if (event != null) {
            dto.setEventDescription(event.getDescription());
            dto.setEventDate(event.getDate());
            dto.setEventPrice(event.getPrice());
        }

        return dto;
    }
}