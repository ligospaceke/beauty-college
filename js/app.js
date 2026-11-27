(async()=>{
const D=await Store.load(),$=(s,r=document)=>r.querySelector(s),esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const KES=n=>'KES '+Number(n||0).toLocaleString(),uid=()=>Math.random().toString(36).slice(2,8),S=()=>D.settings;
const wa=t=>`https://wa.me/${S().whatsapp}?text=${encodeURIComponent(t)}`;
let cart=JSON.parse(localStorage.getItem('covelyne.cart')||'[]'),cat='All',tab='products';
const toast=m=>{const t=$('#ts');t.textContent=m;t.classList.add('on');setTimeout(()=>t.classList.remove('on'),2200)};
const saveCart=()=>{localStorage.setItem('covelyne.cart',JSON.stringify(cart));$('#cn').textContent=cart.length};
const sw=p=>p.img?`<img src="${esc(p.img)}" alt="${esc(p.name)}">`:`<i style="--a:${60+p.name.length*7}deg"></i>`;
const stockTag=p=>p.stock<=0?'<span class="tag no">Sold out</span>':p.stock<3?`<span class="tag lo">Only ${p.stock} left</span>`:'<span class="tag">In stock</span>';

/* ---------- public views ---------- */
const V={
home:()=>`<section class="hero"><div class="bg"><img src="${esc(S().hero)}" alt="Students at work in the Covelyne studio"></div><div class="in"><h1>${esc(S().headline)}</h1><p>${esc(S().sub)}</p><a class="btn" href="#/admissions">Apply for the next intake</a><a class="btn o" href="#/programmes">Explore programmes</a></div></section>
<section class="stats"><div class="max"><div class="c"><b>${D.courses.length}</b><span>Programmes in hair, nails and business</span></div><div class="c"><b>Live</b><span>Training on real clients from week one</span></div><div class="c"><b>Small</b><span>Studio classes with hands-on tutors</span></div><div class="c"><b>Global</b><span>Partner educators and placement routes</span></div></div></section>
<section class="wrap"><div class="max two"><div><h2>We train talent, build professionals and connect them to opportunity.</h2><p>Founded as a working salon, ${esc(S().name)} grew into a school because the craft kept asking for more teachers. Every student learns inside a live studio, in uniform, with real standards.</p><p><a class="btn" href="#/about">Our story</a></p></div><div class="ph"><img src="${esc((D.gallery[8]||D.gallery[0]||{}).src)}" alt="Cohort with a client"></div></div></section>
<section class="wrap alt"><div class="max"><h2 class="t">Programmes</h2><div class="pg">${D.courses.slice(0,3).map(courseCard).join('')}</div></div></section>
<section class="wrap"><div class="max"><h2 class="t">Student life</h2><div class="gal">${D.gallery.slice(0,6).map(gfig).join('')}</div><p style="margin-top:20px"><a class="btn o" href="#/student-life">See the full gallery</a></p></div></section>
<section class="split"><div><div class="bgi"><img src="${esc(S().studio)}" alt="Training studio"></div><div><h2>The Academy</h2><p>Study the craft, earn the certificate, build a career.</p><a class="btn" href="#/programmes">View programmes</a></div></div><div style="background:#120b0e"><div><h2>The Hair Collection</h2><p>Human hair wigs, bundles, closures and frontals, chosen by the people who train the stylists.</p><a class="btn" href="#/collection">Enter the collection</a></div></div></section>`,
about:()=>`<section class="wrap page"><div class="max two"><div><h1 class="serif" style="font-size:clamp(38px,6vw,80px)">From salon to school.</h1><p>${esc(S().name)} began as a working salon. As demand for trained stylists and nail technicians grew, we opened our doors to students, and kept the salon floor as the classroom.</p><p><b>Vision.</b> A beauty education institution with a global identity, rooted in Africa and open to the world.</p><p><b>Mission.</b> Develop talent, create professionals and connect graduates to opportunities.</p></div><div class="ph"><img src="${esc((D.gallery[6]||D.gallery[0]||{}).src)}" alt="Live client training"></div></div></section>`,
programmes:()=>`<section class="wrap page"><div class="max"><h1>Programmes</h1><div class="pg">${D.courses.map(courseCard).join('')}</div></div></section>`,
programme:id=>{const c=D.courses.find(x=>x.id===id);if(!c)return V.programmes();return `<section class="wrap page"><div class="max two"><div><h1 class="serif" style="font-size:clamp(38px,6vw,80px)">${esc(c.name)}</h1><p>${esc(c.summary)}</p><p><b>${esc(c.level)}</b> · ${esc(c.duration)} · ${KES(c.fee)}</p><ul class="list">${String(c.outcomes).split(';').map(o=>`<li>${esc(o.trim())}</li>`).join('')}</ul><a class="btn" href="${wa('Hello, I would like to enquire about the '+c.name+' programme.')}" target="_blank" rel="noopener">Enquire on WhatsApp</a><a class="btn o" href="#/admissions">Apply</a></div><div class="ph"><img src="${esc(c.img)}" alt="${esc(c.name)}"></div></div></section>`},
'student-life':()=>`<section class="wrap page"><div class="max"><h1>Student life</h1><div class="gal">${D.gallery.map(gfig).join('')}</div></div></section>`,
admissions:()=>`<section class="wrap page"><div class="max two"><div class="form"><h1 class="serif" style="font-size:clamp(38px,6vw,80px)">Begin your application</h1><p>An admissions advisor replies on WhatsApp within one working day.</p>
<input id="an" placeholder="Full name" autocomplete="name"><input id="ap" placeholder="Phone number" autocomplete="tel"><select id="ac">${D.courses.map(c=>`<option>${esc(c.name)}</option>`).join('')}</select><textarea id="am" rows="3" placeholder="Anything we should know?"></textarea><button class="btn" data-act="apply">Send application on WhatsApp</button>
<h3 style="font-size:28px;margin-top:30px">Entry requirements</h3><ul class="list"><li>Minimum age 17</li><li>KCSE certificate or equivalent (copy)</li><li>National ID or passport (copy)</li><li>Registration fee paid before the intake starts</li></ul></div><div class="ph"><img src="${esc((D.gallery[4]||D.gallery[0]||{}).src)}" alt="Students at the practice tables"></div></div></section>`,
collection:()=>{const ks=['All',...new Set(D.products.map(p=>p.cat))];return `<section class="wrap page"><div class="max"><div class="shophd"><h1>The Hair<br>Collection</h1><p>Quality human hair, described honestly. Order here or on WhatsApp.</p></div><div class="fl">${ks.map(k=>`<button class="${k===cat?'on':''}" data-act="cat" data-v="${esc(k)}">${esc(k)}</button>`).join('')}<a class="btn o s" href="#/track" style="margin-left:auto">Track an order</a></div>
<div class="grid">${D.products.filter(p=>cat==='All'||p.cat===cat).map(p=>`<div class="pr"><a href="#/product/${p.id}"><div class="sw">${sw(p)}</div><h3>${esc(p.name)}</h3></a><div class="sp">${esc(p.texture)} · ${esc(p.length)} · ${esc(p.lace)}</div><div class="row"><b>${KES(p.price)}</b>${stockTag(p)}</div><button class="btn s" style="margin-top:12px" data-act="add" data-v="${p.id}" ${p.stock<=0?'disabled':''}>Add to bag</button></div>`).join('')}</div></div></section>`},
product:id=>{const p=D.products.find(x=>x.id===id);if(!p)return V.collection();return `<section class="wrap page"><div class="max two"><div class="ph"><div class="sw" style="height:100%">${sw(p)}</div></div><div><h1 class="serif" style="font-size:clamp(38px,6vw,76px)">${esc(p.name)}</h1><p>${esc(p.desc)}</p><ul class="list"><li>Category: ${esc(p.cat)}</li><li>Texture: ${esc(p.texture)}</li><li>Length: ${esc(p.length)}</li><li>Lace / type: ${esc(p.lace)}</li></ul><p><b style="font-size:24px;color:var(--txt)">${KES(p.price)}</b> ${stockTag(p)}</p><button class="btn" data-act="add" data-v="${p.id}" ${p.stock<=0?'disabled':''}>Add to bag</button><a class="btn o" href="${wa('Hello, I am interested in: '+p.name)}" target="_blank" rel="noopener">Ask on WhatsApp</a></div></div></section>`},
track:()=>`<section class="wrap page"><div class="max form"><h1 class="serif" style="font-size:clamp(38px,6vw,80px)">Track your order</h1><p>Enter the order number we sent you, for example HC-1024.</p><input id="ti" placeholder="HC-1024"><button class="btn" data-act="track">Track order</button><div id="tr"></div></div></section>`,
contact:()=>`<section class="wrap page"><div class="max form"><h1 class="serif" style="font-size:clamp(38px,6vw,80px)">Contact</h1><p>${esc(S().location)}<br>${esc(S().email)}</p><a class="btn" href="${wa('Hello, I have an enquiry.')}" target="_blank" rel="noopener">Message us on WhatsApp</a></div></section>`};
function courseCard(c){return `<a class="card" href="#/programme/${c.id}"><img src="${esc(c.img)}" alt="${esc(c.name)}"><div><h3>${esc(c.name)}</h3><p>${esc(c.summary)}</p></div></a>`}
function gfig(g){return `<figure data-act="zoom"><img loading="lazy" src="${esc(g.src)}" alt="${esc(g.caption)}"></figure>`}

/* ---------- admin ---------- */
const FIELDS={products:[{k:'img',t:'img'},{k:'name',n:'Name'},{k:'cat',n:'Category'},{k:'texture',n:'Texture'},{k:'length',n:'Length'},{k:'lace',n:'Lace type'},{k:'price',n:'Price (KES)',t:'number'},{k:'stock',n:'Stock',t:'number'},{k:'desc',n:'Description',t:'area'}],
courses:[{k:'img',t:'img'},{k:'name',n:'Name'},{k:'level',n:'Level'},{k:'duration',n:'Duration'},{k:'fee',n:'Fee (KES)',t:'number'},{k:'summary',n:'Summary',t:'area'},{k:'outcomes',n:'Outcomes (separate with ;)',t:'area'}],
gallery:[{k:'src',t:'img'},{k:'caption',n:'Caption'}],orders:[{k:'no',n:'Order number'},{k:'status',n:'Status',t:'sel'},{k:'note',n:'Note for customer'}]};
const NEW={products:()=>({id:uid(),name:'New product',cat:'Wigs',texture:'',length:'',lace:'',price:0,stock:0,img:'',desc:''}),courses:()=>({id:uid(),name:'New course',level:'Certificate',duration:'',fee:0,img:'',summary:'',outcomes:''}),orders:()=>({no:'HC-'+(1000+Math.floor(Math.random()*9000)),status:'Received',note:''})};
const ST=['Received','Packed','Dispatched','Delivered'];
function fld(l,i,it,f){const a=`data-l="${l}" data-i="${i}" data-k="${f.k}"`;
 if(f.t==='img')return `<label class="im">${it[f.k]?`<img src="${esc(it[f.k])}" alt="">`:'<span>Add image</span>'}<input type="file" accept="image/*" ${a}></label>`;
 if(f.t==='area')return `<label>${f.n}<textarea ${a} rows="3">${esc(it[f.k])}</textarea></label>`;
 if(f.t==='sel')return `<label>${f.n}<select ${a}>${ST.map(s=>`<option ${s===it[f.k]?'selected':''}>${s}</option>`).join('')}</select></label>`;
 return `<label>${f.n}<input ${a} type="${f.t||'text'}" value="${esc(it[f.k])}"></label>`}
function editor(l){const L=D[l];const cells=L.map((it,i)=>`<div class="er">${FIELDS[l].map(f=>fld(l,i,it,f)).join('')}<button class="x" data-act="del" data-l="${l}" data-i="${i}">Delete</button></div>`).join('');
 const add=l==='gallery'?`<label class="btn">Add photos<input type="file" accept="image/*" multiple data-gal style="display:none"></label>`:`<button class="btn" data-act="new" data-l="${l}">Add ${l==='orders'?'order':l.slice(0,-1)}</button>`;
 return (l==='gallery'?`<div class="agrid">${cells}</div>`:cells)+`<p style="margin-top:14px">${add}</p>`}
const gh=()=>JSON.parse(sessionStorage.getItem('gh')||localStorage.getItem('covelyne.gh')||'{}');
function admin(){
 if(!Store.isAdmin())return `<section class="wrap page"><div class="max form"><h1 class="serif" style="font-size:clamp(38px,6vw,80px)">Admin</h1><p>Enter the admin password to manage products, courses, photos and orders.</p><input id="pw" type="password" placeholder="Password" autocomplete="current-password"><button class="btn" data-act="login">Sign in</button></div></section>`;
 const T=['products','courses','gallery','orders','settings'],g=gh(),s=S();
 const body=tab==='settings'?`<div class="form"><h3 style="font-size:28px">Site details</h3>${['name','tagline','whatsapp','email','location','headline','sub'].map(k=>`<label>${k}<input data-s="${k}" value="${esc(s[k])}"></label>`).join('')}<label>Hero image<span class="im" style="display:block;width:160px;height:100px;position:relative;overflow:hidden"><img src="${esc(s.hero)}" alt=""><input type="file" accept="image/*" data-hero style="position:absolute;inset:0;opacity:0"></span></label>
<h3 style="font-size:28px;margin-top:26px">Change password</h3><input id="np" type="password" placeholder="New password"><button class="btn s" data-act="pw">Save password</button>
<h3 style="font-size:28px;margin-top:26px">Publish to GitHub</h3><p class="note">Needs a fine-grained token with Contents: read and write on this repository. It stays in this browser tab only.</p><input id="gr" placeholder="owner/repository" value="${esc(g.repo||'')}"><input id="gb" placeholder="branch (main)" value="${esc(g.branch||'main')}"><input id="gt" type="password" placeholder="Token" value="${esc(g.token||'')}"></div>`:editor(tab);
 return `<section class="wrap page"><div class="max"><h1 style="font-size:clamp(38px,6vw,72px)">Admin</h1><p class="note">Edits are saved as a draft in this browser. Choose Publish to make them live for every visitor.</p>
 <div class="tabs">${T.map(t=>`<button class="${t===tab?'on':''}" data-act="tab" data-v="${t}">${t}</button>`).join('')}</div>${body}
 <p style="margin-top:30px"><button class="btn" data-act="publish">Publish to GitHub</button><button class="btn o" data-act="export">Download site.json</button><label class="btn o">Import site.json<input type="file" accept=".json" data-imp style="display:none"></label><button class="btn o" data-act="discard">Discard draft</button><button class="btn o" data-act="logout">Sign out</button></p></div></section>`}
const fileData=(f,w=1000)=>new Promise(r=>{const fr=new FileReader();fr.onload=()=>{const i=new Image();i.onload=()=>{const k=Math.min(1,w/Math.max(i.width,i.height)),c=document.createElement('canvas');c.width=i.width*k;c.height=i.height*k;c.getContext('2d').drawImage(i,0,0,c.width,c.height);r(c.toDataURL('image/jpeg',.75))};i.src=fr.result};fr.readAsDataURL(f)});

/* ---------- shell ---------- */
function bag(){saveCart();$('#dr').innerHTML=`<h3>Your bag</h3><div class="items">${cart.length?cart.map((p,i)=>`<div class="li"><span>${esc(p.name)}<br><small>${esc(p.length)}</small></span><span>${KES(p.price)}<br><button data-act="rm" data-v="${i}">Remove</button></span></div>`).join(''):'<p>Your bag is empty. Add a piece from the collection.</p>'}</div><div class="li" style="font-weight:600"><span>Total</span><span>${KES(cart.reduce((a,p)=>a+p.price,0))}</span></div><input id="cname" placeholder="Your name"><input id="cdel" placeholder="Phone and delivery area"><button class="btn" data-act="order" style="margin-top:8px;width:100%">Order on WhatsApp</button><button class="btn o" data-act="close" style="width:100%;color:#1b1215">Close</button>`}
function shell(){document.title=S().name+' | '+S().tagline;$('#lg').innerHTML=S().name.replace(/(\S+)$/,'<i>$1</i>');
 $('#nv').innerHTML=[['','Academy'],['about','About'],['programmes','Programmes'],['student-life','Student life'],['admissions','Admissions'],['collection','The Hair Collection'],['contact','Contact']].map(([h,t])=>`<a href="#/${h}" data-h="${h}">${t}</a>`).join('');
 $('#ft').innerHTML=`<div><div class="logo">${S().name.replace(/(\S+)$/,'<i>$1</i>')}</div><p>${esc(S().tagline)} · The Hair Collection</p></div><p>${esc(S().location)}<br>${esc(S().email)}</p><div><a href="#/contact">Contact</a><a href="#/track">Track order</a><a href="#/admin">Admin</a></div>`;$('#wa').href=wa('Hello, I have an enquiry.')}
function route(){const [p,id]=(location.hash.replace(/^#\/?/,'')||'').split('/');const name=p||'home';
 document.body.classList.toggle('shop',['collection','product','track'].includes(name));$('#hd').classList.toggle('s',name!=='home'||scrollY>60);
 const v=name==='admin'?admin:V[name]||V.home;$('#app').innerHTML=v(id);$('#nv').classList.remove('on');
 document.querySelectorAll('#nv a').forEach(a=>a.classList.toggle('on',a.dataset.h===p));scrollTo(0,0)}
function redraw(){const y=scrollY;$('#app').innerHTML=(location.hash.startsWith('#/admin')?admin:()=>{route();return $('#app').innerHTML})();scrollTo(0,y)}

/* ---------- events ---------- */
document.addEventListener('click',async e=>{const t=e.target.closest('[data-act]');if(!t)return;const a=t.dataset.act,v=t.dataset.v,l=t.dataset.l,i=+t.dataset.i;
 if(a==='zoom'){$('#lb img').src=t.querySelector('img').src;$('#lb').classList.add('on')}
 if(a==='cat'){cat=v;$('#app').innerHTML=V.collection()}
 if(a==='add'){const p=D.products.find(x=>x.id===v);cart.push({id:p.id,name:p.name,price:p.price,length:p.length});bag();$('#dr').classList.add('on')}
 if(a==='rm'){cart.splice(+v,1);bag()}if(a==='close')$('#dr').classList.remove('on');
 if(a==='order'){if(!cart.length)return;open(wa("Hello, I'd like to order from The Hair Collection:\n"+cart.map(p=>'- '+p.name+' ('+KES(p.price)+')').join('\n')+'\nTotal: '+KES(cart.reduce((x,p)=>x+p.price,0))+'\nName: '+$('#cname').value+'\nDelivery: '+$('#cdel').value),'_blank')}
 if(a==='apply')open(wa(`Application: ${$('#ac').value}\nName: ${$('#an').value}\nPhone: ${$('#ap').value}\n${$('#am').value}`),'_blank');
 if(a==='track'){const o=D.orders.find(x=>x.no.toLowerCase()===$('#ti').value.trim().toLowerCase()),n=o?ST.indexOf(o.status):-1;$('#tr').innerHTML=o?`<h3 style="font-size:30px;margin-top:20px">${esc(o.no)}: ${esc(o.status)}</h3><div class="steps">${ST.map((s,k)=>`<span class="${k<=n?'on':''}"></span>`).join('')}</div><p>${esc(o.note)}</p>`:'<p style="margin-top:16px">We could not find that order number. Check it and try again, or message us on WhatsApp.</p>'}
 /* admin */
 if(a==='login'){if(await Store.hash($('#pw').value)===D.admin.hash){sessionStorage.setItem('adm','1');location.reload()}else toast('Wrong password')}
 if(a==='logout'){sessionStorage.removeItem('adm');location.hash='#/';location.reload()}
 if(a==='tab'){tab=v;route()}
 if(a==='del'&&confirm('Delete this item?')){D[l].splice(i,1);Store.save();route()}
 if(a==='new'){D[l].unshift(NEW[l]());Store.save();route()}
 if(a==='pw'){const n=$('#np').value;if(n.length<6)return toast('Use at least 6 characters');D.admin.hash=await Store.hash(n);Store.save();toast('Password saved. Publish to keep it.')}
 if(a==='export'){const b=new Blob([JSON.stringify(D,null,1)],{type:'application/json'}),k=document.createElement('a');k.href=URL.createObjectURL(b);k.download='site.json';k.click()}
 if(a==='discard'&&confirm('Discard unpublished changes?')){Store.discard();location.reload()}
 if(a==='publish'){const g={repo:($('#gr')||{}).value||gh().repo,branch:($('#gb')||{}).value||gh().branch||'main',token:($('#gt')||{}).value||gh().token};if(!g.repo||!g.token){tab='settings';route();return toast('Add repository and token in Settings')}
  sessionStorage.setItem('gh',JSON.stringify(g));toast('Publishing...');try{await Store.publish(g);toast('Published. The live site updates in about a minute.')}catch(err){alert('Publish failed: '+err.message)}}});
document.addEventListener('change',async e=>{const t=e.target;
 if(t.dataset.gal!==undefined){for(const f of t.files)D.gallery.unshift({src:await fileData(f),caption:'New photo'});Store.save()&&route();return}
 if(t.dataset.imp!==undefined){try{Object.assign(D,JSON.parse(await t.files[0].text()));Store.save();route();toast('Imported')}catch(x){alert('Not a valid site.json')}return}
 if(t.dataset.hero!==undefined){S().hero=await fileData(t.files[0],1600);Store.save();route();return}
 if(t.dataset.s){S()[t.dataset.s]=t.value;Store.save();return}
 if(t.dataset.l!==undefined){const it=D[t.dataset.l][+t.dataset.i],k=t.dataset.k;
  if(t.type==='file'){it[k]=await fileData(t.files[0],k==='src'?1000:900);Store.save()&&route()}else{it[k]=t.type==='number'?Number(t.value):t.value;Store.save()}}});
$('#lb').onclick=()=>$('#lb').classList.remove('on');$('#cbtn').onclick=()=>{bag();$('#dr').classList.add('on')};$('#mb').onclick=()=>$('#nv').classList.toggle('on');
addEventListener('scroll',()=>{if((location.hash.replace(/^#\/?/,'')||'home')==='home')$('#hd').classList.toggle('s',scrollY>60)});
addEventListener('hashchange',route);shell();bag();route();
})();
