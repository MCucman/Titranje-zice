import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Titranje_zice';
  segments: Array<number> = [0];
  myChart!: Chart;
  t: number = 0;
  intervalId: any;

  constructor() { }

  addSegment(): void{
    this.segments.push(this.segments.length);
  }

  removeSegment(){
    this.segments.pop();
  }

  ngOnInit(): void {
    this.setupChart();
    this.addEventListeners();
  }

  ngOnDestroy(): void {
    this.stopAnimation();
  }

  setupChart() {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;

    if (!ctx) {
      console.error('Canvas element not found');
      return;
    }

    const labels = Array.from({ length: 101 }, (_, i) => i * 0.1);
    const data = labels.map(x => 10 * Math.sin(x) * Math.cos(this.t));

    this.myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Funkcija zavisna o vremenu i prostoru',
          data: data,
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          fill: false,
          pointRadius: 0
        }]
      },
      options: {
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            title: {
              display: true,
              text: 'x'
            }
          },
          y: {
            min: -10,
            max: 10,
            title: {
              display: true,
              text: 'u(x, t)'
            }
          }
        }
      }
    });
  }

  updateChart() {
    const labels = Array.from({ length: 101 }, (_, i) => i * 0.1);
    const data = labels.map(x => 10 * Math.sin(x) * Math.cos(this.t));

    this.myChart.data.datasets[0].data = data;
    this.myChart.update();
  }

  startAnimation() {
    this.intervalId = setInterval(() => {
      this.t += 0.1;
      this.updateChart();
    }, 100);
  }

  stopAnimation() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  addEventListeners() {
    const startButton = document.querySelector('.btn-pokreni-animaciju');
    if (startButton) {
      startButton.addEventListener('click', () => {
        this.startAnimation();
      });
    }

    const stopButton = document.querySelector('.btn-zaustavi-animaciju');
    if (stopButton) {
      stopButton.addEventListener('click', () => {
        this.stopAnimation();
      });
    }
  }
}
