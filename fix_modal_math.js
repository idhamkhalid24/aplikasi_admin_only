const fs = require('fs');
let code = fs.readFileSync('js/app.js', 'utf8');

const target1 = '$("dwMathKembalian").innerText = `- Rp ${rp(kembalian)}`;';
const replacement1 = '$("dwMathKembalian").innerText = `- ${rp(kembalian)}`;';
code = code.replace(target1, replacement1);

const target2 = '$("dwMathWithdrawn").innerText = `Rp ${rp(drawn)}`;';
const replacement2 = `
  if (drawn >= 0) {
    $("dwMathWithdrawn").innerText = \`\${rp(drawn)}\`;
  } else {
    $("dwMathWithdrawn").innerText = \`Uang Pribadi (Tombok): \${rp(Math.abs(drawn))}\`;
  }
`;
code = code.replace(target2, replacement2);

fs.writeFileSync('js/app.js', code);
