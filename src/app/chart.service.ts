import { Injectable } from '@angular/core';
import { Chart } from 'chart.js/auto';

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  myChart!: Chart;
  t: number = 0;

  constructor() { }

  renderMathJax() {
    if (window['MathJax']) {
      window['MathJax'].Hub.Queue(['Typeset', window['MathJax'].Hub]);
    }
  }

  setupChart() {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;

    if (!ctx) {
      console.error('Canvas element not found');
      return;
    }

    let labels = Array.from({ length: 101 }, (_, i) => i * 0.1);
    const data = labels.map(_ => 0);
    this.myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: `Gibanje žice kroz vrijeme, t = ${this.t.toFixed(1)}`,
          data: data,
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          fill: false,
          pointRadius: 0
        }]
      },
      options: {
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            min: 0,
            max: 10,
            title: {
              display: true,
              text: 'x'
            }
          },
          y: {
            min: -1,
            max: 1,
            title: {
              display: true,
              text: 'u(x, t)'
            }
          }
        }
      }
    });
  }
}
