// Search JavaScript - Gestion de la recherche globale

class SearchManager {
    constructor() {
        this.searchData = [];
        this.searchIndex = {};
        this.init();
    }

    async init() {
        await this.loadSearchData();
        this.setupSearch();
        this.setupPopularSearches();
    }

    async loadSearchData() {
        try {
            // Load all data sources
            // Load all data sources from global object
            if (!window.MOOWOOR_DATA) throw new Error('Global MOOWOOR_DATA not found');
            
            const modulesData = window.MOOWOOR_DATA.modules;
            const careersData = window.MOOWOOR_DATA.careers;
            const governanceData = window.MOOWOOR_DATA.governance;

            // Build search index
            this.searchData = [
                ...this.buildModuleIndex(modulesData),
                ...this.buildCareerIndex(careersData),
                ...this.buildGovernanceIndex(governanceData)
            ];

            // Build search index for fast lookup
            this.buildSearchIndex();
            
            console.log('Search data loaded:', this.searchData.length, 'items');
        } catch (error) {
            console.error('Error loading search data:', error);
        }
    }

    buildModuleIndex(data) {
        return data.modules.map(module => ({
            id: module.id,
            title: module.name,
            description: module.description,
            category: 'modules',
            subcategory: module.category,
            url: `modules.html#${module.id}`,
            icon: module.icon,
            features: module.features,
            tags: [module.category, ...module.features],
            type: 'module'
        }));
    }

    buildCareerIndex(data) {
        return data.careers.map(career => ({
            id: career.id,
            title: career.title,
            description: career.description,
            category: 'careers',
            subcategory: career.category,
            url: `metiers.html#${career.id}`,
            icon: career.icon,
            skills: career.skills,
            education_level: career.education_level,
            tags: [career.category, career.education_level, ...career.skills],
            type: 'career'
        }));
    }

    buildGovernanceIndex(data) {
        const items = [];
        
        // Add strategic level
        data.governance.strategic.registries.forEach(registry => {
            items.push({
                id: registry.id,
                title: registry.name,
                description: registry.description,
                category: 'governance',
                subcategory: 'strategic',
                url: `gouvernance.html#${registry.id}`,
                icon: '🎯',
                tags: ['strategic', 'pilotage', registry.name.toLowerCase()],
                type: 'registry'
            });
        });

        // Add regulation level
        data.governance.regulation.registries.forEach(registry => {
            items.push({
                id: registry.id,
                title: registry.name,
                description: registry.description,
                category: 'governance',
                subcategory: 'regulation',
                url: `gouvernance.html#${registry.id}`,
                icon: '⚖️',
                tags: ['regulation', 'contrôle', registry.name.toLowerCase()],
                type: 'registry'
            });
        });

        // Add execution level
        data.governance.execution.registries.forEach(registry => {
            items.push({
                id: registry.id,
                title: registry.name,
                description: registry.description,
                category: 'governance',
                subcategory: 'execution',
                url: `gouvernance.html#${registry.id}`,
                icon: '⚙️',
                tags: ['execution', 'opérations', registry.name.toLowerCase()],
                type: 'registry'
            });
        });

        return items;
    }

    buildSearchIndex() {
        this.searchIndex = {};
        
        this.searchData.forEach(item => {
            // Index by title
            const titleWords = item.title.toLowerCase().split(' ');
            titleWords.forEach(word => {
                if (!this.searchIndex[word]) {
                    this.searchIndex[word] = [];
                }
                this.searchIndex[word].push(item);
            });

            // Index by tags
            item.tags.forEach(tag => {
                const tagWords = tag.toLowerCase().split(' ');
                tagWords.forEach(word => {
                    if (!this.searchIndex[word]) {
                        this.searchIndex[word] = [];
                    }
                    this.searchIndex[word].push(item);
                });
            });

            // Index by description
            const descWords = item.description.toLowerCase().split(' ');
            descWords.forEach(word => {
                if (word.length > 3) { // Only index words longer than 3 characters
                    if (!this.searchIndex[word]) {
                        this.searchIndex[word] = [];
                    }
                    this.searchIndex[word].push(item);
                }
            });
        });
    }

    setupSearch() {
        const searchInput = document.getElementById('searchInput');
        const searchClear = document.getElementById('searchClear');
        const searchSuggestions = document.getElementById('searchSuggestions');

        if (!searchInput) return;

        // Input handler with debouncing
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            
            clearTimeout(searchTimeout);
            
            if (query.length === 0) {
                this.clearSearch();
                this.hideSuggestions();
                return;
            }

            // Show clear button
            if (searchClear) {
                searchClear.style.display = 'block';
            }

            // Show suggestions while typing
            if (query.length >= 2) {
                this.showSuggestions(query);
            }

            // Debounce search
            searchTimeout = setTimeout(() => {
                this.performSearch(query);
            }, 300);
        });

        // Clear button handler
        if (searchClear) {
            searchClear.addEventListener('click', () => {
                this.clearSearch();
                searchInput.value = '';
                searchInput.focus();
            });
        }

        // Keyboard navigation
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.clearSearch();
                this.hideSuggestions();
                searchInput.value = '';
            } else if (e.key === 'ArrowDown') {
                this.navigateSuggestions(1);
                e.preventDefault();
            } else if (e.key === 'ArrowUp') {
                this.navigateSuggestions(-1);
                e.preventDefault();
            } else if (e.key === 'Enter') {
                this.selectSuggestion();
                e.preventDefault();
            }
        });
    }

    performSearch(query) {
        const results = this.search(query);
        this.displayResults(results, query);
    }

    search(query) {
        const queryWords = query.toLowerCase().split(' ').filter(word => word.length > 0);
        
        if (queryWords.length === 0) {
            return [];
        }

        // First try exact match
        const exactMatches = this.exactSearch(query);
        if (exactMatches.length > 0) {
            return exactMatches;
        }

        // Then try fuzzy match
        return this.fuzzySearch(queryWords);
    }

    exactSearch(query) {
        const exactMatches = [];
        
        this.searchData.forEach(item => {
            const titleMatch = item.title.toLowerCase().includes(query.toLowerCase());
            const descMatch = item.description.toLowerCase().includes(query.toLowerCase());
            const tagMatch = item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
            
            if (titleMatch || descMatch || tagMatch) {
                let score = 0;
                if (titleMatch) score += 10;
                if (tagMatch) score += 5;
                if (descMatch) score += 2;
                
                exactMatches.push({ ...item, score });
            }
        });

        return exactMatches.sort((a, b) => b.score - a.score);
    }

    fuzzySearch(queryWords) {
        const scoredItems = new Map();

        queryWords.forEach(word => {
            const exactMatches = this.searchIndex[word] || [];
            exactMatches.forEach(item => {
                const score = scoredItems.get(item) || 0;
                scoredItems.set(item, score + 3); // Higher score for exact matches
            });

            // Try fuzzy matches
            this.searchData.forEach(item => {
                if (this.fuzzyMatch(word, item.title)) {
                    const score = scoredItems.get(item) || 0;
                    scoredItems.set(item, score + 1);
                }
                
                if (this.fuzzyMatch(word, item.description)) {
                    const score = scoredItems.get(item) || 0;
                    scoredItems.set(item, score + 0.5);
                }
                
                item.tags.forEach(tag => {
                    if (this.fuzzyMatch(word, tag)) {
                        const score = scoredItems.get(item) || 0;
                        scoredItems.set(item, score + 2);
                    }
                });
            });
        });

        // Convert to array and sort by score
        const matches = [];
        scoredItems.forEach((score, item) => {
            matches.push({ ...item, score });
        });

        return matches.sort((a, b) => b.score - a.score).slice(0, 20); // Limit results
    }

    fuzzyMatch(pattern, text) {
        pattern = pattern.toLowerCase();
        text = text.toLowerCase();
        
        let patternIndex = 0;
        let textIndex = 0;
        
        while (patternIndex < pattern.length && textIndex < text.length) {
            if (pattern[patternIndex] === text[textIndex]) {
                patternIndex++;
            }
            textIndex++;
        }
        
        return patternIndex === pattern.length;
    }

    displayResults(results, query) {
        const resultsSection = document.getElementById('resultsSection');
        const noResultsSection = document.getElementById('noResultsSection');
        const popularSection = document.getElementById('popularSection');
        const resultsContainer = document.getElementById('resultsContainer');
        const resultsCount = document.getElementById('resultsCount');

        // Hide popular section
        if (popularSection) {
            popularSection.style.display = 'none';
        }

        if (results.length === 0) {
            // Show no results
            if (resultsSection) resultsSection.style.display = 'none';
            if (noResultsSection) noResultsSection.style.display = 'block';
            return;
        }

        // Show results
        if (resultsSection) resultsSection.style.display = 'block';
        if (noResultsSection) noResultsSection.style.display = 'none';
        
        // Update count
        if (resultsCount) {
            resultsCount.textContent = `${results.length} résultat(s) trouvé(s) pour "${query}"`;
        }

        // Render results
        if (resultsContainer) {
            resultsContainer.innerHTML = results.map((result, index) => `
                <div class="search-result-item scroll-animate" style="animation-delay: ${index * 0.05}s">
                    <div class="result-icon">${result.icon || '📄'}</div>
                    <div class="result-content">
                        <div class="result-header">
                            <h3 class="result-title">
                                <a href="${result.url}">${this.highlightText(result.title, query)}</a>
                            </h3>
                            <div class="result-meta">
                                <span class="result-category">${this.getCategoryLabel(result.category)}</span>
                                ${result.subcategory ? `<span class="result-subcategory">${result.subcategory}</span>` : ''}
                                <span class="result-type">${this.getTypeLabel(result.type)}</span>
                            </div>
                        </div>
                        <div class="result-description">
                            ${this.highlightText(result.description, query)}
                        </div>
                        ${result.tags ? `
                            <div class="result-tags">
                                ${result.tags.slice(0, 5).map(tag => 
                                    `<span class="result-tag">${tag}</span>`
                                ).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `).join('');
        }

        // Trigger animations
        this.triggerScrollAnimations();
    }

    highlightText(text, query) {
        if (!query) return text;
        
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    getCategoryLabel(category) {
        const labels = {
            'modules': 'Modules',
            'careers': 'Métiers',
            'governance': 'Gouvernance'
        };
        return labels[category] || category;
    }

    getTypeLabel(type) {
        const labels = {
            'module': 'Module',
            'career': 'Métier',
            'registry': 'Registre'
        };
        return labels[type] || type;
    }

    clearSearch() {
        const resultsSection = document.getElementById('resultsSection');
        const noResultsSection = document.getElementById('noResultsSection');
        const popularSection = document.getElementById('popularSection');
        const searchClear = document.getElementById('searchClear');

        // Hide results sections
        if (resultsSection) resultsSection.style.display = 'none';
        if (noResultsSection) noResultsSection.style.display = 'none';
        
        // Show popular section
        if (popularSection) popularSection.style.display = 'block';
        
        // Hide clear button
        if (searchClear) searchClear.style.display = 'none';
    }

    setupPopularSearches() {
        // Add click handlers to popular search items
        document.querySelectorAll('.popular-search-item').forEach(item => {
            item.addEventListener('click', () => {
                const title = item.querySelector('h3').textContent;
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    searchInput.value = title;
                    this.performSearch(title);
                }
            });
        });
    }

    showSuggestions(query) {
        const suggestions = document.getElementById('searchSuggestions');
        if (!suggestions) return;

        const results = this.getSuggestions(query);
        
        if (results.length === 0) {
            this.hideSuggestions();
            return;
        }

        suggestions.innerHTML = results.map((result, index) => `
            <div class="suggestion-item" data-index="${index}" data-value="${result.title}">
                <div class="suggestion-icon">${result.icon || '📄'}</div>
                <div class="suggestion-content">
                    <div class="suggestion-title">${this.highlightText(result.title, query)}</div>
                    <div class="suggestion-category">${this.getCategoryLabel(result.category)}</div>
                </div>
            </div>
        `).join('');

        suggestions.style.display = 'block';
        this.selectedSuggestion = -1;

        // Add click handlers
        suggestions.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                const value = item.getAttribute('data-value');
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    searchInput.value = value;
                    this.performSearch(value);
                    this.hideSuggestions();
                }
            });
        });
    }

    getSuggestions(query) {
        const results = this.search(query);
        return results.slice(0, 5); // Limit to 5 suggestions
    }

    hideSuggestions() {
        const suggestions = document.getElementById('searchSuggestions');
        if (suggestions) {
            suggestions.style.display = 'none';
        }
        this.selectedSuggestion = -1;
    }

    navigateSuggestions(direction) {
        const suggestions = document.getElementById('searchSuggestions');
        if (!suggestions || suggestions.style.display === 'none') return;

        const items = suggestions.querySelectorAll('.suggestion-item');
        if (items.length === 0) return;

        // Remove previous selection
        if (this.selectedSuggestion >= 0) {
            items[this.selectedSuggestion].classList.remove('selected');
        }

        // Calculate new selection
        this.selectedSuggestion += direction;
        if (this.selectedSuggestion < 0) this.selectedSuggestion = items.length - 1;
        if (this.selectedSuggestion >= items.length) this.selectedSuggestion = 0;

        // Add selection class
        items[this.selectedSuggestion].classList.add('selected');
    }

    selectSuggestion() {
        const suggestions = document.getElementById('searchSuggestions');
        if (!suggestions || this.selectedSuggestion < 0) return;

        const items = suggestions.querySelectorAll('.suggestion-item');
        if (items[this.selectedSuggestion]) {
            const value = items[this.selectedSuggestion].getAttribute('data-value');
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.value = value;
                this.performSearch(value);
                this.hideSuggestions();
            }
        }
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
document.addEventListener('DOMContentLoaded', () => {
    new SearchManager();
});

// Export for use in other modules
window.MoowoorSearch = SearchManager;