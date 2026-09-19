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