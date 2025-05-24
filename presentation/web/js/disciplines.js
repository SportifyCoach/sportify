let allDisciplines = [];

function renderTable(disciplines) {
    const table = document.getElementById('table');
    let tableHTML = `
        <table class="table">
            <thead>
                <tr>
                    <th>Nom</th>
                    <th>Espai</th>
                    <th>Update</th>
                    <th>Delete</th>
                </tr>
            </thead>
            <tbody>
    `;

    disciplines.forEach(disciplina => {
        tableHTML += `
            <tr>
                <td>${disciplina.nom}</td>
                <td>${disciplina.espai}</td>
                <td><button class="btn btn-primary" onclick="goToUpdate('${disciplina.nom}')">Update</button></td>
                <td><button class="btn btn-danger" onclick="confirmDelete('${disciplina.nom}')">Delete</button></td>
            </tr>
        `;
    });

    tableHTML += `</tbody></table>`;
    table.innerHTML = tableHTML;
}

function loadDisciplines() {
    fetch('http://localhost:3000/api/disciplines')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch disciplines');
            }
            return response.json();
        })
        .then(data => {
            allDisciplines = data;
            renderTable(allDisciplines);
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('table').innerHTML =
                `<p class="text-danger">Error al carregar els disciplines.</p>`;
        });
}

function goToUpdate(nom) {
    window.location.href = `updateDisciplina.html?nom=${nom}`;
  }

function setupSearch() {
    const searchInput = document.getElementById('search-bar');
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();
        const filtered = allDisciplines.filter(e =>
            e.nom.toLowerCase().includes(query)
        );
        renderTable(filtered);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadDisciplines();
    setupSearch();
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

    const nom = document.getElementById('nom').value;
    const espai = document.getElementById('espai').value;

    // Enviament de dades al servidor
    fetch('http://localhost:3000/api/disciplines', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nom, espai}),
    })
    .then(response => {
        if (!response.ok) throw new Error('Error al afegir disciplina');
        return response.text();
    })
    .then(msg => {
        missatge.style.color = 'green';
        missatge.textContent = msg;
        registreForm.reset();
        popupFons.style.display = 'none';
        loadDisciplines();
    })
    .catch(err => {
        missatge.style.color = 'red';
        missatge.textContent = err.message;
    });
});

let nomAEliminar = null;

const popupFonsDelete = document.getElementById("popupFonsDelete");
const tancarPopupDelete = document.getElementById("tancarPopupDelete");
const confirmarDelete = document.getElementById("confirmarDelete");
const cancelarDelete = document.getElementById("cancelarDelete");
const textConfirmacio = document.getElementById("textConfirmacio");

function confirmDelete(nom) {
    nomAEliminar = nom;
    textConfirmacio.textContent = `Estàs segur que vols eliminar l'disciplina amb nom ${nom}?`;
    popupFonsDelete.style.display = "flex";
}

confirmarDelete.addEventListener("click", () => {
    if (!nomAEliminar) return;

    fetch(`http://localhost:3000/api/disciplines/${nomAEliminar}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) throw new Error("No s'ha pogut eliminar l'disciplina");
        return response.text();
    })
    .then(msg => {
        popupFonsDelete.style.display = "none";
        nomAEliminar = null;
        loadDisciplines();
    })
    .catch(err => {
        alert("Error: " + err.message);
        popupFonsDelete.style.display = "none";
        nomAEliminar = null;
    });
});

cancelarDelete.addEventListener("click", () => {
    popupFonsDelete.style.display = "none";
    nomAEliminar = null;
});

tancarPopupDelete.addEventListener("click", () => {
    popupFonsDelete.style.display = "none";
    nomAEliminar = null;
});

window.addEventListener("click", (e) => {
    if (e.target === popupFonsDelete) {
        popupFonsDelete.style.display = "none";
        nomAEliminar = null;
    }
});