const fs = require('fs');
let code = fs.readFileSync('js/app.js', 'utf8');
const splitToken = 'function renderAdminSalesPieChart() {';
const lastIdx = code.lastIndexOf(splitToken);
if (lastIdx > -1) {
  code = code.substring(0, lastIdx);
}
fs.writeFileSync('js/app.js', code.trim() + '\n');
