// Add smooth scroll behavior
document.addEventListener('DOMContentLoaded', function() {
    // Add click tracking (optional - can be extended for analytics)
    const linkCards = document.querySelectorAll('.link-card');
    
    linkCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Optional: Add analytics tracking here
            console.log('Link clicked:', this.href);
        });
    });
    
    // Add entrance animations with stagger
    const cards = document.querySelectorAll('.link-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

