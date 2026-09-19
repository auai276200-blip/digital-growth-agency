(() => {
  const menu = document.querySelector('.menu');
  const nav = document.querySelector('.nav');
  if (menu && nav) {
    const panel = document.createElement('div');
    panel.className='mobile-panel';
    panel.innerHTML='<a href="#services">Services</a><a href="#why">Why Us</a><a href="#process">Process</a><a href="#contact">Contact</a><a href="https://wa.me/923341903823?text=Hi%20Digital%20Growth%20Agency%2C%20I%27d%20like%20a%20free%20consultation." target="_blank">Free Consultation ↗</a>';
    nav.after(panel);
    menu.addEventListener('click',()=>{panel.classList.toggle('open');document.body.classList.toggle('menu-open')});
    panel.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{panel.classList.remove('open');document.body.classList.remove('menu-open')}));
  }
  const reveal = () => {
    document.querySelectorAll('.reveal,.service-card,.why-panel,.steps>div').forEach(el=>{
      if(el.getBoundingClientRect().top < innerHeight*.9) el.classList.add('visible');
    });
  };
  addEventListener('scroll',reveal,{passive:true}); addEventListener('load',reveal);
  document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
    const target=document.querySelector(a.getAttribute('href')); if(!target)return;
    e.preventDefault(); target.scrollIntoView({behavior:'smooth',block:'start'});
  }));
})();
/* Lightweight Three.js motion scenes */
(() => {
  if (!window.THREE) return;
  const scenes = [];
  const makeScene = (id, type) => {
    const canvas = document.getElementById(id);
    if (!canvas) return;
    const host = canvas.parentElement;
    const renderer = new THREE.WebGLRenderer({canvas, alpha:true, antialias:true});
    renderer.setPixelRatio(Math.min(devicePixelRatio,2));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38,1,.1,100);
    camera.position.set(0,0,7);
    const group = new THREE.Group();
    scene.add(group);
    const light = new THREE.PointLight(0x8d7cff,2.2,20);
    light.position.set(3,4,5); scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff,1.4));
    let mesh;
    if(type==='hero'){
      mesh = new THREE.Mesh(new THREE.TorusKnotGeometry(1.35,.32,120,18),new THREE.MeshPhysicalMaterial({color:0x7468ff,metalness:.25,roughness:.18,clearcoat:1,transparent:true,opacity:.88}));
      group.add(mesh);
      for(let n=0;n<18;n++){const p=new THREE.Mesh(new THREE.SphereGeometry(.045,10,10),new THREE.MeshBasicMaterial({color:0x3db7ff})); const a=n/18*Math.PI*2; p.position.set(Math.cos(a)*(2+.2*Math.sin(n)),Math.sin(a)*(2+.2*Math.sin(n)),Math.sin(n*1.7)*.7); group.add(p);}
    } else if(type==='why'){
      mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1.25,2),new THREE.MeshPhysicalMaterial({color:0x9b8cff,metalness:.35,roughness:.16,wireframe:false,clearcoat:1,transparent:true,opacity:.9}));
      group.add(mesh);
      const ring=new THREE.Mesh(new THREE.TorusGeometry(2,.035,12,100),new THREE.MeshBasicMaterial({color:0x3db7ff,transparent:true,opacity:.8}));
      ring.rotation.x=.8; group.add(ring);
      const ring2=ring.clone(); ring2.scale.set(.7,.7,.7); ring2.rotation.y=.9; group.add(ring2);
    } else {
      mesh = new THREE.Mesh(new THREE.TorusGeometry(1.35,.38,24,90),new THREE.MeshPhysicalMaterial({color:0x6255f5,metalness:.3,roughness:.14,clearcoat:1,transparent:true,opacity:.9}));
      group.add(mesh);
      for(let n=0;n<28;n++){const p=new THREE.Mesh(new THREE.BoxGeometry(.07,.07,.07),new THREE.MeshBasicMaterial({color:n%2?0x3db7ff:0xffffff})); const a=n/28*Math.PI*2; p.position.set(Math.cos(a)*(2+.25*Math.sin(n)),Math.sin(a)*(2+.25*Math.sin(n)),Math.cos(n*1.9)*.6); group.add(p);}
    }
    const resize=()=>{const w=Math.max(1,host.clientWidth),h=Math.max(1,host.clientHeight); renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();};
    resize(); addEventListener('resize',resize,{passive:true});
    scenes.push({renderer,scene,camera,group,type,canvas});
  };
  makeScene('hero3d','hero'); makeScene('why3d','why'); makeScene('cta3d','cta');
  const clock=new THREE.Clock();
  const tick=()=>{
    const t=clock.getElapsedTime();
    scenes.forEach((s,i)=>{
      s.group.rotation.x = Math.sin(t*.35+i)*.08;
      s.group.rotation.y = t*(i===0?.24:.16);
      if(s.type==='why') s.group.rotation.z=Math.sin(t*.4)*.12;
      s.renderer.render(s.scene,s.camera);
    });
    requestAnimationFrame(tick);
  };
  tick();
})();

/* Interactive 3D tilt + scroll parallax */
(() => {
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce) return;
  document.querySelectorAll('.service-card').forEach(card=>{
    card.addEventListener('pointermove',e=>{
      const r=card.getBoundingClientRect(), x=(e.clientX-r.left)/r.width, y=(e.clientY-r.top)/r.height;
      card.style.setProperty('--mx',(x*100)+'%'); card.style.setProperty('--my',(y*100)+'%');
      card.style.transform='perspective(900px) rotateX('+((.5-y)*7)+'deg) rotateY('+((x-.5)*8)+'deg) translateY(-6px)';
    });
    card.addEventListener('pointerleave',()=>card.style.transform='');
  });
  document.querySelectorAll('.showcase-grid figure').forEach(card=>{
    card.addEventListener('pointermove',e=>{
      const r=card.getBoundingClientRect(), x=(e.clientX-r.left)/r.width, y=(e.clientY-r.top)/r.height;
      card.style.transform='perspective(1000px) rotateX('+((.5-y)*3)+'deg) rotateY('+((x-.5)*4)+'deg) translateY(-4px)';
    });
    card.addEventListener('pointerleave',()=>card.style.transform='');
  });
  const blocks=document.querySelectorAll('[data-parallax]');
  addEventListener('scroll',()=>{
    const sy=scrollY;
    blocks.forEach(el=>{
      const r=el.getBoundingClientRect(), center=innerHeight/2;
      const d=(r.top+r.height/2-center);
      el.style.setProperty('--scroll-shift',Math.max(-18,Math.min(18,-d*.035))+'px');
    });
  },{passive:true});
})();
