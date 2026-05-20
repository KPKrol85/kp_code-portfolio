import {qs,qsa} from '../utils.js';
export function initNav(){const btn=qs('[data-nav-toggle]');const menu=qs('#site-menu');if(!btn||!menu)return;let last=null;
const close=()=>{menu.classList.remove('is-open');btn.setAttribute('aria-expanded','false');if(last)last.focus();};
btn.addEventListener('click',()=>{const open=btn.getAttribute('aria-expanded')==='true';if(open){close();}else{last=document.activeElement;menu.classList.add('is-open');btn.setAttribute('aria-expanded','true');qsa('a',menu)[0]?.focus();}});
document.addEventListener('keydown',(e)=>{if(e.key==='Escape')close();});}
export function initHeaderScroll(){const h=qs('.site-header');if(!h)return;const u=()=>h.classList.toggle('is-scrolled',window.scrollY>8);u();window.addEventListener('scroll',u,{passive:true});}
