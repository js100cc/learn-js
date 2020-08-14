/*
 * 1.4, charfreq, print characters histogram
 *
 * I just learnt first chapter of K&R, this program is familiar.
 * After consulted a little nodejs API docs about stream, I think I
 * can implement one before looking into it's code.
 *
 * The result presentation printed in book are not complete.
 */


/*
 * Based on 1.4 charfreq.js result, I guess:
 * 1. Do not count white spaces.
 * 2. One # means one percent, integer rounded
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
  while (i > 0) {
    if (pattern.lastIndex == str.length) break;
    let chr = pattern.exec(str)[0];
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

  // sort, descending
  charsWithCount.sort((a, b) => b[1] - a[1]);

  // print histograms
  charsWithCount.forEach(pair => {
    let chr = pair[0];
    let count = pair[1];
    let percentage = 100 * (count / str.length);
    let units = '#'.repeat(Math.round(percentage));
    console.log(`${chr.toUpperCase()}: ${units} ${percentage.toFixed(2)}%`);
  });
}

/* test chars
 * 🦕🐪
 */
