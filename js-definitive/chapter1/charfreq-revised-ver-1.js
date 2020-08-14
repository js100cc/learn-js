/*
 * bug fixed revision for charfreq.js
 *
 * Because I wrote charfreq.js without looking code in book 1.4, I didn't
 * guess to ignore chars that less than 1%. I also missed equal-counted
 * chars need to sort alphabetically. A subtle bug also exist, i thought
 * about unicode issue and use regexp u flag to count chars, but forgot that
 * str.length can't handle unicode.
 *
 * This version fixed these three bugs.
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
  const charCounter = {};
  const pattern = /[\s\S]/gu;
  str = str.replace(/\s/g, '');

  // store and count using object
  let i = 1;
  let totalChars = 0;
  while (i > 0) {
    if (pattern.lastIndex == str.length) break;
    let chr = pattern.exec(str)[0];
    totalChars += 1;
    i = pattern.lastIndex;
    if (chr in charCounter) {
      charCounter[chr] += 1;
    } else {
      charCounter[chr] = 1;
    }
  }

  // convert to two-dimensions array
  const charsWithCount = [];
  for (let chr in charCounter) {
    charsWithCount.push([chr, charCounter[chr]]);
  }

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
