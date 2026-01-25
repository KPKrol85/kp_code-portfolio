export const getThemeLabel = (theme) =>
  theme === "dark" ? "Switch to light theme" : "Switch to dark theme";

let themeIconCount = 0;
export const createThemeIcon = () => {
  themeIconCount += 1;
  const maskId = `moon-mask-${themeIconCount}`;
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("class", "sun-and-moon");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("viewBox", "0 0 24 24");

  const mask = document.createElementNS(ns, "mask");
  mask.setAttribute("id", maskId);
  const maskRect = document.createElementNS(ns, "rect");
  maskRect.setAttribute("x", "0");
  maskRect.setAttribute("y", "0");
  maskRect.setAttribute("width", "100%");
  maskRect.setAttribute("height", "100%");
  maskRect.setAttribute("fill", "white");
  const maskCircle = document.createElementNS(ns, "circle");
  maskCircle.setAttribute("class", "moon");
  maskCircle.setAttribute("cx", "24");
  maskCircle.setAttribute("cy", "10");
  maskCircle.setAttribute("r", "6");
  maskCircle.setAttribute("fill", "black");
  mask.appendChild(maskRect);
  mask.appendChild(maskCircle);

  const sun = document.createElementNS(ns, "circle");
  sun.setAttribute("class", "sun");
  sun.setAttribute("cx", "12");
  sun.setAttribute("cy", "12");
  sun.setAttribute("r", "6");
  sun.setAttribute("mask", `url(#${maskId})`);

  const beams = document.createElementNS(ns, "g");
  beams.setAttribute("class", "sun-beams");
  const beamLines = [
    ["12", "1", "12", "3"],
    ["12", "21", "12", "23"],
    ["4.22", "4.22", "5.64", "5.64"],
    ["18.36", "18.36", "19.78", "19.78"],
    ["1", "12", "3", "12"],
    ["21", "12", "23", "12"],
    ["4.22", "19.78", "5.64", "18.36"],
    ["18.36", "5.64", "19.78", "4.22"],
  ];
  beamLines.forEach(([x1, y1, x2, y2]) => {
    const line = document.createElementNS(ns, "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    beams.appendChild(line);
  });

  svg.appendChild(mask);
  svg.appendChild(sun);
  svg.appendChild(beams);
  return svg;
};

export const createThemeToggleButton = ({ theme, onToggle, withId = false } = {}) => {
  const button = document.createElement("button");
  button.className = "theme-toggle";
  button.type = "button";
  button.setAttribute("aria-label", getThemeLabel(theme));
  button.setAttribute("aria-live", "polite");
  button.setAttribute("title", "Toggle theme");
  if (withId) {
    button.id = "theme-toggle";
  }
  button.appendChild(createThemeIcon());
  if (typeof onToggle === "function") {
    button.addEventListener("click", onToggle);
  }
  const updateLabel = (nextTheme) => {
    button.setAttribute("aria-label", getThemeLabel(nextTheme));
  };
  return { button, updateLabel };
};
