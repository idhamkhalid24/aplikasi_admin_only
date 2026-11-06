const fs = require('fs');
let code = fs.readFileSync('js/app.js', 'utf8');

// We need to mock DOM to run it in node
const domMock = `
const document = { getElementById: () => ({}), write: () => {} };
const window = { _dwState: {}, dateKey: () => '2026-09-25' };
const localStorage = { getItem: () => null, setItem: () => {} };
const state = { user: {name: 'Admin', username: 'admin'}, tx: [], page: 'home' };
function id(x) { return {}; }
function $(x) { return { classList: {toggle:()=>{}}, innerHTML: '' }; }
function showLogin() {}
function header() { return ''; }
function dailyBonusCard() { return ''; }
function adminCashierShortcutCard() { return ''; }
const db = {};
const supabase = {};
`;

code = domMock + '\n' + code;

try {
  eval(code);
  console.log("No syntax errors. Testing renderHome...");
  if (typeof renderHome === 'function') {
    renderHome();
    console.log("renderHome executed successfully!");
  }
} catch (e) {
  console.error("RUNTIME ERROR:", e);
}
