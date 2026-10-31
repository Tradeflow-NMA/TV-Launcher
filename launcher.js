// Shared preview logic for the three options: markup, clock, D-pad focus, rotating feature.
// Each option-*.html supplies only its own CSS and <body data-note>.
const APPS=[
  ["YouTube","#f2f2f2","#1b1b1b"],["NOVA+","#d27626","#fff"],["Netflix","#141414","#fff"],
  ["Prime Video","#1a98ff","#fff"],["NRK TV","#0b1f4a","#fff"],["TV 2 Play","#2b2b2b","#fff"],
  ["Spotify","#121212","#fff"],["Disney+","#0b2a63","#fff"]
];
// shortcut: sample featured apps and copy, replace with your own picks before the APK
const FEATURES=[
  ["NOVA+","Your own cinema library.","#d27626","#140a03"],
  ["NRK TV","Live channels and the full archive.","#2a4fb0","#fff"],
  ["Spotify","Music for the whole room.","#1c9e50","#04140a"]
];
const ICON={
  play:'<path d="M8 5v14l11-7z"/>',
  grid:'<path d="M4 4h6v6H4zm10 0h6v6h-6zM4 14h6v6H4zm10 0h6v6h-6z"/>',
  moon:'<path d="M12 3a9 9 0 1 0 9 9 7 7 0 0 1-9-9z"/>'
};
const row=(ic,l,s,act,r='')=>`<div class="row nav" data-g="rows" data-act="${act}"><span class="ic"><svg viewBox="0 0 24 24" fill="currentColor">${ICON[ic]}</svg></span><div><div class="l">${l}</div><div class="s">${s}</div></div>${r&&`<span class="r">${r}</span>`}</div>`;

document.body.insertAdjacentHTML('afterbegin',`<div class="wrap">
  <div class="note"><span><b>${document.title}</b> · 1920×1080, scaled to fit. Nothing is installed.</span><span>Use <kbd>←</kbd><kbd>↑</kbd><kbd>→</kbd><kbd>↓</kbd> and <kbd>Enter</kbd> like the remote, or click.</span></div>
  <div class="frame" id="frame"><div class="stage" id="stage">
    <div class="wall"></div><div class="backdrop"></div>
    <div class="panel">
      <div><div class="clock" id="clock"></div><div class="date" id="date"></div></div>
      <div class="chips">
        <div class="chip nav" data-g="chips" data-act="Switch to HDMI 1">HDMI 1</div>
        <div class="chip nav" data-g="chips" data-act="Switch to HDMI 2">HDMI 2</div>
        <div class="chip nav" data-g="chips" data-act="Open Android settings">Settings</div>
      </div>
      <div class="rows">
        ${row('play','Continue Watching','NOVA+ · tonight','Resume in NOVA+')}
        ${row('grid','All Apps','Everything on this TV','Open all installed apps','14')}
        ${row('moon','Screen Off','Audio keeps playing','Turn the screen off, keep audio')}
      </div>
    </div>
    <div class="feature nav" data-g="feature">
      <div class="art"></div>
      <div class="copy"><h2 id="ftitle"></h2><p id="fline"></p><div class="btn">Open</div></div>
      <div class="dots">${FEATURES.map(()=>'<i></i>').join('')}</div>
    </div>
    <div class="rail" id="rail"></div>
    <div class="name" id="name"></div>
    <div class="toast" id="toast"></div>
  </div></div>
  <div class="note"><span>${document.body.dataset.note||''}</span></div>
</div>`);

const $=id=>document.getElementById(id);
const stage=$('stage'),frame=$('frame'),rail=$('rail');
APPS.forEach(([n,bg,fg])=>{const d=document.createElement('div');d.className='app nav';Object.assign(d.dataset,{g:'rail',act:'Open '+n,tint:bg,name:n});d.style.background=bg;d.style.color=fg;d.textContent=n;rail.appendChild(d)});

function fit(){stage.style.transform='scale('+frame.clientWidth/1920+')'}
new ResizeObserver(fit).observe(frame);fit();

function tick(){const d=new Date();
  $('clock').textContent=d.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});
  $('date').textContent=d.toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'})}
tick();setInterval(tick,10000);

// rotating feature: advances every 8 s, holds while it has focus
const feat=document.querySelector('.feature');let fi=0,swapT;
function showFeature(i){fi=i;const [n,l,c,ink]=FEATURES[i];
  feat.classList.add('swap');clearTimeout(swapT);
  swapT=setTimeout(()=>{$('ftitle').textContent=n;$('fline').textContent=l;
    stage.style.setProperty('--feat',c);stage.style.setProperty('--feat-ink',ink);feat.dataset.act='Open '+n;feat.dataset.tint=c;
    feat.querySelectorAll('.dots i').forEach((d,j)=>d.classList.toggle('on',j===i));
    feat.classList.remove('swap');if(cur.g==='feature')paint(0)},180)}
setInterval(()=>{if(cur.g!=='feature'&&!document.hidden)showFeature((fi+1)%FEATURES.length)},8000);

// D-pad focus, same grid as the first prototype
const G={chips:[...document.querySelectorAll('[data-g=chips]')],rows:[...document.querySelectorAll('[data-g=rows]')],feature:[feat],rail:[...rail.children]};
let cur={g:'rail',i:0},tiltT;
const el=()=>G[cur.g][cur.i];
function railOff(){return cur.g==='rail'?Math.max(0,G.rail[cur.i].offsetLeft-1400):0}
function paint(dir){
  document.querySelectorAll('.focused').forEach(e=>e.classList.remove('focused'));
  const e=el();e.classList.add('focused');
  // --dir leans the tile toward the move, then settles; options decide whether to use it
  e.style.setProperty('--dir',dir);clearTimeout(tiltT);tiltT=setTimeout(()=>e.style.setProperty('--dir',0),160);
  stage.style.setProperty('--tint',e.dataset.tint||'#2a2c34');
  const nm=$('name');nm.textContent=e.dataset.name||'';nm.classList.toggle('on',cur.g==='rail');
  const off=railOff();rail.style.transform='translateX('+(-off)+'px)';
  if(cur.g==='rail')nm.style.left=(80+e.offsetLeft-off)+'px'}
function move(k){const {g,i}=cur;let dir=0;
  if(g==='rail'){if(k==='ArrowLeft'&&i>0){cur.i--;dir=-1}else if(k==='ArrowRight'&&i<G.rail.length-1){cur.i++;dir=1}else if(k==='ArrowUp')cur=i<2?{g:'rows',i:2}:{g:'feature',i:0}}
  else if(g==='feature'){if(k==='ArrowDown')cur={g:'rail',i:2};else if(k==='ArrowLeft')cur={g:'rows',i:0}}
  else if(g==='rows'){if(k==='ArrowUp')cur=i>0?{g,i:i-1}:{g:'chips',i:0};else if(k==='ArrowDown')cur=i<2?{g,i:i+1}:{g:'rail',i:0};else if(k==='ArrowRight')cur={g:'feature',i:0}}
  else if(g==='chips'){if(k==='ArrowLeft'&&i>0)cur.i--;else if(k==='ArrowRight')cur=i<2?{g,i:i+1}:{g:'feature',i:0};else if(k==='ArrowDown')cur={g:'rows',i:0}}
  paint(dir)}
let tt;function act(e){const t=$('toast');t.textContent='On the TV: '+e.dataset.act;t.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('on'),1600)}
document.addEventListener('keydown',e=>{if(e.key.startsWith('Arrow')){e.preventDefault();move(e.key)}else if(e.key==='Enter'){act(el())}});
Object.entries(G).forEach(([g,list])=>list.forEach((e,i)=>e.addEventListener('click',()=>{cur={g,i};paint(0);act(e)})));
showFeature(0);paint(0);
