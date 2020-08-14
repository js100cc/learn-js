/*
 * improvement revision for charfreq-revised-ver-1.js
 *
 * In charfreq-revised-ver-1.js:
 * 1. I avoid to use for loop to count chars in case of unicode codePoint
 * larger than 0XFFFF, I used regexp u flag. 1.4 shows that for-of seems
 * a more simple and elegant way.
 * 2. Also, I  use object to store mapping relationship of chars and counts.
 * then convert this object to two-dimension array. I encounter this same
 * situation before and wonder a more efficient data structure, ES6 Map is
 * the solution.
 *
 * So, this version improved these.
 *
 */



let data = '';

process.stdin.on('readable', () => {
  let chunk;
  while (chunk = process.stdin.read()) {
    data += chunk;
  }
});

process.stdin.on('end', () => {
  charfreq(data);
});

function charfreq(str) {
  const charCounter = new Map();
  str = str.replace(/\s/g, '');
  let totalChars = 0;

  // store and count using Map
  for (let chr of str) {
    totalChars += 1;
    if (charCounter.has(chr)) {
      charCounter.set(chr, charCounter.get(chr) + 1);
    } else {
      charCounter.set(chr, 1);
    }
  }

  const charsWithCount = [...charCounter];

  // sort, descending for char count, if equal sort alphabetically
  charsWithCount.sort((a, b) => {
    if (a[1] == b[1]) {
      return a[0] > b[0] ? 1 : -1;
    } else {
      return b[1] - a[1];
    }
  });

  // print histograms
  charsWithCount
    .filter(pair => pair[1] / str.length * 100 >= 1)
    .forEach(pair => {
      let chr = pair[0];
      let count = pair[1];
      let percentage = 100 * (count / totalChars);
      let units = '#'.repeat(Math.round(percentage));
      console.log(`${chr.toUpperCase()}: ${units} ${percentage.toFixed(2)}%`);
    });
}

/* test chars
 * 🦕🐪 <-- a dinosaur and a camel emoji, codePoint: 129429, 56725
 */
