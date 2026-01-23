(() => {
  const stepsList = document.getElementById('steps-list');
  const addBtn = document.getElementById('add-step-btn');

  const createRow = (value = '') => {
    const row = document.createElement('div');
    row.className = 'step-row';
    row.style.display = 'grid';
    row.style.gridTemplateColumns = '1fr auto';
    row.style.gap = '0.5rem';

    const input = document.createElement('input');
    input.name = 'steps[]';
    input.type = 'text';
    input.placeholder = 'Describe the step';
    input.required = true;
    input.value = value;

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'btn btn-secondary remove-step-btn';
    removeBtn.setAttribute('aria-label', 'Remove step');
    removeBtn.textContent = '−';
    removeBtn.addEventListener('click', () => {
      if (stepsList.children.length > 1) {
        row.remove();
      } else {
        input.value = '';
        input.focus();
      }
    });

    row.appendChild(input);
    row.appendChild(removeBtn);
    return row;
  };

  addBtn?.addEventListener('click', () => {
    stepsList.appendChild(createRow());
  });

  document.querySelectorAll('.remove-step-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const row = btn.closest('.step-row');
      if (stepsList.children.length > 1) {
        row.remove();
      } else {
        const input = row.querySelector('input');
        if (input) {
          input.value = '';
          input.focus();
        }
      }
    });
  });

  document
    .getElementById('routine-form')
    ?.addEventListener('submit', async (e) => {
      e.preventDefault();
      console.log("HKJHLSAKJHDLKASJHDLK");
      const form = e.target;
      const formData = new FormData(form);
      const steps = formData.getAll('steps[]').filter((s) => s.trim());
      const data = {
        name: formData.get('name'),
        period: formData.get('period'),
        steps,
      };

      await fetch(form.action, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      window.location.href = '/routine';
    });
})();
