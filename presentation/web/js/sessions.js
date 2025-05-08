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
                    <span> ${sessio.entrenador} </strong> </span>
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
        .then(data => {
            renderTable(sessions, data);
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('table').innerHTML =
                `<p class="text-danger">Error al carregar els membres.</p>`;
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