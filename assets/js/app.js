// PHARMADICES - Main JavaScript File
// Handles common functionality across all pages

document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile navigation menu
    initMobileNav();
    
    // Initialize any page-specific functionality
    initPageFeatures();
    
    // Add smooth scrolling for anchor links
    initSmoothScrolling();
    
    // Initialize footer year
    updateFooterYear();
});

// Mobile Navigation Toggle
function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    // Create overlay for closing menu by tapping outside
    let overlay = document.querySelector('.nav-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        document.body.appendChild(overlay);
    }

    function openMenu() {
        navMenu.classList.add('active');
        hamburger.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            if (navMenu.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Close when tapping overlay
        overlay.addEventListener('click', closeMenu);

        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close mobile menu on window resize if screen becomes large
        window.addEventListener('resize', function() {
            if (window.innerWidth > 992) {
                closeMenu();
            }
        });
    }
}

// Page-specific initialization
function initPageFeatures() {
    const currentPage = window.location.pathname.split('/').pop();
    
    switch(currentPage) {
        case 'index.html':
        case '':
            initHomePage();
            break;
        case 'drug-database.html':
            // Search functionality is handled in filter-engine.js
            break;
        case 'drug-info.html':
            initMedicineDetailPage();
            break;
        case 'pharmacy-locator.html':
            // Map functionality is handled in geo-map.js
            break;
    }
}

// Home Page specific features
function initHomePage() {
    // Home page search box functionality
    const homeSearchInput = document.getElementById('home-search');
    const enhancedSearchInput = document.querySelector('.enhanced-search-input');
    const homeSearchButton = document.querySelector('.search-box button');
    const enhancedSearchButton = document.querySelector('.enhanced-search-button');
    
    // Initialize autocomplete for both search inputs
    const searchInputs = [homeSearchInput, enhancedSearchInput].filter(input => input);
    
    searchInputs.forEach(input => {
        if (input && window.PHARMADICES && window.PHARMADICES.autocomplete) {
            window.PHARMADICES.autocomplete.init(input, {
                onSelect: function(value, entry) {
                    // When user selects from autocomplete, redirect to medicines page
                    window.location.href = `drug-database.html?search=${encodeURIComponent(value)}`;
                },
                autoSubmit: false
            });
        }
        
        // Add search functionality
        if (input) {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    const query = this.value.trim();
                    if (query) {
                        window.location.href = `drug-database.html?search=${encodeURIComponent(query)}`;
                    } else {
                        window.location.href = 'drug-database.html';
                    }
                }
            });
        }
    });
    
    // Search button functionality
    [homeSearchButton, enhancedSearchButton].forEach(button => {
        if (button) {
            button.addEventListener('click', function() {
                const input = button.closest('.search-box, .enhanced-search-box')?.querySelector('input');
                const query = input?.value.trim();
                if (query) {
                    window.location.href = `drug-database.html?search=${encodeURIComponent(query)}`;
                } else {
                    window.location.href = 'drug-database.html';
                }
            });
        }
    });
    
    // Add placeholder cycling for better UX
    const placeholders = [
        'Search for medicines by name, brand, or generic...',
        'Try "Paracetamol", "Panadol", or "Augmentin"...',
        'Search for drug interactions or side effects...',
        'Find medicine dosage and precautions...'
    ];
    
    let placeholderIndex = 0;
    searchInputs.forEach(input => {
        if (input) {
            setInterval(() => {
                input.placeholder = placeholders[placeholderIndex];
                placeholderIndex = (placeholderIndex + 1) % placeholders.length;
            }, 3000);
        }
    });
    
    // Initialize suggestion tags
    initSuggestionTags();
}

// Medicine Detail Page specific features
function initMedicineDetailPage() {
    // Get medicine ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const medicineId = urlParams.get('id');
    
    if (medicineId) {
        // Fetch medicine data (this will be enhanced when medicines.json is loaded)
        console.log(`Loading details for medicine ID: ${medicineId}`);
        
        // Add print functionality
        const printBtn = document.getElementById('print-btn');
        if (printBtn) {
            printBtn.addEventListener('click', function() {
                window.print();
            });
        }
        
        // Add share functionality
        const shareBtn = document.getElementById('share-btn');
        if (shareBtn && navigator.share) {
            shareBtn.style.display = 'block';
            shareBtn.addEventListener('click', async function() {
                try {
                    await navigator.share({
                        title: document.title,
                        text: 'Check out this medicine information on Pharmadices',
                        url: window.location.href,
                    });
                } catch (err) {
                    console.log('Error sharing:', err);
                }
            });
        }
    }
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update URL without scrolling
                history.pushState(null, null, href);
            }
        });
    });
}

// Update footer year automatically
function updateFooterYear() {
    const yearElements = document.querySelectorAll('.current-year');
    const currentYear = new Date().getFullYear();
    
    yearElements.forEach(element => {
        element.textContent = currentYear;
    });
    
    // Also update any copyright text
    const footerBottom = document.querySelector('.footer-bottom p');
    if (footerBottom) {
        footerBottom.innerHTML = footerBottom.innerHTML.replace(/2023|© \d{4}/g, `© ${currentYear}`);
    }
}

// Utility function to format text (capitalize, etc.)
function formatText(text) {
    if (!text) return '';
    
    // Capitalize first letter of each word for titles
    return text.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
}

// Utility function to truncate text
function truncateText(text, maxLength = 100) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Utility function to show notification/toast
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Add styles if not already present
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                display: flex;
                align-items: center;
                justify-content: space-between;
                min-width: 300px;
                max-width: 400px;
                z-index: 9999;
                animation: slideIn 0.3s ease;
                border-left: 4px solid #1a73e8;
            }
            .notification-success { border-left-color: #34a853; }
            .notification-error { border-left-color: #ea4335; }
            .notification-info { border-left-color: #1a73e8; }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .notification-close {
                background: none;
                border: none;
                cursor: pointer;
                color: #5f6368;
                font-size: 1rem;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Add close functionality
    notification.querySelector('.notification-close').addEventListener('click', function() {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Utility function to load JSON data
async function loadJSON(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading JSON:', error);
        showNotification('Failed to load data. Please try again.', 'error');
        return null;
    }
}

// Add animation on scroll
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements with animation class
    document.querySelectorAll('.feature-card, .link-card, .developer-card').forEach(el => {
        observer.observe(el);
    });
}

// Initialize when DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollAnimations);
} else {
    initScrollAnimations();
}

// Export utility functions for use in other files
window.PHARMADICES = window.PHARMADICES || {};
window.PHARMADICES.utils = {
    formatText,
    truncateText,
    showNotification,
    loadJSON
};

// Initialize suggestion tags functionality
function initSuggestionTags() {
    const suggestionTags = document.querySelectorAll('.enhanced-suggestion-tag');
    
    suggestionTags.forEach(tag => {
        tag.addEventListener('click', function(e) {
            e.preventDefault();
            const searchTerm = this.textContent.trim();
            const searchInput = document.querySelector('.enhanced-search-input') || document.getElementById('home-search');
            
            if (searchInput) {
                searchInput.value = searchTerm;
                // Trigger search
                window.location.href = `drug-database.html?search=${encodeURIComponent(searchTerm)}`;
            }
        });
    });
}

// Initialize all search inputs with autocomplete
function initAllSearchInputs() {
    // Find all search inputs on the page
    const searchInputs = document.querySelectorAll(
        'input[type="text"][placeholder*="search"], ' +
        'input[type="search"], ' +
        '.search-input, ' +
        '#home-search, ' +
        '.enhanced-search-input, ' +
        '#medicine-search'
    );
    
    searchInputs.forEach(input => {
        if (input && window.PHARMADICES && window.PHARMADICES.autocomplete) {
            // Check if autocomplete is already initialized
            if (!input.hasAttribute('data-autocomplete-initialized')) {
                window.PHARMADICES.autocomplete.init(input, {
                    onSelect: function(value, entry) {
                        // Handle selection based on current page
                        const currentPage = window.location.pathname.split('/').pop();
                        
                        if (currentPage === 'drug-database.html' || currentPage === '') {
                            // If on medicines page, trigger search
                            if (typeof window.searchMedicines === 'function') {
                                window.searchMedicines(value);
                            }
                        } else {
                            // Redirect to medicines page with search
                            window.location.href = `drug-database.html?search=${encodeURIComponent(value)}`;
                        }
                    },
                    autoSubmit: false
                });
                
                input.setAttribute('data-autocomplete-initialized', 'true');
            }
        }
    });
}

// Call initAllSearchInputs after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait for autocomplete script to load
    setTimeout(initAllSearchInputs, 100);
});