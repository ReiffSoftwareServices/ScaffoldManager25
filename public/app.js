document.addEventListener('DOMContentLoaded', () => {
    // Temporär: localStorage zurücksetzen
    localStorage.clear();  // Diese Zeile können Sie nach dem ersten Test wieder entfernen
    
    const mainContent = document.getElementById('main-content');

    // Stammdaten initialisieren, falls noch nicht vorhanden
    if (!localStorage.getItem('stammdaten-anmelder')) {
        const anmelderData = [
            {
                id: 1,
                name: "Max Mustermann",
                email: "test@geruestapp.de",
                telefon: "0176-12345678"
            },
            {
                id: 2,
                name: "Jan Reiff",
                email: "reiff.software.services@gmail.com",
                telefon: "0152-87654321"
            },
            {
                id: 3,
                name: "Christoph Lehnertz",
                email: "christoph.lehnertz@web.de",
                telefon: "0170-98765432"
            }
        ];
        localStorage.setItem('stammdaten-anmelder', JSON.stringify(anmelderData));
    }

    if (!localStorage.getItem('stammdaten-leistungsverzeichnis')) {
        const leistungsverzeichnisData = [
            {
                id: 1,
                position: "Kleingerüst-Pauschal bis 15 cbm",
                einheit: "Stück",
                preis: "250,00"
            },
            {
                id: 2,
                position: "Kleingerüst-Pauschal bis 15,01-25 cbm",
                einheit: "Stück",
                preis: "350,00"
            },
            {
                id: 3,
                position: "Kleingerüst-Pauschal bis 25,01-40 cbm",
                einheit: "Stück",
                preis: "450,00"
            },
            {
                id: 4,
                position: "Kleingerüst-Pauschal bis 40,01-60 cbm",
                einheit: "Stück",
                preis: "0,00"
            },
            {
                id: 5,
                position: "Raumgerüst Gerüstgruppe 3 max. 2,0 kN",
                einheit: "m³",
                preis: "10,00"
            },
            {
                id: 6,
                position: "Raumgerüst Gerüstgruppe 4 max. 3,0 kN",
                einheit: "m³",
                preis: "12,00"
            },
            {
                id: 7,
                position: "Raumgerüst Gerüstgruppe 5 max. 4,5 kN",
                einheit: "m³",
                preis: "14,00"
            },
            {
                id: 8,
                position: "Konsolen",
                einheit: "m",
                preis: "8,00"
            },
            {
                id: 9,
                position: "Schutznetze",
                einheit: "m²",
                preis: "3,00"
            },
            {
                id: 10,
                position: "Seitenschutz",
                einheit: "m",
                preis: "2,50"
            },
            {
                id: 11,
                position: "Treppenturm",
                einheit: "m",
                preis: "100,00"
            },
            {
                id: 12,
                position: "Zusätzliche Beläge",
                einheit: "m²",
                preis: "4,50"
            },
            {
                id: 13,
                position: "Stunden ohne Material",
                einheit: "h",
                preis: "50,00"
            },
            {
                id: 14,
                position: "Stunden mit Material",
                einheit: "h",
                preis: "60,00"
            }
        ];
        localStorage.setItem('stammdaten-leistungsverzeichnis', JSON.stringify(leistungsverzeichnisData));
    }

    // Gerüst-Beispieldaten initialisieren
    if (!localStorage.getItem('geruest-uebersicht')) {
        const geruestData = [
            {
                id: 1,
                location: "Hauptstraße 12, Hamburg",
                status: "In Nutzung",
                date: "2024-03-15"
            },
            {
                id: 2,
                location: "Bahnhofstraße 45, Hamburg",
                status: "In Aufbau",
                date: "2024-03-18"
            }
        ];
        localStorage.setItem('geruest-uebersicht', JSON.stringify(geruestData));
    }

    // Einfache Navigation
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[data-page], a[data-table]');
        if (!link) return;

        e.preventDefault();
        
        if (link.dataset.page) {
            const page = link.dataset.page;
            document.querySelectorAll('a[data-page]').forEach(a => a.classList.remove('active'));
            link.classList.add('active');

            if (page === 'stammdaten') {
                showStammdatenOverview();
            } else if (page === 'geruest-uebersicht') {
                showGeruestUebersicht();
            } else {
                showDefaultPage(page);
            }
        } else if (link.dataset.table) {
            // Handling für Stammdaten-Tabellen
            document.querySelectorAll('a[data-table]').forEach(a => a.classList.remove('active'));
            link.classList.add('active');
            showStammdatenTable(link.dataset.table);
        }
    });

    // Plus-Button Funktionalität
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-button')) {
            const data = JSON.parse(localStorage.getItem('geruest-uebersicht') || '[]');
            const newGerüst = {
                id: data.length + 1,
                location: `Musterstraße ${Math.floor(Math.random() * 100)}, Hamburg`,
                status: "Neu",
                date: new Date().toISOString().split('T')[0]
            };
            data.push(newGerüst);
            localStorage.setItem('geruest-uebersicht', JSON.stringify(data));
            showGeruestUebersicht();
        }
    });

    function showStammdatenOverview() {
        mainContent.innerHTML = `
            <h2>Stammdaten</h2>
            <div class="stammdaten-container">
                <div class="stammdaten-menu">
                    <ul>
                        <li><a href="#" data-table="anmelder">Anmelder</a></li>
                        <li><a href="#" data-table="leistungsverzeichnis">Leistungsverzeichnis</a></li>
                    </ul>
                </div>
                <div class="stammdaten-content">
                    <h3>Bitte wählen Sie eine Kategorie</h3>
                </div>
            </div>
        `;
    }

    function showStammdatenTable(table) {
        if (table === 'anmelder') {
            const anmelder = JSON.parse(localStorage.getItem('stammdaten-anmelder'));
            const content = document.querySelector('.stammdaten-content');
            content.innerHTML = `
                <h3>Anmelder</h3>
                <div class="overview-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Telefon</th>
                                <th>E-Mail</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${anmelder.map(person => `
                                <tr>
                                    <td>${person.name}</td>
                                    <td>${person.telefon}</td>
                                    <td><a href="mailto:${person.email}" class="email-link">${person.email}</a></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        } else if (table === 'leistungsverzeichnis') {
            const leistungen = JSON.parse(localStorage.getItem('stammdaten-leistungsverzeichnis'));
            const content = document.querySelector('.stammdaten-content');
            content.innerHTML = `
                <h3>Leistungsverzeichnis</h3>
                <div class="overview-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Position</th>
                                <th>Einheit</th>
                                <th>Preis pro Einheit</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${leistungen.map(leistung => `
                                <tr>
                                    <td>${leistung.position}</td>
                                    <td>${leistung.einheit}</td>
                                    <td>${leistung.preis} €</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }
    }

    function showGeruestUebersicht() {
        const data = JSON.parse(localStorage.getItem('geruest-uebersicht') || '[]');
        mainContent.innerHTML = `
            <h2>GERÜST ÜBERSICHT</h2>
            <button class="add-button">+ Neues Gerüst</button>
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
                                <td>${item.status}</td>
                                <td>${item.date}</td>
                            </tr>
                        `).join('') || '<tr><td colspan="4">Keine Einträge vorhanden</td></tr>'}
                    </tbody>
                </table>
            </div>
        `;
    }

    function showDefaultPage(page) {
        if (page === 'geruest-anmeldung') {
            const anmelder = JSON.parse(localStorage.getItem('stammdaten-anmelder'));
            
            mainContent.innerHTML = `
                <h2>GERÜSTANMELDUNG</h2>
                <div class="form-container">
                    <!-- Foto-Bereich -->
                    <div class="photo-requirement" id="photo-section">
                        <p class="text-red-500 mb-4">* Bitte zuerst ein Foto aufnehmen</p>
                        <button id="take-photo" class="photo-button">
                            <i class="fas fa-camera"></i>
                            Foto aufnehmen
                        </button>
                    </div>

                    <div id="form-content" class="hidden">
                        <!-- Anmelder -->
                        <div class="form-section">
                            <div class="form-group">
                                <label class="form-label required">Anmelder</label>
                                <select id="anmelder" class="form-select">
                                    <option value="">Anmelder auswählen</option>
                                    ${anmelder.map(person => `
                                        <option value="${person.id}">${person.name}</option>
                                    `).join('')}
                                </select>
                            </div>
                        </div>

                        <!-- Gerüstinformationen -->
                        <div class="form-section">
                            <h3>Gerüstinformationen</h3>
                            <div class="form-grid">
                                <div class="form-group">
                                    <label class="form-label required">Bereich</label>
                                    <select id="bereich" class="form-select">
                                        <option value="">Bereich auswählen</option>
                                        <option value="stahlbau">Stahlbau</option>
                                        <option value="rohleitung">Rohleitung</option>
                                        <option value="malerarbeiten">Malerarbeiten</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="form-label required">Anlage</label>
                                    <input type="text" id="anlage" class="form-input" placeholder="Anlage eingeben">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Ebene/Stockwerk</label>
                                    <input type="text" id="ebene" class="form-input" placeholder="Ebene eingeben">
                                </div>
                                <div class="form-group">
                                    <label class="form-label required">Örtlichkeit</label>
                                    <input type="text" id="oertlichkeit" class="form-input" placeholder="Örtlichkeit eingeben">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Koordinate</label>
                                    <input type="text" id="koordinate" class="form-input" placeholder="Koordinate eingeben">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Notiz 1</label>
                                    <textarea id="notiz1" class="form-input" rows="2"></textarea>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Notiz 2</label>
                                    <textarea id="notiz2" class="form-input" rows="2"></textarea>
                                </div>
                            </div>
                        </div>

                        <!-- Kubatur -->
                        <div class="form-section kubatur-section">
                            <h3>Kubatur des Gerüstes</h3>
                            <div class="form-grid">
                                <div class="form-group">
                                    <label class="form-label">Länge (m)</label>
                                    <input type="number" id="length" class="form-input" min="0" step="0.1" placeholder="0">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Breite (m)</label>
                                    <input type="number" id="width" class="form-input" min="0" step="0.1" placeholder="0">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Höhe (m)</label>
                                    <input type="number" id="height" class="form-input" min="0" step="0.1" placeholder="0">
                                </div>
                            </div>
                            <div class="volume-display">
                                <span>Berechnetes Volumen: </span>
                                <span id="volume">0</span>
                                <span>m³</span>
                            </div>
                        </div>

                        <!-- Datum -->
                        <div class="form-section">
                            <div class="form-grid">
                                <div class="form-group">
                                    <label class="form-label">Anmeldedatum</label>
                                    <input type="date" id="anmelde_datum" class="form-input" 
                                        value="${new Date().toISOString().split('T')[0]}" readonly>
                                </div>
                                <div class="form-group">
                                    <label class="form-label required">Aufbaudatum</label>
                                    <input type="date" id="aufbau_datum" class="form-input">
                                </div>
                            </div>
                        </div>

                        <button id="submit-form" class="add-button w-full">
                            Gerüst anmelden
                        </button>
                    </div>
                </div>
            `;

            setupFormEventListeners();
        } else {
            mainContent.innerHTML = `
                <h2>${page.replace(/-/g, ' ').toUpperCase()}</h2>
                <p>Inhalt für ${page}</p>
            `;
        }
    }

    // Hilfsfunktionen für die Gerüstanmeldung
    function calculateVolume() {
        const length = parseFloat(document.getElementById('length')?.value || 0);
        const width = parseFloat(document.getElementById('width')?.value || 0);
        const height = parseFloat(document.getElementById('height')?.value || 0);
        const volume = length * width * height;
        
        document.getElementById('volume').textContent = volume.toFixed(2);
    }

    function handleSubmit() {
        // Validierung der Pflichtfelder
        const requiredFields = ['anmelder', 'bereich', 'anlage', 'oertlichkeit', 'aufbau_datum'];
        const missingFields = requiredFields.filter(field => !document.getElementById(field).value);
        
        if (missingFields.length > 0) {
            alert('Bitte füllen Sie alle Pflichtfelder aus: ' + missingFields.join(', '));
            return;
        }

        const formData = {
            anmelder_id: document.getElementById('anmelder').value,
            bereich: document.getElementById('bereich').value,
            anlage: document.getElementById('anlage').value,
            ebene: document.getElementById('ebene').value,
            oertlichkeit: document.getElementById('oertlichkeit').value,
            koordinate: document.getElementById('koordinate').value,
            notiz1: document.getElementById('notiz1').value,
            notiz2: document.getElementById('notiz2').value,
            length: document.getElementById('length').value,
            width: document.getElementById('width').value,
            height: document.getElementById('height').value,
            volume: document.getElementById('volume').textContent,
            anmelde_datum: document.getElementById('anmelde_datum').value,
            aufbau_datum: document.getElementById('aufbau_datum').value,
            foto_url: null // wird später durch echtes Foto ersetzt
        };

        // API-Aufruf
        fetch('/api/geruest-anmeldung', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Gerüstanmeldung erfolgreich gespeichert');
                document.querySelector('a[data-page="geruest-uebersicht"]').click();
            } else {
                alert('Fehler beim Speichern: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Fehler beim Speichern der Anmeldung');
        });
    }

    // Foto-Upload Funktion
    function handleFotoUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('foto', file);

        fetch('/api/upload-foto', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('foto_url').value = data.foto_url;
                document.getElementById('photo-preview').src = data.foto_url;
                document.getElementById('form-content').classList.remove('hidden');
                document.querySelector('.photo-requirement').classList.add('hidden');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Fehler beim Hochladen des Fotos');
        });
    }

    function setupFormEventListeners() {
        // Foto-Button
        const takePhotoButton = document.getElementById('take-photo');
        const formContent = document.getElementById('form-content');
        const photoSection = document.getElementById('photo-section');
        
        takePhotoButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Statt Foto-Upload erstmal nur das Formular anzeigen
            photoSection.classList.add('hidden');
            formContent.classList.remove('hidden');
        });

        // Volumenberechnung
        ['length', 'width', 'height'].forEach(id => {
            document.getElementById(id)?.addEventListener('input', calculateVolume);
        });

        // Formular Submit
        document.getElementById('submit-form')?.addEventListener('click', handleSubmit);

        // Anmelder Kontaktinfo anzeigen
        const anmelderSelect = document.getElementById('anmelder');
        anmelderSelect?.addEventListener('change', (e) => {
            const anmelderId = e.target.value;
            if (!anmelderId) {
                document.querySelector('.anmelder-contact')?.remove();
                return;
            }

            const anmelder = JSON.parse(localStorage.getItem('stammdaten-anmelder'))
                .find(a => a.id === parseInt(anmelderId));

            if (anmelder) {
                const existingContact = document.querySelector('.anmelder-contact');
                if (existingContact) existingContact.remove();

                const contactInfo = document.createElement('div');
                contactInfo.className = 'anmelder-contact';
                contactInfo.innerHTML = `
                    <div class="anmelder-contact-item">
                        <i class="fas fa-phone"></i>
                        <span>${anmelder.telefon}</span>
                    </div>
                    <div class="anmelder-contact-item">
                        <i class="fas fa-envelope"></i>
                        <a href="mailto:${anmelder.email}">${anmelder.email}</a>
                    </div>
                `;

                // Einfügen nach dem Select-Feld
                anmelderSelect.parentNode.appendChild(contactInfo);
            }
        });
    }

    // Initial die Übersichtsseite laden
    document.querySelector('a[data-page="geruest-uebersicht"]').click();
});

function showStatusMessage(message, type = 'success') {
    const statusBar = document.createElement('div');
    statusBar.className = `status-message ${type}`;
    statusBar.innerHTML = `
        <span>${message}</span>
        <button class="close-message">×</button>
    `;
    document.body.appendChild(statusBar);
    
    // Auto-hide nach 3 Sekunden
    setTimeout(() => statusBar.remove(), 3000);
    
    // Oder manuell schließen
    statusBar.querySelector('.close-message').onclick = () => statusBar.remove();
} 