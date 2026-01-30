// Governance JavaScript - Gestion de la gouvernance et des registres

class GovernanceManager {
    constructor() {
        this.governance = null;
        this.init();
    }

    async init() {
        await this.loadGovernance();
        this.renderRegistries();
        this.setupModal();
        this.animateProgressBars();
    }

    async loadGovernance() {
        try {
            if (window.MOOWOOR_DATA && window.MOOWOOR_DATA.governance) {
                this.governance = window.MOOWOOR_DATA.governance;
            } else {
                throw new Error('Global MOOWOOR_DATA not found');
            }
        } catch (error) {
            console.error('Error loading governance data:', error);
            this.showError('Erreur lors du chargement des données de gouvernance');
        }
    }

    renderRegistries() {
        if (!this.governance) return;

        this.renderStrategicRegistries();
        this.renderRegulationRegistries();
        this.renderExecutionRegistries();
        this.renderOperationalRegistries();
    }

    renderStrategicRegistries() {
        const container = document.getElementById('strategicRegistries');
        if (!container) return;

        const registries = this.governance.governance.strategic.registries;

        container.innerHTML = registries.map((registry, index) => `
            <div class="governance-card strategic scroll-animate" data-registry-id="${registry.id}" style="animation-delay: ${index * 0.1}s">
                <div class="governance-level strategic">Pilotage Stratégique</div>
                <h3 class="governance-title">${registry.name}</h3>
                <p class="governance-description">${registry.description}</p>
                <div class="governance-objective">
                    <strong>Objectif:</strong> ${registry.objective}
                </div>
                
                <div class="governance-details">
                    <div class="governance-section">
                        <h4>Responsabilités</h4>
                        <ul class="governance-list">
                            ${registry.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="governance-section">
                        <h4>Membres</h4>
                        <div class="governance-members">
                            ${registry.members.slice(0, 4).map(member =>
            `<span class="member-tag">${member}</span>`
        ).join('')}
                            ${registry.members.length > 4 ?
                `<span class="member-tag">+${registry.members.length - 4} autres</span>` : ''}
                        </div>
                    </div>
                    
                    <div class="governance-meta">
                        <div class="meta-item">
                            <strong>Fréquence:</strong> ${registry.frequency}
                        </div>
                        <div class="meta-item">
                            <strong>Décisions:</strong> ${registry.decisions}
                        </div>
                        <div class="meta-item">
                            <strong>Reporting:</strong> ${registry.reporting_to}
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        // Add click handlers
        container.querySelectorAll('.governance-card').forEach(card => {
            card.addEventListener('click', () => {
                const registryId = card.dataset.registryId;
                this.showRegistryDetails('strategic', registryId);
            });
        });
    }

    renderRegulationRegistries() {
        const container = document.getElementById('regulationRegistries');
        if (!container) return;

        const registries = this.governance.governance.regulation.registries;

        container.innerHTML = registries.map((registry, index) => `
            <div class="governance-card regulation scroll-animate" data-registry-id="${registry.id}" style="animation-delay: ${index * 0.1}s">
                <div class="governance-level regulation">Régulation</div>
                <h3 class="governance-title">${registry.name}</h3>
                <p class="governance-description">${registry.description}</p>
                <div class="governance-objective">
                    <strong>Objectif:</strong> ${registry.objective}
                </div>
                
                <div class="governance-details">
                    <div class="governance-section">
                        <h4>Responsabilités</h4>
                        <ul class="governance-list">
                            ${registry.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="governance-section">
                        <h4>Membres</h4>
                        <div class="governance-members">
                            ${registry.members.slice(0, 4).map(member =>
            `<span class="member-tag">${member}</span>`
        ).join('')}
                            ${registry.members.length > 4 ?
                `<span class="member-tag">+${registry.members.length - 4} autres</span>` : ''}
                        </div>
                    </div>
                    
                    <div class="governance-meta">
                        <div class="meta-item">
                            <strong>Fréquence:</strong> ${registry.frequency}
                        </div>
                        <div class="meta-item">
                            <strong>Décisions:</strong> ${registry.decisions}
                        </div>
                        <div class="meta-item">
                            <strong>Reporting:</strong> ${registry.reporting_to}
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        // Add click handlers
        container.querySelectorAll('.governance-card').forEach(card => {
            card.addEventListener('click', () => {
                const registryId = card.dataset.registryId;
                this.showRegistryDetails('regulation', registryId);
            });
        });
    }

    renderExecutionRegistries() {
        const container = document.getElementById('executionRegistries');
        if (!container) return;

        const registries = this.governance.governance.execution.registries;

        container.innerHTML = registries.map((registry, index) => `
            <div class="governance-card execution scroll-animate" data-registry-id="${registry.id}" style="animation-delay: ${index * 0.1}s">
                <div class="governance-level execution">Exécution</div>
                <h3 class="governance-title">${registry.name}</h3>
                <p class="governance-description">${registry.description}</p>
                <div class="governance-objective">
                    <strong>Objectif:</strong> ${registry.objective}
                </div>
                
                <div class="governance-details">
                    <div class="governance-section">
                        <h4>Responsabilités</h4>
                        <ul class="governance-list">
                            ${registry.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="governance-section">
                        <h4>Membres</h4>
                        <div class="governance-members">
                            ${registry.members.slice(0, 4).map(member =>
            `<span class="member-tag">${member}</span>`
        ).join('')}
                            ${registry.members.length > 4 ?
                `<span class="member-tag">+${registry.members.length - 4} autres</span>` : ''}
                        </div>
                    </div>
                    
                    <div class="governance-meta">
                        <div class="meta-item">
                            <strong>Fréquence:</strong> ${registry.frequency}
                        </div>
                        <div class="meta-item">
                            <strong>Décisions:</strong> ${registry.decisions}
                        </div>
                        <div class="meta-item">
                            <strong>Reporting:</strong> ${registry.reporting_to}
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        // Add click handlers
        container.querySelectorAll('.governance-card').forEach(card => {
            card.addEventListener('click', () => {
                const registryId = card.dataset.registryId;
                this.showRegistryDetails('execution', registryId);
            });
        });
    }

    renderOperationalRegistries() {
        if (!this.governance || !this.governance.governance.registries) return;

        // Niveau 1: Fondationnel
        this.renderRegistryLevel('niveau1Grid',
            this.governance.governance.registries.niveau_1_fondationnel.registres,
            'niveau-1');

        // Niveau 2: Médical
        this.renderRegistryLevel('niveau2Grid',
            this.governance.governance.registries.niveau_2_medical.registres,
            'niveau-2');

        // Niveau 3: Organisationnel
        this.renderRegistryLevel('niveau3Grid',
            this.governance.governance.registries.niveau_3_organisationnel.registres,
            'niveau-3');

        // Niveau 4: Qualité et Sécurité
        this.renderRegistryLevel('niveau4Grid',
            this.governance.governance.registries.niveau_4_qualite_securite.registres,
            'niveau-4');

        // Niveau 5: Pilotage
        this.renderRegistryLevel('niveau5Grid',
            this.governance.governance.registries.niveau_5_pilotage.registres,
            'niveau-5');
    }

    getLevelColor(level) {
        switch (level) {
            case 'niveau-1': return '#667eea'; // Fondationnel
            case 'niveau-2': return '#f093fb'; // Médical
            case 'niveau-3': return '#4facfe'; // Organisationnel
            case 'niveau-4': return '#43e97b'; // Qualité
            case 'niveau-5': return '#fa709a'; // Pilotage
            default: return 'var(--accent-primary)';
        }
    }

    renderRegistryLevel(containerId, registries, levelClass) {
        const container = document.getElementById(containerId);
        if (!container) return; // Guard clause

        const borderColor = this.getLevelColor(levelClass);


        container.innerHTML = registries.map((registry, index) => `
            <div class="operational-registry-card ${levelClass} scroll-animate" 
                 data-registry-id="${registry.id}" 
                 style="animation-delay: ${index * 0.1}s">
                
                <h3 class="governance-title">${registry.name}</h3>
                <p class="governance-description">${registry.description}</p>
                
                <div class="governance-objective" style="border-left-color: ${borderColor}">
                    <strong>Objectif:</strong> ${registry.objectif}
                </div>
                
                <div class="governance-details">
                    <div class="governance-section">
                        <h4>Contenu</h4>
                        <ul class="governance-list">
                            ${registry.contenu.slice(0, 3).map(item => `<li>${item}</li>`).join('')}
                            ${registry.contenu.length > 3 ? `<li>+ ${registry.contenu.length - 3} autres éléments</li>` : ''}
                        </ul>
                    </div>
                </div>

                <div class="registry-meta" style="margin-top: var(--spacing-md)">
                    <div class="meta-item">
                        <strong>Responsable:</strong> ${registry.responsable}
                    </div>
                    <div class="meta-item">
                        <span class="access-level">${registry.acces}</span>
                    </div>
                </div>
                
                <button class="registry-details-btn" type="button" data-registry-id="${registry.id}" style="background-color: ${borderColor}">
                    <span class="btn-icon">🔎</span>
                    Voir Détails
                </button>
            </div>
        `).join('');

        // Click handlers (card + CTA)
        container.querySelectorAll('.operational-registry-card').forEach(card => {
            card.addEventListener('click', () => {
                const registryId = card.dataset.registryId;
                this.showOperationalRegistryDetails(registryId);
            });
        });

        container.querySelectorAll('.registry-details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const registryId = btn.dataset.registryId;
                this.showOperationalRegistryDetails(registryId);
            });
        });

        this.triggerScrollAnimations();
    }

    showOperationalRegistryDetails(registryId) {
        // Rechercher le registre dans tous les niveaux
        let registry = null;
        let levelName = '';
        let levelClass = '';

        const levels = [
            { key: 'niveau_1_fondationnel', name: 'Niveau 1 - Fondationnel', class: 'niveau-1' },
            { key: 'niveau_2_medical', name: 'Niveau 2 - Médical', class: 'niveau-2' },
            { key: 'niveau_3_organisationnel', name: 'Niveau 3 - Organisationnel', class: 'niveau-3' },
            { key: 'niveau_4_qualite_securite', name: 'Niveau 4 - Qualité et Sécurité', class: 'niveau-4' },
            { key: 'niveau_5_pilotage', name: 'Niveau 5 - Pilotage', class: 'niveau-5' }
        ];

        for (const level of levels) {
            const found = this.governance.governance.registries[level.key].registres
                .find(r => r.id === registryId);
            if (found) {
                registry = found;
                levelName = level.name;
                levelClass = level.class;
                break;
            }
        }

        if (!registry) return;

        const modal = document.getElementById('registryModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');

        modalTitle.textContent = registry.name;
        modalBody.innerHTML = `
            <div class="operational-registry-details">
                <div class="registry-level-badge ${levelClass}">${levelName}</div>
                
                <div class="registry-section">
                    <h4>📝 Description</h4>
                    <p>${registry.description}</p>
                </div>

                <div class="registry-section">
                    <h4>🎯 Objectif Principal</h4>
                    <p>${registry.objectif}</p>
                </div>

                <div class="registry-section">
                    <h4>📚 Contenu du Registre</h4>
                    <ul class="registry-content-list">
                        ${registry.contenu.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>

                <div class="registry-section">
                    <h4>🧩 Cas d'Usage</h4>
                    <ul class="registry-content-list">
                        <li>Consultation et mise à jour des données du registre « ${registry.name} » dans le cadre des opérations quotidiennes.</li>
                        <li>Production de rapports et d'indicateurs à partir des éléments du registre pour le pilotage et la conformité.</li>
                        <li>Coordination entre acteurs (établissements, autorités, équipes) sur la base des informations de référence du registre.</li>
                    </ul>
                </div>

                <div class="registry-section">
                    <h4>🏷️ Informations de Gestion</h4>
                    <div class="registry-management">
                        <div class="management-item">
                            <strong>Responsable:</strong> ${registry.responsable}
                        </div>
                        <div class="management-item">
                            <strong>Niveau d'accès:</strong> ${registry.acces}
                        </div>
                    </div>
                </div>
            </div>
        `;

        modal.classList.add('active');
    }

    showRegistryDetails(level, registryId) {
        const registries = this.governance.governance[level].registries;
        const registry = registries.find(r => r.id === registryId);
        if (!registry) return;

        const modal = document.getElementById('registryModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');

        modalTitle.textContent = registry.name;
        modalBody.innerHTML = `
            <div class="registry-details">
                <div class="registry-details-header">
                    <div class="registry-level ${level}">
                        ${level === 'strategic' ? '🎯 Pilotage Stratégique' :
                level === 'regulation' ? '⚖️ Régulation' : '⚙️ Exécution'}
                    </div>
                    <div class="registry-description">${registry.description}</div>
                </div>
                
                <div class="registry-section">
                    <h4>Objectif Principal</h4>
                    <p>${registry.objective}</p>
                </div>

                <div class="registry-section">
                    <h4>Responsabilités</h4>
                    <ul class="registry-list">
                        ${registry.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
                    </ul>
                </div>

                <div class="registry-section">
                    <h4>Composition</h4>
                    <div class="registry-members">
                        ${registry.members.map(member =>
                    `<div class="member-item">
                                <div class="member-icon">👤</div>
                                <span>${member}</span>
                            </div>`
                ).join('')}
                    </div>
                </div>

                <div class="registry-section">
                    <h4>Modalités de Fonctionnement</h4>
                    <div class="registry-operations">
                        <div class="operation-item">
                            <strong>Fréquence des réunions:</strong> ${registry.frequency}
                        </div>
                        <div class="operation-item">
                            <strong>Pouvoir de décision:</strong> ${registry.decisions}
                        </div>
                        <div class="operation-item">
                            <strong>Reporting hiérarchique:</strong> ${registry.reporting_to}
                        </div>
                    </div>
                </div>

                <div class="registry-section">
                    <h4>Interaction avec les Autres Niveaux</h4>
                    <div class="registry-interactions">
                        ${this.getLevelInteractions(level)}
                    </div>
                </div>
            </div>
        `;

        modal.classList.add('active');
    }

    getLevelInteractions(level) {
        const interactions = {
            strategic: `
                <div class="interaction-item">
                    <div class="interaction-direction">↓</div>
                    <div class="interaction-desc">
                        <strong>Vers la Régulation:</strong> Transmission des orientations stratégiques, validation des cadres réglementaires
                    </div>
                </div>
                <div class="interaction-item">
                    <div class="interaction-direction">↓</div>
                    <div class="interaction-desc">
                        <strong>Vers l'Exécution:</strong> Allocation des ressources, validation des plans opérationnels
                    </div>
                </div>
                <div class="interaction-item">
                    <div class="interaction-direction">↑</div>
                    <div class="interaction-desc">
                        <strong>Retours:</strong> Bilans annuels, indicateurs de performance, ajustements stratégiques
                    </div>
                </div>
            `,
            regulation: `
                <div class="interaction-item">
                    <div class="interaction-direction">↑</div>
                    <div class="interaction-desc">
                        <strong>Vers le Pilotage:</strong> Rapports de conformité, recommandations, alertes réglementaires
                    </div>
                </div>
                <div class="interaction-item">
                    <div class="interaction-direction">↓</div>
                    <div class="interaction-desc">
                        <strong>Vers l'Exécution:</strong> Standards techniques, agréments, audits de conformité
                    </div>
                </div>
                <div class="interaction-item">
                    <div class="interaction-direction">↔</div>
                    <div class="interaction-desc">
                        <strong>Transversal:</strong> Collaboration avec les autorités sectorielles et internationales
                    </div>
                </div>
            `,
            execution: `
                <div class="interaction-item">
                    <div class="interaction-direction">↑</div>
                    <div class="interaction-desc">
                        <strong>Vers la Régulation:</strong> Données opérationnelles, incidents de sécurité, feedback utilisateurs
                    </div>
                </div>
                <div class="interaction-item">
                    <div class="interaction-direction">↑↑</div>
                    <div class="interaction-desc">
                        <strong>Vers le Pilotage:</strong> Indicateurs de performance, rapports de déploiement, impacts terrain
                    </div>
                </div>
                <div class="interaction-item">
                    <div class="interaction-direction">↔</div>
                    <div class="interaction-desc">
                        <strong>Transversal:</strong> Collaboration avec les opérateurs et fournisseurs de services
                    </div>
                </div>
            `
        };
        return interactions[level] || '';
    }

    setupModal() {
        const modal = document.getElementById('registryModal');
        const modalClose = document.getElementById('modalClose');
        const modalCloseBtn = document.getElementById('modalCloseBtn');

        // Close buttons
        [modalClose, modalCloseBtn].forEach(btn => {
            if (btn) {
                btn.addEventListener('click', () => this.closeModal());
            }
        });

        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                this.closeModal();
            }
        });
    }

    closeModal() {
        const modal = document.getElementById('registryModal');
        modal.classList.remove('active');
    }

    animateProgressBars() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBars = entry.target.querySelectorAll('.progress-fill');
                    progressBars.forEach(bar => {
                        const progress = bar.style.getPropertyValue('--progress');
                        bar.style.width = progress;
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });

        const indicatorsContainer = document.querySelector('.indicators-container');
        if (indicatorsContainer) {
            observer.observe(indicatorsContainer);
        }
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <p>${message}</p>
            <button class="btn btn-primary mt-md" onclick="location.reload()">
                Réessayer
            </button>
        `;
        document.body.appendChild(errorDiv);
    }

    triggerScrollAnimations() {
        const elements = document.querySelectorAll('.scroll-animate');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        elements.forEach(element => {
            observer.observe(element);
        });
    }
}

// Initialize when DOM is ready
let governanceManager;
document.addEventListener('DOMContentLoaded', () => {
    governanceManager = new GovernanceManager();
    window.governanceManager = governanceManager; // Rendre accessible globalement
});

// Export for use in other modules
window.MoowoorGovernance = GovernanceManager;