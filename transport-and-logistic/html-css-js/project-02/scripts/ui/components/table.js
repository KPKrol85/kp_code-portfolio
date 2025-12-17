const Table = {
  render(headers, rows) {
    const thead = `<thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead>`;
    const tbody = `<tbody>${rows.join('')}</tbody>`;
    return `<table class="table">${thead}${tbody}</table>`;
  }
};

window.Table = Table;
