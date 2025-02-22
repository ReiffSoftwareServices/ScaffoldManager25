document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
    const navLinks = document.querySelectorAll('.nav-links a');

    // Handle navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            e.target.classList.add('active');

            const page = e.target.dataset.page;
            loadPage(page);
        });
    });

    // Add sample data function
    function loadSampleData() {
        const sampleData = [
            {
                id: 1,
                location: "Bahnhofstraße 12, Hamburg",
                status: "In Nutzung",
                date: "2024-03-15"
            },
            {
                id: 2,
                location: "Hauptstraße 45, Hamburg",
                status: "Abgemeldet",
                date: "2024-03-10"
            },
            {
                id: 3,
                location: "Musterweg 3, Hamburg",
                status: "In Aufbau",
                date: "2024-03-18"
            }
        ];

        localStorage.setItem('geruest-uebersicht', JSON.stringify(sampleData));
        return sampleData;
    }

    // Modify loadPage function to use sample data if no data exists
    function loadPage(page) {
        let data = JSON.parse(localStorage.getItem(page) || '[]');
        
        // Load sample data if overview is empty
        if (page === 'geruest-uebersicht' && data.length === 0) {
            data = loadSampleData();
        }

        switch(page) {
            case 'geruest-uebersicht':
                showOverview(data);
                break;
            default:
                mainContent.innerHTML = `
                    <h2>${page.replace(/-/g, ' ').toUpperCase()}</h2>
                    <p>This is the ${page} page content.</p>
                `;
        }
    }

    // Enhance showOverview to show status with colors
    function showOverview(data) {
        mainContent.innerHTML = `
            <h2>GERÜST ÜBERSICHT</h2>
            <button class="add-button" onclick="window.addRandomScaffold()">+ Neues Gerüst</button>
            <div class="overview-table">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Standort</th>
                            <th>Status</th>
                            <th>Datum</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map(item => `
                            <tr>
                                <td>${item.id}</td>
                                <td>${item.location}</td>
                                <td><span class="status-${item.status.toLowerCase().replace(' ', '-')}">${item.status}</span></td>
                                <td>${new Date(item.date).toLocaleDateString('de-DE')}</td>
                            </tr>
                        `).join('') || '<tr><td colspan="4">Keine Einträge vorhanden</td></tr>'}
                    </tbody>
                </table>
            </div>
        `;
    }

    // Add random scaffold generator
    window.addRandomScaffold = () => {
        const streets = ["Hauptstraße", "Bahnhofstraße", "Kirchweg", "Schulstraße", "Gartenweg", "Industriestraße"];
        const statuses = ["In Nutzung", "In Aufbau", "Abgemeldet"];
        
        const data = JSON.parse(localStorage.getItem('geruest-uebersicht') || '[]');
        
        const newScaffold = {
            id: data.length + 1,
            location: `${streets[Math.floor(Math.random() * streets.length)]} ${Math.floor(Math.random() * 100)}, Hamburg`,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            date: new Date().toISOString().split('T')[0]
        };
        
        data.push(newScaffold);
        localStorage.setItem('geruest-uebersicht', JSON.stringify(data));
        loadPage('geruest-uebersicht');
    };

    // Load default page
    loadPage('geruest-uebersicht');
}); 