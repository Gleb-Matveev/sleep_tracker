(() => {
  const dayData = JSON.parse(
    document.getElementById('day-edit-data').textContent,
  );
  const selectedIds = dayData.selectedRoutineIds || [];

  let multiselect_block = document.querySelectorAll('.multiselect_block');
  const label = document.querySelector('.field_multiselect');
  const select = document.querySelector('.field_select');
  let text = label.innerHTML;

  if (selectedIds.length != 0) {
    label.innerHTML = ' ';
    Array.from(select.options).forEach((option) => {
      const routineId = parseInt(option.getAttribute('routineid'));
      if (selectedIds.includes(routineId)) {
        option.selected = true;
        let button = document.createElement('button');
        button.type = 'button';
        button.textContent = option.value;
        button.setAttribute('routineid', option.getAttribute('routineid'));
        button.onclick = (_) => {
          option.selected = false;
          button.remove();
          if (!select.selectedOptions.length) label.innerHTML = text;
        };
        label.append(button);
      }
    });
  }

  select.addEventListener('change', function (element) {
    let selectedOptions = this.selectedOptions;
    label.innerHTML = '';
    for (let option of selectedOptions) {
      let button = document.createElement('button');
      button.type = 'button';
      button.textContent = option.value;
      button.setAttribute('routineid', option.getAttribute('routineid'));
      button.onclick = (_) => {
        option.selected = false;
        button.remove();
        if (!select.selectedOptions.length) label.innerHTML = text;
      };
      label.append(button);
    }
  });

  document.getElementById('day-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const buttons = document.querySelectorAll(
      '.field_multiselect button[routineid]',
    );
    const routineIds = Array.from(buttons)
      .map((button) => button.getAttribute('routineid'))
      .filter((id) => id && id.trim());

    const data = {
      date: formData.get('date'),
      wakeUpTime: formData.get('wakeUpTime'),
      wakeDownTime: formData.get('wakeDownTime'),
      getup_score: formData.get('getup_score'),
      feeling_score: formData.get('feeling_score'),
      description: formData.get('description'),
      routineIds: routineIds,
    };

    await fetch(form.action, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    window.location.href = '/day';
  });
})();
