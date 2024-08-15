import { Injectable } from '@angular/core';
import * as mathjs from 'mathjs';

@Injectable({
  providedIn: 'root'
})
export class IntegralService {

  constructor() { }

  integrate(f:string, l: number, a: number, b: number, n: number): number{
    let g = mathjs.parse(f).compile();
    const h = (b - a) / 20;
    let sum = 0.5 * (g.evaluate({x: a})* Math.sin(n*Math.PI*a/l) + g.evaluate({x: b})* Math.sin(n*Math.PI*b/l));
    for (let i = 1; i < 20; i++) {
      sum += g.evaluate({x: a+i*h}) * Math.sin(n*Math.PI*(a+i*h)/l);
    }
    return sum * h;
  }

  separate(arr: Array<string>){
    let arr1 = [];
    let regex = /[-+]?\d*\.?\d+/g;
    for(let i = 0; i < arr.length; i++)
      arr1[i] = arr[i].match(regex);
    return arr1;
  }

  integrate_n(arr1: Array<string>, l: number, arr2: Array<any>, n: number){
    let sum = 0;
    for(let i = 0; i < arr1.length; i++)
      sum += this.integrate(arr1[i], l, Number(arr2[i][0]), Number(arr2[i][1]), n);
    return sum;
  }
}
