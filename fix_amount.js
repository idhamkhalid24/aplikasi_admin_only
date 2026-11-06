const fs = require('fs');
let code = fs.readFileSync('js/app.js', 'utf8');

const target1 = 'if (amount <= 0) return toast("Sisa yang ditarik (Disetor) tidak boleh kurang dari atau sama dengan 0", true);';
code = code.replace(target1, '');

const target2 = 'const pin = await askPin(`Tarik uang laci sejumlah Rp ${rp(amount)}?\\nSisa Laci: Rp ${rp(remainingAmount)}\\n\\nMasukkan PIN admin:`);';
const replacement2 = `
    let confirmMsg = "";
    if (amount >= 0) {
      confirmMsg = \`Tarik uang laci sejumlah \${rp(amount)}?\\nSisa Laci: \${rp(remainingAmount)}\\n\\nMasukkan PIN admin:\`;
    } else {
      confirmMsg = \`Kamu akan menyisihkan uang pribadi (tambah laci) sejumlah \${rp(Math.abs(amount))} agar kembalian besok menjadi \${rp(remainingAmount)}.\\n\\nMasukkan PIN admin:\`;
    }
    const pin = await askPin(confirmMsg);
`;
code = code.replace(target2, replacement2);

fs.writeFileSync('js/app.js', code);
