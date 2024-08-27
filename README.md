# Titranje Žice

## Uvod
Ovaj projekt predstavlja razvoj web aplikacije koja simulira i vizualizira dinamičko ponašanje žice podložne oscilacijama. Oscilacije žica su fundamentalna pojava u mnogim disciplinama, od fizike i inženjeringa do glazbe i umjetnosti. Razumijevanje ove pojave zahtijeva kombinaciju teorijskog znanja i praktičnih simulacija, što ovaj projekt čini izuzetno korisnim i značajnim.
Cilj ovog projekta je omogućiti korisnicima da intuitivno istražuju kako različiti parametri, poput duljine žice, brzine širenja vala, početnog položaja i početne brzine, utječu na ponašanje žice. Kroz grafičko sučelje, korisnici mogu mijenjati ove parametre u realnom vremenu i odmah vidjeti rezultate, što olakšava razumijevanje matematičkog modela koji stoje iza ove pojave.
Ova dokumentacija će pružiti detaljniji uvid u tehničke aspekte implementacije, uključujući korištene matematičke modele, numeričke metode za njihovo rješavanje, te tehničke izazove pri razvoju grafičkog sučelja. 

## LaTeX sintaksa
Za korištenje standardne LaTeX sintakse koristili smo MathJax, JavaScript biblioteku koja omogućava prikaz lijepo formatiranih matematičkih izraza na web stranici. 
Uključivanje MathJax bibliotoke: 
```
<script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-MML-AM_CHTML"></script>
```
Slijedeći dio koda definira kako se prepoznaju matematički izrazi.

```
  <script type="text/x-mathjax-config">
    MathJax.Hub.Config({
      tex2jax: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']],
        processEscapes: true
      }
    });
  </script>
```
- `inlineMath`: određuje koji se simboli koriste za inline (u liniji s tekstom) matematičke izraze. 
- `displayMath`: definira simbole za prikaz matematičkih izraza u posebnom bloku (izdvojenom od ostatka teksta).
- `processEscapes`: kada je ovo postavljeno na true, omogućava korištenje niza \$ za prikaz znaka $ u tekstu, bez pokušaja da se interpretira kao matematički izraz.

Također za brzo i jednostavno stiliziranje web aplikacije zajedno sa CSS stilom korišten je Bootstrap CSS framework koji sadrži unaprijed definirane Bootstrap komponente i stilove. 
```
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
```

## Integracija
Definirana u datoteci `integral.service.ts`. Za parsiranje i evaluaciju matematičkih izraza potrebna je `mathjs` biblioteka.
```
import * as mathjs from 'mathjs';
```
Metoda `integrate` izračunava numeričku integraciju funkcije 'f' na intervalu '[a, b]' koristeći trapeznu metodu. 
```
integrate(f:string, l: number, a: number, b: number, n: number): number{
    let g = mathjs.parse(f).compile();
    const h = (b - a) / 20;
    let sum = 0.5 * (g.evaluate({x: a})* Math.sin(n*Math.PI*a/l) + g.evaluate({x: b})* Math.sin(n*Math.PI*b/l));
    for (let i = 1; i < 20; i++) {
      sum += g.evaluate({x: a+i*h}) * Math.sin(n*Math.PI*(a+i*h)/l);
    }
    return sum * h;
  }
```
Funkcija 'f' je definirana kao string pa `mathjs.parse(f).compile();` parsirara matematički izraz iz stringa 'f' u objekt koji se može evaluirati. `compile()` kreira funkciju 'g' (početni položaj, odnosno početna brzina) koja se može koristiti za izračunavanje vrijednosti izraza s različitim vrijednostima varijable 'x'. 
Zatim u varijablu 'h' je spremljena veličina svakog podintervala. 
Funkcija `g.evaluate` uvrštava vrijednost u 'x'. 

Metoda `seperate` uzima niz stringova, izvlači brojeve iz svakog stringa koristeći regularni izraz (regex), i vraća novi niz koji sadrži te brojeve.
```
separate(arr: Array<string>) {
  let arr1 = [];
  let regex = /[-+]?\d*\.?\d+/g;
  for (let i = 0; i < arr.length; i++)
    arr1[i] = arr[i].match(regex);
  return arr1;
}
```
Metoda `integrate_n` provodi integraciju na svakom segmentu tako da na svaki segment primijeni metodu `integrate`, te zbroji sve dobivene vrijednosti.
```
integrate_n(arr1: Array<string>, l: number, arr2: Array<any>, n: number){
    let sum = 0;
    for(let i = 0; i < arr1.length; i++)
      sum += this.integrate(arr1[i], l, Number(arr2[i][0]), Number(arr2[i][1]), n);
    return sum;
  }
```


This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.1.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
