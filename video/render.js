const {chromium}=require('playwright');(async()=>{const [,,dir,out,fps,only]=process.argv;const b=await chromium.launch();
const p=await b.newPage({viewport:{width:1920,height:1080}});await p.goto('file://'+dir+'/scene.html');await p.waitForLoadState('networkidle');await p.evaluate(()=>document.fonts.ready);
const ts=only?only.split(',').map(Number):[...Array(40*fps).keys()].map(i=>i/fps);
for(let i=0;i<ts.length;i++){await p.evaluate(t=>setT(t),ts[i]);await p.screenshot({path:`${out}/${String(i).padStart(5,'0')}.jpg`,type:'jpeg',quality:92});}
await b.close()})();
