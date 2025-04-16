// Map initialization and map-related functions
let markers = [];
let selectedLocation = null;

// Initialize the map
const map = L.map('map').setView([-25.65083, 26.69277], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Handle map clicks
map.on('click', function(e) {
    if (selectedLocation) {
        map.removeLayer(selectedLocation);
    }
    selectedLocation = L.marker(e.latlng).addTo(map)
        .bindPopup('Selected location for new ticket').openPopup();
    document.getElementById('location').value = `${e.latlng.lat.toFixed(5)}, ${e.latlng.lng.toFixed(5)}`;
});

// Legend
const legend = L.control({ position: 'bottomright' });
legend.onAdd = function(map) {
    const div = L.DomUtil.create('div', 'legend');
    div.innerHTML = '<strong>Legend</strong><br>';
    
    for (const category in categories) {
        div.innerHTML += `
            <div class="category-color">
                <div class="color-box" style="background-color: ${categories[category].color}"></div>
                ${categories[category].name} (${categories[category].letter})
            </div>
        `;
    }
    
    return div;
};
legend.addTo(map);
