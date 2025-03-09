// Warten bis das DOM vollständig geladen ist
document.addEventListener('DOMContentLoaded', function() {
    // Alle Seiten initial ausblenden
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.add('hidden'));

    // Navigation-Handler
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            
            // Alle Seiten ausblenden
            pages.forEach(page => page.classList.add('hidden'));
            
            // Gewählte Seite einblenden
            const selectedPage = document.getElementById(pageId);
            if (selectedPage) {
                selectedPage.classList.remove('hidden');
            }
        });
    });

    // Initial die Gerüstanmeldung anzeigen
    document.getElementById('geruest-anmeldung').classList.remove('hidden');

    // Event Listener für die Navigation
    document.querySelector('[data-page="geruest-anmeldung"]').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('main-content').innerHTML = `
            <div class="max-w-4xl mx-auto">
                <h2 class="text-2xl font-semibold mb-6">Gerüstanmeldung</h2>
                
                <!-- Erfolgsbenachrichtigung -->
                <div class="mb-6 bg-green-50 border border-green-200 text-green-700 p-4 rounded-md">
                    Foto wurde erfolgreich aufgenommen. Sie können nun mit der Anmeldung fortfahren.
                </div>

                <div class="bg-white rounded-lg shadow-sm border p-8 space-y-6">
                    <!-- Anmelder -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Anmelder</label>
                        <select class="w-full border rounded-md p-3 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option value="">Anmelder auswählen</option>
                        </select>
                    </div>

                    <!-- Bereich und Anlage -->
                    <div class="grid grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Bereich</label>
                            <select class="w-full border rounded-md p-3 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="">Bereich auswählen</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Anlage</label>
                            <input type="text" placeholder="Anlage eingeben" 
                                class="w-full border rounded-md p-3 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        </div>
                    </div>

                    <!-- Equipment und Ebene -->
                    <div class="grid grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Equipment</label>
                            <input type="text" placeholder="Equipment eingeben"
                                class="w-full border rounded-md p-3 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Ebene</label>
                            <input type="text" placeholder="Ebene eingeben"
                                class="w-full border rounded-md p-3 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        </div>
                    </div>

                    <!-- Örtlichkeit und Koordinate -->
                    <div class="grid grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Örtlichkeit</label>
                            <input type="text" placeholder="Örtlichkeit eingeben"
                                class="w-full border rounded-md p-3 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Koordinate</label>
                            <input type="text" placeholder="Koordinate eingeben"
                                class="w-full border rounded-md p-3 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        </div>
                    </div>

                    <!-- Notizen -->
                    <div class="grid grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Notiz 1</label>
                            <textarea placeholder="Erste Notiz eingeben"
                                class="w-full border rounded-md p-3 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Notiz 2</label>
                            <textarea placeholder="Zweite Notiz eingeben"
                                class="w-full border rounded-md p-3 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
                        </div>
                    </div>

                    <!-- Kubatur des Gerüstes -->
                    <div>
                        <h3 class="text-lg font-medium text-gray-900 mb-4">Kubatur des Gerüstes</h3>
                        <div class="grid grid-cols-3 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Länge (m)</label>
                                <input type="number" value="0"
                                    class="w-full border rounded-md p-3 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Breite (m)</label>
                                <input type="number" value="0"
                                    class="w-full border rounded-md p-3 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Höhe (m)</label>
                                <input type="number" value="0"
                                    class="w-full border rounded-md p-3 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>
                        </div>
                        <div class="mt-2 text-sm text-gray-600">
                            Berechnetes Volumen: 0 m³
                        </div>
                    </div>

                    <!-- Datum -->
                    <div class="grid grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Anmeldedatum</label>
                            <input type="date" class="w-full border rounded-md p-3 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Aufbaudatum</label>
                            <input type="date" class="w-full border rounded-md p-3 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        </div>
                    </div>

                    <!-- Zusätzliches Equipment -->
                    <div>
                        <h3 class="text-lg font-medium text-gray-900 mb-4">Zusätzliches Equipment</h3>
                        
                        <!-- Kleingerüste -->
                        <div class="mb-4">
                            <h4 class="font-medium text-gray-700 mb-2">Kleingerüste</h4>
                            <div class="space-y-2">
                                <label class="flex items-center">
                                    <input type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                                    <span class="ml-2">Kleingerüst-Pauschal bis 15 cbm</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                                    <span class="ml-2">Kleingerüst-Pauschal bis 25,01-40 cbm</span>
                                </label>
                            </div>
                        </div>

                        <!-- Raumgerüste -->
                        <div class="mb-4">
                            <h4 class="font-medium text-gray-700 mb-2">Raumgerüste</h4>
                            <div class="space-y-2">
                                <label class="flex items-center">
                                    <input type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                                    <span class="ml-2">Raumgerüst Gerüstgruppe 3 max. 2.0 kN</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                                    <span class="ml-2">Raumgerüst Gerüstgruppe 4 max. 3.0 kN</span>
                                </label>
                            </div>
                        </div>

                        <!-- Zusatzausstattung -->
                        <div>
                            <h4 class="font-medium text-gray-700 mb-2">Zusatzausstattung</h4>
                            <div class="grid grid-cols-2 gap-4">
                                <label class="flex items-center">
                                    <input type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                                    <span class="ml-2">Konsolen</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                                    <span class="ml-2">Schutznetze</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                                    <span class="ml-2">Seitenschutz</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                                    <span class="ml-2">Treppenturm</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <!-- Submit Button -->
                    <div class="mt-8">
                        <button class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md transition-colors">
                            Gerüst anmelden
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
}); 