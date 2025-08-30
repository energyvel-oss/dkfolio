document.addEventListener('DOMContentLoaded', function() {
    const experienceContent = document.getElementById('experienceContent');

    // Generate experience content
    function generateExperienceContent() {
        // Create robot container
        const robotContainer = document.createElement('div');
        robotContainer.className = 'robot-container';
        robotContainer.innerHTML = `
            <div class="robot">
                <div class="robot-head">
                    <div class="robot-eye left"></div>
                    <div class="robot-eye right"></div>
                    <div class="robot-antenna"></div>
                </div>
                <div class="robot-body">
                    <div class="robot-arm left"></div>
                    <div class="robot-arm right"></div>
                    <div class="robot-wheel left"></div>
                    <div class="robot-wheel right"></div>
                </div>
                <div class="robot-shadow"></div>
                <div class="robot-light"></div>
            </div>
        `;
        experienceContent.appendChild(robotContainer);

        // Create experience container
        const experienceContainer = document.createElement('div');
        experienceContainer.className = 'experience-container';

        // Add experience items
        experienceData.forEach((exp, index) => {
            const experienceItem = document.createElement('div');
            experienceItem.className = `experience-item ${index % 2 !== 0 ? 'right' : ''}`;
            experienceItem.dataset.index = index;
            experienceItem.style.top = `${exp.position.top}px`;

            experienceItem.innerHTML = `
                <h3 class="experience-title">${exp.title}</h3>
                <div class="experience-date">${exp.date}</div>
                <p class="experience-description">${exp.description}</p>
            `;

            experienceContainer.appendChild(experienceItem);
        });

        experienceContent.appendChild(experienceContainer);

        // Create progress indicator
        const progressIndicator = document.createElement('div');
        progressIndicator.className = 'progress-indicator';

        experienceData.forEach((_, index) => {
            const progressDot = document.createElement('div');
            progressDot.className = 'progress-dot';
            progressDot.dataset.index = index;
            progressIndicator.appendChild(progressDot);
        });

        experienceContent.appendChild(progressIndicator);

        // Create stations
        experienceData.forEach((exp, index) => {
            const station = document.createElement('div');
            station.className = 'station';
            station.dataset.index = index;
            station.style.top = `${exp.position.top}px`;
            experienceContent.appendChild(station);
        });

        // Create timeline track
        const timelineTrack = document.createElement('div');
        timelineTrack.className = 'timeline-track';

        const timelineProgress = document.createElement('div');
        timelineProgress.className = 'timeline-progress';
        timelineTrack.appendChild(timelineProgress);

        experienceContent.appendChild(timelineTrack);

        // Create scroll indicator
        const scrollIndicator = document.createElement('div');
        scrollIndicator.className = 'scroll-indicator';

        experienceContent.appendChild(scrollIndicator);

        // Create particles container
        const particles = document.createElement('div');
        particles.className = 'particles';
        experienceContent.appendChild(particles);

        // Create extra space
        const extraSpace = document.createElement('div');
        extraSpace.className = 'extra-space';
        experienceContent.appendChild(extraSpace);

        // Initialize experience timeline
        initExperienceTimeline();
    }

    // Initialize experience timeline
    function initExperienceTimeline() {
        const robotContainer = document.querySelector('.robot-container');
        const road = document.querySelector('.road');
        const experienceItems = document.querySelectorAll('.experience-item');
        const progressDots = document.querySelectorAll('.progress-dot');
        const stations = document.querySelectorAll('.station');
        const timelineProgress = document.querySelector('.timeline-progress');
        const particles = document.querySelector('.particles');

        // Create particles
        for (let i = 0; i < 70; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particles.appendChild(particle);
        }

        let currentIndex = 0;
        let isAnimating = false;

        // Particle burst effect
        function triggerParticles(x, y) {
            const particleElements = document.querySelectorAll('.particle');
            particleElements.forEach((particle) => {
                const angle = Math.random() * 2 * Math.PI;
                const distance = 30 + Math.random() * 40;
                const px = Math.cos(angle) * distance;
                const py = Math.sin(angle) * distance;
                particle.style.left = `${x - particles.getBoundingClientRect().left}px`;
                particle.style.top = `${y - particles.getBoundingClientRect().top}px`;
                particle.style.opacity = 1;
                particle.style.transition = 'none';
                setTimeout(() => {
                    particle.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
                    particle.style.transform = `translate(${px}px, ${py}px) scale(0.5)`;
                    particle.style.opacity = 0;
                }, 10);
            });
        }

        // Update experience and animate robot
        function updateExperience(index, animate = true) {
            if (index < 0 || index >= experienceData.length || isAnimating) return;

            isAnimating = true;
            currentIndex = index;

            if (animate) {
                robotContainer.classList.remove('at-stop');
                robotContainer.classList.add('morphing');

                setTimeout(() => {
                    robotContainer.classList.remove('morphing');
                    robotContainer.classList.add('moving');
                    robotContainer.style.top = `${experienceData[index].position.top}px`;

                    setTimeout(() => {
                        robotContainer.classList.remove('moving');
                        robotContainer.classList.add('at-stop');

                        // Trigger particles at robot position
                        const robotRect = robotContainer.getBoundingClientRect();
                        const x = robotRect.left + robotRect.width / 2;
                        const y = robotRect.top + robotRect.height / 2;
                        triggerParticles(x, y);

                        isAnimating = false;
                    }, 1200); // Delay for arrival animation
                }, 700); // Delay for morphing animation
            } else {
                // No animation for initial state
                robotContainer.style.top = `${experienceData[index].position.top}px`;
                robotContainer.classList.add('at-stop');
                isAnimating = false;
            }

            // Update timeline progress
            const progressPercentage = (index / (experienceData.length - 1)) * 100;
            timelineProgress.style.width = `${progressPercentage}%`;

            // Activate relevant elements
            stations.forEach((station, i) => {
                station.classList.toggle('active', i === index);
            });

            progressDots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });

            experienceItems.forEach((item, i) => {
                item.classList.toggle('active', i === index);
            });
        }

        // Add event listeners to stations
        stations.forEach((station) => {
            station.addEventListener('click', () => {
                if (isAnimating) return;
                updateExperience(parseInt(station.dataset.index));
            });
        });

        // Add event listeners to progress dots
        progressDots.forEach((dot) => {
            dot.addEventListener('click', () => {
                if (isAnimating) return;
                updateExperience(parseInt(dot.dataset.index));
            });
        });

        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (isAnimating) return;
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                if (currentIndex < experienceData.length - 1) {
                    updateExperience(currentIndex + 1);
                }
            } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                if (currentIndex > 0) {
                    updateExperience(currentIndex - 1);
                }
            }
        });

        // Handle scroll navigation
        let lastScrollTime = 0;
        const scrollCooldown = 1000; // ms cooldown between scroll events

        document.querySelector('.content').addEventListener('wheel', (e) => {
            const now = Date.now();
            if (now - lastScrollTime < scrollCooldown || isAnimating) return;

            lastScrollTime = now;
            if (e.deltaY > 0) {
                // Scroll down
                if (currentIndex < experienceData.length - 1) {
                    updateExperience(currentIndex + 1);
                }
            } else {
                // Scroll up
                if (currentIndex > 0) {
                    updateExperience(currentIndex - 1);
                }
            }
        });

        // Handle window controls animations
        const windowControls = document.querySelectorAll('.control');
        windowControls.forEach(control => {
            control.addEventListener('mouseenter', () => {
                control.style.transform = 'scale(1.2)';
                control.style.filter = 'brightness(1.2)';
            });

            control.addEventListener('mouseleave', () => {
                control.style.transform = 'scale(1)';
                control.style.filter = 'brightness(1)';
            });
        });

        // Mobile touch support
        let touchStartY = 0;
        let touchEndY = 0;
        const minSwipeDistance = 30;

        document.addEventListener('touchstart', (e) => {
            touchStartY = e.changedTouches[0].screenY;
        });

        document.addEventListener('touchend', (e) => {
            if (isAnimating) return;
            touchEndY = e.changedTouches[0].screenY;
            const distance = touchStartY - touchEndY;

            if (Math.abs(distance) >= minSwipeDistance) {
                if (distance > 0) {
                    // Swipe up - go forward
                    if (currentIndex < experienceData.length - 1) {
                        updateExperience(currentIndex + 1);
                    }
                } else {
                    // Swipe down - go backward
                    if (currentIndex > 0) {
                        updateExperience(currentIndex - 1);
                    }
                }
            }
        });

        // Initialize with first experience
        updateExperience(0, false);
    }

    // Initialize experience section
    generateExperienceContent();
});