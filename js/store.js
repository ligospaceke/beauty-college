/* Data layer: data/site.json is the published truth. An admin session works on a local draft. */
const Store={key:'covelyne.draft',data:null,
isAdmin(){return sessionStorage.getItem('adm')==='1'},
async load(){
  let base;try{base=await (await fetch('data/site.json?v='+Date.now())).json()}catch(e){base={settings:{},courses:[],products:[],gallery:[],orders:[],admin:{}}}
  this.base=base;const d=this.isAdmin()&&localStorage.getItem(this.key);
  this.data=d?JSON.parse(d):JSON.parse(JSON.stringify(base));return this.data},
save(){try{localStorage.setItem(this.key,JSON.stringify(this.data));return true}catch(e){alert('Browser storage is full. Remove some images or publish first.');return false}},
discard(){localStorage.removeItem(this.key);this.data=JSON.parse(JSON.stringify(this.base))},
async hash(s){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')},
async publish(gh){const u=`https://api.github.com/repos/${gh.repo}/contents/data/site.json`,H={Authorization:'Bearer '+gh.token,Accept:'application/vnd.github+json'};
  const cur=await fetch(u+'?ref='+encodeURIComponent(gh.branch),{headers:H});const sha=cur.ok?(await cur.json()).sha:undefined;
  const content=btoa(unescape(encodeURIComponent(JSON.stringify(this.data,null,1))));
  const r=await fetch(u,{method:'PUT',headers:{...H,'Content-Type':'application/json'},body:JSON.stringify({message:'Update site content from admin panel',content,branch:gh.branch,sha})});
  if(!r.ok)throw new Error((await r.json()).message||r.status);localStorage.removeItem(this.key)}};
