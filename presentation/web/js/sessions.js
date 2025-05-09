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
                    <th>Update</th>
                    <th>Delete</th>
                </tr>
            </thead>
            <tbody>
    `;

    sessions.forEach(sessio => {
        tableHTML += `
            <tr>
                <td>${sessio.id}</td>
                <td>${sessio.date}</td>
                <td>${sessio.limit_persones}</td>
                <td>${sessio.disciplina}</td>
                <td>${sessio.entrenador}</td>
                <td><button class="btn btn-primary" onclick="goToUpdate('')">Update //todo</button></td> 
                <td><button class="btn btn-danger" onclick="confirmDelete(${sessio.id})">Delete</button></td>
            </tr>
        `;
    });

    tableHTML += `</tbody></table>`;
    table.innerHTML = tableHTML;
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

//todo tot cap abaix!!


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