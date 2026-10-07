const fs = require('fs');
let code = fs.readFileSync('js/app.js', 'utf8');

// 1. Optimize setDoc to use localDoc if provided
const regexSetDoc = /async function setDoc\(ref, payload, options = \{\}\) \{\s*const nextData = deepCloneCompat\(payload \|\| \{\}\);\s*let finalData = nextData;\s*if \(options\?\.merge\) \{\s*const oldSnap = await getDocFromServer\(ref\)\.catch\(\(\) => docSnapshot\(ref\.id, null\)\);\s*finalData = \{ \.\.\.\(oldSnap\.exists\(\) \? oldSnap\.data\(\) : \{\}\), \.\.\.nextData \};\s*delete finalData\.id;\s*\}/s;

const replacementSetDoc = `async function setDoc(ref, payload, options = {}) {
    const nextData = deepCloneCompat(payload || {});
    let finalData = nextData;
    if (options?.merge) {
      if (options.localDoc) {
        finalData = { ...options.localDoc, ...nextData };
      } else {
        const oldSnap = await getDocFromServer(ref).catch(() => docSnapshot(ref.id, null));
        finalData = { ...(oldSnap.exists() ? oldSnap.data() : {}), ...nextData };
      }
      delete finalData.id;
    }`;

code = code.replace(regexSetDoc, replacementSetDoc);


// 2. Pass localDoc to saveTransaction
const regexSaveTx = /if\(id\)\{await setDoc\(doc\(db,"transactions",id\),payload,\{merge:true\}\)\}/;
const replacementSaveTx = `if(id){await setDoc(doc(db,"transactions",id),payload,{merge:true, localDoc: old})}`;
code = code.replace(regexSaveTx, replacementSaveTx);

// 3. Pass localDoc to deleteTransaction (the main one)
// "const patch={deleted:true,deletedAt:serverTimestamp(),deletedAtMs:Date.now(),deletedBy:state.user.username,deletedByName:state.user.name};await setDoc(doc(db,"transactions",id),patch,{merge:true});"
const regexDelTx = /const patch=\{deleted:true,deletedAt:serverTimestamp\(\),deletedAtMs:Date\.now\(\),deletedBy:state\.user\.username,deletedByName:state\.user\.name\};\s*await setDoc\(doc\(db,"transactions",id\),patch,\{merge:true\}\);/;
const replacementDelTx = `const patch={deleted:true,deletedAt:serverTimestamp(),deletedAtMs:Date.now(),deletedBy:state.user.username,deletedByName:state.user.name};await setDoc(doc(db,"transactions",id),patch,{merge:true, localDoc: t});`;
code = code.replace(regexDelTx, replacementDelTx);


// 4. Stagger refreshAll requests
const regexRefreshAll = /const p1 = Promise\.all\(\[ getDocs\(txQ\), getDocs\(attQ\), getDocs\(closingQ\), getDocs\(manualQ\) \]\);\s*const p2 = Promise\.all\(\[ getDocs\(usersQ\), getDocs\(unlockQ\), getDocs\(drawerWithdrawalsQ\)\.catch\(\(\)=>(\{docs:\[\]\})\), getDocFromServer\(doc\(db,'closings','__bonus_settings'\)\)\.catch\(\(\)=>null\) \]\);\s*const p3 = Promise\.all\(\[ getDocFromServer\(doc\(db,'closings',STAFF_DAILY_NOTE_DOC_ID\)\)\.catch\(\(\)=>null\), getDocFromServer\(doc\(db,RISMA_MANUAL_CLOSING_COLLECTION,RISMA_MANUAL_CLOSING_DOC_ID\)\)\.catch\(\(\)=>null\), getDocFromServer\(doc\(db,'closings',RECEIPT_TEXT_DOC_ID\)\)\.catch\(\(\)=>null\), fetchCashFisik\(\) \]\);\s*const r1 = await p1; const r2 = await p2; const r3 = await p3;/s;

const replacementRefreshAll = `const r1 = await Promise.all([ getDocs(txQ), getDocs(attQ), getDocs(closingQ), getDocs(manualQ) ]);
const r2 = await Promise.all([ getDocs(usersQ), getDocs(unlockQ), getDocs(drawerWithdrawalsQ).catch(()=>({docs:[]})), getDocFromServer(doc(db,'closings','__bonus_settings')).catch(()=>null) ]);
const r3 = await Promise.all([ getDocFromServer(doc(db,'closings',STAFF_DAILY_NOTE_DOC_ID)).catch(()=>null), getDocFromServer(doc(db,RISMA_MANUAL_CLOSING_COLLECTION,RISMA_MANUAL_CLOSING_DOC_ID)).catch(()=>null), getDocFromServer(doc(db,'closings',RECEIPT_TEXT_DOC_ID)).catch(()=>null), fetchCashFisik() ]);`;

code = code.replace(regexRefreshAll, replacementRefreshAll);

fs.writeFileSync('js/app.js', code);
console.log("Speed optimizations applied.");
