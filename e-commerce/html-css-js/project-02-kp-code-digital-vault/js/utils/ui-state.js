const setButtonLoading = (button, { loadingText = "Processing..." } = {}) => {
  if (!button || button.dataset.loading === "true") {
    return false;
  }
  button.dataset.loading = "true";
  button.dataset.originalText = button.textContent || "";
  button.dataset.originalDisabled = button.disabled ? "true" : "false";
  button.textContent = loadingText;
  button.disabled = true;
  return true;
};

const clearButtonLoading = (button) => {
  if (!button) {
    return;
  }
  if (button.dataset.originalText !== undefined) {
    button.textContent = button.dataset.originalText;
    delete button.dataset.originalText;
  }
  const wasDisabled = button.dataset.originalDisabled === "true";
  if (button.dataset.originalDisabled !== undefined) {
    delete button.dataset.originalDisabled;
  }
  button.disabled = wasDisabled;
  delete button.dataset.loading;
};

const withButtonLoading = async (button, fn, options) => {
  const didSet = setButtonLoading(button, options);
  if (!didSet) {
    return;
  }
  try {
    await fn();
  } finally {
    clearButtonLoading(button);
  }
};

export { setButtonLoading, clearButtonLoading, withButtonLoading };
