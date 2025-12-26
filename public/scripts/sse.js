try {
  if (window.EventSource) {
    const source = new EventSource('/goal/events');
    source.onmessage = (e) => {
      try {
        const evt = JSON.parse(e.data);
        if (evt) {
            console.log(evt);
            const msg = `Goal with id(${evt.payload.id}) ${evt.type}`;
            toastr.success(msg)
        }
      } catch (err) {}
    };
  }
} catch (_) {}