class SmoothRoboticsCarousel {
    constructor() {
        this.currentIndex = 0;
        this.isTransitioning = false;
        this.track = document.getElementById('carouselTrack');
        this.indicators = document.getElementById('indicators');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.progressBar = document.getElementById('progressBar');

        this.autoPlayInterval = null;
        this.autoPlayDuration = 4000;
        this.progressAnimation = null;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        this.minSwipeDistance = 50;

        this.init();
    }

    init() {
        this.createSlides();
        this.createIndicators();
        this.bindEvents();
        this.updateSlides();

        // Start autoplay after a delay to allow user to see the gallery first
        setTimeout(() => {
            this.startAutoPlay();
        }, 2000);
    }

    createSlides() {
        const fragment = document.createDocumentFragment();

        galleryData.forEach((item, index) => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            slide.dataset.index = index;

            slide.innerHTML = `
                        <img src="${item.image}" alt="${item.title}" class="slide-image" loading="lazy">
                        <div class="slide-content">
                            <h3>${item.title}</h3>
                            <p>${item.description}</p>
                        </div>
                    `;

            fragment.appendChild(slide);
        });

        this.track.appendChild(fragment);
    }

    createIndicators() {
        const fragment = document.createDocumentFragment();

        galleryData.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.className = 'indicator';
            if (index === 0) indicator.classList.add('active');
            indicator.dataset.index = index;
            fragment.appendChild(indicator);
        });

        this.indicators.appendChild(fragment);
    }

    bindEvents() {
        // Window button interactions
        document.querySelector('.close-btn').addEventListener('click', () => {
            const window = document.querySelector('.mac-window');
            window.style.transition = 'all 0.3s ease';
            window.style.transform = 'scale(0.8)';
            window.style.opacity = '0';
        });

        document.querySelector('.minimize-btn').addEventListener('click', () => {
            const window = document.querySelector('.mac-window');
            window.style.transition = 'all 0.3s ease';
            window.style.transform = 'scale(0.1) translateY(100vh)';
        });

        document.querySelector('.maximize-btn').addEventListener('click', () => {
            const window = document.querySelector('.mac-window');
            window.style.transition = 'max-width 0.3s ease';
            window.style.maxWidth = window.style.maxWidth === '100vw' ? '800px' : '100vw';
        });

        this.prevBtn.addEventListener('click', () => {
            if (!this.isTransitioning) {
                this.resetAutoPlay();
                this.prev();
            }
        });

        this.nextBtn.addEventListener('click', () => {
            if (!this.isTransitioning) {
                this.resetAutoPlay();
                this.next();
            }
        });

        // Indicator clicks
        this.indicators.addEventListener('click', (e) => {
            if (e.target.classList.contains('indicator') && !this.isTransitioning) {
                this.resetAutoPlay();
                this.goTo(parseInt(e.target.dataset.index));
            }
        });

        // Slide clicks
        this.track.addEventListener('click', (e) => {
            const slide = e.target.closest('.carousel-slide');
            if (slide && !this.isTransitioning) {
                const index = parseInt(slide.dataset.index);
                if (index !== this.currentIndex) {
                    this.resetAutoPlay();
                    this.goTo(index);
                }
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.isTransitioning) {
                if (e.key === 'ArrowLeft') {
                    this.resetAutoPlay();
                    this.prev();
                }
                if (e.key === 'ArrowRight') {
                    this.resetAutoPlay();
                    this.next();
                }
            }
        });

        // Optimized touch support
        this.bindTouchEvents();

        // Mouse wheel support
        this.track.addEventListener('wheel', (e) => {
            if (!this.isTransitioning) {
                e.preventDefault();
                this.resetAutoPlay();
                if (e.deltaY > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }
        }, { passive: false });

        // Pause autoplay on hover
        this.track.addEventListener('mouseenter', () => {
            this.pauseAutoPlay();
        });

        this.track.addEventListener('mouseleave', () => {
            this.resumeAutoPlay();
        });

        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAutoPlay();
            } else {
                this.resumeAutoPlay();
            }
        });
    }

    bindTouchEvents() {
        this.track.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
            this.touchStartY = e.touches[0].clientY;
            this.pauseAutoPlay();
        }, { passive: true });

        this.track.addEventListener('touchmove', (e) => {
            // Prevent scrolling when swiping horizontally
            const touchX = e.touches[0].clientX;
            const touchY = e.touches[0].clientY;
            const diffX = Math.abs(touchX - this.touchStartX);
            const diffY = Math.abs(touchY - this.touchStartY);

            if (diffX > diffY) {
                e.preventDefault();
            }
        }, { passive: false });

        this.track.addEventListener('touchend', (e) => {
            if (!this.touchStartX || this.isTransitioning) {
                this.resumeAutoPlay();
                return;
            }

            this.touchEndX = e.changedTouches[0].clientX;
            this.touchEndY = e.changedTouches[0].clientY;

            const diffX = this.touchStartX - this.touchEndX;
            const diffY = Math.abs(this.touchStartY - this.touchEndY);

            // Only trigger swipe if horizontal movement is greater than vertical
            if (Math.abs(diffX) > this.minSwipeDistance && Math.abs(diffX) > diffY) {
                if (diffX > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }

            // Reset touch coordinates
            this.touchStartX = 0;
            this.touchStartY = 0;
            this.touchEndX = 0;
            this.touchEndY = 0;

            this.resumeAutoPlay();
        }, { passive: true });
    }

    updateSlides() {
        if (this.isTransitioning) return;

        this.isTransitioning = true;
        const slides = this.track.querySelectorAll('.carousel-slide');
        const indicators = this.indicators.querySelectorAll('.indicator');

        // Batch DOM updates
        requestAnimationFrame(() => {
            slides.forEach((slide, index) => {
                // Remove all position classes
                slide.className = 'carousel-slide';

                const diff = index - this.currentIndex;
                const totalSlides = slides.length;

                if (diff === 0) {
                    slide.classList.add('position-active');
                } else if (diff === -1 || (this.currentIndex === 0 && index === totalSlides - 1)) {
                    slide.classList.add('position-prev-1');
                } else if (diff === -2 || (this.currentIndex <= 1 && index >= totalSlides - 2 + this.currentIndex)) {
                    slide.classList.add('position-prev-2');
                } else if (diff === 1 || (this.currentIndex === totalSlides - 1 && index === 0)) {
                    slide.classList.add('position-next-1');
                } else if (diff === 2 || (this.currentIndex >= totalSlides - 2 && index <= 1 - (totalSlides - this.currentIndex))) {
                    slide.classList.add('position-next-2');
                } else {
                    slide.classList.add('position-hidden');
                }
            });

            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === this.currentIndex);
            });

            // Reset transition flag after animation completes
            setTimeout(() => {
                this.isTransitioning = false;
            }, 600); // Match CSS transition duration
        });
    }

    next() {
        if (this.isTransitioning) return;
        this.currentIndex = (this.currentIndex + 1) % galleryData.length;
        this.updateSlides();
    }

    prev() {
        if (this.isTransitioning) return;
        this.currentIndex = (this.currentIndex - 1 + galleryData.length) % galleryData.length;
        this.updateSlides();
    }

    goTo(index) {
        if (index !== this.currentIndex && !this.isTransitioning) {
            this.currentIndex = index;
            this.updateSlides();
        }
    }

    startAutoPlay() {
        this.clearAutoPlay();
        this.startProgressAnimation();

        this.autoPlayInterval = setInterval(() => {
            if (!this.isTransitioning) {
                this.next();
                this.startProgressAnimation();
            }
        }, this.autoPlayDuration);
    }

    pauseAutoPlay() {
        this.clearAutoPlay();
    }

    resumeAutoPlay() {
        if (!this.autoPlayInterval) {
            this.startAutoPlay();
        }
    }

    clearAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
        if (this.progressAnimation) {
            this.progressAnimation.cancel();
        }
    }

    startProgressAnimation() {
        if (this.progressAnimation) {
            this.progressAnimation.cancel();
        }

        this.progressBar.style.transform = 'scaleX(0)';

        this.progressAnimation = this.progressBar.animate([
            { transform: 'scaleX(0)' },
            { transform: 'scaleX(1)' }
        ], {
            duration: this.autoPlayDuration,
            easing: 'linear',
            fill: 'forwards'
        });
    }

    resetAutoPlay() {
        this.clearAutoPlay();
        this.startAutoPlay();
    }

    destroy() {
        this.clearAutoPlay();
        // Remove event listeners if needed
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if gallery section exists
    if (document.getElementById('carouselTrack')) {
        window.galleryCarousel = new SmoothRoboticsCarousel();
    }
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (window.galleryCarousel) {
        window.galleryCarousel.destroy();
    }
});