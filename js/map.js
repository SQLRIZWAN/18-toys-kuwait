// Map JavaScript for Checkout Page
let map;
let marker;
let selectedCoordinates = null;

document.addEventListener('DOMContentLoaded', function() {
    initMap();
});

function initMap() {
    const mapContainer = document.getElementById('location-map');
    if (!mapContainer) return;

    // Kuwait City coordinates
    const kuwaitCity = [29.3759, 47.9774];

    // Initialize map
    map = L.map('location-map').setView(kuwaitCity, 12);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Click on map to set location
    map.on('click', function(e) {
        setLocation(e.latlng.lat, e.latlng.lng);
    });

    // Try to get user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                setLocation(position.coords.latitude, position.coords.longitude);
                map.setView([position.coords.latitude, position.coords.longitude], 14);
            },
            function(error) {
                console.log('Geolocation error:', error.message);
            }
        );
    }
}

function setLocation(lat, lng) {
    selectedCoordinates = { lat: lat, lng: lng };

    // Update or create marker
    if (marker) {
        marker.setLatLng([lat, lng]);
    } else {
        marker = L.marker([lat, lng]).addTo(map);
    }

    // Update display
    const locationDisplay = document.getElementById('selected-location');
    const coordsDisplay = document.getElementById('location-coords');

    if (locationDisplay && coordsDisplay) {
        locationDisplay.style.display = 'flex';
        coordsDisplay.textContent = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
}

function useMyLocation() {
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
        return;
    }

    const btn = document.getElementById('use-my-location');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Locating...';
    btn.disabled = true;

    navigator.geolocation.getCurrentPosition(
        function(position) {
            setLocation(position.coords.latitude, position.coords.longitude);
            map.setView([position.coords.latitude, position.coords.longitude], 14);
            btn.innerHTML = '<i class="fas fa-crosshairs"></i> Use My Location';
            btn.disabled = false;
        },
        function(error) {
            let message = 'Unable to get your location';
            if (error.code === 1) {
                message = 'Location access denied. Please enable location permissions.';
            }
            alert(message);
            btn.innerHTML = '<i class="fas fa-crosshairs"></i> Use My Location';
            btn.disabled = false;
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}
