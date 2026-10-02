import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

/**
 * AI PULSE — GSAP ANIMATIONS, LENIS SMOOTH SCROLL & KINETIC TYPOGRAPHY
 */

export function initAnimations() {
  // 1. Initialize Lenis Smooth Scroll
  let lenis;
  try {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  } catch (err) {
    console.warn('Lenis smooth scroll failed to initialize, using native scroll', err);
  }

  // 2. Hero Entrance Timeline
  const heroTL = gsap.timeline({ defaults: { ease: 'power3.out' } });

  heroTL
    .to('.hero-badge-container', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: 0.2
    })
    .from('.hero-title-line', {
      y: 100,
      opacity: 0,
      skewY: 5,
      stagger: 0.15,
      duration: 1.2,
      ease: 'expo.out'
    }, '-=0.5')
    .to('.hero-description', {
      opacity: 1,
      y: 0,
      duration: 0.9
    }, '-=0.6')
    .to('.hero-cta-group', {
      opacity: 1,
      y: 0,
      duration: 0.8
    }, '-=0.6')
    .to('.visualizer-quickbar', {
      opacity: 1,
      y: 0,
      duration: 0.8
    }, '-=0.6');

  // 3. Header background transition on scroll
  const siteHeader = document.getElementById('site-header');
  if (siteHeader) {
    ScrollTrigger.create({
      start: 'top -50',
      end: 99999,
      toggleClass: { className: 'scrolled', targets: siteHeader }
    });
  }

  // 4. Parallax Multilayer System (5 Distinct Speed Layers)
  // Layer 1: Background grid subtle movement
  gsap.to('.cyber-grid-overlay', {
    yPercent: 20,
    ease: 'none',
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1
    }
  });

  // Layer 2: Featured cards depth parallax
  gsap.utils.toArray('.featured-card').forEach((card, idx) => {
    const speed = (idx + 1) * 20;
    gsap.fromTo(card, 
      { y: speed }, 
      {
        y: -speed,
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2
        }
      }
    );
  });

  // Layer 3: Section Headers floating depth
  gsap.utils.toArray('.section-header').forEach((header) => {
    gsap.from(header, {
      y: 40,
      opacity: 0,
      duration: 1.0,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: header,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

  // Layer 4: Stats section counters count-up animation
  initStatsCounter();

  // Layer 5: Newsletter Card Glow Pulse
  gsap.from('.newsletter-card', {
    scale: 0.94,
    opacity: 0,
    duration: 1.2,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.newsletter-section',
      start: 'top 80%',
      toggleActions: 'play none none none'
    }
  });

  return lenis;
}

/**
 * Animated Stats Number Counter
 */
function initStatsCounter() {
  const statBoxes = document.querySelectorAll('.stat-box');
  if (!statBoxes.length) return;

  ScrollTrigger.create({
    trigger: '.stats-section',
    start: 'top 80%',
    once: true,
    onEnter: () => {
      statBoxes.forEach((box, i) => {
        gsap.from(box, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          delay: i * 0.15,
          ease: 'back.out(1.5)'
        });
      });

      // Animate numerical values
      animateValue('stat-1', 0, 2800, 1800, '+');
      animateValue('stat-3', 0, 450, 1500, '+');
    }
  });
}

function animateValue(id, start, end, duration, suffix = '') {
  const el = document.getElementById(id);
  if (!el) return;

  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3); // cubic out
    const current = Math.floor(easeProgress * (end - start) + start);
    el.textContent = `${current.toLocaleString()}${suffix}`;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

/**
 * Stagger animation for news grid cards when reloaded or filtered
 */
export function animateNewsCards() {
  gsap.fromTo('.news-card', 
    { opacity: 0, y: 30, scale: 0.96 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      stagger: 0.08,
      ease: 'power2.out'
    }
  );
}
