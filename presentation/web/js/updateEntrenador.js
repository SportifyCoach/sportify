document.addEventListener('DOMContentLoaded', () => {
  const dni = new URLSearchParams(window.location.search).get('dni');
  const especialitatInput = document.getElementById('especialitat');
  const experienciaInput = document.getElementById('experiencia');
  const status_a = document.getElementById('status_a');
  const status_d = document.getElementById('status_d');
  const reason_denialInput = document.getElementById('reason_denial');
  const dniInput = document.getElementById('dni');

  status_a.addEventListener('change', () => {
    if (status_a.checked) {
      reason_denialInput.required = false;
    }
  });
  
  status_d.addEventListener('change', () => {
    if (status_d.checked) {
      reason_denialInput.required = true;
    }
  });

  // Cargar datos actuales
  fetch(`http://localhost:3000/api/entrenadors`)
    .then(res => res.json())
    .then(data => {
      const entrenador = data.find(e => e.dni === dni);
      if (entrenador) {
        dniInput.value = entrenador.dni;
        especialitatInput.value = entrenador.especialitat;
        experienciaInput.value = entrenador.experiencia;
        if (entrenador.status === 'approved') {
          status_a.checked = true;
        } else if (entrenador.status === 'denied') {
          status_d.checked = true;
          reason_denialInput.value = entrenador.reason_denial;
        }
      }
    });

  // Actualizar
  const form = document.getElementById('update-form');
  form.addEventListener('submit', e => {
    e.preventDefault();

    const updatedData = {
      especialitat: especialitatInput.value,
      experiencia: experienciaInput.value,
      status: status_a.checked ? 'approved' : 'denied',
      reason_denial: status_d.checked ? reason_denialInput.value : ''
    };

    fetch(`http://localhost:3000/api/entrenadors/${dni}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message || 'Actualizado');
        window.location.href = 'entrenadors.html';
      })
      .catch(err => console.error(err));
  });
});
