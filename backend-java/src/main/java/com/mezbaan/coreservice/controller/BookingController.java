package com.mezbaan.coreservice.controller;

import com.mezbaan.coreservice.entity.Booking;
import com.mezbaan.coreservice.entity.RestaurantTable;
import com.mezbaan.coreservice.repository.BookingRepository;
import com.mezbaan.coreservice.repository.RestaurantTableRepository;
import com.mezbaan.coreservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired private BookingRepository bookingRepository;
    @Autowired private RestaurantTableRepository tableRepository;
    @Autowired private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request) {
        System.out.println("Received booking request for Table ID: " + request.tableId());

        // 1. Find the requested table in the database
        RestaurantTable table = tableRepository.findById(request.tableId())
                .orElseThrow(() -> new RuntimeException("Table not found"));

        // 2. Prevent double-booking
        if ("OCCUPIED".equalsIgnoreCase(table.getStatus())) {
            return ResponseEntity.status(400).body(Map.of("error", "Table is already occupied!"));
        }

        // 3. Mark the table as OCCUPIED
        table.setStatus("OCCUPIED");
        tableRepository.save(table);

        // 4. Create the official Booking receipt in the database
        Booking booking = new Booking();
        // Hardcoding User ID 1 (Our Super Admin) for this test
        booking.setUser(userRepository.findById(1L).orElseThrow()); 
        booking.setTable(table);
        booking.setBookingTime(LocalDateTime.now());
        booking.setStatus("CONFIRMED");
        bookingRepository.save(booking);

        return ResponseEntity.ok(Map.of(
            "message", "Booking Confirmed Successfully!",
            "bookingId", booking.getId(),
            "tableNumber", table.getTableNumber()
        ));
    }

    public record BookingRequest(Long tableId, String date, String timeSlot) {}
}
