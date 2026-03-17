/* ============================================
   IT COMPANY PORTFOLIO - MAIN JS
   Core Functionality & Utilities
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

  // ============================================
  // LAZY LOADING IMAGES
  // ============================================
  const lazyImages = document.querySelectorAll('img[data-src]');

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px'
  });

  lazyImages.forEach(img => {
    imageObserver.observe(img);
  });

  // ============================================
  // SCROLL TO TOP BUTTON
  // ============================================
  const scrollTopBtn = document.querySelector('.scroll-to-top');

  if (scrollTopBtn) {
    // Show/hide scroll to top button
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    });

    // Scroll to top on click
    scrollTopBtn.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ============================================
  // ANIMATED COUNTERS (Stats Section)
  // ============================================
  const statNumbers = document.querySelectorAll('.stat-number');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const targetValue = parseInt(target.getAttribute('data-target')) || parseInt(target.textContent);

        if (!target.classList.contains('counted')) {
          animateCounter(target, 0, targetValue, 2000);
          target.classList.add('counted');
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

  function animateCounter(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const currentValue = Math.floor(progress * (end - start) + start);

      // Check if the original text has a + or other suffix
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
  // SCROLL REVEAL ANIMATIONS
  // ============================================
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  // ============================================
  // FILTER FUNCTIONALITY (for Portfolio/Blog)
  // ============================================
  const filterButtons = document.querySelectorAll('[data-filter]');
  const filterItems = document.querySelectorAll('[data-category]');

  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter');

      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');

      // Filter items
      filterItems.forEach(item => {
        const category = item.getAttribute('data-category');

        if (filter === 'all' || category === filter) {
          item.style.display = '';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 10);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // ============================================
  // MODAL FUNCTIONALITY
  // ============================================
  const modalTriggers = document.querySelectorAll('[data-modal]');
  const modals = document.querySelectorAll('.modal');
  const modalCloses = document.querySelectorAll('.modal-close');

  // Open modal
  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      const modalId = this.getAttribute('data-modal');
      const modal = document.getElementById(modalId);

      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Close modal on close button click
  modalCloses.forEach(close => {
    close.addEventListener('click', function() {
      const modal = this.closest('.modal');
      closeModal(modal);
    });
  });

  // Close modal on overlay click
  modals.forEach(modal => {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // Close modal on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      modals.forEach(modal => {
        if (modal.classList.contains('active')) {
          closeModal(modal);
        }
      });
    }
  });

  function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // ============================================
  // TOAST NOTIFICATIONS
  // ============================================
  window.showToast = function(message, type = 'success', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    // Auto remove after duration
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(400px)';
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, duration);
  };

  // ============================================
  // ACCORDION FUNCTIONALITY
  // ============================================
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', function() {
      const accordion = this.parentElement;
      const content = accordion.querySelector('.accordion-content');
      const isActive = accordion.classList.contains('active');

      // Close all accordions (optional - remove for multi-open)
      document.querySelectorAll('.accordion').forEach(acc => {
        acc.classList.remove('active');
        acc.querySelector('.accordion-content').style.maxHeight = null;
      });

      // Toggle current accordion
      if (!isActive) {
        accordion.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  // ============================================
  // TABS FUNCTIONALITY
  // ============================================
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const tabGroup = this.closest('.tabs');
      const targetId = this.getAttribute('data-tab');

      // Remove active class from all buttons and panes in this group
      tabGroup.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
      tabGroup.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));

      // Add active class to clicked button and corresponding pane
      this.classList.add('active');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });

  // ============================================
  // COPY TO CLIPBOARD
  // ============================================
  window.copyToClipboard = function(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!', 'success', 2000);
      }).catch(() => {
        showToast('Failed to copy', 'error', 2000);
      });
    } else {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        showToast('Copied to clipboard!', 'success', 2000);
      } catch (err) {
        showToast('Failed to copy', 'error', 2000);
      }
      document.body.removeChild(textarea);
    }
  };

  // ============================================
  // DEBOUNCE UTILITY
  // ============================================
  window.debounce = function(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // ============================================
  // THROTTLE UTILITY
  // ============================================
  window.throttle = function(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  };

  // ============================================
  // DETECT IF ELEMENT IS IN VIEWPORT
  // ============================================
  window.isInViewport = function(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  // ============================================
  // PARALLAX SCROLL EFFECT (Optional Enhancement)
  // ============================================
  const parallaxElements = document.querySelectorAll('[data-parallax]');

  if (parallaxElements.length > 0) {
    const handleParallax = throttle(function() {
      parallaxElements.forEach(element => {
        const speed = element.getAttribute('data-parallax') || 0.5;
        const yPos = -(window.pageYOffset * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    }, 10);

    window.addEventListener('scroll', handleParallax);
  }

  // ============================================
  // LOADING STATE MANAGEMENT
  // ============================================
  window.setLoading = function(element, isLoading) {
    if (isLoading) {
      element.classList.add('loading');
      element.disabled = true;
    } else {
      element.classList.remove('loading');
      element.disabled = false;
    }
  };

  // ============================================
  // LOG INITIALIZATION
  // ============================================
  console.log('%c🚀 Portfolio Website Loaded', 'color: #2563eb; font-size: 16px; font-weight: bold;');
  console.log('%cBuilt with HTML, CSS, and JavaScript', 'color: #64748b; font-size: 12px;');

});

// ============================================
// PRELOADER (Optional - if you add a preloader)
// ============================================
window.addEventListener('load', function() {
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 300);
    }, 500);
  }
});
