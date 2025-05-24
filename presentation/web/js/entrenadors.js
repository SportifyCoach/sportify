const API = 'http://localhost:3000/api/entrenadors';

const obrirPopup        = document.getElementById('obrirPopup');
const popupFons         = document.getElementById('popupFons');
const tancarPopup       = document.getElementById('tancarPopup');
const registreForm      = document.getElementById('registreForm');
const missatge          = document.getElementById('missatge');
const taulaContainer    = document.getElementById('table');
const barraCerca        = document.getElementById('search-bar');

const popupFonsDelete   = document.getElementById('popupFonsDelete');
const tancarPopupDelete = document.getElementById('tancarPopupDelete');
const confirmarDelete   = document.getElementById('confirmarDelete');
const cancelarDelete    = document.getElementById('cancelarDelete');
const textConfirmacio   = document.getElementById('textConfirmacio');

let tots = [];
let dniAEliminar = null;

function renderTable(llista) {
  if (!llista.length) {
    taulaContainer.innerHTML = '<p>No hi ha entrenadors.</p>';
    return;
  }

  taulaContainer.innerHTML = `
    <table class="table">
      <thead>
        <tr>
          <th>DNI</th><th>Nom</th><th>Cognoms</th>
          <th>Email</th><th>Especialitat</th><th>Experiència</th>
          <th>Editar</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        ${llista.map(e => `
          <tr>
            <td>${e.dni}</td>
            <td style="color: ${
              e.status === 'approved'   ? '#1dcc25'  :
              e.status === 'denied'  ? '#d9534f'    :
              /* per defecte: pendent */         '#75aaff'
            }">${e.nom}</td>
            <td>${e.cognoms}</td>
            <td>${e.email}</td>
            <td>${e.especialitat}</td>
            <td>${e.experiencia}</td>
            <td><button class="btn btn-primary" onclick="editEntrenador('${e.dni}')">Editar</button></td>
            <td>
              <button class="btn-danger"
                      onclick="confirmDeleteEntrenador('${e.dni}')">
                Eliminar
              </button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>`;
}


// 2) Afegim la funció que crida l'API de validació
async function validateEntrenador(dni, nouEstat) {
  let payload = { approved: nouEstat === 'aproved' };
  // si es rebutjat, demanem motiu
  if (nouEstat === 'denied') {
    const motiu = prompt('Motiu de rebuig:');
    if (motiu === null) return; // l’usuari ha cancel·lat
    payload.motivo = motiu;
  }

  try {
    const res = await fetch(`${API}/${dni}/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err.error || 'Error validant entrenador');
    }
    await loadEntrenadors();
  } catch (err) {
    alert(err.message);
  }
}


async function loadEntrenadors() {
  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error('No s\'han pogut carregar els entrenadors');
    tots = await res.json();
    renderTable(tots);
  } catch (err) {
    taulaContainer.innerHTML = `<p class="text-danger">${err.message}</p>`;
  }
}

/* ---------- Cerca ---------- */
if (barraCerca) {
  barraCerca.addEventListener('input', () => {
    const q = barraCerca.value.trim().toLowerCase();
    renderTable(tots.filter(e => e.dni.toLowerCase().includes(q)));
  });
}

/* ---------- Popup alta ---------- */
obrirPopup.addEventListener('click', () => popupFons.style.display = 'flex');
tancarPopup.addEventListener('click', () => popupFons.style.display = 'none');
window.addEventListener('click', e => { if (e.target === popupFons) popupFons.style.display = 'none'; });

/* Alta entrenador */
registreForm.addEventListener('submit', async e => {
  e.preventDefault();
  missatge.textContent = '';

  const data = Object.fromEntries(new FormData(registreForm));

  try {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(error);
    }
    registreForm.reset();
    popupFons.style.display = 'none';
    await loadEntrenadors();
  } catch (err) {
    missatge.style.color = 'red';
    missatge.textContent = err.message;
  }
});

/* ---------- Eliminar ---------- */
let dniEntrenadorEliminar = null;

function confirmDeleteEntrenador(dni) {
  dniEntrenadorEliminar = dni;
  textConfirmacio.textContent =
    `Estàs segur que vols eliminar l'entrenador amb DNI ${dni}?`;
  popupFonsDelete.style.display = 'flex';
}

function editEntrenador(dni) {
  window.location.href = `updateEntrenador.html?dni=${dni}`;
}

confirmarDelete.addEventListener('click', () => {
  if (!dniEntrenadorEliminar) return;

  fetch(`${API}/${dniEntrenadorEliminar}`, { method: 'DELETE' })
    .then(res => {
      if (!res.ok) throw new Error("No s'ha pogut eliminar l'entrenador");
    })
    .then(() => {
      popupFonsDelete.style.display = 'none';
      dniEntrenadorEliminar = null;
      loadEntrenadors();                 // refresca la taula
    })
    .catch(err => {
      alert(err.message);
      popupFonsDelete.style.display = 'none';
      dniEntrenadorEliminar = null;
    });
});

cancelarDelete.addEventListener('click', () => {
  popupFonsDelete.style.display = 'none';
  dniEntrenadorEliminar = null;
});

tancarPopupDelete.addEventListener('click', () => {
  popupFonsDelete.style.display = 'none';
  dniEntrenadorEliminar = null;
});

window.addEventListener('click', e => {
  if (e.target === popupFonsDelete) {
    popupFonsDelete.style.display = 'none';
    dniEntrenadorEliminar = null;
  }
});


/* ---------- Init ---------- */
document.addEventListener('DOMContentLoaded', loadEntrenadors);
