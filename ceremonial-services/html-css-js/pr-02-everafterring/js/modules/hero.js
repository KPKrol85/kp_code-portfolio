export const initHero = () => {
  const heroImage = document.querySelector("[data-hero-image]");
  if (!heroImage) return;

  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  const img = heroImage.querySelector("img");
  if (!img) return;

  heroImage.addEventListener("mousemove", (e) => {
    const rect = heroImage.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    targetX = (x - centerX) * 0.03;
    targetY = (y - centerY) * 0.03;
  });

  heroImage.addEventListener("mouseleave", () => {
    targetX = 0;
    targetY = 0;
  });

  const animate = () => {
    mouseX += (targetX - mouseX) * 0.1;
    mouseY += (targetY - mouseY) * 0.1;

    img.style.transform = `scale(1.03) translate(${mouseX}px, ${mouseY}px)`;

    requestAnimationFrame(animate);
  };

  animate();
};
