export const qs=(s,c=document)=>c.querySelector(s);export const qsa=(s,c=document)=>[...c.querySelectorAll(s)];
export const prefersReducedMotion=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
