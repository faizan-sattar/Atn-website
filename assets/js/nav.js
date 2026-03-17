/* ============================================
   IT COMPANY PORTFOLIO - NAVIGATION JS
   Mobile Menu & Navigation Functionality
   ============================================ */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {

  // ============================================
  // MOBILE MENU TOGGLE
  // ============================================
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileOverlay = document.querySelector('.mobile-overlay');
  const body = document.body;

  // Toggle mobile menu
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', function() {
      toggleMobileMenu();
    });
  }

  // Close menu when overlay is clicked
  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', function() {
      closeMobileMenu();
    });
  }

  // Close menu when a nav link is clicked
  const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', function() {
      closeMobileMenu();
    });
  });

  function toggleMobileMenu() {
    mobileMenuToggle.classList.toggle('active');
    mobileNav.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
    body.style.overflow = body.style.overflow === 'hidden' ? '' : 'hidden';
  }

  function closeMobileMenu() {
    mobileMenuToggle.classList.remove('active');
    mobileNav.classList.remove('active');
    mobileOverlay.classList.remove('active');
    body.style.overflow = '';
  }

  // Close mobile menu on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
      closeMobileMenu();
    }
  });

  // ============================================
  // STICKY HEADER ON SCROLL
  // ============================================
  const header = document.querySelector('.site-header');
  let lastScrollTop = 0;

  window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Add 'scrolled' class when scrolling down
    if (scrollTop > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScrollTop = scrollTop;
  });

  // ============================================
  // ACTIVE PAGE HIGHLIGHTING
  // ============================================
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-menu a, .mobile-nav a');

  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');

    // Check if this link matches the current page
    if (linkHref === currentPage ||
        (currentPage === '' && linkHref === 'index.html') ||
        (currentPage === '/' && linkHref === 'index.html')) {
      link.classList.add('active');
    }

    // Also handle case where we're on index and link is to home
    if ((currentPage === 'index.html' || currentPage === '' || currentPage === '/') &&
        (linkHref === 'index.html' || linkHref === '/' || linkHref === '')) {
      link.classList.add('active');
    }
  });

  // ============================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');

      // Skip if href is just "#" (no target)
      if (href === '#') return;

      const target = document.querySelector(href);

      if (target) {
        e.preventDefault();

        // Close mobile menu if open
        if (mobileNav.classList.contains('active')) {
          closeMobileMenu();
        }

        // Calculate header height for offset
        const headerHeight = header.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ============================================
  // SHOW DESKTOP MENU ON LARGER SCREENS
  // ============================================
  function handleResize() {
    const navMenu = document.querySelector('.nav-menu');

    if (window.innerWidth >= 1024) {
      // Desktop view
      if (navMenu) {
        navMenu.classList.add('active');
      }
      // Close mobile menu if it's open
      if (mobileNav && mobileNav.classList.contains('active')) {
        closeMobileMenu();
      }
    } else {
      // Mobile view
      if (navMenu) {
        navMenu.classList.remove('active');
      }
    }
  }

  // Initial check
  handleResize();

  // Listen for window resize
  window.addEventListener('resize', handleResize);

  // ============================================
  // PREVENT BODY SCROLL WHEN MODAL IS OPEN
  // ============================================
  // This is a utility function that can be used by other scripts
  window.lockScroll = function() {
    body.style.overflow = 'hidden';
  };

  window.unlockScroll = function() {
    body.style.overflow = '';
  };

});
