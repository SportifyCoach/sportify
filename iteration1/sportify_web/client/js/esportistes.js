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
                <td><button class="btn btn-primary">Update</button></td>
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