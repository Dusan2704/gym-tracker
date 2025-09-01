import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, AbstractControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../service/user';

@Component({
  selector: 'app-workout',
  templateUrl: './workout.html',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, DatePipe, NgFor,CommonModule]
})
export class WorkoutComponent implements OnInit {

  workoutForm!: FormGroup;
  workouts: any[] = [];

  // track currently edited workout id (undefined = creating new)
  editingId?: number;

  constructor(private fb: FormBuilder, private user: UserService) {}

  ngOnInit(): void {
    this.workoutForm = this.fb.group({
      trainingDate: ['', Validators.required],
      type: ['', Validators.required],
      description: [''],
      duration: [30, [Validators.required, Validators.min(1)]],
      caloriesBurned: [0, [Validators.required, Validators.min(0)]],
      difficulty: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
      tiredness: [1, [Validators.required, Validators.min(1), Validators.max(10)]]
    });
    this.loadWorkouts();
  }

 loadWorkouts(): void {
    this.user.getMyWorkouts().subscribe({
      next: (data) => {
        this.workouts = data;
      },
      error: (err) => {
        console.error(err);
       
      }
    });
  }


  get f(): { [key: string]: AbstractControl } {
    return this.workoutForm.controls;
  }

  resetForm() {
    this.editingId = undefined;
    this.workoutForm.reset({
      trainingDate: '',
      type: '',
      description: '',
      duration: 30,
      caloriesBurned: 0,
      difficulty: 1,
      tiredness: 1
    });
  }

  // helper to prepare payload same as before
  private buildPayload(): any {
    const raw = this.workoutForm.value;
    return {
      trainingDate: raw.trainingDate ? new Date(raw.trainingDate).toISOString() : null,
      type: raw.type,
      description: raw.description || null,
      duration: Number(raw.duration),
      caloriesBurned: Math.round(Number(raw.caloriesBurned)),
      difficulty: Number(raw.difficulty),
      tiredness: Number(raw.tiredness)
    };
  }

  onSubmit() {
    if (this.workoutForm.invalid) {
      this.workoutForm.markAllAsTouched();
      return;
    }

    const payload = this.buildPayload();

    if (this.editingId != null) {
      // update existing
      this.user.updateWorkout(this.editingId, payload).subscribe({
        next: () => {
          this.resetForm();
          this.loadWorkouts();
        },
        error: err => console.error(err)
      });
    } else {
      // create new
      this.user.createWorkout(payload).subscribe({
        next: () => {
          this.resetForm();
          this.loadWorkouts(); // osveži listu posle dodavanja
        },
        error: err => console.error(err)
      });
    }
  }

  // populate form for editing a workout
  editWorkout(w: any) {
    this.editingId = w.id ?? w.workoutId ?? undefined; // pokušaj različitih polja id-a
    // Convert ISO date to yyyy-MM-dd for typical date input; if backend uses full datetime, template must support it
    let dateVal = '';
    if (w.trainingDate) {
      try {
        const d = new Date(w.trainingDate);
        // format yyyy-MM-dd (works for <input type="date">)
        dateVal = d.toISOString().substring(0, 10);
      } catch {
        dateVal = w.trainingDate;
      }
    }
    this.workoutForm.patchValue({
      trainingDate: dateVal,
      type: w.type ?? '',
      description: w.description ?? '',
      duration: w.duration ?? 30,
      caloriesBurned: w.caloriesBurned ?? 0,
      difficulty: w.difficulty ?? 1,
      tiredness: w.tiredness ?? 1
    });
    // optionally scroll to form / focus — not implemented here
  }

  // delete by workout id
  deleteWorkout(id?: number) {
    const wid = id ?? this.editingId;
    if (!wid) {
      console.warn('No workout id provided for delete');
      return;
    }
    
    this.user.deleteWorkout(wid).subscribe({
      next: () => {
        // ako smo brisali onaj koji je u edit-u, resetuj formu
        if (this.editingId === wid) this.resetForm();
        this.loadWorkouts();
      },
      error: err => console.error(err)
    });
  }
}
