package com.gymTrackerProject.gymTracker.service;

import com.gymTrackerProject.gymTracker.dto.RegisterRequestDTO;
import com.gymTrackerProject.gymTracker.dto.UserDTO;
import com.gymTrackerProject.gymTracker.entity.User;
import com.gymTrackerProject.gymTracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public UserDTO createUser(RegisterRequestDTO dto) {
        // 1️⃣ Provera da li email već postoji
        if (emailExists(dto.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        // 2️⃣ Provera obaveznih polja
        if (dto.getFirstName() == null || dto.getFirstName().isBlank() ||
                dto.getLastName() == null || dto.getLastName().isBlank() ||
                dto.getEmail() == null || dto.getEmail().isBlank() ||
                dto.getPassword() == null || dto.getPassword().isBlank()) {
            throw new IllegalArgumentException("All fields are required");
        }

        // 3️⃣ Provera email formata
        if (!dto.getEmail().matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {
            throw new IllegalArgumentException("Invalid email format");
        }

        // 4️⃣ Provera jačine lozinke
        if (dto.getPassword().length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters long");
        }

        // 5️⃣ Kreiranje korisnika
        User user = new User();
        user.setEmail(dto.getEmail());
        user.setFirstname(dto.getFirstName());
        user.setLastname(dto.getLastName());
        user.setPassword(new BCryptPasswordEncoder().encode(dto.getPassword())); // hash lozinke

        User createdUser = userRepository.save(user);

        // 6️⃣ Priprema DTO za povrat
        UserDTO userDTO = new UserDTO();
        userDTO.setId(createdUser.getId());
        userDTO.setEmail(createdUser.getEmail());
        userDTO.setFirstName(createdUser.getFirstname());
        userDTO.setLastName(createdUser.getLastname());
        // Lozinka se ne vraća

        return userDTO;
    }

}