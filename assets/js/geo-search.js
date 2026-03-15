// Fixed Location Search Functionality
function setupLocationSearch() {
    const useLocationBtn = document.getElementById('use-location');
    const locationBtn = document.getElementById('location-btn');
    
    // Setup "Use My Location" button
    if (useLocationBtn) {
        useLocationBtn.addEventListener('click', function() {
            findUserLocation();
        });
    }
    
    // Setup TV location button
    if (locationBtn) {
        locationBtn.addEventListener('click', function() {
            findUserLocation();
        });
    }
    
    function findUserLocation() {
        if (!navigator.geolocation) {
            showLocationAlert('Geolocation is not supported by your browser.', 'error');
            return;
        }
        
        // Show loading state
        showLocationAlert('Getting your location...', 'info');
        
        const options = {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 300000
        };
        
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                
                console.log('Location found:', lat, lng);
                
                // Update map with user location
                updateMapWithLocation(lat, lng);
                
                // Update search input
                const searchInput = document.getElementById('stores-search');
                if (searchInput) {
                    searchInput.value = 'Medical stores near my location';
                }
                
                // Show success message
                showLocationAlert('Location found! Showing nearby medical stores', 'success');
                
                // Update TV channel display
                updateTVChannel('YOUR LOCATION');
            },
            function(error) {
                console.error('Location error:', error);
                let errorMsg = 'Unable to get your location. ';
                
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMsg += 'Please enable location services in your browser settings.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMsg += 'Location information is unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMsg += 'Location request timed out. Please try again.';
                        break;
                    default:
                        errorMsg += 'An unknown error occurred.';
                        break;
                }
                
                showLocationAlert(errorMsg, 'error');
            },
            options
        );
    }
    
    function updateMapWithLocation(lat, lng) {
        const mapIframe = document.getElementById('google-map-iframe');
        if (!mapIframe) return;
        
        // Create location-based map URL
        const locationUrl = `https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d3000!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m1!1m0!5e0!3m2!1sen!2s!4v${Date.now()}!5m2!1sen!2s&q=medical+stores+pharmacies+near+me&maptype=roadmap&zoom=15`;
        
        mapIframe.src = locationUrl;
        
        console.log('Map updated with location:', lat, lng);
    }
    
    function showLocationAlert(message, type) {
        // Create alert element
        const alert = document.createElement('div');
        alert.className = `location-alert location-alert-${type}`;
        alert.innerHTML = `
            <div class="location-alert-content">
                <i class="fas fa-${getLocationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Style the alert
        alert.style.cssText = `
            position: fixed;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: ${getLocationColor(type)};
            color: white;
            padding: 15px 25px;
            border-radius: 25px;
            z-index: 10000;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            backdrop-filter: blur(10px);
            font-weight: 600;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
            animation: slideInDown 0.3s ease;
            max-width: 90%;
            text-align: center;
            font-size: 14px;
        `;
        
        document.body.appendChild(alert);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            alert.style.animation = 'slideOutUp 0.3s ease';
            setTimeout(() => {
                if (alert.parentNode) {
                    alert.parentNode.removeChild(alert);
                }
            }, 300);
        }, 4000);
    }
    
    function updateTVChannel(text) {
        const channel = document.querySelector('.tv-channel');
        if (channel) {
            const originalText = channel.textContent;
            channel.textContent = text;
            channel.style.color = '#00ff00';
            
            setTimeout(() => {
                channel.textContent = originalText;
            }, 3000);
        }
    }
    
    function getLocationIcon(type) {
        switch(type) {
            case 'success': return 'check-circle';
            case 'error': return 'exclamation-triangle';
            case 'warning': return 'exclamation-circle';
            default: return 'location-arrow';
        }
    }
    
    function getLocationColor(type) {
        switch(type) {
            case 'success': return 'linear-gradient(135deg, #4caf50, #45a049)';
            case 'error': return 'linear-gradient(135deg, #f44336, #d32f2f)';
            case 'warning': return 'linear-gradient(135deg, #ff9800, #f57c00)';
            default: return 'linear-gradient(135deg, #2196f3, #1976d2)';
        }
    }
}

// Initialize location search when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupLocationSearch();
});