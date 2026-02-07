export const initResourcesFilter = () => {
  const tablist = document.querySelector('[data-tablist]');
  const tabs = Array.from(document.querySelectorAll('[data-tab]'));
  const panels = Array.from(document.querySelectorAll('[data-tab-panel]'));
  if (!tablist || !tabs.length || !panels.length) return;

  const panelByName = new Map(
    panels.map((panel) => [panel.dataset.tabPanel, panel]),
  );
  const tabNames = tabs.map((tab) => tab.dataset.tab);
  const defaultTabIndex = Math.max(
    tabs.findIndex((tab) => tab.classList.contains('is-active')),
    0,
  );
  let activeTabIndex = defaultTabIndex;

  const updateAriaState = () => {
    tabs.forEach((tab, index) => {
      const isActive = index === activeTabIndex;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
      tab.setAttribute('tabindex', isActive ? '0' : '-1');
    });

    panels.forEach((panel, index) => {
      const isActive = index === activeTabIndex;
      panel.hidden = !isActive;
      panel.setAttribute('aria-hidden', String(!isActive));
    });
  };

  const setActiveTab = (nextIndex, { focus = true } = {}) => {
    activeTabIndex = nextIndex;
    updateAriaState();
    if (focus) {
      tabs[activeTabIndex].focus();
    }
  };

  const handleKeyNavigation = (event) => {
    const { key } = event;
    const currentIndex = tabs.indexOf(document.activeElement);
    if (currentIndex === -1) return;

    let nextIndex = currentIndex;
    if (key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % tabs.length;
    } else if (key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else if (key === 'Home') {
      nextIndex = 0;
    } else if (key === 'End') {
      nextIndex = tabs.length - 1;
    } else if (key === 'Enter' || key === ' ') {
      event.preventDefault();
      if (currentIndex !== activeTabIndex) {
        setActiveTab(currentIndex);
      }
      return;
    } else {
      return;
    }

    event.preventDefault();
    tabs[nextIndex].focus();
  };

  tablist.setAttribute('role', 'tablist');
  tablist.setAttribute('aria-label', 'Filtr kategorii');

  tabs.forEach((tab, index) => {
    const tabName = tabNames[index];
    const panel = panelByName.get(tabName);
    if (!panel) return;

    const tabId = `resources-tab-${tabName}`;
    const panelId = `resources-panel-${tabName}`;

    tab.setAttribute('role', 'tab');
    tab.setAttribute('id', tabId);
    tab.setAttribute('aria-controls', panelId);

    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('id', panelId);
    panel.setAttribute('aria-labelledby', tabId);
  });

  tablist.addEventListener('keydown', handleKeyNavigation);

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      if (activeTabIndex !== index) {
        setActiveTab(index, { focus: false });
      }
    });
  });

  setActiveTab(activeTabIndex, { focus: false });
};
