import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChartConfiguration } from 'chart.js';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts'
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { UserService } from '../../service/user';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.html',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    BaseChartDirective
  ],
})
export class StatsComponent implements OnInit {
  workouts: any[] = [];
  filteredWorkouts: any[] = [];

  startDate: Date | null = null;
  endDate: Date | null = null;

  // Chart config
  
  difficultyChartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [{ label: 'Difficulty', data: [], borderColor: 'blue', fill: false }] };
  tirednessChartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [{ label: 'Tiredness', data: [], borderColor: 'red', fill: false }] };
  caloriesChartData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [{ label: 'Calories Burned', data: [], backgroundColor: 'orange' }] };
  difficultyTirednessChartData: ChartConfiguration<'line'>['data'] = {
  labels: [],
  datasets: [
    { label: 'Difficulty', data: [], borderColor: 'blue', fill: false },
    { label: 'Tiredness', data: [], borderColor: 'red', fill: false }
  ]
};

  constructor(private http: HttpClient, private service:UserService) {}

  ngOnInit() {
     const today = new Date();
    const dayOfWeek = today.getDay(); // Sunday = 0, Monday = 1 ...
    const monday = new Date(today);
    monday.setDate(today.getDate() - dayOfWeek + 1); // Ponedeljak
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6); // Nedelja

    this.startDate = monday;
    this.endDate = sunday;

    // Automatski generiši chartove
    this.generateCharts();
    this.loadData();
  }

  loadData() {
    this.http.get<any[]>('http://localhost:8080/workouts').subscribe(data => {
      this.workouts = data;
      this.filteredWorkouts = data; // default no filter
      this.updateCharts();
    });
  }

  filterByDate() {
    if (this.startDate && this.endDate) {
      this.filteredWorkouts = this.workouts.filter(w => {
        const date = new Date(w.trainingDate);
        return date >= this.startDate! && date <= this.endDate!;
      });
    } else {
      this.filteredWorkouts = this.workouts;
    }
    this.updateCharts();
  }

  updateCharts() {
    const labels = this.filteredWorkouts.map(w => new Date(w.trainingDate).toLocaleDateString());

    this.difficultyChartData.labels = labels;
    this.difficultyChartData.datasets[0].data = this.filteredWorkouts.map(w => w.difficulty);

    this.tirednessChartData.labels = labels;
    this.tirednessChartData.datasets[0].data = this.filteredWorkouts.map(w => w.tiredness);

    this.caloriesChartData.labels = labels;
    this.caloriesChartData.datasets[0].data = this.filteredWorkouts.map(w => w.caloriesBurned);

    this.difficultyTirednessChartData.labels = labels;
    this.difficultyTirednessChartData.datasets[0].data = this.filteredWorkouts.map(w => w.difficulty);
    this.difficultyTirednessChartData.datasets[1].data = this.filteredWorkouts.map(w => w.tiredness); 
  }
 generateCharts() {
    if (!this.startDate || !this.endDate) {
      alert("Please select a start and end date");
      return;
    }

    if (this.startDate > this.endDate) {
      alert("Start date cannot be after end date");
      return;
    }

    this.service.getMyWorkouts().subscribe(workouts => {
      // Filtriraj po datumu
      const filtered = workouts.filter((w: any) => {
        const date = new Date(w.trainingDate);
        return date >= this.startDate! && date <= this.endDate!;
      });

      // Sortiraj po datumu
      filtered.sort((a: any, b: any) => new Date(a.trainingDate).getTime() - new Date(b.trainingDate).getTime());

      const labels = filtered.map((w: any) => new Date(w.trainingDate).toLocaleDateString());

      // Individual charts
      this.difficultyChartData = {
        labels,
        datasets: [{ label: 'Difficulty', data: filtered.map((w: any) => w.difficulty), borderColor: 'blue', fill: false }]
      };

      this.tirednessChartData = {
        labels,
        datasets: [{ label: 'Tiredness', data: filtered.map((w: any) => w.tiredness), borderColor: 'red', fill: false }]
      };

      this.caloriesChartData = {
        labels,
        datasets: [{ label: 'Calories', data: filtered.map((w: any) => w.caloriesBurned), backgroundColor: 'orange' }]
      };

      // Multi-line chart (Difficulty + Tiredness)
      this.difficultyTirednessChartData = {
        labels,
        datasets: [
          { label: 'Difficulty', data: filtered.map((w: any) => w.difficulty), borderColor: 'blue', fill: false },
          { label: 'Tiredness', data: filtered.map((w: any) => w.tiredness), borderColor: 'red', fill: false }
        ]
      };
    });
  }
}
