document.getElementById('edit-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  
  await fetch(form.action, {
    method: 'PATCH',
    body: formData
  });

  window.location.href = '/goal';
});
