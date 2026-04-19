import { onReady } from "./modules/dom.js";
import { initPartials } from "./modules/partials.js";
import { initNav } from "./modules/nav.js";
import { initForm } from "./modules/form.js";
import { initHero } from "./modules/hero.js";

onReady(async () => {
  await initPartials();
  initNav();
  initForm();
  initHero();
});
