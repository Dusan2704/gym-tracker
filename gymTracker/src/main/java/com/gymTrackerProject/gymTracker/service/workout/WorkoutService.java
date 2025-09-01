package com.gymTrackerProject.gymTracker.service.workout;

import com.gymTrackerProject.gymTracker.dto.WorkoutDTO;

import java.util.List;

public interface WorkoutService {

    WorkoutDTO postWorkout(WorkoutDTO dto);

    List<WorkoutDTO> getWorkouts();

    WorkoutDTO getWorkoutById(Long id);

    WorkoutDTO updateWorkout(WorkoutDTO dto, Long id);

    void deleteWorkout(Long id);

    List<WorkoutDTO> getUserWorkouts();
}
