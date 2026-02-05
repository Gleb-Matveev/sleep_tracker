window.addEventListener('load', () => {
  const clientMs = performance.now();

  const clientEl = document.getElementById('client-time');

  if (clientEl) {
    clientEl.textContent =
      `Client: ${clientMs.toFixed(0)}ms`;
  }
});
