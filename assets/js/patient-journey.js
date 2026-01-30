// Patient Journey JavaScript - Gestion du parcours patient interactif

class PatientJourneyManager {
    constructor() {
        this.journeySteps = [
            {
                id: 'pre-admission',
                title: 'Pré-Admission',
                description: 'Inscription et prise de rendez-vous initiale',
                icon: '📝',
                modules: ['FIIIMOOWOOR', 'KIIIMOOWOOR'],
                details: {
                    process: 'Le patient s\'inscrit via l\'application mobile ou le portail web, choisit son établissement et prend son premier rendez-vous.',
                    benefits: ['Inscription en ligne', 'Vérification automatique de l\'établissement', 'Choix du professionnel'],
                    duration: '5-10 minutes',
                    documents: ['Carte d\'identité', 'Carte CMU/Assurance', 'Informations de contact']
                }
            },
            {
                id: 'admission',
                title: 'Admission',
                description: 'Enregistrement administratif et création du dossier',
                icon: '🏥',
                modules: ['VACCEC', 'Medical Coverage'],
                details: {
                    process: 'À l\'arrivée, le patient est accueilli, son dossier est créé et sa couverture santé est vérifiée.',
                    benefits: ['Dossier unique', 'Vérification instantanée des droits', 'Historique médical accessible'],
                    duration: '10-15 minutes',
                    documents: ['Pièce d\'identité', 'Carte d\'assurance', 'Dossier médical précédent']
                }
            },
            {
                id: 'consultation',
                title: 'Consultation',
                description: 'Consultation médicale avec le professionnel de santé',
                icon: '👨‍⚕️',
                modules: ['VACCEC', 'KIIIMOOWOOR'],
                details: {
                    process: 'Le médecin consulte le patient, accède à son historique complet et met à jour le dossier en temps réel.',
                    benefits: ['Accès à l\'historique complet', 'Prescription électronique', 'Mise à jour instantanée'],
                    duration: '20-30 minutes',
                    documents: ['Dossier médical', 'Prescriptions', 'Ordonnances']
                }
            },
            {
                id: 'laboratory',
                title: 'Analyses de Laboratoire',
                description: 'Prescription et réalisation des examens biologiques',
                icon: '🔬',
                modules: ['VACCEC Lab', 'VACCEC'],
                details: {
                    process: 'Le médecin prescrit des analyses, le patient se rend au laboratoire et les résultats sont disponibles rapidement.',
                    benefits: ['Prescription électronique', 'Suivi en temps réel', 'Résultats rapides'],
                    duration: '30 minutes - 2 heures',
                    documents: ['Ordonnance', 'Résultats d\'analyses', 'Compte rendu']
                }
            },
            {
                id: 'pharmacy',
                title: 'Pharmacie',
                description: 'Dispensation des médicaments avec validation',
                icon: '💊',
                modules: ['Pharmacie Sénégal', 'INASANI RAMA'],
                details: {
                    process: 'Le patient se rend à la pharmacie avec son ordonnance électronique, les médicaments sont validés et dispensés.',
                    benefits: ['Ordonnance électronique', 'Validation AMM automatique', 'Traçabilité des lots'],
                    duration: '10-20 minutes',
                    documents: ['Ordonnance électronique', 'Médicaments', 'Conseils de prise']
                }
            },
            {
                id: 'specialized-care',
                title: 'Soins Spécialisés',
                description: 'Accès aux soins spécialisés selon les besoins',
                icon: '🦷',
                modules: ['SAMA Dentaire', 'VACCEC'],
                details: {
                    process: 'Orientation vers des soins spécialisés (dentaire, imagerie, etc.) avec suivi intégré.',
                    benefits: ['Orientation automatique', 'Suivi intégré', 'Partage d\'informations'],
                    duration: 'Variable selon spécialité',
                    documents: ['Dossier de spécialité', 'Comptes rendus', 'Plans de traitement']
                }
            },
            {
                id: 'billing',
                title: 'Facturation',
                description: 'Calcul automatique et paiement des services',
                icon: '💰',
                modules: ['VACCEC', 'Medical Coverage'],
                details: {
                    process: 'Calcul automatique des coûts, application de la couverture santé et paiement sécurisé.',
                    benefits: ['Calcul automatique', 'Transparence des tarifs', 'Paiement sécurisé'],
                    duration: '5-10 minutes',
                    documents: ['Facture détaillée', 'Reçu de paiement', 'Justificatif assurance']
                }
            },
            {
                id: 'follow-up',
                title: 'Suivi',
                description: 'Planification du suivi et monitoring',
                icon: '📅',
                modules: ['VACCEC', 'Mobile App'],
                details: {
                    process: 'Planification des rendez-vous de suivi, monitoring à distance et rappels automatiques.',
                    benefits: ['Rappels automatiques', 'Monitoring à distance', 'Suivi personnalisé'],
                    duration: 'Continu',
                    documents: ['Plan de suivi', 'Rapports de monitoring', 'Rendez-vous futurs']
                }
            }
        ];
        this.init();
    }

    init() {
        this.renderTimeline();
        this.setupModal();
        this.animateTimeline();
    }

    renderTimeline() {
        const container = document.getElementById('journeyTimeline');
        if (!container) return;

        container.innerHTML = `
            <div class="timeline-container">
                ${this.journeySteps.map((step, index) => `
                    <div class="timeline-step scroll-animate" data-step-id="${step.id}" style="animation-delay: ${index * 0.1}s">
                        <div class="step-connector ${index === this.journeySteps.length - 1 ? 'last' : ''}"></div>
                        <div class="step-content">
                            <div class="step-icon">${step.icon}</div>
                            <div class="step-info">
                                <h3 class="step-title">${step.title}</h3>
                                <p class="step-description">${step.description}</p>
                                <div class="step-modules">
                                    ${step.modules.map(module => 
                                        `<span class="module-tag">${module}</span>`
                                    ).join('')}
                                </div>
                            </div>
                            <button class="step-details-btn" onclick="patientJourney.showStepDetails('${step.id}')">
                                <span>→</span>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    showStepDetails(stepId) {
        const step = this.journeySteps.find(s => s.id === stepId);
        if (!step) return;

        const modal = document.getElementById('stepModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');

        modalTitle.textContent = step.title;
        modalBody.innerHTML = `
            <div class="step-details">
                <div class="step-details-header">
                    <div class="step-details-icon">${step.icon}</div>
                    <div class="step-details-info">
                        <h3>${step.title}</h3>
                        <p class="step-details-description">${step.description}</p>
                        <div class="step-details-modules">
                            <strong>Modules concernés:</strong>
                            ${step.modules.map(module => 
                                `<span class="module-tag">${module}</span>`
                            ).join('')}
                        </div>
                    </div>
                </div>
                
                <div class="step-details-section">
                    <h4>Processus</h4>
                    <p>${step.details.process}</p>
                </div>

                <div class="step-details-section">
                    <h4>Bénéfices pour le Patient</h4>
                    <ul class="step-benefits">
                        ${step.details.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                    </ul>
                </div>

                <div class="step-details-section">
                    <h4>Durée Estimée</h4>
                    <div class="step-duration">
                        <div class="duration-icon">⏱️</div>
                        <span class="duration-value">${step.details.duration}</span>
                    </div>
                </div>

                <div class="step-details-section">
                    <h4>Documents Requis</h4>
                    <div class="step-documents">
                        ${step.details.documents.map(doc => 
                            `<div class="document-item">
                                <div class="document-icon">📄</div>
                                <span>${doc}</span>
                            </div>`
                        ).join('')}
                    </div>
                </div>

                <div class="step-details-section">
                    <h4>Intégration avec l'Écosystème</h4>
                    <div class="step-integration">
                        <div class="integration-flow-mini">
                            ${this.getStepIntegration(step)}
                        </div>
                    </div>
                </div>
            </div>
        `;

        modal.classList.add('active');
    }

    getStepIntegration(step) {
        const integrationMap = {
            'pre-admission': `
                <div class="integration-item">
                    <span class="integration-from">📱 Patient</span>
                    <span class="integration-arrow">→</span>
                    <span class="integration-to">🏥 FIIIMOOWOOR</span>
                </div>
                <div class="integration-item">
                    <span class="integration-from">🏥 FIIIMOOWOOR</span>
                    <span class="integration-arrow">→</span>
                    <span class="integration-to">👨‍⚕️ KIIIMOOWOOR</span>
                </div>
            `,
            'admission': `
                <div class="integration-item">
                    <span class="integration-from">📝 Pré-admission</span>
                    <span class="integration-arrow">→</span>
                    <span class="integration-to">🏥 VACCEC</span>
                </div>
                <div class="integration-item">
                    <span class="integration-from">🏥 VACCEC</span>
                    <span class="integration-arrow">→</span>
                    <span class="integration-to">🛡️ Medical Coverage</span>
                </div>
            `,
            'consultation': `
                <div class="integration-item">
                    <span class="integration-from">🏥 Admission</span>
                    <span class="integration-arrow">→</span>
                    <span class="integration-to">👨‍⚕️ Médecin</span>
                </div>
                <div class="integration-item">
                    <span class="integration-from">👨‍⚕️ Médecin</span>
                    <span class="integration-arrow">→</span>
                    <span class="integration-to">📋 VACCEC</span>
                </div>
            `,
            'laboratory': `
                <div class="integration-item">
                    <span class="integration-from">👨‍⚕️ Consultation</span>
                    <span class="integration-arrow">→</span>
                    <span class="integration-to">🔬 VACCEC Lab</span>
                </div>
                <div class="integration-item">
                    <span class="integration-from">🔬 VACCEC Lab</span>
                    <span class="integration-arrow">→</span>
                    <span class="integration-to">📋 VACCEC</span>
                </div>
            `,
            'pharmacy': `
                <div class="integration-item">
                    <span class="integration-from">👨‍⚕️ Ordonnance</span>
                    <span class="integration-arrow">→</span>
                    <span class="integration-to">💊 Pharmacie Sénégal</span>
                </div>
                <div class="integration-item">
                    <span class="integration-from">💊 Pharmacie</span>
                    <span class="integration-arrow">→</span>
                    <span class="integration-to">📖 INASANI RAMA</span>
                </div>
            `,
            'specialized-care': `
                <div class="integration-item">
                    <span class="integration-from">👨‍⚕️ Orientation</span>
                    <span class="integration-arrow">→</span>
                    <span class="integration-to">🦷 SAMA Dentaire</span>
                </div>
                <div class="integration-item">
                    <span class="integration-from">🦷 SAMA Dentaire</span>
                    <span class="integration-arrow">→</span>
                    <span class="integration-to">📋 VACCEC</span>
                </div>
            `,
            'billing': `
                <div class="integration-item">
                    <span class="integration-from">🏥 Services</span>
                    <span class="integration-arrow">→</span>
                    <span class="integration-to">💰 VACCEC</span>
                </div>
                <div class="integration-item">
                    <span class="integration-from">💰 VACCEC</span>
                    <span class="integration-arrow">→</span>
                    <span class="integration-to">🛡️ Medical Coverage</span>
                </div>
            `,
            'follow-up': `
                <div class="integration-item">
                    <span class="integration-from">🏥 Sortie</span>
                    <span class="integration-arrow">→</span>
                    <span class="integration-to">📅 VACCEC</span>
                </div>
                <div class="integration-item">
                    <span class="integration-from">📅 VACCEC</span>
                    <span class="integration-arrow">→</span>
                    <span class="integration-to">📱 Mobile App</span>
                </div>
            `
        };
        return integrationMap[step.id] || '';
    }

    setupModal() {
        const modal = document.getElementById('stepModal');
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
        const modal = document.getElementById('stepModal');
        modal.classList.remove('active');
    }

    animateTimeline() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Animate progress bar
                    const progressBar = entry.target.querySelector('.step-progress');
                    if (progressBar) {
                        setTimeout(() => {
                            progressBar.style.width = '100%';
                        }, 200);
                    }
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        const steps = document.querySelectorAll('.timeline-step');
        steps.forEach(step => {
            observer.observe(step);
        });
    }

    // Interactive features
    setupInteractiveFeatures() {
        // Add hover effects for timeline steps
        const steps = document.querySelectorAll('.timeline-step');
        steps.forEach(step => {
            step.addEventListener('mouseenter', () => {
                step.classList.add('hovered');
            });
            
            step.addEventListener('mouseleave', () => {
                step.classList.remove('hovered');
            });
        });

        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                this.navigateTimeline(e.key === 'ArrowRight' ? 1 : -1);
            }
        });
    }

    navigateTimeline(direction) {
        const steps = document.querySelectorAll('.timeline-step');
        const currentStep = document.querySelector('.timeline-step.active');
        
        if (!currentStep && steps.length > 0) {
            steps[0].classList.add('active');
            return;
        }
        
        const currentIndex = Array.from(steps).indexOf(currentStep);
        const newIndex = currentIndex + direction;
        
        if (newIndex >= 0 && newIndex < steps.length) {
            currentStep.classList.remove('active');
            steps[newIndex].classList.add('active');
            steps[newIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.patientJourney = new PatientJourneyManager();
});

// Export for use in other modules
window.PatientJourneyManager = PatientJourneyManager;