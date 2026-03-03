// ============================================
// AR4CHNE Teaser — GSAP Animations
// Includes: Loader, Logo threads, Silk shoot
// ============================================

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initAnimations() {
  const tl = gsap.timeline();

  // =============================================
  // LOADER — Spider web draw-in then fade out
  // =============================================
  tl.to('#loader', {
    opacity: 0,
    duration: 0.6,
    delay: 2.0,
    ease: 'power2.inOut',
    onComplete: () => {
      document.getElementById('loader').style.display = 'none';
    },
  });

  // =============================================
  // HERO — Logo characters stagger in
  // =============================================
  tl.to(
    '.logo-char',
    {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.08,
      ease: 'expo.out',
    },
    '-=0.2'
  );

  // Logo underline
  tl.to(
    '.logo-line',
    {
      width: '100%',
      duration: 1.2,
      ease: 'expo.out',
    },
    '-=0.6'
  );

  // =============================================
  // LOGO THREADS — SVG silk lines drawing in
  // =============================================
  const logoThreads = document.querySelectorAll('.logo-thread');
  if (logoThreads.length > 0) {
    const logoContainer = document.querySelector('.logo-container');
    const logoThreadsSvg = document.querySelector('.logo-threads');
    if (logoContainer && logoThreadsSvg) {
      const rect = logoContainer.getBoundingClientRect();
      const w = rect.width * 1.1;
      const h = rect.height * 1.2;
      logoThreadsSvg.setAttribute('viewBox', `0 0 ${Math.round(w)} ${Math.round(h)}`);

      const paths = generateLogoThreadPaths(w, h);
      logoThreads.forEach((thread, i) => {
        if (paths[i]) {
          thread.setAttribute('d', paths[i]);
        }
      });
    }

    logoThreads.forEach((thread, i) => {
      const length = thread.getTotalLength ? thread.getTotalLength() : 200;
      thread.style.strokeDasharray = length;
      thread.style.strokeDashoffset = length;

      tl.to(
        thread,
        {
          strokeDashoffset: 0,
          opacity: 0.2,
          duration: 0.6 + i * 0.05,
          ease: 'power2.out',
        },
        '-=0.7'
      );
    });
  }

  // Taglines
  tl.to(
    '.tagline',
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
    },
    '-=0.5'
  );

  tl.to(
    '.sub-tagline',
    {
      opacity: 0.6,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
    },
    '-=0.5'
  );

  // Scroll indicator
  tl.to(
    '.scroll-indicator',
    {
      opacity: 0.6,
      duration: 1,
      ease: 'power2.out',
    },
    '-=0.2'
  );

  // =============================================
  // CONCEPT SECTION
  // =============================================
  gsap
    .timeline({
      scrollTrigger: {
        trigger: '#concept',
        start: 'top 75%',
        end: 'center center',
        toggleActions: 'play none none reverse',
      },
    })
    .to('#concept .section-label', {
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out',
    })
    .to(
      '#concept .section-title',
      {
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
      },
      '-=0.3'
    )
    .to(
      '#concept .section-desc',
      {
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
      },
      '-=0.5'
    );

  // =============================================
  // FEATURES SECTION
  // =============================================
  gsap.to('#features .section-label', {
    scrollTrigger: {
      trigger: '#features',
      start: 'top 75%',
      toggleActions: 'play none none reverse',
    },
    opacity: 1,
    duration: 0.6,
    ease: 'power2.out',
  });

  gsap.utils.toArray('.feature-item').forEach((item, i) => {
    gsap
      .timeline({
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      })
      .to(item, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: i * 0.1,
        ease: 'power3.out',
      })
      .to(
        item.querySelector('.feature-line'),
        {
          scaleX: 1,
          duration: 0.8,
          ease: 'expo.out',
        },
        '-=0.4'
      );
  });

  // =============================================
  // COUNTDOWN SECTION
  // =============================================
  gsap
    .timeline({
      scrollTrigger: {
        trigger: '#countdown',
        start: 'top 70%',
        toggleActions: 'play none none reverse',
      },
    })
    .to('#countdown .section-label', {
      opacity: 1,
      duration: 0.6,
    })
    .to(
      '#countdown .section-title',
      {
        opacity: 1,
        duration: 0.8,
      },
      '-=0.3'
    )
    .to(
      '.countdown-display',
      {
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
      },
      '-=0.3'
    )
    .to(
      '.profile-trigger',
      {
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
      },
      '-=0.3'
    );

  // =============================================
  // HERO FADE OUT on scroll
  // =============================================
  gsap.to('.hero-content', {
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom center',
      scrub: 1,
    },
    opacity: 0,
    y: -80,
    ease: 'none',
  });
}

// =============================================
// HELPER — Generate organic thread paths for logo
// =============================================
function generateLogoThreadPaths(w, h) {
  const paths = [];
  const cx = w / 2;
  const cy = h / 2;

  paths.push(`M${w * 0.05},${h * 0.2} Q${cx},${h * 0.05} ${w * 0.95},${h * 0.25}`);
  paths.push(`M${w * 0.1},${h * 0.85} Q${cx},${h * 1.0} ${w * 0.9},${h * 0.8}`);
  paths.push(`M${w * 0.02},${h * 0.1} Q${cx * 0.8},${cy} ${w * 0.98},${h * 0.9}`);
  paths.push(`M${w * 0.98},${h * 0.15} Q${cx * 1.2},${cy} ${w * 0.02},${h * 0.85}`);
  paths.push(`M${w * 0.15},${h * 0.5} Q${cx},${h * 0.3} ${w * 0.85},${h * 0.55}`);

  return paths;
}
