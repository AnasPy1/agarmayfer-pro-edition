document.addEventListener('DOMContentLoaded', () => {
    // Animate achievement numbers when they come into view
    const animateNumbers = () => {
        const achievementCards = document.querySelectorAll('.achievement-card[data-count]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const card = entry.target;
                    const targetNumber = parseInt(card.dataset.count);
                    const numberElement = card.querySelector('.achievement-number');
                    let currentNumber = 0;
                    const duration = 2000; // 2 seconds
                    const stepTime = 50; // Update every 50ms
                    const totalSteps = duration / stepTime;
                    const increment = targetNumber / totalSteps;

                    const counter = setInterval(() => {
                        currentNumber = Math.ceil(currentNumber + increment);
                        if (currentNumber >= targetNumber) {
                            currentNumber = targetNumber;
                            clearInterval(counter);
                        }
                        numberElement.textContent = currentNumber.toLocaleString() + '+';
                    }, stepTime);

                    observer.unobserve(card);
                }
            });
        }, {
            threshold: 0.5
        });

        achievementCards.forEach(card => observer.observe(card));
    };

    // Animate team member cards
    const animateTeamCards = () => {
        const teamMembers = document.querySelectorAll('.team-member');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });

        teamMembers.forEach(member => {
            member.style.opacity = '0';
            member.style.transform = 'translateY(20px)';
            member.style.transition = 'all 0.6s ease-out';
            observer.observe(member);
        });
    };

    // Initialize animations
    animateNumbers();
    animateTeamCards();

    // Add hover effect to value cards
    const valueCards = document.querySelectorAll('.value-card');
    valueCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.querySelector('i').style.transform = 'scale(1.2) rotate(10deg)';
        });
        card.addEventListener('mouseleave', () => {
            card.querySelector('i').style.transform = 'scale(1) rotate(0)';
        });
    });
});
