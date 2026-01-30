// Downloads JavaScript - Gestion des téléchargements

class DownloadsManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupDownloadButtons();
        this.setupProgressTracking();
        this.setupVersionCheck();
        this.setupSearch();
    }

    setupDownloadButtons() {
        const downloadButtons = document.querySelectorAll('.download-btn');
        
        downloadButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const fileName = button.dataset.file;
                if (fileName) {
                    this.downloadFile(fileName, button);
                }
            });
        });
    }

    async downloadFile(fileName, button) {
        // Show loading state
        const originalContent = button.innerHTML;
        button.innerHTML = '<span class="loading-spinner"></span> Téléchargement...';
        button.disabled = true;
        
        try {
            // For demo purposes, simulate download
            if (fileName.includes('.zip')) {
                await this.simulateDownload(fileName);
            } else {
                await this.downloadRealFile(fileName);
            }
            
            // Show success state
            button.innerHTML = '<span>✅</span> Téléchargé!';
            button.classList.add('success');
            
            // Reset button after delay
            setTimeout(() => {
                button.innerHTML = originalContent;
                button.disabled = false;
                button.classList.remove('success');
            }, 3000);
            
        } catch (error) {
            console.error('Download error:', error);
            
            // Show error state
            button.innerHTML = '<span>❌</span> Erreur';
            button.classList.add('error');
            
            // Reset button after delay
            setTimeout(() => {
                button.innerHTML = originalContent;
                button.disabled = false;
                button.classList.remove('error');
            }, 3000);
        }
    }

    async simulateDownload(fileName) {
        // Simulate download progress
        const progressSteps = [10, 25, 50, 75, 90, 100];
        
        for (const progress of progressSteps) {
            await this.delay(200);
            this.updateProgress(progress);
        }
        
        // Generate a small blob for download
        const content = `Simulation du téléchargement de ${fileName}\n`;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    async downloadRealFile(fileName) {
        try {
            const response = await fetch(`https://releases.moowoor.sn/${fileName}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            return { success: true, size: blob.size };
        } catch (error) {
            console.error('Real download error:', error);
            throw error;
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    setupProgressTracking() {
        // Create progress bar if it doesn't exist
        let progressBar = document.querySelector('.download-progress');
        
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.className = 'download-progress';
            progressBar.innerHTML = `
                <div class="progress-bar">
                    <div class="progress-fill"></div>
                </div>
                <div class="progress-text">0%</div>
            `;
            progressBar.style.display = 'none';
            document.body.appendChild(progressBar);
        }
        
        this.progressBar = progressBar;
    }

    updateProgress(percentage) {
        if (!this.progressBar) return;
        
        const progressFill = this.progressBar.querySelector('.progress-fill');
        const progressText = this.progressBar.querySelector('.progress-text');
        
        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }
        
        if (progressText) {
            progressText.textContent = `${percentage}%`;
        }
        
        // Show progress bar
        this.progressBar.style.display = 'block';
        
        // Hide progress bar when complete
        if (percentage >= 100) {
            setTimeout(() => {
                this.progressBar.style.display = 'none';
            }, 1000);
        }
    }

    setupVersionCheck() {
        // Check for updates
        this.checkForUpdates();
        
        // Set up periodic checks
        setInterval(() => {
            this.checkForUpdates();
        }, 24 * 60 * 60 * 1000); // Check daily
    }

    async checkForUpdates() {
        try {
            const currentVersion = '18.0.1.0.0';
            const response = await fetch('https://api.moowoor.sn/version');
            const data = await response.json();
            
            if (this.compareVersions(data.latest, currentVersion) > 0) {
                this.showUpdateNotification(data.latest, data.changelog);
            }
        } catch (error) {
            console.log('Could not check for updates:', error);
        }
    }

    compareVersions(latest, current) {
        const latestParts = latest.split('.').map(Number);
        const currentParts = current.split('.').map(Number);
        
        for (let i = 0; i < latestParts.length; i++) {
            if (latestParts[i] > currentParts[i]) {
                return 1;
            } else if (latestParts[i] < currentParts[i]) {
                return -1;
            }
        }
        return 0;
    }

    showUpdateNotification(latestVersion, changelog) {
        // Update existing notification or create new one
        let notification = document.querySelector('.update-notification');
        
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'update-notification';
            document.body.appendChild(notification);
        }
        
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">🔄</div>
                <div class="notification-info">
                    <h4>Nouvelle version disponible!</h4>
                    <p>Moowoor ${latestVersion} est maintenant disponible</p>
                    <button class="btn btn-primary" onclick="window.location.reload()">
                        Mettre à jour maintenant
                    </button>
                </div>
                <button class="notification-close" onclick="this.parentElement.remove()">×</button>
            </div>
        `;
        
        notification.style.display = 'block';
        
        // Auto-hide after 30 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 30000);
    }

    setupSearch() {
        const searchInput = document.querySelector('input[type="text"]');
        if (!searchInput) return;
        
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            this.filterDownloads(query);
        });
    }

    filterDownloads(query) {
        const downloadItems = document.querySelectorAll('.download-item, .main-download, .docs-download-item');
        
        downloadItems.forEach(item => {
            const title = item.querySelector('h3')?.textContent.toLowerCase();
            const description = item.querySelector('p')?.textContent.toLowerCase();
            
            if (query.length === 0) {
                item.style.display = '';
                return;
            }
            
            const matches = query.split(' ').every(word => 
                title.includes(word) || description.includes(word)
            );
            
            item.style.display = matches ? '' : 'none';
        });
    }

    setupAnalytics() {
        // Track download events
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('download-btn')) {
                const fileName = e.target.dataset.file;
                this.trackDownload(fileName);
            }
        });
    }

    trackDownload(fileName) {
        // In a real implementation, this would send to analytics service
        console.log('Download tracked:', fileName);
        
        // Store download in localStorage
        const downloads = JSON.parse(localStorage.getItem('moowoor-downloads') || '[]');
        downloads.push({
            file: fileName,
            date: new Date().toISOString(),
            version: '18.0.1.0.0'
        });
        localStorage.setItem('moowoor-downloads', JSON.stringify(downloads));
    }

    getDownloadStats() {
        const downloads = JSON.parse(localStorage.getItem('moowoor-downloads') || '[]');
        
        return {
            total: downloads.length,
            thisMonth: downloads.filter(d => {
                const downloadDate = new Date(d.date);
                const now = new Date();
                return downloadDate.getMonth() === now.getMonth() &&
                       downloadDate.getFullYear() === now.getFullYear();
            }).length,
            popular: this.getPopularDownloads(downloads)
        };
    }

    getPopularDownloads(downloads) {
        const counts = {};
        
        downloads.forEach(download => {
            const baseName = download.file.replace('-18.0.1.0.0', '');
            counts[baseName] = (counts[baseName] || 0) + 1;
        });
        
        return Object.entries(counts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([file, count]) => ({ file, count }));
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new DownloadsManager();
});

// Export for use in other modules
window.MoowoorDownloads = DownloadsManager;