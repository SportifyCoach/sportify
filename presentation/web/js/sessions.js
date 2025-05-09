let allSessions = [];
let sessioAEliminar = null;

const popupFonsDeleteSessio = document.getElementById("popupFonsDeleteSessio");
const tancarPopupDeleteSessio = document.getElementById("tancarPopupDeleteSessio");
const confirmarDeleteSessio = document.getElementById("confirmarDeleteSessio");
const cancelarDeleteSessio = document.getElementById("cancelarDeleteSessio");
const textConfirmacioSessio = document.getElementById("textConfirmacioSessio");

const obrirPopupSessio = document.getElementById("obrirPopupSessio");
const popupFonsSessio = document.getElementById("popupFonsSessio");
const tancarPopupSessio = document.getElementById("tancarPopupSessio");

function renderTable(sessions, members) {
  const table = document.getElementById('table');
  table.innerHTML = '';

  sessions.forEach(sessio => {
    // Filtrar els membres que coincideixen amb la sessio
    const filteredMembers = members.filter(member => member.sessio_id === sessio.id);

    // Convertir la data a un format llegible
    const date = new Date(sessio.date);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    sessio.date = date.toLocaleDateString('ca-ES', options)

    sessio.disciplina = sessio.disciplina.toUpperCase();

    table.innerHTML += `
          <div class="session">
              <div class="session-title">
                  <span> <strong> ${sessio.disciplina} </strong> - ${sessio.date}  </span> 
                  <span> <strong> Entrenador: </strong> ${sessio.entrenador} <strong>Val mitja: </strong>${Number(sessio.valMitja).toFixed(2)}</span>
              </div>
              <table class="table">
                  <thead>
                      <tr>
                          <th>Participants</th>
                          <th>Valoració</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${filteredMembers.map(member => `
                          <tr>
                              <td>${member.esportista_dni}</td>
                              <td>${member.valoracio}</td>
                          </tr>
                      `).join('')}
                  </tbody>
              </table>
              <div class="session-footer">
                  <div class="session-footer-row">
                      <button id="add-member-${sessio.id}" class="btn btn-success small" onclick="mostrarInscripcio(${sessio.id})">Afegir Participants ${filteredMembers.length}/${sessio.limit_persones}</button>
                      <button id="edit-sessio-${sessio.id}" class="btn btn-primary small">Editar Sessió</button> <!--todo-->
                  </div>
                  <div class="session-footer-row">
                      <button id="add-member-${sessio.id}" class="btn btn-danger small">Eliminar Participants</button> <!--todo-->
                      <button id="del-m-${sessio.id}" class="btn btn-danger small" onclick="confirmDelete(${sessio.id})">Eliminar Sessió</button>
                  </div>
              </div>
          </div>
      `;
  });
}

function renderTable(sessions) {
  const table = document.getElementById('table');
  let tableHTML = `
    <table class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Data</th>
          <th>Límit persones</th>
          <th>Disciplina</th>
          <th>Entrenador</th>
          <th>Inscripció</th>
          <th>Inscrits</th>
          <th>Update</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
  `;

  sessions.forEach(sessio => {
    // comptem inscrits si cal validar mínim
    const inscrits = sessio.inscrits_count || 0; 

    tableHTML += `
      <tr>
        <td>${sessio.id}</td>
        <td>${sessio.date}</td>

        <!-- Input + botó per editar límit -->
        <td>
          <input
            type="number"
            id="limit-${sessio.id}"
            value="${sessio.limit_persones}"
            min="${inscrits}"
            style="width:60px;"
          />
          <button
            class="btn btn-sm btn-primary"
            onclick="updateLimit(${sessio.id}, ${inscrits})"
          >
            Desa
          </button>
        </td>

        <td>${sessio.disciplina}</td>
        <td>${sessio.entrenador}</td>
        <td>
          <button
            class="btn btn-success"
            onclick="mostrarInscripcio(${sessio.id})"
          >Inscriure's</button>
        </td>
        <td>
          <button
            class="btn"
            onclick="mostrarInscrits(${sessio.id})"
          >Veure</button>
        </td>
        <td>
          <button
            class="btn btn-primary"
            onclick="goToUpdate(${sessio.id})"
          >Update</button>
        </td>
        <td>
          <button
            class="btn btn-danger"
            onclick="confirmDelete(${sessio.id})"
          >Delete</button>
        </td>
      </tr>
    `;
  });

  tableHTML += `
      </tbody>
    </table>
  `;
  table.innerHTML = tableHTML;
}
/**
 * Llegeix el valor de l'input i fa PUT a /api/sessions/:id/limit
 * @param {number} id       - ID de la sessió
 * @param {number} inscrits - número actual d'inscrits (limit ≥ inscrits)
 */
function updateLimit(id, inscrits) {
  const input = document.getElementById(`limit-${id}`);
  const nouLimit = parseInt(input.value, 10);

  if (isNaN(nouLimit) || nouLimit < inscrits) {
    return alert(`El límit ha de ser un nombre ≥ ${inscrits}.`);
  }

  fetch(`http://localhost:3000/api/sessions/${id}/limit`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ newLimit: nouLimit })
  })
  .then(async res => {
    // Llegim la resposta com JSON, si hi ha error ho processem
    const payload = await res.json().catch(() => null);
    if (!res.ok) {
      throw new Error(payload?.error || res.statusText);
    }
    return payload;
  })
  .then(updatedSessio => {
    // Suposem que el backend retorna l'objecte sessio amb limit_persones
    if (updatedSessio?.limit_persones != null) {
      input.value = updatedSessio.limit_persones;
    }
    alert('Límit de participants actualitzat!');
  })
  .catch(err => {
    alert(`Error actualitzant límit: ${err.message}`);
    // reassignem el valor antic, perquè no quedi 0 si falla
    input.value = inscrits;
  });
}




function loadSessions() {
    fetch('http://localhost:3000/api/sessions')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch sessions');
            }
            return response.json();
        })
        .then(data => {
            allSessions = data;
            console.log(data);
            renderTable(allSessions);
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('table').innerHTML =
                `<p class="text-danger">Error al carregar les sessions.</p>`;
        });

function loadSessions() {
  fetch('http://localhost:3000/api/sessions')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch sessions');
      }
      return response.json();
    })
    .then(data => {
      loadMembers(data);
    })
    .catch(error => {
      console.error('Error:', error);
      document.getElementById('table').innerHTML =
        `<p class="text-danger">Error al carregar les sessions.</p>`;
    });
}

function loadMembers(sessions) {
  fetch(`http://localhost:3000/api/entrenaments/`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch members');
      }
      return response.json();
    })
    .then(members => {
      // Per cada sessió, obtenir la valoració de forma paral·lela
      const valoracionsPromises = sessions.map(sessio =>
        loadValoracionsEntrenador(sessio.entrenador)
          .then(valoracio => {
            sessio.valMitja = valoracio;
          })
      );

      // Quan totes les valoracions estiguin carregades
      Promise.all(valoracionsPromises).then(() => {
        renderTable(sessions, members);
      });
    })
    .then(data => {
      renderTable(sessions, data);
    })
    .catch(error => {
      console.error('Error:', error);
      document.getElementById('table').innerHTML =
        `<p class="text-danger">Error al carregar els membres.</p>`;
    });
}



function loadAvailableSessions() {
  const disciplina = document.getElementById('filtreDisciplina').value;
  const entrenador = document.getElementById('filtreEntrenador').value;

  let url = 'http://localhost:3000/api/sessions/disponibles';
  const params = new URLSearchParams();

  if (disciplina) params.append('disciplina', disciplina);
  if (entrenador) params.append('entrenador', entrenador);

  if (params.toString()) {
    url += '?' + params.toString();
  }

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error('Error carregant sessions disponibles');
      return res.json();
    })
    .then(data => {
      allSessions = data;
      renderTable(data);
    })
    .catch(err => {
      console.error('Error:', err);
      document.getElementById('table').innerHTML =
        `<p class="text-danger">Error al carregar les sessions disponibles.</p>`;
    });
}

async function loadValoracionsEntrenador(dni) {
  let url = `http://localhost:3000/api/sessions/valoracions/entrenador/${dni}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Error carregant les valoracions mitjanes');

    const data = await res.json();

    if (data.length === 0) return 0;

    const total = data.reduce((sum, val) => sum + val, 0);
    const mitjana = total / data.length;

    return mitjana;
  } catch (err) {
    console.error('Error:', err);
    return null; // o -1 si vols indicar error
  }
}


function goToUpdate(dni) {
  window.location.href = `update.html?dni=${dni}`;
}


function setupSearch() {
  const searchInput = document.getElementById('search-bar');
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    const filtered = allEsportistes.filter(e =>
      e.dni.toLowerCase().includes(query)
    );
    renderTable(filtered);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadSessions();
  //setupSearch();
  // Botons de filtratge
  document.getElementById('mostrarDisponibles').addEventListener('click', loadAvailableSessions);
  document.getElementById('mostrarTotes').addEventListener('click', loadSessions);
});


obrirPopupSessio.addEventListener("click", () => popupFonsSessio.style.display = "flex");

tancarPopupSessio.addEventListener("click", () => popupFonsSessio.style.display = "none");

// Tancar fent clic fora del formulari
window.addEventListener("click", (e) => {
  if (e.target === popupFonsSessio) popupFonsSessio.style.display = "none";
});


const registreForm = document.getElementById('registreForm');
const missatge = document.getElementById('missatge');


function confirmDelete(id) {
  sessioAEliminar = id;
  textConfirmacioSessio.textContent = `Estàs segur que vols eliminar la sessió amb ID ${id}?`;
  popupFonsDeleteSessio.style.display = "flex";
}

confirmarDeleteSessio.addEventListener("click", () => {
  if (!sessioAEliminar) return;

  fetch(`http://localhost:3000/api/sessions/${sessioAEliminar}`, {
    method: 'DELETE'
  })
    .then(response => {
      if (!response.ok) throw new Error("No s'ha pogut eliminar la sessió");
      return response.text();
    })
    .then(() => {
      popupFonsDeleteSessio.style.display = "none";
      sessioAEliminar = null;
      loadSessions(); // ← refresca la taula
    })
    .catch(err => {
      alert("Error: " + err.message);
      popupFonsDeleteSessio.style.display = "none";
      sessioAEliminar = null;
    });
});

cancelarDeleteSessio.addEventListener("click", () => {
  popupFonsDeleteSessio.style.display = "none";
  sessioAEliminar = null;
});

tancarPopupDeleteSessio.addEventListener("click", () => {
  popupFonsDeleteSessio.style.display = "none";
  sessioAEliminar = null;
});

window.addEventListener("click", (e) => {
  if (e.target === popupFonsDeleteSessio) {
    popupFonsDeleteSessio.style.display = "none";
    sessioAEliminar = null;
  }
});

let sessioAInscriure = null;

function mostrarInscripcio(sessioId) {
  sessioAInscriure = sessioId;
  document.getElementById('textSessioInscripcio').textContent = `Inscripció a la sessió ID ${sessioId}`;
  document.getElementById('dniInscripcio').value = '';
  document.getElementById('missatgeInscripcio').textContent = '';
  document.getElementById('popupInscripcio').style.display = 'flex';
}

document.getElementById('tancarPopupInscripcio').addEventListener('click', () => {
  document.getElementById('popupInscripcio').style.display = 'none';
});

document.getElementById('confirmarInscripcio').addEventListener('click', () => {
  const dni = document.getElementById('dniInscripcio').value;
  const missatge = document.getElementById('missatgeInscripcio');

  fetch('http://localhost:3000/api/inscripcions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ esportista_dni: dni, sessio_id: sessioAInscriure }),
  })
    .then(res => {
      if (!res.ok) return res.json().then(err => { throw new Error(err.error) });
      return res.text();
    })
    .then(() => {
      missatge.style.color = 'green';
      missatge.textContent = 'Inscripció correcta!';
      setTimeout(() => {
        document.getElementById('popupInscripcio').style.display = 'none';
        loadSessions(); // refresca
      }, 1500);
    })
    .catch(err => {
      missatge.style.color = 'red';
      missatge.textContent = err.message;
    });
});

let sessioAConsultar = null;

function mostrarInscrits(id) {
  sessioAConsultar = id;
  document.getElementById('llistaInscrits').innerHTML = '';
  document.getElementById('missatgeInscrits').textContent = '';
  document.getElementById('dniEntrenadorCheck').value = '';
  document.getElementById('textInscritsSessio').textContent = `Sessió ID: ${id}`;
  document.getElementById('popupInscrits').style.display = 'flex';
}

document.getElementById('tancarPopupInscrits').addEventListener('click', () => {
  document.getElementById('popupInscrits').style.display = 'none';
});

document.getElementById('verificarEntrenador').addEventListener('click', () => {
  const dni = document.getElementById('dniEntrenadorCheck').value;

  fetch(`http://localhost:3000/api/inscripcions/${sessioAConsultar}?dni=${dni}`)
    .then(res => {
      if (!res.ok) return res.json().then(err => { throw new Error(err.error) });
      return res.json();
    })
    .then(data => {
      const list = document.getElementById('llistaInscrits');
      list.innerHTML = '';
      data.forEach(e => {
        const li = document.createElement('li');
        li.textContent = `${e.nom} ${e.cognom} (${e.dni})`;
        list.appendChild(li);
      });
    })
    .catch(err => {
      document.getElementById('missatgeInscrits').style.color = 'red';
      document.getElementById('missatgeInscrits').textContent = err.message;
    });
});