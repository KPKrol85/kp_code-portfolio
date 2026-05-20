import {storage} from './storage.js';
export function initTheme(){const t=storage.get('theme');if(t)document.documentElement.dataset.theme=t;}
