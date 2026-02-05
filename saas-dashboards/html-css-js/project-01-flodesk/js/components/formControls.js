export const inputField = ({ id, label, type = 'text', value = '', helper = '', error = '' }) => {
  return `
    <div class="input">
      <label class="input__label" for="${id}">${label}</label>
      <input class="input__field ${error ? 'input__field--error' : ''}" id="${id}" name="${id}" type="${type}" value="${value}" />
      ${helper ? `<span class="input__helper">${helper}</span>` : ''}
      ${error ? `<span class="input__error">${error}</span>` : ''}
    </div>
  `;
};

export const selectField = ({ id, label, options = [], value = '', helper = '', error = '' }) => {
  return `
    <div class="input">
      <label class="input__label" for="${id}">${label}</label>
      <select class="input__select ${error ? 'input__select--error' : ''}" id="${id}" name="${id}">
        ${options
          .map(
            (option) => `<option value="${option.value}" ${option.value === value ? 'selected' : ''}>${option.label}</option>`
          )
          .join('')}
      </select>
      ${helper ? `<span class="input__helper">${helper}</span>` : ''}
      ${error ? `<span class="input__error">${error}</span>` : ''}
    </div>
  `;
};
