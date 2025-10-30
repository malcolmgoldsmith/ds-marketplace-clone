/**
 * Black Friday Carousel Component
 * Handles product carousel with auto-rotation and navigation
 */
class BFCarousel {
    constructor(trackId, options = {}) {
        this.track = document.getElementById(trackId);
        if (!this.track) {
            console.error(`Carousel track not found: ${trackId}`);
            return;
        }

        this.options = {
            itemsPerPage: options.itemsPerPage || 3,
            autoRotate: options.autoRotate !== undefined ? options.autoRotate : true,
            rotateInterval: options.rotateInterval || 5000,
            gap: options.gap || 27
        };

        this.currentPage = 0;
        this.autoRotateTimer = null;
        this.items = [];

        this.init();
    }

    init() {
        // Get carousel ID from track ID
        this.carouselId = this.track.id.replace('-track', '');

        // Setup navigation
        this.setupNavigation();

        // Wait for products to be loaded
        setTimeout(() => {
            this.items = Array.from(this.track.children);
            if (this.items.length > 0) {
                this.totalPages = Math.ceil(this.items.length / this.options.itemsPerPage);
                this.generateDots();
                this.updateCarousel();

                if (this.options.autoRotate && this.totalPages > 1) {
                    this.startAutoRotate();
                }

                console.log(`🎠 Carousel initialized: ${this.items.length} items, ${this.totalPages} pages`);
            }
        }, 500);
    }

    setupNavigation() {
        const prevBtn = document.getElementById(`${this.carouselId}-prev`);
        const nextBtn = document.getElementById(`${this.carouselId}-next`);

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.stopAutoRotate();
                this.prev();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.stopAutoRotate();
                this.next();
            });
        }
    }

    generateDots() {
        const dotsContainer = document.getElementById(`${this.carouselId}-dots`);
        if (!dotsContainer) return;

        dotsContainer.innerHTML = '';

        for (let i = 0; i < this.totalPages; i++) {
            const dot = document.createElement('button');
            dot.className = `bf-v3-carousel-dot ${i === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => {
                this.stopAutoRotate();
                this.goToPage(i);
            });
            dotsContainer.appendChild(dot);
        }
    }

    updateCarousel() {
        if (this.items.length === 0) return;

        // Calculate transform
        const itemWidth = this.items[0].offsetWidth;
        const offset = -(this.currentPage * this.options.itemsPerPage * (itemWidth + this.options.gap));

        this.track.style.transform = `translateX(${offset}px)`;

        // Update dots
        const dots = document.querySelectorAll(`#${this.carouselId}-dots .bf-v3-carousel-dot`);
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentPage);
        });

        // Update navigation buttons
        const prevBtn = document.getElementById(`${this.carouselId}-prev`);
        const nextBtn = document.getElementById(`${this.carouselId}-next`);

        if (prevBtn) {
            prevBtn.style.opacity = this.currentPage === 0 ? '0.3' : '1';
            prevBtn.style.cursor = this.currentPage === 0 ? 'not-allowed' : 'pointer';
        }

        if (nextBtn) {
            nextBtn.style.opacity = this.currentPage === this.totalPages - 1 ? '0.3' : '1';
            nextBtn.style.cursor = this.currentPage === this.totalPages - 1 ? 'not-allowed' : 'pointer';
        }
    }

    next() {
        if (this.currentPage < this.totalPages - 1) {
            this.currentPage++;
            this.updateCarousel();
        }
    }

    prev() {
        if (this.currentPage > 0) {
            this.currentPage--;
            this.updateCarousel();
        }
    }

    goToPage(page) {
        if (page >= 0 && page < this.totalPages) {
            this.currentPage = page;
            this.updateCarousel();
        }
    }

    startAutoRotate() {
        this.autoRotateTimer = setInterval(() => {
            this.currentPage = (this.currentPage + 1) % this.totalPages;
            this.updateCarousel();
        }, this.options.rotateInterval);
    }

    stopAutoRotate() {
        if (this.autoRotateTimer) {
            clearInterval(this.autoRotateTimer);
            this.autoRotateTimer = null;
        }
    }

    destroy() {
        this.stopAutoRotate();
        this.items = [];
    }
}

// Export to window
window.BFCarousel = BFCarousel;
