(() => {
  if (!window.EventSource) return;

  const source = new EventSource('/goal/events');

  source.onmessage = (e) => {
    try {
      const evt = JSON.parse(e.data);
      if (evt) {
        const msg = `Goal with id(${evt.payload.id}) ${evt.type}`;
        toastr.success(msg);
      }
    } catch (_) {}
  };

  // Close before unload to free the connection
  window.addEventListener('beforeunload', () => {
    source.close();
  });
})();
