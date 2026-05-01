import { onReady } from "./modules/dom.js";
import { initPartials } from "./modules/partials.js";
import { initNav } from "./modules/nav.js";
import { initForm } from "./modules/form.js";
import { initHero } from "./modules/hero.js";
import { initTheme } from "./modules/theme.js";

onReady(async () => {
  await initPartials();
  initTheme();
  initNav();
  initForm();
  initHero();
});
