/**
 * World-Class JavaScript Implementation
 * Modern patterns, performance optimization, and best practices
 */

(function() {
    'use strict';

    // ============================================
    // Configuration & Constants
    // ============================================
    const CONFIG = {
        animationDelay: 100,
        staggerDelay: 80,
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        performanceMode: 'high' // 'high' | 'balanced' | 'low'
    };

    // ============================================
    // Performance Utilities
    // ============================================
    
    /**
     * RequestAnimationFrame wrapper with fallback
     */
    const raf = window.requestAnimationFrame || 
                window.webkitRequestAnimationFrame || 
                ((callback) => setTimeout(callback, 16));

    /**
     * Throttle function for performance optimization
     */
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Debounce function for event optimization
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // ============================================
    // DOM Utilities
    // ============================================
    
    /**
     * Query selector with error handling
     */
    function $(selector, context = document) {
        try {
            return context.querySelector(selector);
        } catch (e) {
            console.warn('Invalid selector:', selector);
            return null;
        }
    }

    /**
     * Query selector all with error handling
     */
    function $$(selector, context = document) {
        try {
            return Array.from(context.querySelectorAll(selector));
        } catch (e) {
            console.warn('Invalid selector:', selector);
            return [];
        }
    }

    // ============================================
    // Animation Controller
    // ============================================
    
    class AnimationController {
        constructor() {
            this.observers = new Map();
            this.animations = new Set();
        }

        /**
         * Initialize entrance animations with Intersection Observer
         * Enhanced with better performance and smoother animations
         */
        initEntranceAnimations() {
            if (CONFIG.reducedMotion) {
                // Still show cards, just without animation
                const linkCards = $$('.link-card');
                linkCards.forEach(card => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                });
                return;
            }

            const linkCards = $$('.link-card');
            if (!linkCards.length) return;

            // Use Intersection Observer for performance with optimized settings
            const observerOptions = {
                root: null,
                rootMargin: '50px', // Start animation slightly before visible
                threshold: [0, 0.1, 0.25]
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && entry.intersectionRatio > 0) {
                        const index = Array.from(linkCards).indexOf(entry.target);
                        this.animateCard(entry.target, index);
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            linkCards.forEach(card => {
                observer.observe(card);
            });
        }

        /**
         * Animate individual card with enhanced easing
         */
        animateCard(card, index) {
            const delay = CONFIG.reducedMotion ? 0 : index * CONFIG.staggerDelay;
            const duration = 600 + (index * 20); // Slightly longer for later cards
            
            raf(() => {
                card.style.transition = `opacity ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94), 
                                         transform ${duration}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;
                card.style.transitionDelay = `${delay}ms`;
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
                
                // Clean up will-change after animation
                setTimeout(() => {
                    card.style.willChange = 'auto';
                }, delay + duration + 100);
            });
        }

        /**
         * Add hover interaction effects with enhanced performance
         */
        initHoverEffects() {
            const linkCards = $$('.link-card');
            
            linkCards.forEach((card, index) => {
                // Use passive event listeners for better performance
                const handleEnter = throttle(this.handleMouseEnter.bind(this), 16);
                const handleLeave = throttle(this.handleMouseLeave.bind(this), 16);
                
                card.addEventListener('mouseenter', (e) => {
                    handleEnter(e);
                    // Add subtle stagger effect for visual interest
                    if (!CONFIG.reducedMotion && index > 0) {
                        card.style.transitionDelay = `${index * 10}ms`;
                    }
                }, { passive: true });
                
                card.addEventListener('mouseleave', handleLeave, { passive: true });
                
                // Enhanced touch feedback
                card.addEventListener('touchstart', () => {
                    if (!CONFIG.reducedMotion) {
                        card.style.willChange = 'transform';
                    }
                }, { passive: true });
            });
        }

        handleMouseEnter(e) {
            if (CONFIG.reducedMotion) return;
            const card = e.currentTarget;
            // Optimize for hover animations
            raf(() => {
                card.style.willChange = 'transform, box-shadow, filter';
            });
        }

        handleMouseLeave(e) {
            const card = e.currentTarget;
            // Remove will-change after animation for performance
            raf(() => {
                setTimeout(() => {
                    card.style.willChange = 'auto';
                    card.style.transitionDelay = '0ms';
                }, 300);
            });
        }
    }

    // ============================================
    // Analytics & Tracking
    // ============================================
    
    class Analytics {
        constructor() {
            this.trackedLinks = new Set();
        }

        /**
         * Track link clicks (ready for analytics integration)
         */
        trackLinkClick(url, platform) {
            if (this.trackedLinks.has(url)) return;
            
            this.trackedLinks.add(url);
            
            // Performance-optimized logging
            if (CONFIG.performanceMode === 'high') {
                // Use requestIdleCallback for non-critical tracking
                if ('requestIdleCallback' in window) {
                    requestIdleCallback(() => {
                        this.logClick(url, platform);
                    });
                } else {
                    setTimeout(() => this.logClick(url, platform), 0);
                }
            } else {
                this.logClick(url, platform);
            }
        }

        logClick(url, platform) {
            // Ready for integration with analytics services
            // Example: Google Analytics, Mixpanel, etc.
            console.log('Link clicked:', { url, platform, timestamp: Date.now() });
            
            // Example analytics integration:
            // if (typeof gtag !== 'undefined') {
            //     gtag('event', 'click', {
            //         'event_category': 'social_link',
            //         'event_label': platform,
            //         'value': 1
            //     });
            // }
        }
    }

    // ============================================
    // Performance Monitor
    // ============================================
    
    class PerformanceMonitor {
        constructor() {
            this.metrics = {
                loadTime: 0,
                firstPaint: 0,
                interactiveTime: 0
            };
        }

        init() {
            if ('PerformanceObserver' in window) {
                this.observePerformance();
            }
            this.measureLoadTime();
        }

        observePerformance() {
            try {
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.entryType === 'paint') {
                            if (entry.name === 'first-contentful-paint') {
                                this.metrics.firstPaint = entry.startTime;
                            }
                        }
                    }
                });
                observer.observe({ entryTypes: ['paint'] });
            } catch (e) {
                console.warn('Performance Observer not supported');
            }
        }

        measureLoadTime() {
            if ('performance' in window && 'timing' in window.performance) {
                window.addEventListener('load', () => {
                    const timing = window.performance.timing;
                    this.metrics.loadTime = timing.loadEventEnd - timing.navigationStart;
                    
                    if (CONFIG.performanceMode !== 'high') {
                        console.log('Performance metrics:', this.metrics);
                    }
                });
            }
        }
    }

    // ============================================
    // Accessibility Enhancements
    // ============================================
    
    class Accessibility {
        constructor() {
            this.init();
        }

        init() {
            this.enhanceKeyboardNavigation();
            this.detectReducedMotion();
        }

        /**
         * Enhance keyboard navigation
         */
        enhanceKeyboardNavigation() {
            const linkCards = $$('.link-card');
            
            linkCards.forEach(card => {
                card.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        card.click();
                    }
                });
            });
        }

        /**
         * Detect and respect reduced motion preference
         */
        detectReducedMotion() {
            const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
            
            const handleChange = (e) => {
                CONFIG.reducedMotion = e.matches;
                document.documentElement.classList.toggle('reduced-motion', e.matches);
            };
            
            handleChange(mediaQuery);
            mediaQuery.addEventListener('change', handleChange);
        }
    }

    // ============================================
    // Main Application
    // ============================================
    
    class App {
        constructor() {
            this.animationController = new AnimationController();
            this.analytics = new Analytics();
            this.performanceMonitor = new PerformanceMonitor();
            this.accessibility = new Accessibility();
        }

        init() {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.start());
            } else {
                this.start();
            }
        }

        start() {
            // Initialize performance monitoring
            this.performanceMonitor.init();

            // Initialize animations
            this.animationController.initEntranceAnimations();
            this.animationController.initHoverEffects();

            // Initialize link tracking
            this.initLinkTracking();

            // Optimize images and assets (if any)
            this.optimizeAssets();

            // Log initialization
            if (CONFIG.performanceMode !== 'high') {
                console.log('App initialized successfully');
            }
        }

        /**
         * Track link clicks with analytics
         */
        initLinkTracking() {
            const linkCards = $$('.link-card');
            
            linkCards.forEach(card => {
                card.addEventListener('click', (e) => {
                    const url = card.href;
                    const platform = card.querySelector('.link-title')?.textContent || 'Unknown';
                    
                    this.analytics.trackLinkClick(url, platform);
                }, { passive: true });
            });
        }

        /**
         * Optimize assets and lazy load if needed
         */
        optimizeAssets() {
            // Future: Add lazy loading for images if needed
            // Future: Add preload hints for critical resources
        }
    }

    // ============================================
    // Initialize Application
    // ============================================
    
    // Create and start the application
    const app = new App();
    app.init();

    // Expose app globally for debugging (optional)
    if (typeof window !== 'undefined' && CONFIG.performanceMode !== 'high') {
        window.app = app;
    }

})();
