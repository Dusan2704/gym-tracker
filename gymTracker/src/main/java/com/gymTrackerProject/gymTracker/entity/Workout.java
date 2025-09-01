package com.gymTrackerProject.gymTracker.entity;

import com.gymTrackerProject.gymTracker.dto.WorkoutDTO;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Entity
@Data
public class Workout {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Date trainingDate;

    private String type;

    private String description;

    private int duration;

    private int caloriesBurned;

    private int difficulty;

    private int tiredness;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)  // kolona u bazi
    private User user;

    public WorkoutDTO getWorkoutDTO() {
        WorkoutDTO workoutDTO = new WorkoutDTO();

        workoutDTO.setId(id);
        workoutDTO.setTrainingDate(trainingDate);
        workoutDTO.setType(type);
        workoutDTO.setDescription(description);
        workoutDTO.setDuration(duration);
        workoutDTO.setCaloriesBurned(caloriesBurned);
        workoutDTO.setDifficulty(difficulty);
        workoutDTO.setTiredness(tiredness);
        return workoutDTO;

    }

}
