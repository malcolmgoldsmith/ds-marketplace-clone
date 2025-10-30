# Black Friday Sale Section - Requirement Capture

**Date:** 2025-10-21
**Feature:** Black Friday countdown timer and sales section
**Status:** Requirements Gathering

---

## Requirements Summary

### Core Requirements
1. **Countdown Timer**: 1 minute initial countdown to sale going live
2. **Display Format**: Days, Hours, Minutes, Seconds
3. **End State**: Show "Sale Live" when countdown reaches zero
4. **Featured Products**: Highlight specific products from existing marketplace
5. **Promotional Banner**: Standalone Black Friday promotional banner
6. **No Pricing Changes**: No special badges or pricing modifications needed

---

## Version 1: Minimal - Homepage Banner with Countdown

### Description
Simple Black Friday countdown banner that appears above the product grid on the homepage. Minimalist design with countdown timer and "View Deals" CTA.

### Placement
- **Location**: Top of main product section (above existing cards)
- **Type**: Inline banner component
- **Pages**: Homepage only

### Components
1. **Banner Container**
   - Full-width promotional banner
   - Dark gradient background (black to purple)
   - 120px height on desktop, 160px on mobile

2. **Countdown Timer**
   - Center-aligned digit display
   - Format: `DD : HH : MM : SS`
   - White text on dark background
   - Font: Lato, 48px bold for numbers
   - Labels below each unit (Days, Hours, Minutes, Seconds)

3. **Messaging**
   - "Black Friday Sale" headline (32px, white)
   - Subtitle: "Incredible deals starting soon!" (16px)
   - When countdown ends: Replace with "SALE LIVE NOW!" (animated pulse)

4. **CTA Button**
   - "View Deals" button (scrolls to product cards)
   - Blue primary button matching design system
   - 160px × 48px

### Technical Implementation
```javascript
// Countdown logic
const saleStartTime = new Date(Date.now() + 60000); // 1 minute from now
const countdown = setInterval(() => {
  const now = new Date();
  const diff = saleStartTime - now;

  if (diff <= 0) {
    clearInterval(countdown);
    showSaleLive();
  } else {
    updateTimerDisplay(diff);
  }
}, 1000);
```

### Featured Products
- No specific product highlighting in Version 1
- CTA scrolls to existing product grid

### Files to Create/Modify
- `app/index.html` - Add banner HTML above product grid
- `app/styles.css` - Add banner and countdown styles
- `app/countdown.js` - Timer logic (new file)

### Effort Estimate
- **Time**: 2-3 hours
- **Complexity**: Low
- **Files**: 3 modified/created

---

## Version 2: Standard - Full Black Friday Section on Homepage

### Description
Comprehensive Black Friday section with promotional hero banner, countdown timer, and featured product carousel. Displays 4 handpicked deals below the countdown.

### Placement
- **Location**: Dedicated section on homepage between breadcrumbs and main product grid
- **Type**: Full-width section with multiple components
- **Pages**: Homepage only

### Components

#### 1. Hero Banner
- **Size**: 1440px × 300px (full viewport width)
- **Background**: Animated gradient (purple #5d2661 → red #c8102e)
- **Content**:
  - "BLACK FRIDAY" large text (72px, white, bold)
  - "Up to 70% OFF on Premium Software" (24px, white)
  - Black Friday logo/badge (positioned top-right)

#### 2. Countdown Timer
- **Style**: Card-based timer with 4 separated boxes
- **Layout**: Flexbox horizontal layout, centered
- **Each Unit Box**:
  - 100px × 100px white card
  - 2px border, 8px border-radius
  - Number: 64px bold, dark gray (#333)
  - Label: 14px, light gray below number
- **Spacing**: 24px gap between boxes
- **Animation**: Flip animation on number change

#### 3. Featured Products Grid
- **Title**: "Featured Black Friday Deals" (32px, centered)
- **Layout**: 4-column grid (352px cards, 27px gap)
- **Products to Feature**:
  1. Microsoft 365 (existing card)
  2. Norton (existing card)
  3. McAfee (existing card)
  4. Dropbox (existing card)
- **Enhancements**:
  - Add "BLACK FRIDAY DEAL" badge (top-left corner, red background)
  - Subtle glow effect on hover
  - No price changes, just visual enhancement

#### 4. Promotional Banner (Bottom)
- **Size**: 1440px × 120px
- **Background**: Black
- **Content**:
  - Left: "Limited Time Offer" icon + text
  - Center: "Don't miss out on exclusive Black Friday deals!"
  - Right: "Shop Now" button (white text, transparent border)

### Technical Implementation
```javascript
// Countdown with flip animation
class CountdownTimer {
  constructor(targetDate) {
    this.targetDate = targetDate;
    this.elements = {
      days: document.getElementById('days'),
      hours: document.getElementById('hours'),
      minutes: document.getElementById('minutes'),
      seconds: document.getElementById('seconds')
    };
  }

  start() {
    this.interval = setInterval(() => {
      const diff = this.targetDate - Date.now();

      if (diff <= 0) {
        this.handleSaleLive();
      } else {
        this.updateDisplay(diff);
      }
    }, 1000);
  }

  updateDisplay(diff) {
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    this.animateChange(this.elements.days, days);
    this.animateChange(this.elements.hours, hours);
    this.animateChange(this.elements.minutes, minutes);
    this.animateChange(this.elements.seconds, seconds);
  }

  animateChange(element, newValue) {
    if (element.textContent !== String(newValue).padStart(2, '0')) {
      element.classList.add('flip');
      setTimeout(() => {
        element.textContent = String(newValue).padStart(2, '0');
        element.classList.remove('flip');
      }, 300);
    }
  }

  handleSaleLive() {
    clearInterval(this.interval);
    document.querySelector('.countdown-section').innerHTML =
      '<h1 class="sale-live">🔥 SALE LIVE NOW! 🔥</h1>';
  }
}

// Initialize
const saleStart = new Date(Date.now() + 60000); // 1 minute from now
const timer = new CountdownTimer(saleStart);
timer.start();
```

### CSS Animations
```css
@keyframes flip {
  0% { transform: rotateX(0deg); }
  50% { transform: rotateX(90deg); }
  100% { transform: rotateX(0deg); }
}

.flip {
  animation: flip 0.6s ease;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.sale-live {
  animation: pulse 1s infinite;
}
```

### Files to Create/Modify
- `app/black-friday-section.html` - Section HTML
- `app/countdown-timer.js` - Timer class (new)
- `app/black-friday.css` - All Black Friday styles (new)
- `app/index.html` - Insert section after breadcrumbs

### Effort Estimate
- **Time**: 5-7 hours
- **Complexity**: Medium
- **Files**: 4 modified/created

---

## Version 3: Deluxe - Dedicated Black Friday Page with Full Experience

### Description
Complete Black Friday experience on a dedicated page (`/black-friday.html`) with animated hero section, countdown timer, featured deals carousel, category-based deals, and promotional content. Accessible via prominent navigation link.

### Placement
- **Location**: Dedicated page (`/app/black-friday.html`)
- **Type**: Full standalone page
- **Navigation**: Add "Black Friday 🔥" link to main header

### Components

#### 1. Animated Hero Section
- **Size**: Full viewport height (100vh)
- **Background**:
  - Video background or animated gradient
  - Purple to red gradient with floating particles effect
  - Overlay: rgba(0, 0, 0, 0.3) for text contrast
- **Content (Centered)**:
  - Animated "BLACK FRIDAY" text (96px, slide-in from top)
  - "The Biggest Software Sale of the Year" (32px, fade-in)
  - Countdown timer (large format, see below)
  - "Explore Deals" CTA button (bounce animation, scroll to products)

#### 2. Premium Countdown Timer
- **Style**: 3D card design with shadows
- **Layout**: Centered, 4 units in a row
- **Each Unit**:
  - 140px × 140px card
  - White background
  - 4px border-radius
  - Box shadow: 0 8px 16px rgba(0,0,0,0.2)
  - Number: 80px, bold, gradient text (purple to red)
  - Label: 16px, uppercase, letter-spacing: 2px
  - Separator: ":" between units (48px, white)
- **Animations**:
  - Flip animation on digit change
  - Glow pulse on last 10 seconds
  - Confetti explosion when reaching zero

#### 3. Featured Deals Hero Carousel
- **Title**: "LIGHTNING DEALS" (48px, centered, animated underline)
- **Layout**: Full-width carousel/slider
- **Slides**: 3 featured product groupings
  - **Slide 1**: Productivity Pack (Microsoft 365 + Dropbox)
  - **Slide 2**: Security Suite (Norton + McAfee)
  - **Slide 3**: Creative Tools (CyberLink + others)
- **Card Design**:
  - Large format: 600px × 400px per slide
  - Product image background with gradient overlay
  - "BLACK FRIDAY EXCLUSIVE" badge
  - Animated on hover (scale + shadow)
- **Controls**: Arrow navigation + dot indicators

#### 4. Categorized Deals Grid
- **Section Title**: "Shop by Category" (40px)
- **Categories**:
  1. **Productivity** (3 products: Microsoft, Dropbox, Special Offers)
  2. **Security** (3 products: Norton, McAfee, others)
  3. **Creative** (3 products: CyberLink, others)
- **Grid Layout**: 3 columns per category
- **Card Enhancements**:
  - Corner ribbon: "BLACK FRIDAY"
  - Hover effect: lift + glow
  - "Quick View" overlay on hover

#### 5. Promotional Content Sections

##### a) Limited Time Banner (Sticky Top)
- **Style**: Sticky banner at top of page
- **Content**: "⏰ Sale ends in [countdown] - Shop Now!"
- **Background**: Red (#c8102e)
- **Height**: 48px
- **Dismissible**: Yes (X button on right)

##### b) Deal of the Hour Section
- **Layout**: Single large card, centered
- **Content**: Rotates featured product every hour
- **Style**:
  - 800px × 500px
  - White background with red accent border
  - Large product image + description
  - "Deal of the Hour" badge with clock icon
  - Progress bar showing time remaining

##### c) Why Shop Black Friday Section
- **Layout**: 4-column grid
- **Content**:
  1. "🎯 Up to 70% Off" - Best prices of the year
  2. "✓ Trusted Brands" - Microsoft, Norton, McAfee
  3. "🚀 Instant Access" - Digital delivery
  4. "💝 Perfect Gifts" - Give the gift of productivity
- **Style**: Icon + title + description cards

#### 6. Footer CTA Section
- **Background**: Dark gradient (matching hero)
- **Content**:
  - "Don't Wait - Limited Stock Available!"
  - Countdown timer (compact version)
  - "Back to Top" + "View All Deals" buttons

### Technical Implementation

#### Countdown Timer (Enhanced)
```javascript
class DeluxeCountdownTimer {
  constructor(targetDate, options = {}) {
    this.targetDate = targetDate;
    this.onComplete = options.onComplete || this.defaultOnComplete;
    this.playSound = options.playSound || false;
    this.confetti = options.confetti || false;

    this.elements = {
      days: document.querySelector('[data-countdown="days"]'),
      hours: document.querySelector('[data-countdown="hours"]'),
      minutes: document.querySelector('[data-countdown="minutes"]'),
      seconds: document.querySelector('[data-countdown="seconds"]')
    };

    this.lastValues = { days: -1, hours: -1, minutes: -1, seconds: -1 };
  }

  start() {
    this.update(); // Initial update
    this.interval = setInterval(() => this.update(), 1000);
  }

  update() {
    const now = Date.now();
    const diff = this.targetDate - now;

    if (diff <= 0) {
      this.complete();
      return;
    }

    const time = this.calculateTime(diff);
    this.updateDisplay(time);

    // Warning animations for last 10 seconds
    if (diff <= 10000) {
      this.addWarningState();
    }
  }

  calculateTime(diff) {
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000)
    };
  }

  updateDisplay(time) {
    Object.keys(time).forEach(unit => {
      if (this.lastValues[unit] !== time[unit]) {
        this.animateDigitChange(this.elements[unit], time[unit]);
        this.lastValues[unit] = time[unit];
      }
    });
  }

  animateDigitChange(element, newValue) {
    const formatted = String(newValue).padStart(2, '0');

    // Create flip animation
    element.classList.add('flipping');

    setTimeout(() => {
      element.querySelector('.digit-top').textContent = formatted;
      element.querySelector('.digit-bottom').textContent = formatted;
    }, 300);

    setTimeout(() => {
      element.classList.remove('flipping');
    }, 600);
  }

  addWarningState() {
    document.querySelector('.countdown-timer').classList.add('warning');
  }

  complete() {
    clearInterval(this.interval);

    if (this.confetti) {
      this.launchConfetti();
    }

    this.onComplete();
  }

  defaultOnComplete() {
    const container = document.querySelector('.countdown-section');
    container.innerHTML = `
      <div class="sale-live-banner">
        <h1 class="sale-live-title">
          🔥 SALE IS LIVE NOW! 🔥
        </h1>
        <p class="sale-live-subtitle">Get your exclusive Black Friday deals before they're gone!</p>
        <button class="cta-button pulse" onclick="scrollToDeals()">
          Shop Now
        </button>
      </div>
    `;
  }

  launchConfetti() {
    // Confetti animation (using canvas or library like canvas-confetti)
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 200,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  const saleStartTime = new Date(Date.now() + 60000); // 1 minute from now

  const mainTimer = new DeluxeCountdownTimer(saleStartTime, {
    confetti: true,
    playSound: false,
    onComplete: () => {
      // Custom completion behavior
      showSaleLiveNotification();
      enableAllDeals();
    }
  });

  mainTimer.start();
});
```

#### Carousel Component
```javascript
class DealsCarousel {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    this.slides = this.container.querySelectorAll('.carousel-slide');
    this.currentSlide = 0;
    this.autoPlayInterval = null;
  }

  init() {
    this.createControls();
    this.createIndicators();
    this.autoPlay();
  }

  createControls() {
    const prevBtn = document.createElement('button');
    prevBtn.className = 'carousel-control prev';
    prevBtn.innerHTML = '‹';
    prevBtn.addEventListener('click', () => this.prev());

    const nextBtn = document.createElement('button');
    nextBtn.className = 'carousel-control next';
    nextBtn.innerHTML = '›';
    nextBtn.addEventListener('click', () => this.next());

    this.container.appendChild(prevBtn);
    this.container.appendChild(nextBtn);
  }

  createIndicators() {
    const indicators = document.createElement('div');
    indicators.className = 'carousel-indicators';

    this.slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = 'indicator-dot';
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => this.goToSlide(index));
      indicators.appendChild(dot);
    });

    this.container.appendChild(indicators);
  }

  goToSlide(index) {
    this.slides[this.currentSlide].classList.remove('active');
    this.currentSlide = index;
    this.slides[this.currentSlide].classList.add('active');
    this.updateIndicators();
  }

  next() {
    this.goToSlide((this.currentSlide + 1) % this.slides.length);
  }

  prev() {
    this.goToSlide((this.currentSlide - 1 + this.slides.length) % this.slides.length);
  }

  updateIndicators() {
    const dots = this.container.querySelectorAll('.indicator-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentSlide);
    });
  }

  autoPlay() {
    this.autoPlayInterval = setInterval(() => this.next(), 5000);
  }

  stop() {
    clearInterval(this.autoPlayInterval);
  }
}
```

### Files to Create/Modify
- `app/black-friday.html` - Main Black Friday page (new)
- `app/js/countdown-timer-deluxe.js` - Enhanced timer class (new)
- `app/js/deals-carousel.js` - Carousel component (new)
- `app/js/confetti.min.js` - Confetti library (external)
- `app/css/black-friday.css` - All Black Friday styles (new)
- `app/css/animations.css` - Animation keyframes (new)
- `app/index.html` - Add header navigation link

### Effort Estimate
- **Time**: 12-16 hours
- **Complexity**: High
- **Files**: 7 modified/created

---

## Comparison Matrix

| Feature | Version 1 (Minimal) | Version 2 (Standard) | Version 3 (Deluxe) |
|---------|-------------------|---------------------|-------------------|
| **Placement** | Homepage banner | Homepage section | Dedicated page |
| **Countdown Timer** | Simple text display | Card-based with flip | 3D cards with effects |
| **Hero Banner** | ❌ | Gradient banner | Animated full-height hero |
| **Featured Products** | ❌ (scroll to main) | 4-card grid | Carousel + categories |
| **Promotional Banners** | ❌ | 1 bottom banner | Multiple (sticky, rotating) |
| **Animations** | None | Flip, pulse | Flip, confetti, particle effects |
| **Navigation** | ❌ | ❌ | Header link added |
| **Sale Live State** | Text replacement | Animated text | Full banner + confetti |
| **Effort** | 2-3 hours | 5-7 hours | 12-16 hours |
| **Files** | 3 | 4 | 7 |

---

## Recommendation

**For Quick Implementation**: Choose **Version 2 (Standard)**
- Balances features and development time
- Provides full countdown experience
- Featured products get Black Friday treatment
- Professional promotional banners
- Can be completed in 1 day

**For Maximum Impact**: Choose **Version 3 (Deluxe)**
- Complete Black Friday destination
- Best user experience with animations
- Dedicated page allows for more content
- Impressive visual effects
- Worth the 2-day investment for major sale event

**For Fastest Deploy**: Choose **Version 1 (Minimal)**
- Can be live in 2-3 hours
- Simple but effective
- Good for testing before full rollout

---

## Next Steps

1. **Choose Version**: Select which version to implement
2. **Set Sale Date**: Confirm exact Black Friday start date/time
3. **Review Designs**: I can create mockups for chosen version
4. **Begin Development**: Start with countdown timer component
5. **Test**: Verify countdown logic and animations
6. **Deploy**: Launch before Black Friday sale

**Ready to proceed? Which version would you like me to build?**
