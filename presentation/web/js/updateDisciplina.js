document.addEventListener('DOMContentLoaded', () => {
    const nom = new URLSearchParams(window.location.search).get('nom');
    const espaiInput = document.getElementById('espai');
    const nomInput = document.getElementById('nom');
  
    // Cargar datos actuales
    fetch(`http://localhost:3000/api/disciplines`)
      .then(res => res.json())
      .then(data => {
        const disciplina = data.find(e => e.nom === nom);
        if (disciplina) {
          nomInput.value = disciplina.nom;
          espaiInput.value = disciplina.espai;
        }
      });
  
    // Actualizar
    const form = document.getElementById('update-form');
    form.addEventListener('submit', e => {
      e.preventDefault();
  
      const updatedData = {
        espai: espaiInput.value
      };
  
      fetch(`http://localhost:3000/api/disciplines/${nom}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      })
      .then(res => res.json())
      .then(data => {
        alert(data.message || 'Actualizado');
        window.location.href = 'disciplines.html';
      })
      .catch(err => console.error(err));
    });
  });
  