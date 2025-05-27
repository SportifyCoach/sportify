let allSessions = [];
let allMembers  = [];
let sessioAEliminar = null;

const popupFonsDeleteSessio = document.getElementById("popupFonsDeleteSessio");
const tancarPopupDeleteSessio = document.getElementById("tancarPopupDeleteSessio");
const confirmarDeleteSessio = document.getElementById("confirmarDeleteSessio");
const cancelarDeleteSessio = document.getElementById("cancelarDeleteSessio");
const textConfirmacioSessio = document.getElementById("textConfirmacioSessio");

const obrirPopupSessio = document.getElementById("obrirPopupSessio");
const popupFons = document.getElementById("popupFons");
const tancarPopupSessio = document.getElementById("tancarPopupSessio");


function renderTable(sessions, members) {
  const table = document.getElementById('table');
  table.innerHTML = '';

  sessions.forEach(sessio => {
    // Filtrar els membres que coincideixen amb la sessio
    const filteredMembers = members.filter(member => member.sessio_id === sessio.id);

    let valoracio = 0;
    filteredMembers.forEach(member => {
      valoracio += member.valoracio;
    })

    // Calcula valoració mitjana
    if (valoracio != 0) {
      sessio.valMitja = (valoracio / filteredMembers.length).toFixed(1);
    } else {
      sessio.valMitja = "-";
    }

    // Convertir la data a un format llegible
    const date = new Date(sessio.date);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    const formattedDate = date.toLocaleDateString('ca-ES', options);

    sessio.disciplina = sessio.disciplina.toUpperCase();

    table.innerHTML += `
          <div class="session">
              <div class="session-title">
                  <span> <strong> ${sessio.disciplina} </strong> - ${formattedDate}  </span> 
                  <span> <strong> Entrenador/a: </strong> ${sessio.entrenadorNom} (${Number(sessio.valMitjaEnt)}/10)</span>
              </div>
              <table class="table">
                  <thead>
                      <tr>
                          <th>Participants</th>
                          <th>Valoració</th>
                          <th></th>
                      </tr>
                  </thead>
                  <tbody>
                      ${filteredMembers.map(member => `
                          <tr>
                              <td>${member.esportistaName}</td>
                              <td> ${member.valoracio ? member.valoracio : '-'}</td>
                              <td style="text-align: right; width: 20px; align-items: center; padding: 5px 11px 0 11px;"><img class="edit_val" src="../img/edit.png" alt="Editar Valoració" 
                                onclick="updateVal(${member.esportista_dni, sessio.id})"></td>
                          </tr>
                      `).join('')}
                  </tbody>
                  <thead>
                        <tr>
                          <th>Mitjana Sessió</th>
                          <th>${sessio.valMitja}</th>
                          <th></th>
              </table>
              <div class="session-footer">
                  <div class="session-footer-row">
                      <button id="add-member-${sessio.id}" class="btn btn-success small" onclick="
                        (function() {
                          const parts = '${sessio.date}'.split('/');
                          const sessioDate = new Date(parts[2], parts[1] - 1, parts[0]);
                          const now = new Date();
                          if (sessioDate <= now) {
                            tooLate(${sessio.id});
                          } else {
                            ${filteredMembers.length == sessio.limit_persones
                              ? `noMoreSpace(${sessio.id});` : `mostrarInscripcio(${sessio.id});`
                            }
                          }
                        })()">Afegir Participants ${filteredMembers.length}/${sessio.limit_persones}
                      </button>
                      <button id="edit-sessio-${sessio.id}" class="btn btn-primary small" onclick="goToUpdate(${sessio.id})">Editar Sessió</button>
                  </div>
                  <div class="session-footer-row">
                      <button id="del-member-${sessio.id}" class="btn btn-danger small" onclick="mostrarDeleteParticipant(${sessio.id})">Eliminar Participants</button> <!--todo-->
                      <button id="del-m-${sessio.id}" class="btn btn-danger small" onclick="confirmDelete(${sessio.id})">Eliminar Sessió</button>
                  </div>
              </div>
          </div>
      `;
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
      allMembers = members;
      getAllEntrenadorsNames(sessions, members);
    })
    .catch(error => {
      console.error('Error:', error);
      document.getElementById('table').innerHTML =
        `<p class="text-danger">Error al carregar els participants.</p>`;
    });
}

function getAllEsportistesNames(sessions, members) {
  fetch('http://localhost:3000/api/esportistes')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch esportistes');
      }
      return response.json();
    })
    .then(esportistes => {
      members.forEach(member => {
        const esportista = esportistes.find(e => e.dni === member.esportista_dni);
        if (esportista) {
          member.esportistaName = `${esportista.nom} ${esportista.cognom}`;
        } else {
          member.esportistaName = 'Esportista no trobat';
        }
      });
    })
    .then(() => {
      const promises = sessions.map(async (sessio) => {
        const valoracio = await loadValoracionsEntrenador(sessio.entrenador);
        sessio.valMitjaEnt = valoracio !== null ? valoracio : 0;
      });
      return Promise.all(promises);
    })
    .then(() => {
      renderTable(sessions, members);
    })
    .catch(error => {
      console.error('Error:', error);
      document.getElementById('table').innerHTML =
        `<p class="text-danger">Error al carregar els esportistes.</p>`;
    });
}

function getAllEntrenadorsNames(sessions, members) {
  fetch('http://localhost:3000/api/entrenadors')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch entrenadors');
      }
      return response.json();
    })
    .then(entrenadors => {
      sessions.forEach(sessio => {
        const entrenador = entrenadors.find(e => e.dni === sessio.entrenador);
        if (entrenador) {
          sessio.entrenadorNom = `${entrenador.nom} ${entrenador.cognoms}`;
        } else {
          sessio.entrenadorNom = 'Entrenador no trobat';
        }
      });
      getAllEsportistesNames(sessions, members);
    })
    .catch(error => {
      console.error('Error:', error);
      document.getElementById('table').innerHTML =
        `<p class="text-danger">Error al carregar els entrenadors.</p>`;
    });
}

async function loadValoracionsEntrenador(dni) {
  let url = `http://localhost:3000/api/sessions/valoracions/entrenador/${dni}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Error carregant les valoracions mitjanes');

    const data = await res.json();

    // Filtra valors invàlids: null, undefined o menors que 1
    const valids = data.filter(val => val !== null && val !== undefined && val >= 1);

    if (valids.length === 0) return 0;

    const total = valids.reduce((sum, val) => sum + val, 0);
    const mitjana = (total / valids.length).toFixed(1);

    return mitjana;
  } catch (err) {
    console.error('Error:', err);
    return null; // o -1 si vols indicar error
  }
}

function goToUpdate(id) {
  window.location.href = `updateSessio.html?id=${id}`;
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
  //document.getElementById('mostrarDisponibles').addEventListener('click', loadAvailableSessions);
  //document.getElementById('mostrarTotes').addEventListener('click', loadSessions);
});


obrirPopupSessio.addEventListener("click", () => popupFons.style.display = "flex");
tancarPopupSessio.addEventListener("click", () => popupFons.style.display = "none");

// Tancar fent clic fora del formulari
window.addEventListener("click", (e) => {
  if (e.target === popupFons) popupFons.style.display = "none";
});


const registreForm = document.getElementById('registreForm');
const missatge = document.getElementById('missatge');

registreForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const date = document.getElementById('datetime').value;
  const limit_persones = document.getElementById('limit_persones').value;
  const disciplina = document.getElementById('disciplina').value;
  const entrenador = document.getElementById('entrenador').value;

  // Enviament de dades al servidor
  fetch('http://localhost:3000/api/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ date, limit_persones, disciplina, entrenador }),
  })
    .then(response => {
      if (!response.ok) throw new Error('Error al afegir la sessió');
      return response.text();
    })
    .then(msg => {
      missatge.style.color = 'green';
      missatge.textContent = msg;
      registreForm.reset();
      popupFons.style.display = 'none';
      loadSessions();
    })
    .catch(err => {
      console.log(err);
      missatge.style.color = 'red';
      missatge.textContent = err.message;
    });
});


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
let sessioABorrar = null;

function mostrarInscripcio(sessioId) {
  sessioAInscriure = sessioId;
  document.getElementById('textSessioInscripcio').textContent = `Inscripció a la sessió ID ${sessioId}`;
  document.getElementById('dniInscripcio').style.display = '';
  document.getElementById('confirmarInscripcio').style.display = '';
  document.getElementById('dniInscripcio').value = '';
  document.getElementById('missatgeInscripcio').textContent = '';
  document.getElementById('popupInscripcio').style.display = 'flex';
}

function mostrarDeleteParticipant(sessioId) {
  sessioABorrar = sessioId;
  document.getElementById('textSessioDeleteParticipant').textContent = `Eliminar participant a la sessió ID ${sessioId}`;
  document.getElementById('dniDelete').style.display = '';
  document.getElementById('confirmarDelete').style.display = '';
  document.getElementById('dniDelete').value = '';
  document.getElementById('missatgeDelete').textContent = '';
  document.getElementById('popupDeleteParticipant').style.display = 'flex';
}

function tooLate(sessioId) {
  document.getElementById('missatgeInscripcio').style.color = 'red';
  document.getElementById('missatgeInscripcio').textContent = 'La data d\'aquesta sessió ja ha passat.';
  document.getElementById('textSessioInscripcio').textContent = `Inscripció a la sessió ID ${sessioId}`;
  document.getElementById('dniInscripcio').style.display = 'none';
  document.getElementById('confirmarInscripcio').style.display = 'none';
  document.getElementById('popupInscripcio').style.display = 'flex';
}

function noMoreSpace(sessioId) {
  document.getElementById('missatgeInscripcio').style.color = 'red';
  document.getElementById('missatgeInscripcio').textContent = 'No hi ha més espai per a inscriure\'s a aquesta sessió.';
  document.getElementById('textSessioInscripcio').textContent = `Inscripció a la sessió ID ${sessioId}`;
  document.getElementById('dniInscripcio').style.display = 'none';
  document.getElementById('confirmarInscripcio').style.display = 'none';
  document.getElementById('popupInscripcio').style.display = 'flex';
}

document.getElementById('tancarPopupInscripcio').addEventListener('click', () => {
  document.getElementById('popupInscripcio').style.display = 'none';
});

document.getElementById('tancarPopupDeleteParticipant').addEventListener('click', () => {
  document.getElementById('popupDeleteParticipant').style.display = 'none';
});

document.getElementById('confirmarInscripcio').addEventListener('click', () => {
  const dni = document.getElementById('dniInscripcio').value;
  const missatge = document.getElementById('missatgeInscripcio');

  fetch('http://localhost:3000/api/entrenaments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessio_id: sessioAInscriure, esportista_dni: dni }),
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
      console.log('Error:', err);
      missatge.style.color = 'red';
      missatge.textContent = 'Error al realitzar la inscripció';
    });
});

document.getElementById('confirmarDelete').addEventListener('click', () => {
  const dni = document.getElementById('dniDelete').value;
  const missatge = document.getElementById('missatgeDelete');

  fetch('http://localhost:3000/api/entrenaments', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessio_id: sessioABorrar, esportista_dni: dni }),
  })
    .then(res => {
      if (!res.ok) return res.json().then(err => { throw new Error(err.error) });
      return res.text();
    })
    .then(() => {
      missatge.style.color = 'green';
      missatge.textContent = 'Eliminat correctament!';
      setTimeout(() => {
        document.getElementById('popupDeleteParticipant').style.display = 'none';
        loadSessions(); // refresca
      }, 1500);
    })
    .catch(err => {
      console.log(err);
      missatge.style.color = 'red';
      if (err.message === 'Entrenament no trobat') {
        missatge.textContent = 'Error: No existeix el participant a la sessió';
      } else {
        console.log('Error:', err);
        missatge.textContent = 'Error al eliminar';
      }
    });
});

function applyFilters() {
  const disFilter  = document.getElementById('search-bar-dis').value.trim().toLowerCase();
  const espFilter  = document.getElementById('search-bar-esp').value.trim().toLowerCase();
  const entFilter  = document.getElementById('search-bar-ent').value.trim().toLowerCase();

  // 1) Filtra per disciplina i entrenador
  let filteredS = allSessions.filter(s => {
    const matchDisc = s.disciplina.toLowerCase().includes(disFilter);
    const matchEnt  = s.entrenadorNom.toLowerCase().includes(entFilter);
    return matchDisc && matchEnt && s.date;
  });

  // 2) Si hi ha text d’esportista, només quedin sessions amb algun member coincident
  if (espFilter) {
    filteredS = filteredS.filter(s => {
      // troba membres d’aquesta sessió amb esportistaName que inclogui espFilter
      return allMembers.some(m =>
        m.sessio_id === s.id &&
        m.esportistaName.toLowerCase().includes(espFilter)
      );
    });
  }

  renderTable(filteredS, allMembers);
}

document.addEventListener('DOMContentLoaded', () => {
  loadSessions();
  // Quan l’usuari escriu, reaplica filtres:
  ['dis','esp','ent'].forEach(type => {
    document
      .getElementById(`search-bar-${type}`)
      .addEventListener('input', applyFilters);
  });
});

let sessioAConsultar = null;