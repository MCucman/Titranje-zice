import { Injectable } from '@angular/core';
import * as mathjs from 'mathjs';

@Injectable({
  providedIn: 'root'
})
export class IntegralService {
  tempr1: boolean = false;
  tempr2: boolean = false;
  r1: boolean = false;
  r2: boolean = false;

  constructor() { }

  integrate(f:string, l: number, a: number, b: number, n: number): number{
    let g = mathjs.parse(f).compile();
    const h = (b - a) / 20;
    let sum;
    if(this.r1 && !this.r2){
      sum = 0.5 * (g.evaluate({x: a})* Math.cos(this.k(n)*Math.PI*a/l) + g.evaluate({x: b})* Math.cos(this.k(n)*Math.PI*b/l));
      for (let i = 1; i < 20; i++)
        sum += g.evaluate({x: a+i*h}) * Math.cos(this.k(n)*Math.PI*(a+i*h)/l);
    }else{
      sum = 0.5 * (g.evaluate({x: a})* Math.sin(this.k(n)*Math.PI*a/l) + g.evaluate({x: b})* Math.sin(this.k(n)*Math.PI*b/l));
      for (let i = 1; i < 20; i++)
        sum += g.evaluate({x: a+i*h}) * Math.sin(this.k(n)*Math.PI*(a+i*h)/l);
    }
    return sum * h;
  }

  integrate_n(arr1: Array<string>, l: number, arr2: Array<any>, k: number){
    let sum = 0;
    for(let i = 0; i < arr1.length; i++)
      sum += this.integrate(arr1[i], l, Number(arr2[i][0]), Number(arr2[i][1]), k);
    return sum;
  }

  separate(arr: Array<string>){
    let arr1 = [];
    let regex = /[-+]?\d*\.?\d+/g;
    for(let i = 0; i < arr.length; i++)
      arr1[i] = arr[i].match(regex);
    return arr1;
  }

  k(n: number){
    if(this.r1 || this.r2)
      return (2*n-1)/2;
    else
      return n
  }
}
