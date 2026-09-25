const fs = require('fs');
let code = fs.readFileSync('js/app.js', 'utf8');

const regex = /function formatShort\(num\)\s*\{\s*if \(num >= 1000000\) return \(num \/ 1000000\)\.toFixed\(1\)\.replace\("\.0", ""\) \+ "jt";\s*if \(num >= 1000\) return \(num \/ 1000\)\.toFixed\(0\) \+ "k";\s*return num\.toString\(\);\s*\}/g;

let count = 0;
code = code.replace(regex, (match) => {
  count++;
  if (count > 1) return ''; // Remove duplicates
  return match;
});

fs.writeFileSync('js/app.js', code);
console.log("Removed " + (count - 1) + " duplicates.");
