package com.gymTrackerProject.gymTracker.service.workout;


import com.gymTrackerProject.gymTracker.dto.WorkoutDTO;
import com.gymTrackerProject.gymTracker.entity.User;
import com.gymTrackerProject.gymTracker.entity.Workout;
import com.gymTrackerProject.gymTracker.repository.UserRepository;
import com.gymTrackerProject.gymTracker.repository.workoutRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkoutServiceImpl implements WorkoutService {
    @Autowired
    private final workoutRepository workoutRepository;
    @Autowired
    private final UserRepository userRepository;

    public WorkoutDTO postWorkout(WorkoutDTO dto) {
        Workout workout = new Workout();

        // Popunjavanje polja iz DTO
        workout.setTrainingDate(dto.getTrainingDate());
        workout.setDescription(dto.getDescription());
        workout.setType(dto.getType());
        workout.setDuration(dto.getDuration());
        workout.setTiredness(dto.getTiredness());
        workout.setCaloriesBurned(dto.getCaloriesBurned());
        workout.setDifficulty(dto.getDifficulty());

        // DOBAVLJANJE TRENUTNO ULOGOVANOG KORISNIKA
        org.springframework.security.core.Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("No authenticated user found");
        }

        Object principal = authentication.getPrincipal();
        String email;

        if (principal instanceof UserDetails) {
            email = ((UserDetails) principal).getUsername();
        } else if (principal instanceof String) {
            email = (String) principal;
        } else {
            throw new RuntimeException("Cannot extract user from principal");
        }

        User user = userRepository.findFirstByEmail(email);
        workout.setUser(user); // OBAVEZNO!!!

        // Čuvanje u bazu
        return workoutRepository.save(workout).getWorkoutDTO();
    }


    public List<WorkoutDTO> getWorkouts() {
        List<Workout> workouts = workoutRepository.findAll();
        return workouts.stream().map(Workout::getWorkoutDTO).collect(Collectors.toList());
    }

    @Override
    public WorkoutDTO getWorkoutById(Long id) {
        // findById vraća Optional<Workout>
        Workout workout = workoutRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Workout not found with id: " + id));

        return workout.getWorkoutDTO();
    }
    public WorkoutDTO updateWorkout(WorkoutDTO dto, Long id) {
        Workout workout = workoutRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Workout not found with id: " + id));
        workout.setDescription(dto.getDescription());
        workout.setType(dto.getType());
        workout.setDuration(dto.getDuration());
        workout.setTiredness(dto.getTiredness());
        workout.setCaloriesBurned(dto.getCaloriesBurned());
        workout.setDifficulty(dto.getDifficulty());
        workout.setTrainingDate(workout.getTrainingDate());

        Workout updatedWorkout = workoutRepository.save(workout);
        return updatedWorkout.getWorkoutDTO();

    }

    public void deleteWorkout(Long id) {
        // Prvo proverimo da li postoji trening sa datim ID
        Workout workout = workoutRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Workout not found with id: " + id));

        // Brišemo trening
        workoutRepository.delete(workout);
    }




    public List<WorkoutDTO> getUserWorkouts() {
        // Dohvati Authentication iz SecurityContext
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("No authenticated user found");
        }

        // Dohvati principal i izvuci email
        Object principal = authentication.getPrincipal();
        String email;

        if (principal instanceof UserDetails) {
            email = ((UserDetails) principal).getUsername(); // ovo je email
        } else if (principal instanceof String) {
            email = (String) principal; // u slučaju da je principal string
        } else {
            throw new RuntimeException("Cannot extract user from principal");
        }

        // Na osnovu email-a dohvatimo user objekat
        User user = userRepository.findFirstByEmail(email);
        if (user == null) {
            throw new RuntimeException("Authenticated user not found in database");
        }

        // Vrati sve workout-e za tog user-a
        return workoutRepository.findByUser_Id(user.getId())
                .stream()
                .map(Workout::getWorkoutDTO)
                .toList();
    }






}
