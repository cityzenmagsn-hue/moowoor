// Service Worker Registration and Management

class ServiceWorkerManager {
    constructor() {
        this.swRegistration = null;
        this.isOnline = navigator.onLine;
        this.init();
    }

    async init() {
        // Check if service workers are supported
        if ('serviceWorker' in navigator) {
            try {
                await this.registerServiceWorker();
                this.setupEventListeners();
                this.setupNetworkMonitoring();
                this.setupPeriodicSync();
            } catch (error) {
                console.error('Service Worker registration failed:', error);
            }
        } else {
            console.warn('Service Workers are not supported in this browser');
        }
    }

    async registerServiceWorker() {
        try {
            // Register the service worker
            this.swRegistration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            });

            console.log('Service Worker registered successfully:', this.swRegistration.scope);

            // Wait for the service worker to activate
            if (this.swRegistration.active) {
                console.log('Service Worker is already active');
            } else {
                this.swRegistration.addEventListener('updatefound', () => {
                    const installingWorker = this.swRegistration.installing;
                    installingWorker.addEventListener('statechange', () => {
                        if (installingWorker.state === 'activated') {
                            console.log('Service Worker activated');
                            this.showUpdateNotification();
                        }
                    });
                });
            }

            return this.swRegistration;
        } catch (error) {
            throw new Error(`Service Worker registration failed: ${error.message}`);
        }
    }

    setupEventListeners() {
        // Listen for messages from service worker
        navigator.serviceWorker.addEventListener('message', (event) => {
            const { type, data } = event.data;
            
            switch (type) {
                case 'SYNC_COMPLETE':
                    this.showNotification('Synchronisation terminée', data);
                    break;
                case 'CACHE_UPDATED':
                    this.showNotification('Cache mis à jour', 'Le contenu a été actualisé');
                    break;
                case 'NEW_VERSION':
                    this.showUpdateDialog();
                    break;
            }
        });

        // Listen for service worker controller changes
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('Service Worker controller changed');
            window.location.reload();
        });
    }

    setupNetworkMonitoring() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.updateNetworkStatus(true);
            this.syncWhenOnline();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.updateNetworkStatus(false);
        });

        // Initial status
        this.updateNetworkStatus(this.isOnline);
    }

    setupPeriodicSync() {
        // Request periodic sync if supported
        if ('periodicSync' in window.ServiceWorkerRegistration.prototype) {
            navigator.permissions.query({ name: 'periodic-background-sync' })
                .then((status) => {
                    if (status.state === 'granted') {
                        this.setupPeriodicBackgroundSync();
                    }
                });
        }
    }

    async setupPeriodicBackgroundSync() {
        try {
            await this.swRegistration.periodicSync.register('content-update', {
                minInterval: 24 * 60 * 60 * 1000 // 24 hours
            });
            console.log('Periodic background sync registered');
        } catch (error) {
            console.error('Periodic sync registration failed:', error);
        }
    }

    updateNetworkStatus(isOnline) {
        const statusIndicator = document.getElementById('networkStatus');
        const statusText = document.getElementById('networkStatusText');
        
        if (statusIndicator) {
            statusIndicator.className = isOnline ? 'status-online' : 'status-offline';
            statusIndicator.textContent = isOnline ? '●' : '●';
        }
        
        if (statusText) {
            statusText.textContent = isOnline ? 'En ligne' : 'Hors connexion';
        }

        // Update page visibility
        document.body.classList.toggle('offline-mode', !isOnline);
    }

    async syncWhenOnline() {
        if (!this.isOnline) return;

        try {
            // Trigger background sync
            if (this.swRegistration && this.swRegistration.sync) {
                await this.swRegistration.sync.register('background-sync');
                console.log('Background sync triggered');
            }
        } catch (error) {
            console.error('Background sync failed:', error);
        }
    }

    async updateCache() {
        try {
            if (this.swRegistration && this.swRegistration.active) {
                this.swRegistration.active.postMessage({
                    type: 'CACHE_UPDATE'
                });
                
                this.showNotification('Mise à jour', 'Cache en cours de mise à jour...');
            }
        } catch (error) {
            console.error('Cache update failed:', error);
        }
    }

    showNotification(title, message) {
        // Try to use browser notification first
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                body: message,
                icon: '/assets/images/logo-moowoor.svg',
                badge: '/assets/images/logo-moowoor.svg'
            });
        } else {
            // Fallback to in-app notification
            this.showInAppNotification(title, message);
        }
    }

    showInAppNotification(title, message) {
        const notification = document.createElement('div');
        notification.className = 'notification-toast';
        notification.innerHTML = `
            <div class="notification-content">
                <strong>${title}</strong>
                <p>${message}</p>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">×</button>
        `;

        // Add styles if not already present
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification-toast {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: var(--bg-card);
                    border: 1px solid var(--border-color);
                    border-radius: var(--border-radius);
                    padding: 1rem;
                    box-shadow: var(--shadow-lg);
                    z-index: 10000;
                    animation: slideInRight 0.3s ease;
                    max-width: 300px;
                }
                
                .notification-content strong {
                    color: var(--text-primary);
                    display: block;
                    margin-bottom: 0.5rem;
                }
                
                .notification-content p {
                    color: var(--text-secondary);
                    margin: 0;
                    font-size: 0.875rem;
                }
                
                .notification-close {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    font-size: 1.25rem;
                    cursor: pointer;
                    padding: 0;
                }
                
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    showUpdateDialog() {
        const dialog = document.createElement('div');
        dialog.className = 'update-dialog';
        dialog.innerHTML = `
            <div class="update-dialog-content">
                <h3>🔄 Nouvelle version disponible</h3>
                <p>Une nouvelle version de la documentation Moowoor est disponible. Voulez-vous mettre à jour maintenant ?</p>
                <div class="update-dialog-actions">
                    <button class="btn btn-primary" onclick="swManager.applyUpdate()">Mettre à jour</button>
                    <button class="btn btn-secondary" onclick="this.closest('.update-dialog').remove()">Plus tard</button>
                </div>
            </div>
        `;

        // Add styles if not already present
        if (!document.querySelector('#update-dialog-styles')) {
            const styles = document.createElement('style');
            styles.id = 'update-dialog-styles';
            styles.textContent = `
                .update-dialog {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    animation: fadeIn 0.3s ease;
                }
                
                .update-dialog-content {
                    background: var(--bg-card);
                    border: 1px solid var(--border-color);
                    border-radius: var(--border-radius);
                    padding: 2rem;
                    max-width: 400px;
                    width: 90%;
                    text-align: center;
                    animation: slideUp 0.3s ease;
                }
                
                .update-dialog-content h3 {
                    color: var(--text-primary);
                    margin-bottom: 1rem;
                }
                
                .update-dialog-content p {
                    color: var(--text-secondary);
                    margin-bottom: 2rem;
                    line-height: 1.5;
                }
                
                .update-dialog-actions {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideUp {
                    from {
                        transform: translateY(20px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(dialog);

        // Close dialog when clicking outside
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                dialog.remove();
            }
        });
    }

    applyUpdate() {
        // Remove the dialog
        const dialog = document.querySelector('.update-dialog');
        if (dialog) dialog.remove();

        // Tell service worker to skip waiting
        if (this.swRegistration && this.swRegistration.waiting) {
            this.swRegistration.waiting.postMessage({
                type: 'SKIP_WAITING'
            });
        }
    }

    async requestNotificationPermission() {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            return permission;
        }
        return 'denied';
    }

    // Manual cache refresh
    async refreshCache() {
        try {
            await this.updateCache();
            this.showNotification('Cache actualisé', 'Le contenu a été mis à jour');
        } catch (error) {
            console.error('Cache refresh failed:', error);
            this.showNotification('Erreur', 'Échec de la mise à jour du cache');
        }
    }

    // Get cache size information
    async getCacheInfo() {
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            let totalSize = 0;
            
            for (const name of cacheNames) {
                const cache = await caches.open(name);
                const requests = await cache.keys();
                totalSize += requests.length;
            }
            
            return {
                caches: cacheNames.length,
                entries: totalSize
            };
        }
        return null;
    }
}

// Initialize service worker manager
const swManager = new ServiceWorkerManager();

// Add global access for debugging and manual controls
window.swManager = swManager;

// Add offline styles
const offlineStyles = document.createElement('style');
offlineStyles.textContent = `
    body.offline-mode::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: var(--accent-danger);
        z-index: 10000;
        animation: pulse 2s infinite;
    }
    
    body.offline-mode .offline-only {
        display: block !important;
    }
    
    body.offline-mode .online-only {
        display: none !important;
    }
    
    .status-online {
        color: var(--accent-success) !important;
    }
    
    .status-offline {
        color: var(--accent-danger) !important;
    }
`;
document.head.appendChild(offlineStyles);