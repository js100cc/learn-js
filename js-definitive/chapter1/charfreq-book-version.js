/*
 * This file contains almost exactly the same code from 1.4
 * Some feature test code of my own added after Feature Test comment in bottom
 *
 * comments will be replaced with my own as study notes
 */


/*
 * A note about Map, map is semantic relative to two-dimension array
 * Default behavior of Map dont treat non-two-dimension-array as valid input,
 * this DefaultMap class changed this. See Feature Test in bottom.
 */
class DefaultMap extends Map {
  constructor(defaultValue) {

    // ignore Map initial value, super is just a syntax requirement here
    super();

    // set default value for any key, need extra implementation below
    this.defaultValue = defaultValue;
  }

  // this is the extra implementation
  get(key) {
    if (this.has(key)) {
      return super.get(key);
    } else {

      // Although book code works well for that purpose, but get(key)
      // is not a accessor property, it's an actual method
      // I think it's better to add this line
      // get(key) semantic means get THE key and return it's value
      // It would be confuse if it can get a key of it's own but don't
      // has the key
      this.set(key, this.defaultValue);

      return this.defaultValue;
    }
  }
}

/*
 * Now is the REAL OOP part
 * My own implementation in ./charfreq-revised-ver-2.js using a function
 * to manage string and print histogram. Using function is my first nature,
 * book code shows me a good OOP implementation
 */
class Histogram {
  constructor() {
    this.letterCounts = new DefaultMap(0);
    this.totalLetters = 0;
  }

  add(text) {
    text = text.replace(/\s/g, '').toUpperCase();

    for (let character of text) {
      this.totalLetters += 1;
      let count = this.letterCounts.get(character);
      this.letterCounts.set(character, count + 1);
    }
  }

  toString() {
    let entries = [...this.letterCounts];

    entries.sort((a, b) => {
      if (a[1] === b[1]) {
        return a[0] < b[0] ? -1 : 1;
      } else {
        return b[1] - a[1];
      }
    });

    for (let entry of entries) {
      entry[1] = entry[1] / this.totalLetters * 100;
    }

    entries = entries.filter(entry => entry[1] >= 1);

    let lines = entries.map(([letter, n]) => {
      return `${letter}: ${'#'.repeat(Math.round(n))} ${n.toFixed(2)}%`;
    });

    return lines.join('\n');
  }
}

/*
 * I never know that process.stdin now is an async iterable
 */
async function histogramFromStdin() {
  process.stdin.setEncoding('utf-8');
  let histogram = new Histogram();
  for await (let chunk of process.stdin) {
    histogram.add(chunk);
  }
  return histogram;
}

histogramFromStdin().then(histogram => console.log(histogram.toString()));


/* ------- Feature Test ----------- */
console.log('------------- Feature Test ----------------');

let map = new Map([[1, 2]]);
console.log('Map class accept and spread two-dimension array?', map.has(1));

let map2 = new DefaultMap([[1, 2]]);
console.log('DefaultMap class accept and spread two-dimension array?',
  map2.has(1));
console.log(map2.get(1)); // [[1, 2]]
console.log(map2.has(1)); // true, if get(key) use book code then it's false
