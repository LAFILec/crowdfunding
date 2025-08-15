const CONFIG = {
    fundraising: {
        goal: 1000,         
        raised: 3,       
        donors: 2         
    }
};

function animateProgress() {
    try {
        const progressBar = document.querySelector('.progress-fill');
        if (!progressBar) return;
        const raisedElement = document.querySelector('.stat-card:first-child .stat-number');
        const goalElement = document.querySelector('.stat-card:nth-child(2) .stat-number');
        
        let raised = CONFIG.fundraising.raised;
        let goal = CONFIG.fundraising.goal;
        if (raisedElement && goalElement) {
            const raisedText = raisedElement.textContent.replace(/[$,]/g, '');
            const goalText = goalElement.textContent.replace(/[$,]/g, '');
            
            const parsedRaised = parseFloat(raisedText);
            const parsedGoal = parseFloat(goalText);
            
            if (!isNaN(parsedRaised) && !isNaN(parsedGoal)) {
                raised = parsedRaised;
                goal = parsedGoal;
            }
        }

        let percentage = (raised / goal) * 100;
        percentage = Math.max(percentage, 2); 
        percentage = Math.min(percentage, 100); 

        let width = 0;
        const increment = percentage / 80;
        
        const interval = setInterval(() => {
            if (width >= percentage) {
                clearInterval(interval);
                progressBar.style.width = percentage + '%';
            } else {
                width += increment;
                progressBar.style.width = width + '%';
            }
        }, 20);
        
        console.log(`📊 Progreso: ${raised}/${goal} (${percentage.toFixed(1)}%)`);
    } catch (error) {
        console.error('❌ Error en animación de progreso:', error);
    }
}

function animateCounters() {
    try {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const finalText = counter.textContent;
            const isMonetary = finalText.includes('$');
            const targetValue = parseFloat(finalText.replace(/[$,]/g, ''));
            
            if (isNaN(targetValue)) return;
            
            let currentValue = 0;
            const increment = targetValue / 80;
            
            const timer = setInterval(() => {
                currentValue += increment;
                
                if (currentValue >= targetValue) {
                    currentValue = targetValue;
                    clearInterval(timer);
                }
                
                if (isMonetary) {
                    counter.textContent = '$' + Math.floor(currentValue).toLocaleString();
                } else {
                    counter.textContent = Math.floor(currentValue);
                }
            }, 20);
        });
    } catch (error) {
        console.error('❌ Error en animación de contadores:', error);
    }
}

function addHoverEffects() {
    try {
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.03)';
                this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

        const podiumPlaces = document.querySelectorAll('.podium-place');
        podiumPlaces.forEach(place => {
            place.addEventListener('mouseenter', function() {
                const step = this.querySelector('.podium-step');
                if (step) {
                    step.style.transform = 'scale(1.05) translateY(-5px)';
                    step.style.transition = 'all 0.3s ease';
                }
            });
            
            place.addEventListener('mouseleave', function() {
                const step = this.querySelector('.podium-step');
                if (step) {
                    step.style.transform = 'scale(1) translateY(0)';
                }
            });
        });

        const donorItems = document.querySelectorAll('.donor-item');
        donorItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.transform = 'translateX(10px) scale(1.02)';
                this.style.background = 'rgba(255, 255, 255, 0.9)';
                this.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.transform = 'translateX(0) scale(1)';
                this.style.background = 'rgba(255, 255, 255, 0.6)';
                this.style.boxShadow = 'none';
            });
        });

    } catch (error) {
        console.error('❌ Error agregando efectos hover:', error);
    }
}

function addDonor(name, amount) {
    try {
        if (!name || !amount || amount <= 0) {
            console.warn('⚠️ Datos de donador inválidos');
            return;
        }
        
        const donorList = document.querySelector('.donor-list');
        if (!donorList) {
            console.warn('⚠️ Lista de donadores no encontrada');
            return;
        }
        
        const existingItems = donorList.querySelectorAll('.donor-item').length;
        const newRank = existingItems + 4; 
        const donorItem = document.createElement('div');
        donorItem.className = 'donor-item';
        donorItem.style.opacity = '0';
        donorItem.style.transform = 'translateY(20px)';
        
        donorItem.innerHTML = `
            <span class="donor-rank">${newRank}°</span>
            <span class="donor-name">${name}</span>
            <span class="donor-amount">$${amount}</span>
        `;
        
        donorList.appendChild(donorItem);

        setTimeout(() => {
            donorItem.style.transition = 'all 0.5s ease';
            donorItem.style.opacity = '1';
            donorItem.style.transform = 'translateY(0)';
        }, 100);
        
        CONFIG.fundraising.donors++;
        CONFIG.fundraising.raised += amount;
        updateDisplayStats();
        
        console.log(`✅ Nuevo donador agregado: ${name} - $${amount}`);
        return donorItem;
    } catch (error) {
        console.error('❌ Error agregando donador:', error);
        return null;
    }
}

function updateDisplayStats() {
    try {
        const statNumbers = document.querySelectorAll('.stat-number');
        if (statNumbers.length >= 3) {
            statNumbers[0].textContent = '$' + CONFIG.fundraising.raised.toLocaleString();
            statNumbers[2].textContent = CONFIG.fundraising.donors.toString();
        }
        const progressBar = document.querySelector('.progress-fill');
        if (progressBar) {
            const percentage = Math.min((CONFIG.fundraising.raised / CONFIG.fundraising.goal) * 100, 100);
            progressBar.style.transition = 'width 0.5s ease';
            progressBar.style.width = percentage + '%';
        }
    } catch (error) {
        console.error('❌ Error actualizando estadísticas:', error);
    }
}

function isMobile() {
    return window.innerWidth <= 768;
}

function mobileOptimizations() {
    try {
        const screenWidth = window.innerWidth;
        if (screenWidth <= 1024) {
            const interactiveElements = document.querySelectorAll('.stat-card, .podium-place, .donor-item, .btn');
            
            interactiveElements.forEach(element => {
                element.removeEventListener('touchstart', handleTouchStart);
                element.removeEventListener('touchend', handleTouchEnd);
                element.addEventListener('touchstart', handleTouchStart, { passive: true });
                element.addEventListener('touchend', handleTouchEnd, { passive: true });
            });
        }

        if (screenWidth <= 360) {
            const podiumSteps = document.querySelectorAll('.podium-step');
            podiumSteps.forEach(step => {
                step.style.fontSize = '0.8rem';
            });
        }

        console.log(`📱 Optimizaciones aplicadas para pantalla de ${screenWidth}px`);
    } catch (error) {
        console.error('❌ Error en optimizaciones móviles:', error);
    }
}

function handleTouchStart(e) {
    this.style.transform = 'scale(0.95)';
    this.style.transition = 'transform 0.1s ease';
}

function handleTouchEnd(e) {
    this.style.transform = 'scale(1)';
}

function enableSmoothScroll() {
    try {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    } catch (error) {
        console.error('❌ Error habilitando smooth scroll:', error);
    }
}

function simulateNewDonation() {
    const names = [
        'Andrea Silva', 'Luis Morales', 'Carmen Vega', 'Pedro Castro',
        'Isabel Ramos', 'Jorge Mendoza', 'Patricia Ruiz', 'Fernando Gil',
        'Lucía Herrera', 'Manuel Soto', 'Valentina Cruz', 'Sebastián Díaz'
    ];
    
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomAmount = Math.floor(Math.random() * 400) + 50;
    
    addDonor(randomName, randomAmount);
    console.log(`🎉 Simulación: ${randomName} donó $${randomAmount}`);
}

document.addEventListener('DOMContentLoaded', function() {
    try {
        console.log('🚀 Iniciando página de crowdfunding...');

        setTimeout(() => {
            animateProgress();
            animateCounters();

            addHoverEffects();
            enableSmoothScroll();
            mobileOptimizations();
            
            console.log('✅ Página cargada y animada correctamente');
        }, 100);
        
    } catch (error) {
        console.error('❌ Error durante la inicialización:', error);
    }
});

let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        mobileOptimizations();
    }, 250);
});

window.crowdfundingApp = {
    addDonor,
    simulateNewDonation,
    updateDisplayStats,
    CONFIG
};

console.log('📦 Crowdfunding App cargada - Usa crowdfundingApp para interactuar');
