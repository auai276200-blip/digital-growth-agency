(() => {
  const loader = document.querySelector('.loader');
  const line = document.querySelector('.loader-line i');
  if (window.gsap) {
    gsap.to(line,{width:'100%',duration:1.1,ease:'power2.inOut'});
    gsap.to(loader,{autoAlpha:0,duration:.7,delay:1.25,ease:'power2.inOut',onComplete:()=>loader.remove()});
  } else loader?.remove();

  // Three.js particle sphere / constellation
  const canvas = document.getElementById('hero-canvas');
  if (window.THREE && canvas) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, innerWidth/innerHeight,.1,100);
    camera.position.z = 4.7;
    const renderer = new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
    renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));
    renderer.setSize(innerWidth,innerHeight);
    const group = new THREE.Group(); scene.add(group);

    const count = innerWidth < 700 ? 650 : 1100;
    const pos = new Float32Array(count*3);
    const pts = [];
    for(let i=0;i<count;i++){
      const u=Math.random(), v=Math.random();
      const theta=2*Math.PI*u, phi=Math.acos(2*v-1);
      const r=1.55 + (Math.random()-.5)*.22;
      const x=r*Math.sin(phi)*Math.cos(theta), y=r*Math.sin(phi)*Math.sin(theta), z=r*Math.cos(phi);
      pos[i*3]=x;pos[i*3+1]=y;pos[i*3+2]=z;pts.push(new THREE.Vector3(x,y,z));
    }
    const geo=new THREE.BufferGeometry(); geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
    const mat=new THREE.PointsMaterial({color:0xd9d7ff,size:.018,transparent:true,opacity:.8,sizeAttenuation:true});
    group.add(new THREE.Points(geo,mat));

    const linePositions=[]; const maxDist=.48;
    for(let i=0;i<count;i+=2){
      for(let j=i+1;j<Math.min(i+55,count);j++){
        if(pts[i].distanceTo(pts[j])<maxDist){linePositions.push(pts[i].x,pts[i].y,pts[i].z,pts[j].x,pts[j].y,pts[j].z)}
      }
    }
    const lgeo=new THREE.BufferGeometry();lgeo.setAttribute('position',new THREE.Float32BufferAttribute(linePositions,3));
    const lmat=new THREE.LineBasicMaterial({color:0x8b82ff,transparent:true,opacity:.12}); group.add(new THREE.LineSegments(lgeo,lmat));
    const core=new THREE.Mesh(new THREE.IcosahedronGeometry(1.18,2),new THREE.MeshBasicMaterial({color:0x7b70d9,wireframe:true,transparent:true,opacity:.07}));group.add(core);
    const mouse={x:0,y:0};
    addEventListener('pointermove',e=>{mouse.x=(e.clientX/innerWidth-.5)*2;mouse.y=(e.clientY/innerHeight-.5)*2});
    addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.7))});
    let t=0;
    function render(){t+=.003;group.rotation.y+=.0018;group.rotation.x=Math.sin(t)*.06;group.position.x+=(mouse.x*.18-group.position.x)*.025;group.position.y+=(-mouse.y*.12-group.position.y)*.025;core.rotation.x+=.002;core.rotation.y-=.001;renderer.render(scene,camera);requestAnimationFrame(render)} render();
  }

  if(window.gsap){
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray('.reveal').forEach((el,i)=>gsap.to(el,{opacity:1,y:0,duration:1,ease:'power3.out',delay:.12+i*.08}));
    gsap.utils.toArray('.service-card').forEach(card=>{
      gsap.from(card,{scrollTrigger:{trigger:card,start:'top 88%'},opacity:0,y:35,duration:.8,ease:'power3.out'});
      card.addEventListener('mousemove',e=>{const r=card.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(900px) rotateX(${y*-3}deg) rotateY(${x*3}deg) translateY(-5px)`});
      card.addEventListener('mouseleave',()=>card.style.transform='');
    });
    gsap.to('.statement-orbit',{rotation:360,duration:40,repeat:-1,ease:'none'});
    gsap.to('.cta-sphere',{y:-30,scrollTrigger:{trigger:'.cta',start:'top bottom',end:'bottom top',scrub:1}});
    document.querySelectorAll('.magnetic').forEach(btn=>{btn.addEventListener('mousemove',e=>{const r=btn.getBoundingClientRect();gsap.to(btn,{x:(e.clientX-r.left-r.width/2)*.16,y:(e.clientY-r.top-r.height/2)*.16,duration:.3})});btn.addEventListener('mouseleave',()=>gsap.to(btn,{x:0,y:0,duration:.5}))});
  }

  const dot=document.querySelector('.cursor-dot'),ring=document.querySelector('.cursor-ring');
  if(dot&&ring){addEventListener('pointermove',e=>{dot.style.left=e.clientX+'px';dot.style.top=e.clientY+'px';ring.animate({left:e.clientX+'px',top:e.clientY+'px'},{duration:400,fill:'forwards'});});document.querySelectorAll('a,.service-card').forEach(el=>{el.addEventListener('mouseenter',()=>{ring.style.width='52px';ring.style.height='52px'});el.addEventListener('mouseleave',()=>{ring.style.width='32px';ring.style.height='32px'})})}
})();
