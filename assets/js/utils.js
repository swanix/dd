// ===== UTILIDADES GENERALES =====

// ===== MANEJO DE ELEMENTOS DEL DOM =====
function getElement(id) {
    return document.getElementById(id);
}

function getElements(selector) {
    return document.querySelectorAll(selector);
}

function createElement(tag, className = '', innerHTML = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (innerHTML) element.innerHTML = innerHTML;
    return element;
}

// ===== MANEJO DE CLASES CSS =====
function addClass(element, className) {
    if (element && element.classList) {
        element.classList.add(className);
    }
}

function removeClass(element, className) {
    if (element && element.classList) {
        element.classList.remove(className);
    }
}

function toggleClass(element, className) {
    if (element && element.classList) {
        element.classList.toggle(className);
    }
}

function hasClass(element, className) {
    return element && element.classList && element.classList.contains(className);
}

// ===== MANEJO DE VISIBILIDAD =====
function show(element) {
    if (element) {
        element.style.display = 'block';
    }
}

function hide(element) {
    if (element) {
        element.style.display = 'none';
    }
}

function toggle(element) {
    if (element) {
        element.style.display = element.style.display === 'none' ? 'block' : 'none';
    }
}

// ===== MANEJO DE EVENTOS =====
function addEventListener(element, event, handler) {
    if (element) {
        element.addEventListener(event, handler);
    }
}

function removeEventListener(element, event, handler) {
    if (element) {
        element.removeEventListener(event, handler);
    }
}

// ===== MANEJO DE LOCAL STORAGE =====
function setStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('Error guardando en localStorage:', error);
    }
}

function getStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('Error leyendo de localStorage:', error);
        return defaultValue;
    }
}

function removeStorage(key) {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error('Error eliminando de localStorage:', error);
    }
}

// ===== MANEJO DE FECHAS =====
function formatDate(date, options = {}) {
    const defaultOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    return new Date(date).toLocaleDateString('es-ES', { ...defaultOptions, ...options });
}

function formatRelativeTime(date) {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (minutes < 1) return 'Hace un momento';
    if (minutes < 60) return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    if (hours < 24) return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
    if (days < 7) return `Hace ${days} día${days > 1 ? 's' : ''}`;
    
    return formatDate(date, { year: 'numeric', month: 'short', day: 'numeric' });
}

// ===== MANEJO DE URLS =====
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function setUrlParameter(name, value) {
    const url = new URL(window.location);
    url.searchParams.set(name, value);
    window.history.replaceState({}, '', url);
}

function removeUrlParameter(name) {
    const url = new URL(window.location);
    url.searchParams.delete(name);
    window.history.replaceState({}, '', url);
}

// ===== MANEJO DE VALIDACIONES =====
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// ===== MANEJO DE DEBOUNCE Y THROTTLE =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== MANEJO DE NOTIFICACIONES =====
function showNotification(message, type = 'info', duration = 5000) {
    const notification = createElement('div', `notification notification-${type}`);
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after duration
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, duration);
}

// ===== MANEJO DE LOADING =====
function showLoading(container, message = 'Cargando...') {
    const loading = createElement('div', 'loading-overlay');
    loading.innerHTML = `
        <div class="loading-content">
            <div class="spinner"></div>
            <p>${message}</p>
        </div>
    `;
    
    if (container) {
        container.appendChild(loading);
    } else {
        document.body.appendChild(loading);
    }
    
    return loading;
}

function hideLoading(loadingElement) {
    if (loadingElement && loadingElement.parentElement) {
        loadingElement.remove();
    }
}

// ===== EXPORTAR FUNCIONES =====
window.Utils = {
    // DOM
    getElement,
    getElements,
    createElement,
    
    // Classes
    addClass,
    removeClass,
    toggleClass,
    hasClass,
    
    // Visibility
    show,
    hide,
    toggle,
    
    // Events
    addEventListener,
    removeEventListener,
    
    // Storage
    setStorage,
    getStorage,
    removeStorage,
    
    // Dates
    formatDate,
    formatRelativeTime,
    
    // URLs
    getUrlParameter,
    setUrlParameter,
    removeUrlParameter,
    
    // Validation
    isValidEmail,
    isValidUrl,
    
    // Performance
    debounce,
    throttle,
    
    // UI
    showNotification,
    showLoading,
    hideLoading
};
