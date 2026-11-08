const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const out=process.argv[2];
const p=await b.newPage({viewport:{width:1440,height:900},deviceScaleFactor:2});await p.goto('http://localhost:8811/',{waitUntil:'networkidle'});
await p.addStyleTag({content:'*{animation-duration:0s!important;transition:none!important}.reveal{opacity:1!important;transform:none!important}'});
await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=400){scrollTo(0,y);await new Promise(r=>setTimeout(r,60))}});
const sel={hero:'.hero__panel',svc1:'#servicos .service >> nth=0',svc2:'#servicos .service >> nth=1',svc3:'#servicos .service >> nth=2',svc4:'#servicos .service >> nth=3',form:'.form',map:'.map-card',faq:'#faq .faq__item >> nth=0',steps:'#como-funciona .container',dif:'#diferenciais .container'};
for(const [k,s] of Object.entries(sel)){try{const e=p.locator(s).first();await e.scrollIntoViewIfNeeded();await p.waitForTimeout(250);await e.screenshot({path:`${out}/el-${k}.png`,omitBackground:true})}catch(x){console.log(k,x.message.slice(0,80))}}
await b.close()})();
