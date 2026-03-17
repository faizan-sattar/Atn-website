/* ============================================
   IT COMPANY PORTFOLIO - ANIMATIONS JS
   Scroll Animations & Interactive Effects
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

  // ============================================
  // SCROLL REVEAL ANIMATIONS
  // ============================================
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Unobserve after revealing (one-time animation)
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
      revealObserver.observe(element);
    });
  }

  // ============================================
  // STAGGER ANIMATION FOR GROUPS
  // ============================================
  const staggerGroups = document.querySelectorAll('.stagger-group');

  staggerGroups.forEach(group => {
    const children = group.querySelectorAll('.stagger-item');

    const staggerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          children.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('revealed');
            }, index * 100); // 100ms delay between each item
          });
          staggerObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });

    staggerObserver.observe(group);
  });

  // ============================================
  // COUNTER ANIMATION (Stats)
  // ============================================
  const statNumbers = document.querySelectorAll('.stat-number');

  if (statNumbers.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;

          if (!target.classList.contains('counted')) {
            const targetValue = parseInt(target.getAttribute('data-target')) ||
                              parseInt(target.textContent.replace(/\D/g, ''));

            if (targetValue) {
              animateCounter(target, 0, targetValue, 2000);
              target.classList.add('counted');
            }
          }

          counterObserver.unobserve(target);
        }
      });
    }, {
      threshold: 0.5
    });

    statNumbers.forEach(stat => {
      counterObserver.observe(stat);
    });
  }

  function animateCounter(element, start, end, duration) {
    let startTimestamp = null;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(easeOutQuart * (end - start) + start);

      // Preserve original text suffix (like +, %, etc.)
      const originalText = element.textContent;
      const suffix = originalText.match(/[^0-9]+$/)?.[0] || '';

      element.textContent = currentValue + suffix;

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        element.textContent = end + suffix;
      }
    };

    window.requestAnimationFrame(step);
  }

  // ============================================
  // PARALLAX SCROLL EFFECT
  // ============================================
  const parallaxElements = document.querySelectorAll('[data-parallax]');

  if (parallaxElements.length > 0) {
    const handleParallax = throttle(function() {
      const scrolled = window.pageYOffset;

      parallaxElements.forEach(element => {
        const speed = parseFloat(element.getAttribute('data-parallax')) || 0.5;
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + scrolled;

        // Only apply parallax if element is in or near viewport
        if (scrolled + window.innerHeight > elementTop && scrolled < elementTop + rect.height) {
          const yPos = -(scrolled - elementTop) * speed;
          element.style.transform = `translateY(${yPos}px)`;
        }
      });
    }, 10);

    window.addEventListener('scroll', handleParallax);
    handleParallax(); // Initial call
  }

  // ============================================
  // TYPEWRITER EFFECT
  // ============================================
  const typewriterElements = document.querySelectorAll('.typewriter');

  typewriterElements.forEach(element => {
    const text = element.textContent;
    const speed = parseInt(element.getAttribute('data-speed')) || 100;

    element.textContent = '';
    element.style.opacity = '1';

    let i = 0;
    const typeWriter = () => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
      }
    };

    // Start typewriter when element comes into view
    const typeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          typeWriter();
          typeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    typeObserver.observe(element);
  });

  // ============================================
  // PROGRESS BARS ANIMATION
  // ============================================
  const progressBars = document.querySelectorAll('.progress-bar');

  if (progressBars.length > 0) {
    const progressObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const targetWidth = bar.getAttribute('data-progress') || '0';

          setTimeout(() => {
            bar.style.width = targetWidth + '%';
          }, 200);

          progressObserver.unobserve(bar);
        }
      });
    }, { threshold: 0.5 });

    progressBars.forEach(bar => {
      progressObserver.observe(bar);
    });
  }

  // ============================================
  // FADE-IN ON SCROLL
  // ============================================
  const fadeElements = document.querySelectorAll('.fade-in');

  if (fadeElements.length > 0) {
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          fadeObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(element => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      fadeObserver.observe(element);
    });
  }

  // ============================================
  // IMAGE LAZY LOAD WITH FADE-IN
  // ============================================
  const lazyImages = document.querySelectorAll('img[data-src]');

  if (lazyImages.length > 0) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;

          img.style.opacity = '0';
          img.style.transition = 'opacity 0.5s ease-in';

          img.src = img.dataset.src;

          img.onload = () => {
            img.style.opacity = '1';
            img.removeAttribute('data-src');
            img.classList.add('loaded');
          };

          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '100px'
    });

    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });
  }

  // ============================================
  // HOVER TILT EFFECT (Optional)
  // ============================================
  const tiltElements = document.querySelectorAll('.tilt-effect');

  tiltElements.forEach(element => {
    element.addEventListener('mousemove', function(e) {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;

      element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });

    element.addEventListener('mouseleave', function() {
      element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
  });

  // ============================================
  // SMOOTH SCROLL TO SECTION
  // ============================================
  const scrollLinks = document.querySelectorAll('a[href^="#"]');

  scrollLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');

      if (href === '#') return;

      const target = document.querySelector(href);

      if (target) {
        e.preventDefault();

        const headerOffset = 80; // Height of fixed header
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ============================================
  // NUMBER INCREMENT ON HOVER (Optional)
  // ============================================
  const hoverCounters = document.querySelectorAll('.hover-counter');

  hoverCounters.forEach(counter => {
    const originalValue = parseInt(counter.textContent);
    const incrementValue = parseInt(counter.getAttribute('data-increment')) || 1;

    counter.addEventListener('mouseenter', function() {
      const newValue = originalValue + incrementValue;
      animateCounter(this, originalValue, newValue, 300);
    });

    counter.addEventListener('mouseleave', function() {
      animateCounter(this, originalValue + incrementValue, originalValue, 300);
    });
  });

  // ============================================
  // SCROLL PROGRESS BAR (Optional)
  // ============================================
  const scrollProgress = document.querySelector('.scroll-progress');

  if (scrollProgress) {
    window.addEventListener('scroll', throttle(function() {
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (window.pageYOffset / windowHeight) * 100;

      scrollProgress.style.width = scrolled + '%';
    }, 50));
  }

  // ============================================
  // MOUSE CURSOR EFFECT (Optional - Custom Cursor)
  // ============================================
  const customCursor = document.querySelector('.custom-cursor');

  if (customCursor) {
    document.addEventListener('mousemove', function(e) {
      customCursor.style.left = e.clientX + 'px';
      customCursor.style.top = e.clientY + 'px';
    });

    // Add 'active' class on click
    document.addEventListener('mousedown', function() {
      customCursor.classList.add('active');
    });

    document.addEventListener('mouseup', function() {
      customCursor.classList.remove('active');
    });

    // Enlarge cursor on hoverable elements
    const hoverElements = document.querySelectorAll('a, button, .card');
    hoverElements.forEach(element => {
      element.addEventListener('mouseenter', function() {
        customCursor.classList.add('hover');
      });

      element.addEventListener('mouseleave', function() {
        customCursor.classList.remove('hover');
      });
    });
  }

  // ============================================
  // UTILITY: THROTTLE FUNCTION
  // ============================================
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

  // ============================================
  // ANIMATE ON SCROLL (Generic)
  // ============================================
  window.animateOnScroll = function(selector, animationClass = 'animate-fadeInUp') {
    const elements = document.querySelectorAll(selector);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(animationClass);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(element => {
      observer.observe(element);
    });
  };

  // ============================================
  // PAGE TRANSITION EFFECT (Optional)
  // ============================================
  const pageTransition = document.querySelector('.page-transition');

  if (pageTransition) {
    // Fade out page transition on load
    window.addEventListener('load', function() {
      setTimeout(() => {
        pageTransition.style.opacity = '0';
        setTimeout(() => {
          pageTransition.style.display = 'none';
        }, 300);
      }, 200);
    });

    // Add transition on link clicks
    const transitionLinks = document.querySelectorAll('a:not([target="_blank"]):not([href^="#"])');

    transitionLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');

        if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
          e.preventDefault();

          pageTransition.style.display = 'block';
          setTimeout(() => {
            pageTransition.style.opacity = '1';
          }, 10);

          setTimeout(() => {
            window.location.href = href;
          }, 300);
        }
      });
    });
  }

  // ============================================
  // TEXT SPLIT ANIMATION (Optional)
  // ============================================
  window.splitTextAnimation = function(selector) {
    const elements = document.querySelectorAll(selector);

    elements.forEach(element => {
      const text = element.textContent;
      element.textContent = '';

      text.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        span.style.transform = 'translateY(20px)';
        span.style.transition = `all 0.3s ease ${index * 0.03}s`;

        element.appendChild(span);
      });

      // Trigger animation
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const spans = entry.target.querySelectorAll('span');
            spans.forEach(span => {
              span.style.opacity = '1';
              span.style.transform = 'translateY(0)';
            });
            observer.unobserve(entry.target);
          }
        });
      });

      observer.observe(element);
    });
  };

  // ============================================
  // LOG INITIALIZATION
  // ============================================
  console.log('Animations initialized');

});

// ============================================
// REDUCE MOTION PREFERENCE CHECK
// ============================================
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  console.log('Reduced motion preference detected - animations disabled');

  // Disable all animations
  document.documentElement.style.setProperty('--transition-fast', '0ms');
  document.documentElement.style.setProperty('--transition-base', '0ms');
  document.documentElement.style.setProperty('--transition-slow', '0ms');
}
