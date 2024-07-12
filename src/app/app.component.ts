import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Chart } from 'chart.js/auto';
import { FormsModule } from '@angular/forms';

declare global {
  interface Window {
    MathJax: any;
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {
  title = 'Titranje_zice';
  segments_u: Array<number> = [0];
  segments_v: Array<number> = [0];
  myChart!: Chart;
  bool: boolean = false;
  t: number = 0;
  intervalId: any;
  pocetniPolozaj: string = '';
  pocetnaBrzina: string = '';
  duljinaZice: number = 0;
  brzinaVala: number = 0;
  VJ!: string;
  RU!: string;
  PU!: string;
  l!: string;
  c!: string;
  u0!: string;
  v0!: string;

  constructor() { }

  ngOnInit() {
    this.VJ = '$$\\frac{\\partial^2u}{\\partial t^2}(x,t) - c^2 \\frac{\\partial^2u}{\\partial x^2}(x,t) = 0$$';
    this.RU = '$$u(0,t) = 0\\\\ u(l,t) = 0$$'
    this.PU = '$$u_0(x) =  \\\\ v_0(x) =  $$';
    this.l = '$$Duljina\\\: žice:\\\: l =$$'
    this.c = '$$Brzina\\\: širenja\\\: vala:\\\: c =$$'
    this.u0 = '$$Početni\\\: položaj:\\\: u_0(x) =$$'
    this.v0 = '$$Početna\\\: brzina:\\\: v_0(x) =$$'
    this.renderMathJax();
    this.setupChart();
    this.addEventListeners();
  }

  dodajUvjet() {
    this.PU = `$$u_0(x) = ${this.pocetniPolozaj} \\\\ v_0(x) = ${this.pocetnaBrzina}$$`;
    this.renderMathJax();
  }

  dodajDuljinu() {
    this.RU = `$$ u(0,t) = 0\\\\ u(${this.duljinaZice},t) = 0 $$`
    this.renderMathJax();
  }

  dodajBrzinu() {
    this.VJ = `$$\\frac{\\partial^2u}{\\partial t^2}(x,t) - ${this.brzinaVala}^2 \\frac{\\partial^2u}{\\partial x^2}(x,t) = 0$$`;
    this.renderMathJax();
  }

  renderMathJax() {
    if (window['MathJax']) {
      window['MathJax'].Hub.Queue(['Typeset', window['MathJax'].Hub]);
    }
  }

  addSegment_u(): void{
    this.segments_u.push(this.segments_u.length);
  }

  removeSegment_u(){
    this.segments_u.pop();
  }

  addSegment_v(): void{
    this.segments_v.push(this.segments_v.length);
  }

  removeSegment_v(){
    this.segments_v.pop();
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
    const data = labels.map(x => Math.sin(x) * Math.cos(this.t));

    this.myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Gibanje žice kroz vrijeme',
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

  updateChart() {
    const labels = Array.from({ length: 101 }, (_, i) => i * 0.1);
    const data = labels.map(x => Math.sin(x) * Math.cos(this.t));

    this.myChart.data.datasets[0].data = data;
    this.myChart.update();
  }

  startAnimation() {
    if(!this.bool){
      this.bool = true;
      this.intervalId = setInterval(() => {
        this.t += 0.1;
        this.updateChart();
      }, 100);
    }
  }

  stopAnimation() {
    this.bool = false;
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
