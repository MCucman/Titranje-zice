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

  k(n: number){
    if(this.r1 || this.r2)
      return (2*n-1)/2;
    else
      return n
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

## Fourierova metoda
Za rješavanje početno-rubne zadaće za valnu jednadžbu koristimo Fourierovu metodu. Fourierove koeficijente određujemo iz Fourierovi redova 
za funkcije početnog položaja i početne brzine. Slijedeće funkcije se nalaze u datoteci `app.component.ts` i vraćaju vrijednost Fourierovih koeficijenata
```
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
```

U sijedećim metodama, `u` računa gibanje žice kroz vrijeme, odnosno njezin progib iz ravnotežnog položaja u točki 'x'.
Zajedno s metodom `T` one daju rješenje u točki 'x' u trenutku 't'.
```
u(x:number){
    let result = 0;
    for(let n = 1; n < 10; n++){
      result += this.T(n)*this.X(x, n);
    }
    return result;
  }

  T(n: number){
    return this.A_n(n)*Math.cos(this.integralService.k(n)*Math.PI*this.brzinaVala*this.t/this.duljinaZice)
    + this.B_n(n)*Math.sin(this.integralService.k(n)*Math.PI*this.brzinaVala*this.t/this.duljinaZice);
  }

  X(x: number, n: number){
    if(this.integralService.r1 && !this.integralService.r2)
      return Math.cos(this.integralService.k(n)*Math.PI*x/this.duljinaZice);
    else
      return Math.sin(this.integralService.k(n)*Math.PI*x/this.duljinaZice);
  }
```

## Prikaz grafa
U datoteci `chart.service.ts` nalazi se metoda `setupChart` koja prikazuje graf, a u datoteci `app.component.ts` imamo metodu `azuriraj`
u kojoj ovi redovi koda definiraju skaliranje 'x' i 'y' osi:
```
this.chartService.myChart.options.scales!['x']!.max = this.duljinaZice;
this.chartService.myChart.options.scales!['y']!.min = -this.amplitude();
this.chartService.myChart.options.scales!['y']!.max = this.amplitude();
```
Pomoću metode `s` računamo amplitudu, a s metodom `amplitude` računamo maksimalnu amplitudu. 
```
amplitude(){
    let data = []
    let labels = Array.from({ length: this.duljinaZice*10+1 }, (_, i) => i * 0.1);
    for(let i = 0; i < labels.length; i++){
      data[i] = this.s(labels[i]);
    }
    const max = Math.max(...data);
    return max + 0.3 * max;
  }

  s(x:number){
    let sum = 0;
    for(let n = 1; n < 10; n++){
      sum += Math.sqrt(this.A_n(n)**2 + this.B_n(n)**2)*Math.sin(n*Math.PI*x/this.duljinaZice);
    }
    return sum;
  }
```
Za ažuriranje grafa imamo metodu `updateChart`:
```
updateChart() {
    let labels = Array.from({ length: this.duljinaZice*10+1 }, (_, i) => i * 0.1);
    const data = labels.map(x => this.sum(x));
    this.chartService.myChart.data.labels = labels;
    this.chartService.myChart.data.datasets[0].data = data;
    this.chartService.myChart.data.datasets[0].label = `Gibanje žice kroz vrijeme, t = ${this.chartService.t.toFixed(1)}`;
    this.chartService.myChart.update();
  }
```
U varijablu 'labels' spremljena je subdivizija intervala, te se na taj svaki x mapira metoda `sum` što rezultira prikazom grafa i simulacijom 
titranja žice.

### Mentori i autori
- Mentori: prof. dr. sc. Krešimir Burazin, doc. dr. sc. Jelena Jankov Pavlović
- Autori: Matea Čučman, Anja Balentović

