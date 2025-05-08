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

//todo
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
});