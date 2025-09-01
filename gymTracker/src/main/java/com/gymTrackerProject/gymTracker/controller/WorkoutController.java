package com.gymTrackerProject.gymTracker.controller;

import com.gymTrackerProject.gymTracker.dto.WorkoutDTO;
import com.gymTrackerProject.gymTracker.repository.UserRepository;
import com.gymTrackerProject.gymTracker.service.workout.WorkoutService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController

@RequiredArgsConstructor
@CrossOrigin("*")
public class WorkoutController {
    private final WorkoutService workoutService;
    private final UserRepository userRepository;


    @PostMapping("/workouts")
    public ResponseEntity<WorkoutDTO> postWorkout(@RequestBody WorkoutDTO dto) {
        WorkoutDTO createWorkout = workoutService.postWorkout(dto);

        if (createWorkout != null) {
            return ResponseEntity.ok(createWorkout);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

  /* @GetMapping("/workouts")
    public ResponseEntity<List<WorkoutDTO>> getAllWorkouts() {
        try {
            return ResponseEntity.ok(workoutService.getWorkouts());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(List.of());
        }
    }*/

    @GetMapping("/workouts/{id}")
    public ResponseEntity<?> getWorkout(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(workoutService.getWorkoutById(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong");
        }

    }

    @PutMapping("/workouts/{id}")
    public ResponseEntity<?> updateWorkout(@PathVariable Long id, @RequestBody WorkoutDTO dto) {
        WorkoutDTO updateWorkout = workoutService.updateWorkout(dto, id);
        if (updateWorkout != null) {
            return ResponseEntity.ok(updateWorkout);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong");
        }

    }

    @DeleteMapping("/workouts/{id}")
    public ResponseEntity<?> deleteWorkout(@PathVariable Long id) {
        workoutService.deleteWorkout(id);
        return ResponseEntity.ok("Workout deleted successfully!");

    }
    @GetMapping("/workouts")
    public List<WorkoutDTO> getUserWorkouts() {
        return workoutService.getUserWorkouts();
    }






}