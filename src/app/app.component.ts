import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChartService } from './chart.service';
import { IntegralService } from './integral.service';

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
  bool: boolean = false;
  intervalId: any;
  VJ!: string;
  RU!: string;
  PU!: string;
  l!: string;
  c!: string;
  u0!: string;
  v0!: string;

  tempsegment_u: Array<string> = [];
  tempsegment_v: Array<string> = [];
  temppocetniPolozaj: string = '';
  temppocetniPolozaji: Array<string> = [];
  temppocetnaBrzina: string = '';
  temppocetneBrzine: Array<string> = [];
  tempduljinaZice: number = 0;
  tempbrzinaVala: number = 0;

  segment_u: Array<string> = [];
  segment_v: Array<string> = [];
  pocetniPolozaj: string = '';
  pocetniPolozaji: Array<string> = [];
  pocetnaBrzina: string = '';
  pocetneBrzine: Array<string> = [];
  duljinaZice: number = 0;
  brzinaVala: number = 0;


  constructor(private chartService: ChartService, private integralService: IntegralService) {}

  ngOnInit() {
    this.VJ = '$$\\frac{\\partial^2u}{\\partial t^2}(x,t) - c^2 \\frac{\\partial^2u}{\\partial x^2}(x,t) = 0$$';
    this.RU = '$$u(0,t) = 0\\\\ u(l,t) = 0$$';
    this.PU = '$$u_0(x) =  \\\\ v_0(x) =  $$';
    this.l = '$$Duljina\\\: žice:\\\: l =$$';
    this.c = '$$Brzina\\\: širenja\\\: vala:\\\: c =$$';
    this.u0 = '$$Početni\\\: položaj:\\\: u_0(x) =$$';
    this.v0 = '$$Početna\\\: brzina:\\\: v_0(x) =$$';
    this.chartService.setupChart();
    this.addEventListeners();
  }

  ngAfterViewChecked() {
    this.chartService.renderMathJax();
  }

  azuriraj() {
    let pp = '';
    let pb = '';

    this.segment_u = [...this.tempsegment_u];
    this.segment_v = [...this.tempsegment_v];
    this.pocetniPolozaj = this.temppocetniPolozaj;
    this.pocetniPolozaji = [...this.temppocetniPolozaji];
    this.pocetnaBrzina = this.temppocetnaBrzina;
    this.pocetneBrzine = [...this.temppocetneBrzine];
    this.duljinaZice = this.tempduljinaZice;
    this.brzinaVala = this.tempbrzinaVala;

    if(this.segments_u.length == 1) pp = this.pocetniPolozaj;
    else pp = `\\begin{cases}
                ${this.pocetniPolozaji.map((p, i) => `${p}, ${this.segment_u[i]}`).join('\\\\')}
                \\end{cases}`;

    if(this.segments_v.length == 1) pb = this.pocetnaBrzina;
    else pb = `\\begin{cases}
                ${this.pocetneBrzine.map((p, i) => `${p}, ${this.segment_v[i]}`).join('\\\\')}
                \\end{cases}`;

    if(this.segments_u.length > 1 || this.segments_v.length > 1)
      this.PU = `$$u_0(x) = ${pp}, \\: v_0(x) = ${pb}$$`;
    else
      this.PU = `$$u_0(x) = ${pp} \\\\ v_0(x) = ${pb}$$`;

    this.stopAnimation();
    this.VJ = `$$\\frac{\\partial^2u}{\\partial t^2}(x,t) - ${this.brzinaVala}^2 \\frac{\\partial^2u}{\\partial x^2}(x,t) = 0$$`;
    this.RU = `$$ u(0,t) = 0\\\\ u(${this.duljinaZice},t) = 0 $$`;
    this.chartService.t = 0;
    this.chartService.myChart.options.scales!['x']!.max = this.duljinaZice;
    this.updateChart();
  }

  addSegment_u(): void {
    this.segments_u.push(this.segments_u.length);
    this.tempsegment_u.push('');
    this.temppocetniPolozaji.push('');
    if(this.segments_u.length == 2) this.temppocetniPolozaj = '';
  }

  removeSegment_u() {
    this.segments_u.pop();
    this.tempsegment_u.pop();
    this.temppocetniPolozaji.pop();
    if(this.segments_u.length == 1){
      this.tempsegment_u.pop();
      this.temppocetniPolozaji.pop();
    }
  }

  addSegment_v(): void {
    this.segments_v.push(this.segments_v.length);
    this.tempsegment_v.push('');
    this.temppocetneBrzine.push('');
    if(this.segments_v.length == 2) this.temppocetnaBrzina = '';
  }

  removeSegment_v() {
    this.segments_v.pop();
    this.tempsegment_v.pop();
    this.temppocetneBrzine.pop();
    if(this.segments_v.length == 1){
      this.tempsegment_v.pop();
      this.temppocetneBrzine.pop();
    }
  }

  startAnimation() {
    if (!this.bool) {
      this.bool = true;
      if(this.chartService.t >= 9.9)
        this.chartService.t = 0;
      this.intervalId = setInterval(() => {
        this.chartService.t += 0.1;
        if(this.chartService.t >= 9.9){
          this.stopAnimation();
        }
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

  ngOnDestroy(): void {
    this.stopAnimation();
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

  updateChart() {
    let labels = Array.from({ length: this.duljinaZice*10+1 }, (_, i) => i * 0.1);
    const data = labels.map(x => this.sum(x));
    this.chartService.myChart.data.labels = labels;
    this.chartService.myChart.data.datasets[0].data = data;
    this.chartService.myChart.data.datasets[0].label = `Gibanje žice kroz vrijeme, t = ${this.chartService.t.toFixed(1)}`;
    this.chartService.myChart.update();
  }

  sum(x:number){
    let result = 0;
    for(let n = 1; n < 10; n++){
      result += this.f(n)*Math.sin(n*Math.PI*x/this.duljinaZice)
    }
    return result;
  }

  f(n: number){
    return this.A_n(n)*Math.cos(n*Math.PI*this.brzinaVala*this.chartService.t/this.duljinaZice)
    + this.B_n(n)*Math.sin(n*Math.PI*this.brzinaVala*this.chartService.t/this.duljinaZice);
  }

  A_n(n: number){
    let f = 0;
    if(this.segments_u.length == 1)
      f = this.integralService.integrate(this.pocetniPolozaj, this.duljinaZice, 0, this.duljinaZice, n);
    else{
      let arr = this.integralService.separate(this.segment_u);
      f = this.integralService.integrate_n(this.pocetniPolozaji, this.duljinaZice, arr, n);
    }
    return 2/this.duljinaZice*f;
  }

  B_n(n: number){
    let f = 0;
    if(this.segments_v.length == 1)
      f = this.integralService.integrate(this.pocetnaBrzina, this.duljinaZice, 0, this.duljinaZice, n);
    else {
      let arr = this.integralService.separate(this.segment_v);
        f = this.integralService.integrate_n(this.pocetneBrzine, this.duljinaZice, arr, n);
    }
    return 2/n/Math.PI/this.brzinaVala*f;
  }
}
