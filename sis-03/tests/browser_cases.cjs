const {chromium} = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const evidence = path.resolve(__dirname, '../evidence');
const cases = [
 ['T1','11:00','12:00','Available'],
 ['T2','10:30','11:30','Unavailable'],
 ['T3','11:00','12:00','Unavailable'],
 ['T4','12:00','14:00','Available'],
 ['T5','12:00','14:01','Unavailable'],
 ['T6','09:00','09:30','Unavailable'],
 ['T7','12:00','11:00','Unavailable'],
 ['T8','23:00','24:00','Available'],
 ['T9','23:00','24:01','Unavailable'],
 ['T10','12:00','13:00','Unavailable'],
 ['T11','11:00','12:00','Available'],
 ['T12','11:00','12:00','Available'],
];
async function fill(page,start,end,room='A-101') {
 await page.locator('select').selectOption(room);
 const inputs=page.locator('form input');
 await inputs.nth(0).fill('09:00');
 await inputs.nth(1).fill(start);
 await inputs.nth(2).fill(end);
}
async function result(page) {
 return (await page.locator('section').nth(1).innerText()).match(/\b(Unavailable|Available)\b/)?.[1] || null;
}
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const results={v1:{},final:{},issues:{},method:'v1 campus data supplied by browser route interception, source files unchanged; final uses shipped demo fixtures'};
 for (const version of ['v1','final']) {
  for (const [id,start,end,expected] of cases) {
   const page=await browser.newPage({viewport:{width:id==='T12'?375:1280,height:id==='T12'?812:900}});
   const errors=[]; page.on('pageerror',e=>errors.push(e.message));
   if(version==='v1') {
    await page.route('**/src/data/campus.ts*',async route=>{
     const response=await route.fetch(); let body=await response.text();
     const room=id==='T3'?'C-310':'A-101';
     const bookings=[{id:'case-base',roomCode:room,start:600,end:660,bookedBy:'Sample group',purpose:'Class'}];
     if(id==='T10') bookings.push({id:'case-second',roomCode:room,start:700,end:760,bookedBy:'Sample group',purpose:'Workshop'});
     if(!/const bookings = \[/.test(body)) throw new Error('Cannot find transformed booking data');
     body=body.replace(/const bookings = \[[\s\S]*?\n\];/,`const bookings = ${JSON.stringify(bookings)};`);
     await route.fulfill({response,body});
    });
   }
   await page.goto(`http://127.0.0.1:${version==='v1'?5175:5176}`,{waitUntil:'networkidle'});
   if(version==='v1' && ['T8','T9'].includes(id)) {
    await fill(page,start,'23:59');
    let error='';try {await page.locator('form input').nth(2).fill(end);}catch(e){error=e.message.split('\n')[0];}
    results[version][id]={actual:'Not testable',reason:error||'Native time control cannot express 24:00 or 24:01'};
   } else {
    const room=id==='T3'?'C-310':id==='T10'&&version==='final'?'B-204':'A-101';
    await fill(page,start,end,room);
    const before=await page.locator('section').nth(2).innerText();
    await page.getByRole('button',{name:'Check availability'}).click();
    if(id==='T11') await page.getByRole('button',{name:'Check availability'}).click();
    const actual=await result(page);
    const after=await page.locator('section').nth(2).innerText();
    results[version][id]={actual,expected,pass:actual===expected,bookingsUnchanged:before===after,errors};
    if(id==='T12') {
     results[version][id].layout=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth}));
     await page.screenshot({path:path.join(evidence,version==='final'?'final-narrow.png':'v1-narrow-retest.png'),fullPage:true});
    }
    if(id==='T1') {
     results.issues[version]={associatedLabels:await page.locator('label[for]').count()};
     await page.locator('form input').nth(1).fill('10:30');
     results.issues[version].resultAfterEditing=await result(page);
     await page.screenshot({path:path.join(evidence,version==='v1'?'before-1.png':'after-1.png'),fullPage:true});
     await page.getByRole('button',{name:'Check availability'}).click();
     results.issues[version].resultAfterRecheck=await result(page);
    }
   }
   await page.close();
  }
 }
 await browser.close();
 fs.writeFileSync(path.join(evidence,'browser-results.json'),JSON.stringify(results,null,2));
 console.log(JSON.stringify(results,null,2));
})().catch(e=>{console.error(e);process.exitCode=1});
