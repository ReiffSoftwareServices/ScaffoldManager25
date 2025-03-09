/**
 * Gerüst Manager - Main Application
 * 
 * Eine einfache Single-Page-Anwendung zur Verwaltung von Gerüsten
 */

document.addEventListener('DOMContentLoaded', () => {
    // Temporär: localStorage zurücksetzen
    // localStorage.clear();  // Diese Zeile können Sie nach dem ersten Test wieder entfernen
    
    const mainContent = document.getElementById('main-content');

    // Speichern des ursprünglichen HTML-Inhalts der Gerüstanmeldung
    const originalGeruestAnmeldungHTML = document.getElementById('geruest-anmeldung')?.outerHTML;

    // Initialisierung
    initializeLocalStorage();
    setupEventListeners();
    showInitialPage();
    
    /**
     * Initialisiert die lokalen Speicherdaten, falls noch nicht vorhanden
     */
    function initializeLocalStorage() {
        // Anmelder-Daten
        if (!localStorage.getItem('stammdaten-anmelder')) {
            const anmelderData = [
                { id: 1, name: "Max Mustermann", email: "test@geruestapp.de", telefon: "0176-12345678" },
                { id: 2, name: "Jan Reiff", email: "reiff.software.services@gmail.com", telefon: "0152-87654321" },
                { id: 3, name: "Christoph Lehnertz", email: "christoph.lehnertz@web.de", telefon: "0170-98765432" }
            ];
            localStorage.setItem('stammdaten-anmelder', JSON.stringify(anmelderData));
        }
        
        // Leistungsverzeichnis-Daten
        if (!localStorage.getItem('stammdaten-leistungsverzeichnis')) {
            const leistungsverzeichnisData = [
                { id: 1, position: "Kleingerüst-Pauschal bis 15 cbm", einheit: "Stück", preis: "250,00" },
                { id: 2, position: "Kleingerüst-Pauschal bis 15,01-25 cbm", einheit: "Stück", preis: "350,00" },
                { id: 3, position: "Kleingerüst-Pauschal bis 25,01-40 cbm", einheit: "Stück", preis: "450,00" },
                { id: 4, position: "Kleingerüst-Pauschal bis 40,01-60 cbm", einheit: "Stück", preis: "0,00" },
                { id: 5, position: "Raumgerüst Gerüstgruppe 3 max. 2,0 kN", einheit: "m³", preis: "10,00" },
                { id: 6, position: "Raumgerüst Gerüstgruppe 4 max. 3,0 kN", einheit: "m³", preis: "12,00" },
                { id: 7, position: "Raumgerüst Gerüstgruppe 5 max. 4,5 kN", einheit: "m³", preis: "14,00" },
                { id: 8, position: "Konsolen", einheit: "m", preis: "8,00" },
                { id: 9, position: "Schutznetze", einheit: "m²", preis: "3,00" },
                { id: 10, position: "Seitenschutz", einheit: "m", preis: "2,50" },
                { id: 11, position: "Treppenturm", einheit: "m", preis: "100,00" },
                { id: 12, position: "Zusätzliche Beläge", einheit: "m²", preis: "4,50" },
                { id: 13, position: "Stunden ohne Material", einheit: "h", preis: "50,00" },
                { id: 14, position: "Stunden mit Material", einheit: "h", preis: "60,00" }
            ];
            localStorage.setItem('stammdaten-leistungsverzeichnis', JSON.stringify(leistungsverzeichnisData));
        }
        
        // Gerüst-Beispieldaten - use the correct storage key 'gerueste'
        if (!localStorage.getItem('gerueste')) {
            const geruestData = [
                { 
                    id: "1", 
                    anmelderId: "1",
                    anmelderName: "Max Mustermann",
                    location: "Hauptstraße 12, Hamburg", 
                    oertlichkeit: "Hauptstraße 12",
                    koordinate: "Hamburg",
                    status: "In Nutzung", 
                    anmeldeDatum: "2024-03-15",
                    aufbauDatum: "2024-03-16",
                    length: 5,
                    width: 3,
                    height: 2,
                    volume: 30,
                    equipment: "Gerüst A",
                    ebene: "EG"
                },
                { 
                    id: "2", 
                    anmelderId: "2",
                    anmelderName: "Jan Reiff",
                    location: "Bahnhofstraße 45, Hamburg", 
                    oertlichkeit: "Bahnhofstraße 45",
                    koordinate: "Hamburg",
                    status: "In Aufbau", 
                    anmeldeDatum: "2024-03-18",
                    aufbauDatum: "2024-03-19",
                    length: 4,
                    width: 2,
                    height: 3,
                    volume: 24,
                    equipment: "Gerüst B",
                    ebene: "1. OG"
                }
            ];
            localStorage.setItem('gerueste', JSON.stringify(geruestData));
        }
        
        // Migrate data from old key if it exists
        if (localStorage.getItem('geruest-uebersicht') && !localStorage.getItem('gerueste')) {
            const oldData = JSON.parse(localStorage.getItem('geruest-uebersicht') || '[]');
            localStorage.setItem('gerueste', JSON.stringify(oldData));
            // Optionally remove the old data
            // localStorage.removeItem('geruest-uebersicht');
        }
    }
    
    /**
     * Richtet alle Event-Listener ein
     */
    function setupEventListeners() {
        // Navigation
        document.addEventListener('click', handleNavigation);
        
        // Add-Button für neue Gerüste
        document.addEventListener('click', handleAddButton);
    }
    
    /**
     * Behandelt Klicks auf Navigations-Elemente
     */
    function handleNavigation(e) {
        const navItem = e.target.closest('a[data-page], button[data-page], a[data-table]');
        if (!navItem) return;
        
        e.preventDefault();
        
        // Seiten-Navigation
        if (navItem.dataset.page) {
            const pageName = navItem.dataset.page;
            
            // Aktive Klasse für Navigation setzen
            updateActiveNavItem(navItem);
            
            // Zur entsprechenden Seite navigieren
            navigateToPage(pageName);
        } 
        // Stammdaten-Tabellen-Navigation
        else if (navItem.dataset.table) {
            const tableName = navItem.dataset.table;
            
            // Aktive Klasse für Tabellen-Navigation setzen
            document.querySelectorAll('a[data-table]').forEach(a => a.classList.remove('active'));
            navItem.classList.add('active');
            
            // Entsprechende Tabelle anzeigen
            showStammdatenTable(tableName);
        }
    }
    
    /**
     * Aktualisiert den aktiven Navigations-Tab
     */
    function updateActiveNavItem(navItem) {
        // Nur für Links, nicht für Buttons wie Settings
        if (navItem.tagName === 'A') {
            document.querySelectorAll('a[data-page]').forEach(a => a.classList.remove('active'));
            navItem.classList.add('active');
        }
    }
    
    /**
     * Navigiert zu einer bestimmten Seite
     */
    function navigateToPage(pageName) {
        // Alle Seiten ausblenden
        clearMainContent();
        
        switch (pageName) {
            case 'stammdaten':
                showStammdatenOverview();
                break;
            case 'geruest-buch':
                showGeruestUebersicht();
                break;
            case 'geruest-anmeldung':
                showGeruestAnmeldung();
                break;
            case 'geruest-umbau':
            case 'geruest-erweiterung':
            case 'aufmass-kontrolle':
            case 'geruest-abmeldung':
                showEmptyPage(pageName);
                break;
            default:
                showEmptyPage(pageName);
                break;
        }
    }
    
    /**
     * Leert den Hauptinhalt
     */
    function clearMainContent() {
        if (mainContent) {
            mainContent.innerHTML = '';
        }
    }
    
    /**
     * Behandelt Klicks auf den Add-Button
     */
    function handleAddButton(e) {
        // Prüfen, ob es sich um einen Button mit der Klasse "md-button-contained" handelt,
        // der das Text "Neues Gerüst" enthält oder die alte Klasse "add-button" hat
        const isAddButton = e.target.classList.contains('add-button') || 
                           (e.target.closest('.md-button-contained') && 
                            e.target.closest('.md-button-contained').textContent.includes('Neues Gerüst'));
        
        if (!isAddButton) return;
        
        // Zur Gerüstanmeldung navigieren
        const geruestAnmeldungLink = document.querySelector('[data-page="geruest-anmeldung"]');
        if (geruestAnmeldungLink) {
            geruestAnmeldungLink.click();
        }
    }
    
    /**
     * Zeigt die initiale Seite an
     */
    function showInitialPage() {
        const activeTab = document.querySelector('.nav-tabs a.active');
        if (activeTab) {
            const pageId = activeTab.getAttribute('data-page');
            if (pageId) {
                navigateToPage(pageId);
            }
        } else {
            // Fallback: Gerüstanmeldung anzeigen, wenn kein aktiver Tab gefunden wurde
            showGeruestAnmeldung();
        }
    }
    
    /**
     * Zeigt die Stammdaten-Übersicht an
     */
    function showStammdatenOverview() {
        clearMainContent();
        
        const mainContent = document.getElementById('main-content');
        
        // Create page container
        const page = document.createElement('div');
        page.id = 'stammdaten-overview';
        page.className = 'page';
        
        // Create page header
        const pageHeader = document.createElement('div');
        pageHeader.className = 'page-header';
        
        const pageTitle = document.createElement('h2');
        pageTitle.textContent = 'Stammdaten';
        pageHeader.appendChild(pageTitle);
        
        page.appendChild(pageHeader);
        
        // Create status container
        const statusContainer = document.createElement('div');
        statusContainer.className = 'status-container';
        page.appendChild(statusContainer);
        
        // Create stammdaten container
        const stammdatenContainer = document.createElement('div');
        stammdatenContainer.className = 'stammdaten-container';
        
        // Create menu
        const menu = document.createElement('div');
        menu.className = 'stammdaten-menu';
        
        const menuList = document.createElement('ul');
        
        const menuItems = [
            { id: 'anmelder', text: 'Anmelder' },
            { id: 'leistungsverzeichnis', text: 'Leistungsverzeichnis' }
        ];
        
        menuItems.forEach(item => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = '#';
            link.setAttribute('data-table', item.id);
            link.textContent = item.text;
            
            // Set first item as active
            if (item.id === 'anmelder') {
                link.classList.add('active');
            }
            
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Update active state
                document.querySelectorAll('.stammdaten-menu a').forEach(a => {
                    a.classList.remove('active');
                });
                this.classList.add('active');
                
                // Show selected table
                showStammdatenTable(this.getAttribute('data-table'));
            });
            
            listItem.appendChild(link);
            menuList.appendChild(listItem);
        });
        
        menu.appendChild(menuList);
        stammdatenContainer.appendChild(menu);
        
        // Create content area
        const content = document.createElement('div');
        content.className = 'stammdaten-content';
        content.id = 'stammdaten-content';
        stammdatenContainer.appendChild(content);
        
        page.appendChild(stammdatenContainer);
        mainContent.appendChild(page);
        
        // Show anmelder table by default
        showStammdatenTable('anmelder');
    }
    
    /**
     * Zeigt eine bestimmte Stammdaten-Tabelle an
     */
    function showStammdatenTable(tableName) {
        const contentContainer = document.getElementById('stammdaten-content');
        
        // Clear content
        contentContainer.innerHTML = '';
        
        // Show selected table
        if (tableName === 'anmelder') {
            showAnmelderTable(contentContainer);
        } else if (tableName === 'leistungsverzeichnis') {
            showLeistungsverzeichnisTable(contentContainer);
        }
    }
    
    /**
     * Zeigt die Anmelder-Tabelle an
     */
    function showAnmelderTable(container) {
        const anmelder = JSON.parse(localStorage.getItem('stammdaten-anmelder') || '[]');
        const statusContainer = document.createElement('div');
        statusContainer.className = 'status-container';
        
        container.innerHTML = `
            <h3>Anmelder</h3>
            <div class="md-card-section md-card-header">
                <button class="md-button-contained md-button-with-icon" id="add-anmelder-button">
                    <span class="material-icons">add</span>
                    Neuer Anmelder
                </button>
            </div>
            <div class="overview-table">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Telefon</th>
                            <th>E-Mail</th>
                            <th>Aktionen</th>
                        </tr>
                    </thead>
                    <tbody id="anmelder-table-body">
                        ${anmelder.map(person => `
                            <tr data-id="${person.id}">
                                <td class="editable" data-field="name">${person.name}</td>
                                <td class="editable" data-field="telefon">${person.telefon}</td>
                                <td class="editable" data-field="email">${person.email}</td>
                                <td>
                                    <button class="icon-button save-anmelder" data-id="${person.id}" style="display: none;">
                                        <span class="material-icons">save</span>
                                    </button>
                                    <button class="icon-button delete-anmelder" data-id="${person.id}">
                                        <span class="material-icons">delete</span>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
        
        // Status-Container einfügen
        container.insertBefore(statusContainer, container.querySelector('.overview-table'));

        // Event-Listener für das Hinzufügen eines neuen Anmelders
        const addButton = container.querySelector('#add-anmelder-button');
        if (addButton) {
            addButton.addEventListener('click', () => {
                const tableBody = container.querySelector('#anmelder-table-body');
                if (tableBody) {
                    // Prüfen, ob bereits eine ungespeicherte Zeile existiert
                    const existingNewRow = tableBody.querySelector('tr[data-new="true"]');
                    if (existingNewRow) {
                        showInlineMessage(statusContainer, 'Bitte füllen Sie zuerst den aktuellen Eintrag aus.', 'error');
                        existingNewRow.querySelector('td').click(); // Fokus auf das erste Feld setzen
                        return;
                    }
                    
                    // Neue ID generieren
                    const newId = anmelder.length > 0 ? Math.max(...anmelder.map(item => item.id)) + 1 : 1;
                    
                    // Neue Zeile erstellen
                    const newRow = document.createElement('tr');
                    newRow.setAttribute('data-new', 'true');
                    
                    // Zellen erstellen mit Platzhaltern
                    newRow.innerHTML = `
                        <td class="editable" data-field="name"><span class="placeholder">Name eingeben...</span></td>
                        <td class="editable" data-field="telefon"><span class="placeholder">Telefon eingeben...</span></td>
                        <td class="editable" data-field="email"><span class="placeholder">E-Mail eingeben...</span></td>
                        <td>
                            <button class="icon-button save-anmelder" data-id="${newId}">
                                <span class="material-icons">save</span>
                            </button>
                            <button class="icon-button delete-anmelder" data-id="${newId}">
                                <span class="material-icons">delete</span>
                            </button>
                        </td>
                    `;
                    
                    // Zeile am Anfang der Tabelle einfügen
                    if (tableBody.firstChild) {
                        tableBody.insertBefore(newRow, tableBody.firstChild);
                    } else {
                        tableBody.appendChild(newRow);
                    }
                    
                    // Event-Listener für editierbare Zellen
                    setupEditableFields(newRow);
                    
                    // Event-Listener für Speichern-Button
                    newRow.querySelector('.save-anmelder').addEventListener('click', function() {
                        saveAnmelder(newRow, statusContainer);
                    });
                    
                    // Event-Listener für Löschen-Button
                    newRow.querySelector('.delete-anmelder').addEventListener('click', function() {
                        if (confirm('Möchten Sie diesen ungespeicherten Eintrag wirklich löschen?')) {
                            newRow.remove();
                        }
                    });
                    
                    // Automatisch auf das erste Feld klicken, um die Bearbeitung zu starten
                    setTimeout(() => {
                        const firstCell = newRow.querySelector('td.editable');
                        if (firstCell) firstCell.click();
                    }, 100);
                    
                    // Zum neuen Eintrag scrollen
                    newRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
        }
        
        // Event-Listener für das Löschen von Anmeldern
        container.querySelectorAll('.delete-anmelder').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                deleteAnmelder(id, container);
            });
        });
        
        // Event-Listener für das Speichern von Anmeldern
        container.querySelectorAll('.save-anmelder').forEach(button => {
            button.addEventListener('click', function() {
                const row = this.closest('tr');
                saveAnmelder(row, statusContainer);
            });
        });
        
        // Event-Listener für das Bearbeiten von Anmeldern
        setupEditableFields(container.querySelector('table'));
        
        // Funktion zum Einrichten der editierbaren Felder
        function setupEditableFields(element) {
            const editableCells = element.querySelectorAll('.editable');
            
            editableCells.forEach(cell => {
                cell.addEventListener('click', function() {
                    // Exit edit mode for any other row
                    const otherEditingCells = document.querySelectorAll('.editing');
                    otherEditingCells.forEach(otherCell => {
                        if (otherCell !== this) {
                            cancelEdit(otherCell, otherCell.closest('tr').getAttribute('data-new') === 'true');
                        }
                    });
                    
                    // If already editing, do nothing
                    if (this.classList.contains('editing')) {
                        return;
                    }
                    
                    // Store original content for cancel
                    this.setAttribute('data-original', this.innerHTML);
                    
                    // Get the field type
                    const fieldType = this.getAttribute('data-field');
                    
                    // Create input element based on field type
                    let inputElement;
                    
                    if (fieldType === 'einheit') {
                        // Create a select element for einheit
                        inputElement = document.createElement('select');
                        inputElement.className = 'einheit-select';
                        
                        // Add options
                        const units = ['Stück', 'm', 'm²', 'm³', 'h'];
                        units.forEach(unit => {
                            const option = document.createElement('option');
                            option.value = unit;
                            option.textContent = unit;
                            inputElement.appendChild(option);
                        });
                        
                        // Set current value if exists
                        const currentValue = this.textContent.trim();
                        if (units.includes(currentValue)) {
                            inputElement.value = currentValue;
                        }
                    } else if (fieldType === 'inZusatzEquipment') {
                        // Create a select element for inZusatzEquipment
                        inputElement = document.createElement('select');
                        inputElement.className = 'einheit-select';
                        
                        // Add options
                        const options = [
                            { value: 'true', text: 'Ja' },
                            { value: 'false', text: 'Nein' }
                        ];
                        
                        options.forEach(option => {
                            const optionElement = document.createElement('option');
                            optionElement.value = option.value;
                            optionElement.textContent = option.text;
                            inputElement.appendChild(optionElement);
                        });
                        
                        // Set current value if exists
                        const currentValue = this.textContent.trim();
                        if (currentValue === 'Ja') {
                            inputElement.value = 'true';
                        } else if (currentValue === 'Nein') {
                            inputElement.value = 'false';
                        } else {
                            // Default to "Ja" for new entries
                            inputElement.value = 'true';
                        }
                    } else {
                        // Create a text input for other fields
                        inputElement = document.createElement('input');
                        inputElement.type = 'text';
                        inputElement.className = 'edit-input';
                        
                        // Set current value if exists
                        if (fieldType === 'preis') {
                            // Remove the Euro symbol for editing
                            const priceText = this.textContent.trim();
                            inputElement.value = priceText.replace(' €', '');
                        } else if (!this.querySelector('.placeholder')) {
                            inputElement.value = this.textContent.trim();
                        }
                    }
                    
                    // Clear the cell and add the input
                    this.innerHTML = '';
                    this.appendChild(inputElement);
                    this.classList.add('editing');
                    
                    // Show save and discard buttons
                    const row = this.closest('tr');
                    const saveButton = row.querySelector('.save-anmelder');
                    const discardButton = row.querySelector('.discard-edit');
                    saveButton.style.display = 'inline-flex';
                    discardButton.style.display = 'inline-flex';
                    
                    // Focus the input
                    inputElement.focus();
                    
                    if (inputElement.tagName === 'INPUT') {
                        inputElement.select();
                    }
                    
                    // Add event listeners for the input
                    inputElement.addEventListener('keydown', function(e) {
                        if (e.key === 'Enter') {
                            // Save on Enter
                            const row = cell.closest('tr');
                            const statusContainer = row.closest('.stammdaten-content').querySelector('.status-container');
                            saveAnmelder(row, statusContainer);
                        } else if (e.key === 'Escape') {
                            // Cancel on Escape
                            cancelEdit(cell, row.getAttribute('data-new') === 'true');
                        }
                    });
                    
                    // Prevent losing focus from discarding changes
                    inputElement.addEventListener('blur', function(e) {
                        // Only if the click is not on a save or discard button
                        const relatedTarget = e.relatedTarget;
                        if (!relatedTarget || 
                            (!relatedTarget.classList.contains('save-anmelder') && 
                             !relatedTarget.classList.contains('discard-edit'))) {
                            // Don't cancel edit immediately to allow clicking save button
                            setTimeout(() => {
                                // Check if the element is still in the DOM
                                if (document.contains(cell) && cell.classList.contains('editing')) {
                                    // Don't cancel if we clicked on a save or discard button
                                    const activeElement = document.activeElement;
                                    if (!activeElement || 
                                        (!activeElement.classList.contains('save-anmelder') && 
                                         !activeElement.classList.contains('discard-edit'))) {
                                        // Don't cancel edit for new rows
                                        const row = cell.closest('tr');
                                        if (row && row.getAttribute('data-new') !== 'true') {
                                            // Save the changes instead of canceling
                                            const statusContainer = row.closest('.stammdaten-content').querySelector('.status-container');
                                            saveAnmelder(row, statusContainer);
                                        }
                                    }
                                }
                            }, 200);
                        }
                    });
                });
            });
        }
        
        function cancelEdit(cell, isNewRow) {
            if (!cell) return;
            
            const row = cell.closest('tr');
            
            // If it's a new row and we're canceling, just remove the row
            if (isNewRow && row.getAttribute('data-new') === 'true') {
                row.remove();
                return;
            }
            
            // Restore original content
            const originalContent = cell.getAttribute('data-original');
            if (originalContent) {
                cell.innerHTML = originalContent;
            }
            
            // Remove editing class
            cell.classList.remove('editing');
            
            // Hide save and discard buttons if no other cell is being edited
            if (!row.querySelector('.editing')) {
                const saveButton = row.querySelector('.save-anmelder');
                const discardButton = row.querySelector('.discard-edit');
                if (saveButton) saveButton.style.display = 'none';
                if (discardButton) discardButton.style.display = 'none';
            }
        }
        
        function saveAnmelder(row, statusContainer) {
            const id = row.getAttribute('data-id');
            const isNewRow = row.hasAttribute('data-new');
            
            // Werte aus den Zellen holen
            const nameCell = row.querySelector('[data-field="name"]');
            const telefonCell = row.querySelector('[data-field="telefon"]');
            const emailCell = row.querySelector('[data-field="email"]');
            
            // Prüfen, ob noch Felder im Bearbeitungsmodus sind
            const editingCells = row.querySelectorAll('.editing');
            editingCells.forEach(cell => {
                // Bearbeitungsmodus beenden und Wert übernehmen
                const field = cell.getAttribute('data-field');
                const input = cell.querySelector('input');
                const value = input ? input.value : '';
                
                // Wert setzen
                if (value.trim() === '') {
                    if (isNewRow) {
                        let placeholder = '';
                        switch(field) {
                            case 'name': placeholder = 'Name eingeben...'; break;
                            case 'telefon': placeholder = 'Telefon eingeben...'; break;
                            case 'email': placeholder = 'E-Mail eingeben...'; break;
                            default: placeholder = 'Wert eingeben...';
                        }
                        cell.innerHTML = `<span class="placeholder">${placeholder}</span>`;
                    } else {
                        cell.textContent = '';
                    }
                } else {
                    cell.textContent = value;
                }
                
                cell.classList.remove('editing');
            });
            
            // Werte aus den Zellen holen (nach Beendigung des Bearbeitungsmodus)
            const name = nameCell.textContent.trim();
            const telefon = telefonCell.textContent.trim();
            const email = emailCell.textContent.trim();
            
            // Validierung
            if (isNewRow && (name === '' || name.includes('eingeben...') || 
                             telefon === '' || telefon.includes('eingeben...') || 
                             email === '' || email.includes('eingeben...'))) {
                showInlineMessage(statusContainer, 'Bitte füllen Sie alle Felder aus.', 'error');
                return;
            }
            
            // Anmelder-Daten laden
            let anmelderList = JSON.parse(localStorage.getItem('stammdaten-anmelder') || '[]');
            
            if (isNewRow) {
                // Neuen Anmelder hinzufügen
                const newId = parseInt(id) || Date.now();
                anmelderList.unshift({
                    id: newId,
                    name: name,
                    telefon: telefon,
                    email: email
                });
                
                // Attribute aktualisieren
                row.setAttribute('data-id', newId);
                row.removeAttribute('data-new');
                
                showInlineMessage(statusContainer, 'Anmelder erfolgreich gespeichert', 'success');
            } else {
                // Bestehenden Anmelder aktualisieren
                const index = anmelderList.findIndex(a => a.id == id);
                if (index >= 0) {
                    anmelderList[index] = {
                        ...anmelderList[index],
                        name: name,
                        telefon: telefon,
                        email: email
                    };
                    
                    showInlineMessage(statusContainer, 'Anmelder erfolgreich aktualisiert', 'success');
                }
            }
            
            // Anmelder-Daten speichern
            localStorage.setItem('stammdaten-anmelder', JSON.stringify(anmelderList));
            
            // Speicherbutton ausblenden
            const saveButton = row.querySelector('.save-anmelder');
            if (saveButton) {
                saveButton.style.display = 'none';
            }
        }
    }
    
    /**
     * Zeigt die Leistungsverzeichnis-Tabelle an
     */
    function showLeistungsverzeichnisTable(container) {
        // Get leistungsverzeichnis data from local storage
        let leistungen = JSON.parse(localStorage.getItem('stammdaten-leistungsverzeichnis')) || [];
        
        // If no entries exist, create initial data
        if (leistungen.length === 0) {
            leistungen = [
                { id: "1", position: "Kleingerüst-Pauschal bis 15 cbm", einheit: "Stück", preis: "250,00", inZusatzEquipment: true },
                { id: "2", position: "Kleingerüst-Pauschal bis 15,01-25 cbm", einheit: "Stück", preis: "350,00", inZusatzEquipment: true },
                { id: "3", position: "Kleingerüst-Pauschal bis 25,01-40 cbm", einheit: "Stück", preis: "450,00", inZusatzEquipment: true },
                { id: "4", position: "Kleingerüst-Pauschal bis 40,01-60 cbm", einheit: "Stück", preis: "0,00", inZusatzEquipment: true },
                { id: "5", position: "Raumgerüst Gerüstgruppe 3 max. 2,0 kN", einheit: "m³", preis: "10,00", inZusatzEquipment: true },
                { id: "6", position: "Raumgerüst Gerüstgruppe 4 max. 3,0 kN", einheit: "m³", preis: "12,00", inZusatzEquipment: true },
                { id: "7", position: "Raumgerüst Gerüstgruppe 5 max. 4,5 kN", einheit: "m³", preis: "14,00", inZusatzEquipment: true },
                { id: "8", position: "Konsolen", einheit: "m", preis: "8,00", inZusatzEquipment: true },
                { id: "9", position: "Schutznetze", einheit: "m²", preis: "3,00", inZusatzEquipment: true },
                { id: "10", position: "Seitenschutz", einheit: "m", preis: "2,50", inZusatzEquipment: true },
                { id: "11", position: "Treppenturm", einheit: "m", preis: "100,00", inZusatzEquipment: true },
                { id: "12", position: "Zusätzliche Beläge", einheit: "m²", preis: "4,50", inZusatzEquipment: true },
                { id: "13", position: "Stunden ohne Material", einheit: "h", preis: "50,00", inZusatzEquipment: true },
                { id: "14", position: "Stunden mit Material", einheit: "h", preis: "60,00", inZusatzEquipment: true }
            ];
            localStorage.setItem('stammdaten-leistungsverzeichnis', JSON.stringify(leistungen));
        }
        
        // Create table header
        const tableHeader = document.createElement('div');
        tableHeader.className = 'md-card-header';
        
        const addButton = document.createElement('button');
        addButton.className = 'md-button-text md-button-with-icon';
        addButton.innerHTML = '<span class="material-icons">add</span> Neue Position';
        tableHeader.appendChild(addButton);
        
        container.appendChild(tableHeader);
        
        // Create status container
        const statusContainer = document.createElement('div');
        statusContainer.className = 'status-container';
        container.appendChild(statusContainer);
        
        // Create table container
        const tableContainer = document.createElement('div');
        tableContainer.className = 'overview-table';
        
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        // Define table headers - Remove "Beschreibung" column
        const headers = ['Position', 'Einheit', 'Preis (€)', 'In zusätzliches Equipment', 'Aktionen'];
        
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        // Create table body
        const tbody = document.createElement('tbody');
        
        // Add rows for each leistung
        leistungen.forEach(leistung => {
            const row = document.createElement('tr');
            row.setAttribute('data-id', leistung.id);
            
            // Position cell
            const positionCell = document.createElement('td');
            positionCell.className = 'editable';
            positionCell.textContent = leistung.position;
            positionCell.setAttribute('data-field', 'position');
            row.appendChild(positionCell);
            
            // Einheit cell
            const einheitCell = document.createElement('td');
            einheitCell.className = 'editable';
            einheitCell.textContent = leistung.einheit;
            einheitCell.setAttribute('data-field', 'einheit');
            row.appendChild(einheitCell);
            
            // Preis cell
            const preisCell = document.createElement('td');
            preisCell.className = 'editable';
            preisCell.textContent = `${leistung.preis} €`;
            preisCell.setAttribute('data-field', 'preis');
            row.appendChild(preisCell);
            
            // In zusätzliches Equipment cell
            const zusatzCell = document.createElement('td');
            zusatzCell.className = 'editable';
            zusatzCell.textContent = leistung.inZusatzEquipment ? 'Ja' : 'Nein';
            zusatzCell.setAttribute('data-field', 'inZusatzEquipment');
            row.appendChild(zusatzCell);
            
            // Actions cell
            const actionsCell = document.createElement('td');
            
            // Save button (initially hidden)
            const saveButton = document.createElement('button');
            saveButton.className = 'icon-button save-leistung';
            saveButton.style.display = 'none';
            saveButton.innerHTML = '<span class="material-icons">save</span>';
            actionsCell.appendChild(saveButton);
            
            // Discard button (initially hidden)
            const discardButton = document.createElement('button');
            discardButton.className = 'icon-button discard-edit';
            discardButton.style.display = 'none';
            discardButton.innerHTML = '<span class="material-icons">cancel</span>';
            actionsCell.appendChild(discardButton);
            
            // Delete button
            const deleteButton = document.createElement('button');
            deleteButton.className = 'icon-button delete-leistung';
            deleteButton.innerHTML = '<span class="material-icons">delete</span>';
            actionsCell.appendChild(deleteButton);
            
            row.appendChild(actionsCell);
            tbody.appendChild(row);
            
            // Add event listener for save button
            saveButton.addEventListener('click', function() {
                saveLeistung(row, statusContainer);
            });
            
            // Add event listener for discard button
            discardButton.addEventListener('click', function() {
                const editingCell = row.querySelector('.editing');
                if (editingCell) {
                    cancelEdit(editingCell, false);
                }
            });
            
            // Add event listener for delete button
            deleteButton.addEventListener('click', function() {
                // Check if row is in edit mode
                const editingCell = row.querySelector('.editing');
                if (editingCell) {
                    showInlineMessage(statusContainer, 'Bitte beenden Sie zuerst den Bearbeitungsmodus.', 'error');
                    return;
                }
                
                // Create delete confirmation
                const confirmationDiv = document.createElement('div');
                confirmationDiv.className = 'delete-confirmation';
                
                const confirmationMessage = document.createElement('div');
                confirmationMessage.className = 'delete-message';
                confirmationMessage.textContent = `Möchten Sie die Position "${leistung.position}" wirklich löschen?`;
                confirmationDiv.appendChild(confirmationMessage);
                
                const confirmationActions = document.createElement('div');
                confirmationActions.className = 'delete-actions';
                
                const cancelButton = document.createElement('button');
                cancelButton.className = 'md-button-text';
                cancelButton.textContent = 'Abbrechen';
                confirmationActions.appendChild(cancelButton);
                
                const confirmButton = document.createElement('button');
                confirmButton.className = 'md-button-contained';
                confirmButton.textContent = 'Löschen';
                confirmationActions.appendChild(confirmButton);
                
                confirmationDiv.appendChild(confirmationActions);
                
                // Insert confirmation before the row
                row.parentNode.insertBefore(confirmationDiv, row);
                
                // Add event listeners for confirmation buttons
                cancelButton.addEventListener('click', function() {
                    confirmationDiv.remove();
                });
                
                confirmButton.addEventListener('click', function() {
                    // Remove the leistung from local storage
                    const leistungen = JSON.parse(localStorage.getItem('stammdaten-leistungsverzeichnis')) || [];
                    const updatedLeistungen = leistungen.filter(l => l.id !== leistung.id);
                    localStorage.setItem('stammdaten-leistungsverzeichnis', JSON.stringify(updatedLeistungen));
                    
                    // Remove the row and confirmation div
                    confirmationDiv.remove();
                    row.remove();
                    
                    // Show success message
                    showInlineMessage(statusContainer, `Position "${leistung.position}" wurde gelöscht.`, 'success');
                });
            });
        });
        
        table.appendChild(tbody);
        tableContainer.appendChild(table);
        container.appendChild(tableContainer);
        
        // Add event listener for add button
        addButton.addEventListener('click', function() {
            // Check if there's already a new row
            const existingNewRow = tbody.querySelector('tr[data-new="true"]');
            if (existingNewRow) {
                showInlineMessage(statusContainer, 'Bitte füllen Sie zuerst die aktuelle neue Position aus.', 'error');
                // Scroll to the existing new row
                existingNewRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }
            
            // Create a new row
            const newRow = document.createElement('tr');
            newRow.setAttribute('data-new', 'true');
            
            // Position cell
            const positionCell = document.createElement('td');
            positionCell.className = 'editable';
            positionCell.setAttribute('data-field', 'position');
            positionCell.innerHTML = '<span class="placeholder">Position eingeben...</span>';
            newRow.appendChild(positionCell);
            
            // Einheit cell
            const einheitCell = document.createElement('td');
            einheitCell.className = 'editable';
            einheitCell.setAttribute('data-field', 'einheit');
            einheitCell.innerHTML = '<span class="placeholder">Einheit wählen...</span>';
            newRow.appendChild(einheitCell);
            
            // Preis cell
            const preisCell = document.createElement('td');
            preisCell.className = 'editable';
            preisCell.setAttribute('data-field', 'preis');
            preisCell.innerHTML = '<span class="placeholder">Preis eingeben...</span>';
            newRow.appendChild(preisCell);
            
            // In zusätzliches Equipment cell
            const zusatzCell = document.createElement('td');
            zusatzCell.className = 'editable';
            zusatzCell.setAttribute('data-field', 'inZusatzEquipment');
            zusatzCell.innerHTML = '<span class="placeholder">Ja/Nein...</span>';
            newRow.appendChild(zusatzCell);
            
            // Actions cell
            const actionsCell = document.createElement('td');
            
            // Save button
            const saveButton = document.createElement('button');
            saveButton.className = 'icon-button save-leistung';
            saveButton.innerHTML = '<span class="material-icons">save</span>';
            actionsCell.appendChild(saveButton);
            
            // Discard button
            const discardButton = document.createElement('button');
            discardButton.className = 'icon-button discard-edit';
            discardButton.innerHTML = '<span class="material-icons">cancel</span>';
            actionsCell.appendChild(discardButton);
            
            // Delete button
            const deleteButton = document.createElement('button');
            deleteButton.className = 'icon-button delete-leistung';
            deleteButton.innerHTML = '<span class="material-icons">delete</span>';
            actionsCell.appendChild(deleteButton);
            
            newRow.appendChild(actionsCell);
            
            // Insert the new row at the beginning of the table
            tbody.insertBefore(newRow, tbody.firstChild);
            
            // Scroll to the new row
            newRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Add event listener for save button
            saveButton.addEventListener('click', function() {
                saveLeistung(newRow, statusContainer);
            });
            
            // Add event listener for discard button
            discardButton.addEventListener('click', function() {
                const editingCell = newRow.querySelector('.editing');
                if (editingCell) {
                    cancelEdit(editingCell, true);
                } else {
                    newRow.remove();
                }
            });
            
            // Add event listener for delete button
            deleteButton.addEventListener('click', function() {
                newRow.remove();
            });
            
            // Setup editable fields for the new row
            setupEditableFields(newRow);
            
            // Automatically open the first cell for editing
            const firstCell = newRow.querySelector('.editable');
            if (firstCell) {
                // Exit edit mode for any other row
                const otherEditingCells = document.querySelectorAll('.editing');
                otherEditingCells.forEach(otherCell => {
                    cancelEdit(otherCell, otherCell.closest('tr').getAttribute('data-new') === 'true');
                });
                
                firstCell.click();
            }
        });
        
        // Setup editable fields for all rows
        const rows = tbody.querySelectorAll('tr');
        rows.forEach(row => {
            setupEditableFields(row);
        });
        
        function setupEditableFields(element) {
            const editableCells = element.querySelectorAll('.editable');
            
            editableCells.forEach(cell => {
                cell.addEventListener('click', function() {
                    // Exit edit mode for any other row
                    const otherEditingCells = document.querySelectorAll('.editing');
                    otherEditingCells.forEach(otherCell => {
                        if (otherCell !== this) {
                            cancelEdit(otherCell, otherCell.closest('tr').getAttribute('data-new') === 'true');
                        }
                    });
                    
                    // If already editing, do nothing
                    if (this.classList.contains('editing')) {
                        return;
                    }
                    
                    // Store original content for cancel
                    this.setAttribute('data-original', this.innerHTML);
                    
                    // Get the field type
                    const fieldType = this.getAttribute('data-field');
                    
                    // Create input element based on field type
                    let inputElement;
                    
                    if (fieldType === 'einheit') {
                        // Create a select element for einheit
                        inputElement = document.createElement('select');
                        inputElement.className = 'einheit-select';
                        
                        // Add options
                        const units = ['Stück', 'm', 'm²', 'm³', 'h'];
                        units.forEach(unit => {
                            const option = document.createElement('option');
                            option.value = unit;
                            option.textContent = unit;
                            inputElement.appendChild(option);
                        });
                        
                        // Set current value if exists
                        const currentValue = this.textContent.trim();
                        if (units.includes(currentValue)) {
                            inputElement.value = currentValue;
                        }
                    } else if (fieldType === 'inZusatzEquipment') {
                        // Create a select element for inZusatzEquipment
                        inputElement = document.createElement('select');
                        inputElement.className = 'einheit-select';
                        
                        // Add options
                        const options = [
                            { value: 'true', text: 'Ja' },
                            { value: 'false', text: 'Nein' }
                        ];
                        
                        options.forEach(option => {
                            const optionElement = document.createElement('option');
                            optionElement.value = option.value;
                            optionElement.textContent = option.text;
                            inputElement.appendChild(optionElement);
                        });
                        
                        // Set current value if exists
                        const currentValue = this.textContent.trim();
                        if (currentValue === 'Ja') {
                            inputElement.value = 'true';
                        } else if (currentValue === 'Nein') {
                            inputElement.value = 'false';
                        } else {
                            // Default to "Ja" for new entries
                            inputElement.value = 'true';
                        }
                    } else {
                        // Create a text input for other fields
                        inputElement = document.createElement('input');
                        inputElement.type = 'text';
                        inputElement.className = 'edit-input';
                        
                        // Set current value if exists
                        if (fieldType === 'preis') {
                            // Remove the Euro symbol for editing
                            const priceText = this.textContent.trim();
                            inputElement.value = priceText.replace(' €', '');
                        } else if (!this.querySelector('.placeholder')) {
                            inputElement.value = this.textContent.trim();
                        }
                    }
                    
                    // Clear the cell and add the input
                    this.innerHTML = '';
                    this.appendChild(inputElement);
                    this.classList.add('editing');
                    
                    // Show save and discard buttons
                    const row = this.closest('tr');
                    const saveButton = row.querySelector('.save-leistung');
                    const discardButton = row.querySelector('.discard-edit');
                    saveButton.style.display = 'inline-flex';
                    discardButton.style.display = 'inline-flex';
                    
                    // Focus the input
                    inputElement.focus();
                    
                    if (inputElement.tagName === 'INPUT') {
                        inputElement.select();
                    }
                    
                    // Add event listeners for the input
                    inputElement.addEventListener('keydown', function(e) {
                        if (e.key === 'Enter') {
                            // Save on Enter
                            const row = cell.closest('tr');
                            const statusContainer = row.closest('.stammdaten-content').querySelector('.status-container');
                            saveLeistung(row, statusContainer);
                        } else if (e.key === 'Escape') {
                            // Cancel on Escape
                            cancelEdit(cell, row.getAttribute('data-new') === 'true');
                        }
                    });
                    
                    // Prevent losing focus from discarding changes
                    inputElement.addEventListener('blur', function(e) {
                        // Only if the click is not on a save or discard button
                        const relatedTarget = e.relatedTarget;
                        if (!relatedTarget || 
                            (!relatedTarget.classList.contains('save-leistung') && 
                             !relatedTarget.classList.contains('discard-edit'))) {
                            // Don't cancel edit immediately to allow clicking save button
                            setTimeout(() => {
                                // Check if the element is still in the DOM
                                if (document.contains(cell) && cell.classList.contains('editing')) {
                                    // Don't cancel if we clicked on a save or discard button
                                    const activeElement = document.activeElement;
                                    if (!activeElement || 
                                        (!activeElement.classList.contains('save-leistung') && 
                                         !activeElement.classList.contains('discard-edit'))) {
                                        // Don't cancel edit for new rows
                                        const row = cell.closest('tr');
                                        if (row && row.getAttribute('data-new') !== 'true') {
                                            // Save the changes instead of canceling
                                            const statusContainer = row.closest('.stammdaten-content').querySelector('.status-container');
                                            saveLeistung(row, statusContainer);
                                        }
                                    }
                                }
                            }, 200);
                        }
                    });
                });
            });
        }
        
        function cancelEdit(cell, isNewRow) {
            if (!cell) return;
            
            const row = cell.closest('tr');
            
            // If it's a new row and we're canceling, just remove the row
            if (isNewRow && row.getAttribute('data-new') === 'true') {
                row.remove();
                return;
            }
            
            // Restore original content
            const originalContent = cell.getAttribute('data-original');
            if (originalContent) {
                cell.innerHTML = originalContent;
            }
            
            // Remove editing class
            cell.classList.remove('editing');
            
            // Hide save and discard buttons if no other cell is being edited
            if (!row.querySelector('.editing')) {
                const saveButton = row.querySelector('.save-leistung');
                const discardButton = row.querySelector('.discard-edit');
                if (saveButton) saveButton.style.display = 'none';
                if (discardButton) discardButton.style.display = 'none';
            }
        }
        
        function saveLeistung(row, statusContainer) {
            // Get all input values
            const positionInput = row.querySelector('[data-field="position"] input, [data-field="position"] select');
            const einheitInput = row.querySelector('[data-field="einheit"] input, [data-field="einheit"] select');
            const preisInput = row.querySelector('[data-field="preis"] input, [data-field="preis"] select');
            const zusatzInput = row.querySelector('[data-field="inZusatzEquipment"] input, [data-field="inZusatzEquipment"] select');
            
            // For existing rows, we need to check if any field is being edited
            const isNewRow = row.getAttribute('data-new') === 'true';
            const editingCells = row.querySelectorAll('.editing');
            
            // Get values from inputs if they exist, otherwise from cell text
            let position, einheit, preis, inZusatzEquipment;
            
            // Get position value
            if (positionInput) {
                position = positionInput.value.trim();
            } else {
                const positionCell = row.querySelector('[data-field="position"]');
                position = positionCell.textContent.trim();
            }
            
            // Get einheit value
            if (einheitInput) {
                einheit = einheitInput.value.trim();
            } else {
                const einheitCell = row.querySelector('[data-field="einheit"]');
                einheit = einheitCell.textContent.trim();
            }
            
            // Get preis value
            if (preisInput) {
                preis = preisInput.value.trim();
            } else {
                const preisCell = row.querySelector('[data-field="preis"]');
                preis = preisCell.textContent.trim().replace(' €', '');
            }
            
            // Get inZusatzEquipment value
            if (zusatzInput) {
                inZusatzEquipment = zusatzInput.value === 'true';
            } else {
                const zusatzCell = row.querySelector('[data-field="inZusatzEquipment"]');
                inZusatzEquipment = zusatzCell.textContent.trim() === 'Ja';
            }
            
            // Validate inputs
            if (!position || !einheit || !preis) {
                showInlineMessage(statusContainer, 'Bitte füllen Sie alle Felder aus.', 'error');
                return;
            }
            
            // Check if it's a new row or existing
            let leistungen = JSON.parse(localStorage.getItem('stammdaten-leistungsverzeichnis')) || [];
            
            if (isNewRow) {
                // Create new leistung
                const newLeistung = {
                    id: Date.now().toString(),
                    position,
                    einheit,
                    preis,
                    inZusatzEquipment
                };
                
                // Add to leistungen
                leistungen.unshift(newLeistung);
                
                // Update row
                row.setAttribute('data-id', newLeistung.id);
                row.removeAttribute('data-new');
                
                showInlineMessage(statusContainer, 'Neue Position wurde hinzugefügt.', 'success');
            } else {
                // Update existing leistung
                const leistungId = row.getAttribute('data-id');
                const leistungIndex = leistungen.findIndex(l => l.id === leistungId);
                
                if (leistungIndex !== -1) {
                    leistungen[leistungIndex] = {
                        ...leistungen[leistungIndex],
                        position,
                        einheit,
                        preis,
                        inZusatzEquipment
                    };
                    
                    showInlineMessage(statusContainer, 'Position wurde aktualisiert.', 'success');
                }
            }
            
            // Save to local storage
            localStorage.setItem('stammdaten-leistungsverzeichnis', JSON.stringify(leistungen));
            
            // Update cell contents
            const positionCell = row.querySelector('[data-field="position"]');
            const einheitCell = row.querySelector('[data-field="einheit"]');
            const preisCell = row.querySelector('[data-field="preis"]');
            const zusatzCell = row.querySelector('[data-field="inZusatzEquipment"]');
            
            positionCell.innerHTML = position;
            einheitCell.innerHTML = einheit;
            preisCell.innerHTML = `${preis} €`;
            zusatzCell.innerHTML = inZusatzEquipment ? 'Ja' : 'Nein';
            
            // Remove editing class
            row.querySelectorAll('.editing').forEach(cell => {
                cell.classList.remove('editing');
            });
            
            // Hide save and discard buttons
            const saveButton = row.querySelector('.save-leistung');
            const discardButton = row.querySelector('.discard-edit');
            saveButton.style.display = 'none';
            discardButton.style.display = 'none';
            
            // Log the updated data for debugging
            console.log('Saved leistung:', {
                id: isNewRow ? leistungen[0].id : leistungId,
                position,
                einheit,
                preis,
                inZusatzEquipment
            });
        }
    }
    
    /**
     * Zeigt die Gerüstübersicht an
     */
    function showGeruestUebersicht() {
        if (!mainContent) return;
        
        // Use the correct storage key 'gerueste' instead of 'geruest-uebersicht'
        const data = JSON.parse(localStorage.getItem('gerueste') || '[]');
        
        // Anmelder-Daten für die Anzeige laden
        const anmelderData = JSON.parse(localStorage.getItem('stammdaten-anmelder') || '[]');
        
        mainContent.innerHTML = `
            <div class="page-header">
                <h2>Gerüstbuch</h2>
                <div id="status-container" class="status-container"></div>
            </div>
            
            <div class="md-card">
                <div class="md-card-section md-card-header">
                    <button class="md-button-contained md-button-with-icon" id="add-geruest-button">
                        <span class="material-icons">add</span>
                        Neues Gerüst
                    </button>
                </div>
                
                <div class="md-card-section">
                    <div class="geruest-list">
                        ${data.length > 0 
                            ? data.map((item, index) => {
                                // Anmelder-Informationen finden
                                const anmelder = anmelderData.find(a => a.id == item.anmelderId) || { name: 'Unbekannt' };
                                
                                return `
                                    <div class="geruest-card" data-id="${item.id}">
                                        <div class="geruest-card-header">
                                            <div class="geruest-card-summary">
                                                <div class="geruest-status ${item.status?.toLowerCase().replace(/\s+/g, '-') || 'angemeldet'}">${item.status || 'Angemeldet'}</div>
                                                <div class="geruest-anmelder">${anmelder.name}</div>
                                                <div class="geruest-volume">${item.volume || '0'} m³</div>
                                            </div>
                                            <div class="geruest-card-actions">
                                                <button class="icon-button toggle-details" data-index="${index}">
                                                    <span class="material-icons">expand_more</span>
                                                </button>
                                                <button class="icon-button delete-geruest" data-id="${item.id}">
                                                    <span class="material-icons">delete</span>
                                                </button>
                                            </div>
                                        </div>
                                        <div class="geruest-card-details hidden">
                                            <div class="geruest-details-grid">
                                                <div class="geruest-detail-item">
                                                    <span class="detail-label">Standort:</span>
                                                    <span class="detail-value">${item.location || '-'}</span>
                                                </div>
                                                <div class="geruest-detail-item">
                                                    <span class="detail-label">Anmeldedatum:</span>
                                                    <span class="detail-value">${item.anmeldeDatum || item.date || '-'}</span>
                                                </div>
                                                <div class="geruest-detail-item">
                                                    <span class="detail-label">Aufbaudatum:</span>
                                                    <span class="detail-value">${item.aufbauDatum || '-'}</span>
                                                </div>
                                                <div class="geruest-detail-item">
                                                    <span class="detail-label">Equipment:</span>
                                                    <span class="detail-value">${item.equipment || '-'}</span>
                                                </div>
                                                <div class="geruest-detail-item">
                                                    <span class="detail-label">Ebene:</span>
                                                    <span class="detail-value">${item.ebene || '-'}</span>
                                                </div>
                                                <div class="geruest-detail-item">
                                                    <span class="detail-label">Örtlichkeit:</span>
                                                    <span class="detail-value">${item.oertlichkeit || '-'}</span>
                                                </div>
                                                <div class="geruest-detail-item">
                                                    <span class="detail-label">Koordinate:</span>
                                                    <span class="detail-value">${item.koordinate || '-'}</span>
                                                </div>
                                                <div class="geruest-detail-item">
                                                    <span class="detail-label">Kubatur:</span>
                                                    <span class="detail-value">L: ${item.length || '0'} m × B: ${item.width || '0'} m × H: ${item.height || '0'} m = ${item.volume || '0'} m³</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                `;
                            }).join('') 
                            : '<div class="md-empty-state">Keine Gerüste vorhanden</div>'}
                    </div>
                </div>
            </div>
        `;
        
        // Event-Listener für das Auf- und Zuklappen der Kacheln
        document.querySelectorAll('.toggle-details').forEach(button => {
            button.addEventListener('click', function() {
                const card = this.closest('.geruest-card');
                const details = card.querySelector('.geruest-card-details');
                const icon = this.querySelector('.material-icons');
                
                details.classList.toggle('hidden');
                
                if (details.classList.contains('hidden')) {
                    icon.textContent = 'expand_more';
                } else {
                    icon.textContent = 'expand_less';
                }
            });
        });
        
        // Event-Listener für das Löschen von Gerüsten
        document.querySelectorAll('.delete-geruest').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const card = this.closest('.geruest-card');
                
                // Löschbestätigung direkt in der Karte anzeigen
                if (!card.querySelector('.delete-confirmation')) {
                    const confirmationElement = document.createElement('div');
                    confirmationElement.className = 'delete-confirmation';
                    confirmationElement.innerHTML = `
                        <div class="delete-message">Möchten Sie dieses Gerüst wirklich löschen?</div>
                        <div class="delete-actions">
                            <button class="md-button-text delete-cancel">Abbrechen</button>
                            <button class="md-button-contained delete-confirm">Löschen</button>
                        </div>
                    `;
                    
                    // Einfügen nach dem Header
                    const header = card.querySelector('.geruest-card-header');
                    header.insertAdjacentElement('afterend', confirmationElement);
                    
                    // Event-Listener für Abbrechen
                    confirmationElement.querySelector('.delete-cancel').addEventListener('click', function() {
                        confirmationElement.remove();
                    });
                    
                    // Event-Listener für Bestätigen
                    confirmationElement.querySelector('.delete-confirm').addEventListener('click', function() {
                        deleteGeruest(id);
                    });
                }
            });
        });
    }
    
    /**
     * Löscht ein Gerüst aus der Übersicht
     */
    function deleteGeruest(id) {
        // Use the correct storage key 'gerueste' instead of 'geruest-uebersicht'
        let data = JSON.parse(localStorage.getItem('gerueste') || '[]');
        data = data.filter(item => item.id != id);
        localStorage.setItem('gerueste', JSON.stringify(data));
        
        // Erfolgsmeldung anzeigen
        const statusContainer = document.getElementById('status-container');
        if (statusContainer) {
            showInlineMessage(statusContainer.parentNode, 'Gerüst wurde erfolgreich gelöscht', 'success');
        } else {
            showStatusMessage('Gerüst wurde erfolgreich gelöscht', 'success');
        }
        
        // Gerüstübersicht aktualisieren
        showGeruestUebersicht();
    }
    
    /**
     * Zeigt die Gerüstanmeldung-Seite an
     */
    function showGeruestAnmeldung() {
        clearMainContent();
        
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <div id="geruest-anmeldung" class="page">
                <div class="page-header">
                    <h2>Gerüstanmeldung</h2>
                </div>
                
                <div class="md-card">
                    <!-- Foto-Bereich -->
                    <div class="md-card-section">
                        <button id="photo-button" class="md-button-text md-button-with-icon">
                            <span class="material-icons">photo_camera</span>
                            Foto aufnehmen
                        </button>
                        
                        <!-- Erfolgsmeldung (initial versteckt) -->
                        <div id="photo-success" class="photo-success initially-hidden">
                            <span class="material-icons">check_circle</span>
                            <span>Foto wurde erfolgreich aufgenommen</span>
                        </div>
                    </div>

                    <form id="geruest-form" class="md-form">
                        <!-- Anmelder -->
                        <div class="md-card-section">
                            <div class="md-form-field">
                                <label for="anmelder" class="md-label">Anmelder</label>
                                <select id="anmelder" class="md-select" required>
                                    <option value="">Anmelder auswählen</option>
                                </select>
                                <div id="anmelder-kontakt" class="md-contact-info"></div>
                            </div>
                        </div>

                        <!-- Standort-Informationen -->
                        <div class="md-card-section">
                            <h3 class="md-subheading">Standort-Informationen</h3>
                            
                            <div class="md-form-row">
                                <div class="md-form-field">
                                    <label for="equipment" class="md-label">Equipment</label>
                                    <input type="text" id="equipment" class="md-input" placeholder="Equipment eingeben" required>
                                </div>
                                <div class="md-form-field">
                                    <label for="ebene" class="md-label">Ebene</label>
                                    <input type="text" id="ebene" class="md-input" placeholder="Ebene eingeben">
                                </div>
                            </div>
                            
                            <div class="md-form-row">
                                <div class="md-form-field">
                                    <label for="oertlichkeit" class="md-label">Örtlichkeit</label>
                                    <input type="text" id="oertlichkeit" class="md-input" placeholder="Örtlichkeit eingeben" required>
                                </div>
                                <div class="md-form-field">
                                    <label for="koordinate" class="md-label">Koordinate</label>
                                    <input type="text" id="koordinate" class="md-input" placeholder="Koordinate eingeben">
                                </div>
                            </div>
                        </div>

                        <!-- Kubatur -->
                        <div class="md-card-section">
                            <h3 class="md-subheading">Kubatur des Gerüstes</h3>
                            
                            <div class="md-form-row md-form-row-3">
                                <div class="md-form-field">
                                    <label for="length" class="md-label">Länge (m)</label>
                                    <input type="number" id="length" class="md-input kubatur-input" value="0" min="0" step="0.1" required>
                                </div>
                                <div class="md-form-field">
                                    <label for="width" class="md-label">Breite (m)</label>
                                    <input type="number" id="width" class="md-input kubatur-input" value="0" min="0" step="0.1" required>
                                </div>
                                <div class="md-form-field">
                                    <label for="height" class="md-label">Höhe (m)</label>
                                    <input type="number" id="height" class="md-input kubatur-input" value="0" min="0" step="0.1" required>
                                </div>
                            </div>
                            
                            <div class="md-volume-display">
                                Berechnetes Volumen: <span id="volume">0</span> m³
                            </div>
                        </div>
                        
                        <!-- Datum -->
                        <div class="md-card-section">
                            <div class="md-form-row">
                                <div class="md-form-field">
                                    <label for="anmelde_datum" class="md-label">Anmeldedatum</label>
                                    <input type="date" id="anmelde_datum" class="md-input" required>
                                </div>
                                <div class="md-form-field">
                                    <label for="aufbau_datum" class="md-label">Aufbaudatum</label>
                                    <input type="date" id="aufbau_datum" class="md-input" required>
                                </div>
                            </div>
                        </div>

                        <!-- Zusätzliches Equipment -->
                        <div class="md-card-section">
                            <h3 class="md-subheading">Zusätzliches Equipment</h3>
                            <div id="additional-equipment" class="additional-equipment">
                                <!-- Wird dynamisch befüllt -->
                            </div>
                        </div>

                        <!-- Submit Button -->
                        <div class="md-card-actions">
                            <button type="submit" class="md-button-contained">
                                Gerüst anmelden
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        const page = document.getElementById('geruest-anmeldung');
        initializeGeruestAnmeldung(page);
    }
    
    /**
     * Zeigt eine leere Seite mit Platzhalter an
     */
    function showEmptyPage(pageName) {
        if (!mainContent) return;
        
        mainContent.innerHTML = `
            <div class="page-header">
                <h2>${pageName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h2>
            </div>
            
            <div class="md-card">
                <div class="md-card-section">
                    <p>Inhalt für ${pageName} wird noch entwickelt.</p>
                </div>
            </div>
        `;
    }
    
    /**
     * Initialisiert die Gerüstanmeldung-Seite
     */
    function initializeGeruestAnmeldung(page) {
        // Anmelder-Dropdown befüllen
        const anmelderSelect = page.querySelector('#anmelder');
        const anmelderData = JSON.parse(localStorage.getItem('anmelder')) || [];
        
        anmelderData.forEach(anmelder => {
            const option = document.createElement('option');
            option.value = anmelder.id;
            option.textContent = anmelder.name;
            anmelderSelect.appendChild(option);
        });
        
        // Anmelder-Kontaktinfo aktualisieren bei Änderung
        anmelderSelect.addEventListener('change', function() {
            updateAnmelderKontaktInfo(page, this.value);
        });
        
        // Volumenberechnung einrichten
        setupVolumeCalculation(page);
        
        // Foto-Button einrichten
        setupPhotoButton(page);
        
        // Aktuelles Datum vorausfüllen
        const today = new Date().toISOString().split('T')[0];
        page.querySelector('#anmelde_datum').value = today;
        
        // Zusätzliches Equipment laden
        loadAdditionalEquipment(page);
        
        // Submit-Button einrichten
        setupSubmitButton(page);
    }
    
    /**
     * Aktualisiert die Kontaktinformationen des ausgewählten Anmelders
     */
    function updateAnmelderKontaktInfo(page, anmelderId) {
        const contactInfo = page.querySelector('.md-contact-info');
        contactInfo.innerHTML = '';
        
        if (!anmelderId) return;
        
        // Get anmelder from local storage
        const anmelder = JSON.parse(localStorage.getItem('stammdaten-anmelder')) || [];
        const selectedAnmelder = anmelder.find(a => a.id == anmelderId);
        
        if (selectedAnmelder) {
            // Add phone info if available
            if (selectedAnmelder.telefon) {
                const phoneItem = document.createElement('div');
                phoneItem.className = 'md-contact-item';
                phoneItem.innerHTML = `<span class="material-icons">phone</span><span>${selectedAnmelder.telefon}</span>`;
                contactInfo.appendChild(phoneItem);
            }
            
            // Add email info if available
            if (selectedAnmelder.email) {
                const emailItem = document.createElement('div');
                emailItem.className = 'md-contact-item';
                emailItem.innerHTML = `<span class="material-icons">email</span><span>${selectedAnmelder.email}</span>`;
                contactInfo.appendChild(emailItem);
            }
            
            // Add contact person if available
            if (selectedAnmelder.kontaktperson) {
                const personItem = document.createElement('div');
                personItem.className = 'md-contact-item';
                personItem.innerHTML = `<span class="material-icons">person</span><span>${selectedAnmelder.kontaktperson}</span>`;
                contactInfo.appendChild(personItem);
            }
            
            // Make sure the contact info is visible
            contactInfo.style.display = 'flex';
        } else {
            contactInfo.style.display = 'none';
        }
    }
    
    /**
     * Richtet die Volumenberechnung ein
     */
    function setupVolumeCalculation(page) {
        const lengthInput = page.querySelector('#length');
        const widthInput = page.querySelector('#width');
        const heightInput = page.querySelector('#height');
        const volumeDisplay = page.querySelector('#volume');
        
        // Add event listeners to inputs
        [lengthInput, widthInput, heightInput].forEach(input => {
            input.addEventListener('input', calculateVolume);
        });
        
        function calculateVolume() {
            const length = parseFloat(lengthInput.value) || 0;
            const width = parseFloat(widthInput.value) || 0;
            const height = parseFloat(heightInput.value) || 0;
            
            const volume = length * width * height;
            volumeDisplay.textContent = volume.toFixed(2);
        }
    }
    
    /**
     * Richtet den Foto-Button ein
     */
    function setupPhotoButton(page) {
        const photoButton = page.querySelector('.md-button-with-icon');
        const form = page.querySelector('.md-form');
        const disabledMessage = page.querySelector('.form-disabled-message');
        const successMessage = page.querySelector('.photo-success');
        
        photoButton.addEventListener('click', function() {
            // Simulate photo capture
            setTimeout(() => {
                // Hide disabled message
                disabledMessage.style.display = 'none';
                
                // Show success message
                successMessage.classList.remove('initially-hidden');
                
                // Enable form
                form.classList.remove('form-disabled');
            }, 500);
        });
    }
    
    /**
     * Richtet den Submit-Button ein
     */
    function setupSubmitButton(page) {
        const form = page.querySelector('#geruest-form');
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Formularvalidierung
            if (!form.checkValidity()) {
                showStatusMessage('Bitte füllen Sie alle Pflichtfelder aus.', 'error');
                return;
            }
            
            // Daten sammeln
            const geruestData = {
                id: Date.now().toString(),
                foto: page.querySelector('#photo-success').classList.contains('initially-hidden') ? null : 'foto_' + Date.now() + '.jpg',
                anmelder_id: page.querySelector('#anmelder').value,
                anmelder_name: page.querySelector('#anmelder option:checked').textContent,
                equipment: page.querySelector('#equipment').value,
                ebene: page.querySelector('#ebene').value,
                oertlichkeit: page.querySelector('#oertlichkeit').value,
                koordinate: page.querySelector('#koordinate').value,
                length: parseFloat(page.querySelector('#length').value),
                width: parseFloat(page.querySelector('#width').value),
                height: parseFloat(page.querySelector('#height').value),
                volume: parseFloat(page.querySelector('#volume').textContent),
                anmelde_datum: page.querySelector('#anmelde_datum').value,
                aufbau_datum: page.querySelector('#aufbau_datum').value,
                status: 'Angemeldet',
                created_at: new Date().toISOString(),
                additional_equipment: JSON.parse(localStorage.getItem('selected_equipment')) || []
            };
            
            // Gerüst speichern
            saveGeruest(geruestData);
            
            // Formular zurücksetzen
            form.reset();
            page.querySelector('#photo-success').classList.add('initially-hidden');
            page.querySelector('#volume').textContent = '0';
            
            // Ausgewähltes Equipment zurücksetzen
            localStorage.removeItem('selected_equipment');
            const checkboxes = page.querySelectorAll('.equipment-checkbox');
            checkboxes.forEach(checkbox => checkbox.checked = false);
            
            // Erfolgsmeldung anzeigen
            showStatusMessage('Gerüst wurde erfolgreich angemeldet!');
            
            // Zur Gerüstübersicht navigieren
            setTimeout(() => {
                navigateToPage('geruest-buch');
            }, 1500);
        });
    }
    
    /**
     * Speichert ein neues Gerüst in der Übersicht
     */
    function saveGeruest(geruestData) {
        // Bestehende Gerüste laden
        const gerueste = JSON.parse(localStorage.getItem('gerueste')) || [];
        
        // Neues Gerüst hinzufügen
        gerueste.unshift(geruestData);
        
        // Zurück in localStorage speichern
        localStorage.setItem('gerueste', JSON.stringify(gerueste));
        
        console.log('Gerüst gespeichert:', geruestData);
    }
    
    /**
     * Lädt zusätzliche Ausrüstungen
     */
    function loadAdditionalEquipment(page) {
        const equipmentContainer = page.querySelector('#additional-equipment');
        const leistungsverzeichnis = JSON.parse(localStorage.getItem('leistungsverzeichnis')) || [];
        
        // Nur Einträge mit zusaetzliches_equipment = "Ja" anzeigen
        const additionalEquipment = leistungsverzeichnis.filter(item => item.zusaetzliches_equipment === "Ja");
        
        if (additionalEquipment.length === 0) {
            equipmentContainer.innerHTML = '<p>Keine zusätzlichen Ausrüstungen verfügbar.</p>';
            return;
        }
        
        // Gruppieren nach Kategorie
        const categories = {};
        additionalEquipment.forEach(item => {
            if (!categories[item.kategorie]) {
                categories[item.kategorie] = [];
            }
            categories[item.kategorie].push(item);
        });
        
        // HTML für jede Kategorie erstellen
        let html = '';
        for (const [category, items] of Object.entries(categories)) {
            html += `
                <div class="equipment-category">
                    <h4 class="font-medium text-gray-700 mb-2">${category}</h4>
                    <div class="equipment-grid">
            `;
            
            items.forEach(item => {
                html += `
                    <label class="equipment-item">
                        <input type="checkbox" class="equipment-checkbox" data-id="${item.id}" data-position="${item.position}">
                        <span>${item.position}</span>
                    </label>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        }
        
        equipmentContainer.innerHTML = html;
        
        // Event-Listener für Checkboxen hinzufügen
        const checkboxes = equipmentContainer.querySelectorAll('.equipment-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                // Speichere den aktuellen Zustand der Checkboxen im localStorage
                saveEquipmentSelection(page);
            });
        });
        
        // Lade gespeicherte Auswahl, falls vorhanden
        loadSavedEquipmentSelection(page);
    }
    
    /**
     * Speichert die Auswahl der zusätzlichen Ausrüstungen
     */
    function saveEquipmentSelection(page) {
        const checkboxes = page.querySelectorAll('.equipment-checkbox');
        const selectedEquipment = [];
        
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                selectedEquipment.push({
                    id: checkbox.dataset.id,
                    position: checkbox.dataset.position
                });
            }
        });
        
        // Speichere die Auswahl im localStorage
        localStorage.setItem('selected_equipment', JSON.stringify(selectedEquipment));
        console.log('Equipment selection saved:', selectedEquipment);
    }
    
    /**
     * Lädt gespeicherte Auswahl der zusätzlichen Ausrüstungen
     */
    function loadSavedEquipmentSelection(page) {
        const savedSelection = JSON.parse(localStorage.getItem('selected_equipment')) || [];
        const checkboxes = page.querySelectorAll('.equipment-checkbox');
        
        checkboxes.forEach(checkbox => {
            const isSelected = savedSelection.some(item => item.id === checkbox.dataset.id);
            checkbox.checked = isSelected;
        });
    }
});

/**
 * Zeigt eine Status-Nachricht an
 */
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

/**
 * Zeigt eine Inline-Nachricht innerhalb einer Seite an
 */
function showInlineMessage(container, message, type = 'success') {
    // Bestehende Nachrichten entfernen
    const existingMessages = container.querySelectorAll('.md-alert');
    existingMessages.forEach(msg => msg.remove());
    
    // Neue Nachricht erstellen
    const alertElement = document.createElement('div');
    alertElement.className = `md-alert md-alert-${type}`;
    alertElement.innerHTML = `
        <span class="material-icons">${type === 'success' ? 'check_circle' : 'error'}</span>
        <span>${message}</span>
    `;
    
    // Nachricht einfügen
    const statusContainer = container.querySelector('.status-container') || container;
    statusContainer.appendChild(alertElement);
    
    // Auto-hide nach 5 Sekunden
    setTimeout(() => alertElement.remove(), 5000);
}

// Warnung beim Verlassen der Seite, wenn ungespeicherte Änderungen vorhanden sind
function setupPageLeaveWarning() {
    window.addEventListener('beforeunload', function(e) {
        const hasUnsavedChanges = document.querySelector('tr[data-new="true"]');
        
        if (hasUnsavedChanges) {
            // Standard-Meldung für verschiedene Browser
            const message = 'Es gibt ungespeicherte Änderungen. Möchten Sie die Seite wirklich verlassen?';
            e.returnValue = message;
            return message;
        }
    });
    
    // Warnung beim Wechsel zwischen Tabs
    document.querySelectorAll('nav a, [data-page]').forEach(link => {
        link.addEventListener('click', function(e) {
            const hasUnsavedChanges = document.querySelector('tr[data-new="true"]');
            
            if (hasUnsavedChanges) {
                if (!confirm('Es gibt ungespeicherte Änderungen. Möchten Sie die Seite wirklich verlassen?')) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }
            }
        });
    });
}

// Initialisierung der Warnungen beim Seitenladen
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    setupPageLeaveWarning();
}); 