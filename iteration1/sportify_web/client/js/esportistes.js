let allEsportistes = [];

function renderTable(esportistes) {
    const table = document.getElementById('table');
    let tableHTML = `
        <table class="table">
            <thead>
                <tr>
                    <th>DNI</th>
                    <th>Telèfon</th>
                    <th>Email</th>
                    <th>Update</th>
                    <th>Delete</th>
                </tr>
            </thead>
            <tbody>
    `;

    esportistes.forEach(esportista => {
        tableHTML += `
            <tr>
                <td>${esportista.dni}</td>
                <td>${esportista.tlf}</td>
                <td>${esportista.email}</td>
                <td><button class="btn btn-primary" onclick="goToUpdate('${esportista.dni}')">Update</button></td>
                <td><button class="btn btn-danger">Delete</button></td>
            </tr>
        `;
    });

    tableHTML += `</tbody></table>`;
    table.innerHTML = tableHTML;
}

function loadEsportistes() {
    console.log("ata");
    fetch('http://localhost:3000/esportistes')
        .then(response => {
            console.log("data");
            if (!response.ok) {
                throw new Error('Failed to fetch esportistes');
            }
            return response.json();
        })
        .then(data => {
            allEsportistes = data;
            console.log(data);
            renderTable(allEsportistes);
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('table').innerHTML =
                `<p class="text-danger">Error al carregar els esportistes.</p>`;
        });
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
    loadEsportistes();
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

    const dni = document.getElementById('dni').value;
    //const nom = document.getElementById('nom').value;
    //const cognoms = document.getElementById('cognoms').value;
    const tlf = document.getElementById('tlf').value;
    const email = document.getElementById('email').value;
    //const contrasenya = document.getElementById('contrasenya').value;
    //const confirmar = document.getElementById('confirmar').value;
/*
    if (contrasenya !== confirmar) {
        missatge.textContent = "Les contrasenyes no coincideixen";
        return;
    }
*/
    // Enviament de dades al servidor
    fetch('http://localhost:3000/esportistes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        //body: JSON.stringify({ dni, tlf, email, nom, cognoms, contrasenya }),
        body: JSON.stringify({ dni, tlf, email}),
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
