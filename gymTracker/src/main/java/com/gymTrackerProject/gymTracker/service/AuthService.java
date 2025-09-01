package com.gymTrackerProject.gymTracker.service;

import com.gymTrackerProject.gymTracker.dto.RegisterRequestDTO;
import com.gymTrackerProject.gymTracker.dto.UserDTO;

public interface AuthService {
    UserDTO createUser(RegisterRequestDTO dto);
}
