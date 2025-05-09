document.addEventListener('DOMContentLoaded', () => {
    const dni = new URLSearchParams(window.location.search).get('dni');
    const emailInput = document.getElementById('email');
    const tlfInput = document.getElementById('tlf');
    const dniInput = document.getElementById('dni');
  
    // Cargar datos actuales
    fetch(`http://localhost:3000/api/esportistes`)
      .then(res => res.json())
      .then(data => {
        const esportista = data.find(e => e.dni === dni);
        if (esportista) {
          dniInput.value = esportista.dni;
          emailInput.value = esportista.email;
          tlfInput.value = esportista.tlf;
        }
      });
  
    // Actualizar
    const form = document.getElementById('update-form');
    form.addEventListener('submit', e => {
      e.preventDefault();
  
      const updatedData = {
        email: emailInput.value,
        tlf: tlfInput.value
      };
  
      fetch(`http://localhost:3000/api/esportistes/${dni}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      })
      .then(res => res.json())
      .then(data => {
        alert(data.message || 'Actualizado');
        window.location.href = 'esportistes.html';
      })
      .catch(err => console.error(err));
    });
  });
  