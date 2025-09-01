package com.gymTrackerProject.gymTracker.controller;

import com.gymTrackerProject.gymTracker.dto.RegisterRequestDTO;
import com.gymTrackerProject.gymTracker.dto.UserDTO;
import com.gymTrackerProject.gymTracker.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.web.bind.annotation.RestController;

@RestController

public class RegisterUserController {

    @Autowired
    private AuthService authService;
    @PostMapping("/register")
    public ResponseEntity<?> createUser(@RequestBody RegisterRequestDTO dto) {
        try {
            UserDTO createdUser = authService.createUser(dto);
            return ResponseEntity.ok(createdUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Something went wrong");
        }
    }
}
