/**
 * Sistema de Notificaciones - Swanix Wall
 * Maneja toast notifications y feedback visual
 */

class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.maxNotifications = 5;
        this.defaultDuration = 5000; // 5 segundos
        this.init();
    }

    init() {
        // Crear contenedor de notificaciones si no existe
        if (!document.getElementById('notification-container')) {
            const container = document.createElement('div');
            container.id = 'notification-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 10px;
                max-width: 350px;
            `;
            document.body.appendChild(container);
        }
    }

    /**
     * Mostrar una notificación
     * @param {string} message - Mensaje a mostrar
     * @param {string} type - Tipo de notificación (success, error, warning, info)
     * @param {number} duration - Duración en milisegundos
     */
    show(message, type = 'info', duration = this.defaultDuration) {
        const notification = this.createNotification(message, type);
        this.addNotification(notification);
        
        // Auto-remover después del tiempo especificado
        if (duration > 0) {
            setTimeout(() => {
                this.removeNotification(notification);
            }, duration);
        }

        return notification;
    }

    /**
     * Crear elemento de notificación
     */
    createNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `toast toast-${type} fade-in`;
        notification.innerHTML = `
            <div class="toast-content">
                <div class="toast-message">${this.escapeHtml(message)}</div>
                <button class="toast-close" aria-label="Cerrar notificación">
                    <span>&times;</span>
                </button>
            </div>
        `;

        // Agregar icono según el tipo
        const icon = this.getIconForType(type);
        if (icon) {
            notification.querySelector('.toast-content').insertAdjacentHTML('afterbegin', icon);
        }

        // Evento para cerrar
        notification.querySelector('.toast-close').addEventListener('click', () => {
            this.removeNotification(notification);
        });

        return notification;
    }

    /**
     * Agregar notificación al contenedor
     */
    addNotification(notification) {
        const container = document.getElementById('notification-container');
        
        // Limitar número de notificaciones
        if (this.notifications.length >= this.maxNotifications) {
            const oldestNotification = this.notifications.shift();
            this.removeNotification(oldestNotification);
        }

        container.appendChild(notification);
        this.notifications.push(notification);

        // Animar entrada
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });
    }

    /**
     * Remover notificación
     */
    removeNotification(notification) {
        if (!notification || !notification.parentNode) return;

        notification.classList.remove('show');
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            
            // Remover de la lista
            const index = this.notifications.indexOf(notification);
            if (index > -1) {
                this.notifications.splice(index, 1);
            }
        }, 300);
    }

    /**
     * Obtener icono según el tipo
     */
    getIconForType(type) {
        const icons = {
            success: '<svg class="toast-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>',
            error: '<svg class="toast-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>',
            warning: '<svg class="toast-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>',
            info: '<svg class="toast-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>'
        };

        return icons[type] || icons.info;
    }

    /**
     * Escapar HTML para prevenir XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Métodos de conveniencia
     */
    success(message, duration) {
        return this.show(message, 'success', duration);
    }

    error(message, duration) {
        return this.show(message, 'error', duration);
    }

    warning(message, duration) {
        return this.show(message, 'warning', duration);
    }

    info(message, duration) {
        return this.show(message, 'info', duration);
    }

    /**
     * Limpiar todas las notificaciones
     */
    clearAll() {
        this.notifications.forEach(notification => {
            this.removeNotification(notification);
        });
    }
}

// Estilos adicionales para las notificaciones
const notificationStyles = `
<style>
.toast {
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    padding: 16px;
    margin-bottom: 8px;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    border-left: 4px solid;
    max-width: 350px;
}

.toast.show {
    transform: translateX(0);
}

.toast-success {
    border-left-color: #28a745;
    background-color: #d4edda;
    color: #155724;
}

.toast-error {
    border-left-color: #dc3545;
    background-color: #f8d7da;
    color: #721c24;
}

.toast-warning {
    border-left-color: #ffc107;
    background-color: #fff3cd;
    color: #856404;
}

.toast-info {
    border-left-color: #17a2b8;
    background-color: #d1ecf1;
    color: #0c5460;
}

.toast-content {
    display: flex;
    align-items: flex-start;
    gap: 12px;
}

.toast-icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    margin-top: 2px;
}

.toast-message {
    flex: 1;
    font-size: 14px;
    line-height: 1.4;
}

.toast-close {
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    font-size: 18px;
    padding: 0;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.7;
    transition: opacity 0.2s ease;
}

.toast-close:hover {
    opacity: 1;
}

@media (max-width: 768px) {
    #notification-container {
        top: 10px;
        right: 10px;
        left: 10px;
        max-width: none;
    }
    
    .toast {
        transform: translateY(-100%);
        max-width: none;
    }
    
    .toast.show {
        transform: translateY(0);
    }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
    .toast {
        background-color: #2d2d2d;
        color: #ffffff;
    }
    
    .toast-success {
        background-color: #1e4d2b;
        color: #d4edda;
    }
    
    .toast-error {
        background-color: #4d1e1e;
        color: #f8d7da;
    }
    
    .toast-warning {
        background-color: #4d3e1e;
        color: #fff3cd;
    }
    
    .toast-info {
        background-color: #1e3d4d;
        color: #d1ecf1;
    }
}
</style>
`;

// Agregar estilos al documento
if (!document.getElementById('notification-styles')) {
    const styleElement = document.createElement('div');
    styleElement.id = 'notification-styles';
    styleElement.innerHTML = notificationStyles;
    document.head.appendChild(styleElement);
}

// Crear instancia global
window.notifications = new NotificationSystem();

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NotificationSystem;
}
