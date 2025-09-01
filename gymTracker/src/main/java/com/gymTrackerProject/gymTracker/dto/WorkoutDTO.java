package com.gymTrackerProject.gymTracker.dto;

import lombok.Data;

import java.util.Date;

@Data
public class WorkoutDTO {

    private Long id;

    private Date trainingDate;

    private String type;

    private String description;

    private int duration;

    private int caloriesBurned;

    private int difficulty;

    private int tiredness;
}
