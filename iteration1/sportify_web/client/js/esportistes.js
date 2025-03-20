function loadEsportistes() {
    const table = document.getElementById('table');
    fetch('http://localhost:3000/esportistes')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch esportistes');
            }
            return response.json();
        })
        .then(esportistes => {
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
        })
        .catch(error => {
            console.error('Error:', error);
            table.innerHTML = `<p class="text-danger">Error al carregar els esportistes.</p>`;
        });

}

document.addEventListener('DOMContentLoaded', loadEsportistes);