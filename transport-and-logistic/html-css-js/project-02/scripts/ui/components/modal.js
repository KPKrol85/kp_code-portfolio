const Modal = (() => {
  let backdrop;
  const close = () => {
    if (backdrop) {
      backdrop.remove();
      backdrop = null;
    }
  };

  const open = ({ title, body }) => {
    close();
    backdrop = dom.h('div', 'modal-backdrop');
    const modal = dom.h('div', 'modal');
    const header = dom.h('div', 'modal-header');
    header.appendChild(dom.h('h3', '', title || ''));
    const closeBtn = dom.h('button', 'modal-close', '×');
    closeBtn.setAttribute('aria-label', 'Zamknij');
    closeBtn.addEventListener('click', close);
    header.appendChild(closeBtn);
    modal.appendChild(header);
    const content = dom.h('div', 'modal-body');
    if (typeof body === 'string') content.innerHTML = body; else content.appendChild(body);
    modal.appendChild(content);
    backdrop.appendChild(modal);
    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });
    document.body.appendChild(backdrop);
  };

  return { open, close };
})();

window.Modal = Modal;
