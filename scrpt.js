const LAFIL_CONFIG = {
    funding: {
        goal: 1000,
        raised: 3,
        contributors: 2
    },
    ui: {
        animationDuration: 1200,
        counterSpeed: 30
    }
};

class CrowdfundingManager {
    constructor(config) {
        this.config = config;
        this.progressBar = null;
        this.counters = [];
        this.isInitialized = false;
    }

    init() {
        try {
            this.cacheElements();
            this.setupEventListeners();
            this.initializeAnimations();
            this.isInitialized = true;
        } catch (error) {
            console.error('Error during initialization:', error);
        }
    }

    cacheElements() {
        this.progressBar = document.querySelector('.progress-fill');
        this.counters = document.querySelectorAll('.stat-number');
        this.statCards = document.querySelectorAll('.stat-card');
        this.contributorItems = document.querySelectorAll('.contributor-item');
        this.podiumPlaces = document.querySelectorAll('.podium-place');
        this.missionItems = document.querySelectorAll('.mission-item');
        this.contributorsList = document.querySelector('.contributor-items');
    }

    setupEventListeners() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });

        this.enableSmoothScrolling();
        
        if (this.isMobileDevice()) {
            this.setupTouchEffects();
        }
    }

    initializeAnimations() {
        setTimeout(() => this.animateCounters(), 200);
        setTimeout(() => this.animateProgressBar(), 600);
        setTimeout(() => this.setupHoverEffects(), 1000);
        setTimeout(() => this.animateElements(), 1200);
    }

    animateCounters() {
        this.counters.forEach((counter, index) => {
            const finalText = counter.textContent.trim();
            const isMonetary = finalText.includes('$');
            const targetValue = parseFloat(finalText.replace(/[$,]/g, ''));
            
            if (isNaN(targetValue) || targetValue === 0) return;
            
            const duration = this.config.ui.animationDuration;
            const steps = duration / this.config.ui.counterSpeed;
            const increment = targetValue / steps;
            let currentValue = 0;
            
            setTimeout(() => {
                const timer = setInterval(() => {
                    currentValue += increment;
                    
                    if (currentValue >= targetValue) {
                        currentValue = targetValue;
                        clearInterval(timer);
                    }
                    
                    if (isMonetary) {
                        counter.textContent = ' + Math.floor(currentValue).toLocaleString()';
                    } else {
                        counter.textContent = Math.floor(currentValue);
                    }
                }, this.config.ui.counterSpeed);
            }, index * 200);
        });
    }

    animateProgressBar() {
        if (!this.progressBar) return;
        
        const percentage = Math.max((this.config.funding.raised / this.config.funding.goal) * 100, 0.3);
        const clampedPercentage = Math.min(percentage, 100);
        
        this.progressBar.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
        this.progressBar.style.width = clampedPercentage + '%';
        
        const progressText = document.querySelector('.progress-text span');
        if (progressText) {
            setTimeout(() => {
                progressText.textContent = `${clampedPercentage.toFixed(1)}% completado`;
            }, 800);
        }
    }

    setupHoverEffects() {
        this.statCards.forEach(card => {
            card.addEventListener('mouseenter', this.handleStatCardHover.bind(this));
            card.addEventListener('mouseleave', this.handleStatCardLeave.bind(this));
        });

        this.missionItems.forEach(item => {
            item.addEventListener('mouseenter', this.handleMissionHover.bind(this));
            item.addEventListener('mouseleave', this.handleMissionLeave.bind(this));
        });

        this.podiumPlaces.forEach(place => {
            place.addEventListener('mouseenter', this.handlePodiumHover.bind(this));
            place.addEventListener('mouseleave', this.handlePodiumLeave.bind(this));
        });

        this.contributorItems.forEach(item => {
            item.addEventListener('mouseenter', this.handleContributorHover.bind(this));
            item.addEventListener('mouseleave', this.handleContributorLeave.bind(this));
        });
    }

    handleStatCardHover(e) {
        e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.12)';
    }

    handleStatCardLeave(e) {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = '';
    }

    handleMissionHover(e) {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
    }

    handleMissionLeave(e) {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '';
    }

    handlePodiumHover(e) {
        const step = e.currentTarget.querySelector('.podium-step');
        if (step) {
            step.style.transform = 'translateY(-6px) scale(1.05)';
            step.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.2)';
        }
    }

    handlePodiumLeave(e) {
        const step = e.currentTarget.querySelector('.podium-step');
        if (step) {
            step.style.transform = 'translateY(0) scale(1)';
            step.style.boxShadow = '';
        }
    }

    handleContributorHover(e) {
        e.currentTarget.style.transform = 'translateX(8px)';
        e.currentTarget.style.backgroundColor = '#ffffff';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    }

    handleContributorLeave(e) {
        e.currentTarget.style.transform = 'translateX(0)';
        e.currentTarget.style.backgroundColor = '';
        e.currentTarget.style.boxShadow = '';
    }

    addContributor(name, amount) {
        if (!this.validateContributorData(name, amount)) {
            return false;
        }

        try {
            const contributorElement = this.createContributorElement(name, amount);
            
            if (!this.contributorsList) {
                return false;
            }

            this.contributorsList.appendChild(contributorElement);
            this.animateNewContributor(contributorElement);
            this.updateFundingStats(amount);
            this.setupSingleContributorHover(contributorElement);
            
            return true;
        } catch (error) {
            return false;
        }
    }

    validateContributorData(name, amount) {
        return name && 
               typeof name === 'string' && 
               name.trim().length > 0 && 
               typeof amount === 'number' && 
               amount > 0;
    }

    createContributorElement(name, amount) {
        const existingItems = document.querySelectorAll('.contributor-item').length;
        const rank = existingItems + 1;
        
        const element = document.createElement('div');
        element.className = 'contributor-item';
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        element.innerHTML = `
            <span class="contributor-rank">${rank}</span>
            <span class="contributor-name">${this.sanitizeString(name)}</span>
            <span class="contributor-amount">${amount}</span>
        `;
        
        return element;
    }

    setupSingleContributorHover(element) {
        element.addEventListener('mouseenter', this.handleContributorHover.bind(this));
        element.addEventListener('mouseleave', this.handleContributorLeave.bind(this));
    }

    animateNewContributor(element) {
        setTimeout(() => {
            element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100);
    }

    updateFundingStats(amount) {
        this.config.funding.contributors++;
        this.config.funding.raised += amount;
        
        const statNumbers = document.querySelectorAll('.stat-number');
        if (statNumbers.length >= 3) {
            statNumbers[0].textContent = ' + this.config.funding.raised.toLocaleString()';
            statNumbers[2].textContent = this.config.funding.contributors.toString();
        }
        
        this.animateProgressBar();
    }

    sanitizeString(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               window.innerWidth <= 768;
    }

    setupTouchEffects() {
        const touchElements = document.querySelectorAll('.stat-card, .mission-item, .podium-place, .contributor-item, .btn');
        
        touchElements.forEach(element => {
            element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
            element.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
        });
    }

    handleTouchStart(e) {
        e.currentTarget.style.transform = 'scale(0.98)';
        e.currentTarget.style.transition = 'transform 0.1s ease';
    }

    handleTouchEnd(e) {
        setTimeout(() => {
            e.currentTarget.style.transform = '';
        }, 150);
    }

    enableSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    handleResize() {
        if (this.isMobileDevice()) {
            this.setupTouchEffects();
        }
    }

    animateElements() {
        const elementsToAnimate = document.querySelectorAll('.mission-item, .breakdown-item');
        
        elementsToAnimate.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    simulateContribution() {
        const sampleNames = [
            'Dr. Elena Vásquez', 'Ing. Roberto Mendez', 'Lcda. Patricia Torres',
            'Prof. Fernando Silva', 'Arq. Isabella Morales', 'Ec. Diego Ramírez',
            'Dra. Sofía Guerrero', 'Ing. Carlos Herrera', 'Lcda. Valeria Castro'
        ];
        
        const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
        const randomAmount = Math.floor(Math.random() * 150) + 25;
        
        this.addContributor(randomName, randomAmount);
    }

    getPublicAPI() {
        return {
            addContributor: this.addContributor.bind(this),
            simulateContribution: this.simulateContribution.bind(this),
            updateFundingStats: this.updateFundingStats.bind(this),
            getConfig: () => ({ ...this.config }),
            getStats: () => ({
                raised: this.config.funding.raised,
                goal: this.config.funding.goal,
                contributors: this.config.funding.contributors,
                percentage: (this.config.funding.raised / this.config.funding.goal) * 100
            })
        };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        const crowdfundingManager = new CrowdfundingManager(LAFIL_CONFIG);
        crowdfundingManager.init();
        
        window.LAFIL = crowdfundingManager.getPublicAPI();
    } catch (error) {
        console.error('Critical error during initialization:', error);
    }
});

window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

if ('performance' in window) {
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
    });
}
