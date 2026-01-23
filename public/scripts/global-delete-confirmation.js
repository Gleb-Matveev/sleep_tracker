(() => {
  const overlay = document.getElementById('confirm-overlay');
  if (!overlay) return;

  const cancelBtn = overlay.querySelector('.modal-cancel');
  const confirmBtn = overlay.querySelector('.modal-confirm');
  const messageEl = overlay.querySelector('.modal-message');

  let current = {
    trigger: null,
    url: null,
    removeClosest: null,
  };

  const close = () => {
    overlay.style.display = 'none';
    current = { trigger: null, url: null, removeClosest: null };
  };

  const open = (trigger, url, removeClosest, message) => {
    current.trigger = trigger;
    current.url = url;
    current.removeClosest = removeClosest;
    if (messageEl && message) {
      messageEl.textContent = message;
    }
    overlay.style.display = 'flex';
  };

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const btn = target.closest('.js-delete-trigger');
    if (btn) {
      event.preventDefault();
      const url = btn.getAttribute('data-delete-url');
      const removeClosest = btn.getAttribute('data-remove-closest');
      const message =
        btn.getAttribute('data-delete-message') ||
        'Are you sure you want to delete this item?';
      if (!url) return;
      open(btn, url, removeClosest, message);
      return;
    }

    const card = target.closest('.card-delete-trigger');
    if (card) {
      const url = card.getAttribute('card-collection-url');
      const id = card.getAttribute('entity-id');
      window.location.href = `/${url}/${id}/edit`;
    }

    if (target.classList.contains('modal-backdrop')) {
      close();
    }
  });

  cancelBtn?.addEventListener('click', (event) => {
    event.preventDefault();
    close();
  });

  confirmBtn?.addEventListener('click', (event) => {
    event.preventDefault();
    if (!current.url) {
      close();
      return;
    }

    fetch(current.url, { method: 'DELETE' })
      .then(() => {
        if (current.removeClosest && current.trigger instanceof HTMLElement) {
          const el = current.trigger.closest(current.removeClosest);
          if (el) {
            el.remove();
            return;
          }
        }
        window.location.reload();
      })
      .finally(() => {
        close();
      });
  });
})();
