document.addEventListener('DOMContentLoaded', function() {
    // Typewriter effect for role
    const roleElement = document.getElementById('typewriter-role');
    const roles = [
        'Robotics Developer',
        'AI Engineer', 
        'Automation Specialist',
        'ROS Expert',
        'Computer Vision Engineer'
    ];
    
    let currentRoleIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;
    
    function typeWriter() {
        const currentRole = roles[currentRoleIndex];
        
        if (isDeleting) {
            // Deleting characters
            roleElement.textContent = currentRole.substring(0, currentCharIndex - 1);
            currentCharIndex--;
            typeSpeed = 50;
            
            if (currentCharIndex === 0) {
                isDeleting = false;
                currentRoleIndex = (currentRoleIndex + 1) % roles.length;
                typeSpeed = 500; // Pause before typing next role
            }
        } else {
            // Typing characters
            roleElement.textContent = currentRole.substring(0, currentCharIndex + 1);
            currentCharIndex++;
            typeSpeed = 100;
            
            if (currentCharIndex === currentRole.length) {
                isDeleting = true;
                typeSpeed = 2000; // Pause before deleting
            }
        }
        
        setTimeout(typeWriter, typeSpeed);
    }
    
    // Start typewriter effect after initial animations
    setTimeout(() => {
        typeWriter();
    }, 3000);
    
    // Add smooth scroll behavior for hire me button
    const hireMeBtn = document.querySelector('.btn-animated');
    if (hireMeBtn) {
        hireMeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add click animation
            this.style.transform = 'translateY(-3px) scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'translateY(-3px) scale(1)';
            }, 150);
            
            // Navigate to contact section
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                contactSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
    
    // Add parallax effect to background elements
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-bg-elements');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
    
    // Add mouse movement parallax effect
    document.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            const moveX = (mouseX - 0.5) * 20;
            const moveY = (mouseY - 0.5) * 20;
            
            heroContent.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }
    });
});