let allSessions = [];

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
                <td><button class="btn btn-danger" onclick="confirmDelete('')">Delete //todo</button></td>
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

const obrirPopup = document.getElementById("obrirPopup");
const popupFons = document.getElementById("popupFons");
const tancarPopup = document.getElementById("tancarPopup");


obrirPopup.addEventListener("click", () => popupFons.style.display = "flex");
  
tancarPopup.addEventListener("click", () => popupFons.style.display = "none");
  
  // Tancar fent clic fora del formulari
window.addEventListener("click", (e) => {
    if (e.target === popupFons) popupFons.style.display = "none";
});


const registreForm = document.getElementById('registreForm');
const missatge = document.getElementById('missatge');

registreForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const dni = document.getElementById('dni').value;
    const nom = document.getElementById('nom').value;
    const cognoms = document.getElementById('cognoms').value;
    const tlf = document.getElementById('tlf').value;
    const email = document.getElementById('email').value;

    // Enviament de dades al servidor
    fetch('http://localhost:3000/api/esportistes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dni, nom, cognoms, tlf, email}),
    })
    .then(response => {
        if (!response.ok) throw new Error('Error al afegir esportista');
        return response.text();
    })
    .then(msg => {
        missatge.style.color = 'green';
        missatge.textContent = msg;
        registreForm.reset();
        popupFons.style.display = 'none';
        loadEsportistes();
    })
    .catch(err => {
        missatge.style.color = 'red';
        missatge.textContent = err.message;
    });
});

let dniAEliminar = null;

const popupFonsDelete = document.getElementById("popupFonsDelete");
const tancarPopupDelete = document.getElementById("tancarPopupDelete");
const confirmarDelete = document.getElementById("confirmarDelete");
const cancelarDelete = document.getElementById("cancelarDelete");
const textConfirmacio = document.getElementById("textConfirmacio");

function confirmDelete(dni) {
    dniAEliminar = dni;
    textConfirmacio.textContent = `Estàs segur que vols eliminar l'esportista amb DNI ${dni}?`;
    popupFonsDelete.style.display = "flex";
}

confirmarDelete.addEventListener("click", () => {
    if (!dniAEliminar) return;

    fetch(`http://localhost:3000/api/esportistes/${dniAEliminar}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) throw new Error("No s'ha pogut eliminar l'esportista");
        return response.text();
    })
    .then(msg => {
        popupFonsDelete.style.display = "none";
        dniAEliminar = null;
        loadEsportistes();
    })
    .catch(err => {
        alert("Error: " + err.message);
        popupFonsDelete.style.display = "none";
        dniAEliminar = null;
    });
});

cancelarDelete.addEventListener("click", () => {
    popupFonsDelete.style.display = "none";
    dniAEliminar = null;
});

tancarPopupDelete.addEventListener("click", () => {
    popupFonsDelete.style.display = "none";
    dniAEliminar = null;
});

window.addEventListener("click", (e) => {
    if (e.target === popupFonsDelete) {
        popupFonsDelete.style.display = "none";
        dniAEliminar = null;
    }
});