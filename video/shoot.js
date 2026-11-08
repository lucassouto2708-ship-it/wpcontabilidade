const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const out=process.argv[2];
const ids=['inicio','sobre','servicos','diferenciais','como-funciona','depoimentos','faq','contato'];
for(const [name,vp] of [['d',{width:1440,height:900}],['m',{width:390,height:844}]]){
 const p=await b.newPage({viewport:vp,deviceScaleFactor:2});await p.goto('http://localhost:8811/',{waitUntil:'networkidle'});
 await p.addStyleTag({content:'*{animation-duration:0s!important;transition:none!important}.reveal,.text-animate,[class*=reveal]{opacity:1!important;transform:none!important}'});
 await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=400){scrollTo(0,y);await new Promise(r=>setTimeout(r,60))}document.querySelectorAll('*').forEach(e=>e.classList.add('is-visible','in','visible','show'))});
 for(const id of ids){await p.evaluate(i=>{const e=document.getElementById(i);scrollTo(0,e.getBoundingClientRect().top+scrollY-(i=='inicio'?0:60))},id);await p.waitForTimeout(400);await p.screenshot({path:`${out}/${name}-${id}.png`});}
}await b.close()})();
