export const initTabs = (tabList, onChange) => {
  const tabs = Array.from(tabList.querySelectorAll("[role=tab]"));
  let currentIndex = tabs.findIndex((tab) => tab.getAttribute("aria-selected") === "true");
  if (currentIndex === -1) currentIndex = 0;

  const focusTab = (index) => {
    tabs.forEach((tab, idx) => {
      tab.setAttribute("aria-selected", idx === index ? "true" : "false");
      tab.tabIndex = idx === index ? 0 : -1;
    });
    tabs[index].focus();
    onChange?.(tabs[index].dataset.tab);
  };

  tabList.addEventListener("click", (event) => {
    const tab = event.target.closest("[role=tab]");
    if (!tab) return;
    focusTab(tabs.indexOf(tab));
  });

  tabList.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") focusTab((currentIndex + 1) % tabs.length);
    if (event.key === "ArrowLeft") focusTab((currentIndex - 1 + tabs.length) % tabs.length);
  });

  focusTab(currentIndex);
};
