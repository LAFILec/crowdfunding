const CONFIG = {
    raised: 3,
    goal: 1000,
    contributors: 2
};

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach((counter, index) => {
        const text = counter.textContent;
        const isMoney = text.includes('$');
        const target = parseFloat(text.replace(/[$,]/g, ''));
        
        if (isNaN(target)) return;
        
        setTimeout(() => {
            let current = 0;
            const increment = target / 60;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = isMoney 
                    ? '$' + Math.floor(current)
                    : Math.floor(current);
            }, 25);
        }, index * 200);
    });
}

function animateProgress() {
    const progressBar = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text span');
    
    if (!progressBar) return;
    
    const percentage = Math.min((CONFIG.raised / CONFIG.goal) * 100, 100);
    
    setTimeout(() => {
        progressBar.style.width = percentage + '%';
    }, 100);
    
    if (progressText) {
        setTimeout(() => {
            progressText.textContent = percentage.toFixed(1) + '% completado';
        }, 800);
    }
}

function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.mission-item, .timeline-item, .breakdown-item, .stat-card, .podium-place');

    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease ' + (index * 0.1) + 's';
        observer.observe(el);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    setupSmoothScroll();
    setupScrollAnimations();
    
    setTimeout(animateCounters, 300);
    setTimeout(animateProgress, 600);
});
