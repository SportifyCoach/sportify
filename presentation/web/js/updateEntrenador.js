document.addEventListener('DOMContentLoaded', () => {
    const dni = new URLSearchParams(window.location.search).get('dni');
    const emailInput = document.getElementById('email');
    const nomInput = document.getElementById('nom');
    const cognomsInput = document.getElementById('cognoms');
    const especialitatInput = document.getElementById('especialitat');
    const experienciaInput = document.getElementById('experiencia');
    const dniInput = document.getElementById('dni');
  
    // Cargar datos actuales
    fetch(`http://localhost:3000/api/entrenadors`)
      .then(res => res.json())
      .then(data => {
        const entrenador = data.find(e => e.dni === dni);
        if (entrenador) {
          dniInput.value = entrenador.dni;
          emailInput.value = entrenador.email;
          nomInput.value = entrenador.nom;
          cognomsInput.value = entrenador.cognoms;
          especialitatInput.value = entrenador.especialitat;
          experienciaInput.value = entrenador.experiencia;
        }
      });
  
    // Actualizar
    const form = document.getElementById('update-form');
    form.addEventListener('submit', e => {
      e.preventDefault();
  
      const updatedData = {
        email: emailInput.value,
        nom: nomInput.value,
        cognoms: cognomsInput.value,
        especialitat: especialitatInput.value,
        experiencia: experienciaInput.value
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
  