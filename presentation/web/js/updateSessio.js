document.addEventListener('DOMContentLoaded', () => {
    const id = new URLSearchParams(window.location.search).get('id');
    const limit_personesInput = document.getElementById('limit_persones');
    const disciplinaInput = document.getElementById('disciplina');
    const dateInput = document.getElementById('date');
    const entrenadorInput = document.getElementById('entrenador');
    const idInput = document.getElementById('id');
  
    // Cargar datos actuales
    fetch(`http://localhost:3000/api/sessions`)
      .then(res => res.json())
      .then(data => {
        console.log("Searching for id:", id, "Type:", typeof id);
        console.log("All IDs in data:", data.map(e => e.id));

        const sessio = data.find(e => e.id == id);
        if (sessio) {
          idInput.value = sessio.id;
          limit_personesInput.value = sessio.limit_persones;
          dateInput.value = sessio.date;
          entrenadorInput.value = sessio.entrenador;
          disciplinaInput.value = sessio.disciplina;
        }
      });
  
    // Actualizar
    const form = document.getElementById('update-form');
    form.addEventListener('submit', e => {
      e.preventDefault();
  
      const updatedData = {
        limit_persones: limit_personesInput.value,
        disciplina: disciplinaInput.value,
        date: dateInput.value,
        entrenador: entrenadorInput.value
      };
  
      fetch(`http://localhost:3000/api/sessions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      })
      .then(res => res.json())
      .then(data => {
        alert(data.message || 'Actualizado');
        window.location.href = 'sessions.html';
      })
      .catch(err => console.error(err));
    });
  });
  