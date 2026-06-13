document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  document.getElementById('year').textContent = new Date().getFullYear();

  // Mobile Menu
  const menuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = menuButton.querySelector('i');
  menuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    menuIcon.setAttribute('data-lucide', mobileMenu.classList.contains('hidden') ? 'menu' : 'x');
    lucide.createIcons();
  });
  mobileMenu.querySelectorAll('a, button').forEach(link => {
      link.addEventListener('click', () => {
          mobileMenu.classList.add('hidden');
          menuIcon.setAttribute('data-lucide', 'menu');
          lucide.createIcons();
      });
  });

  // Animate sections on scroll
  const fadeSections = document.querySelectorAll('.fade-in-section');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
  }, { threshold: 0.1 });
  fadeSections.forEach(section => sectionObserver.observe(section));



  // Sticky FAB Logic
  const fabButton = document.getElementById('fab-booking-button');
  const heroSection = document.getElementById('hero');
  const fabObserver = new IntersectionObserver(([entry]) => { fabButton.classList.toggle('hidden', entry.isIntersecting); }, { threshold: 0.1 });
  if (heroSection) fabObserver.observe(heroSection);

  // Relocation Modal Logic
  const relocationModal = document.getElementById('relocation-modal');
  const closeRelocationModal = document.getElementById('close-relocation-modal');
  const closeRelocationModalBtn = document.getElementById('close-relocation-modal-btn');
  
  if (relocationModal) {
    const relocationDismissed = localStorage.getItem('lqb_relocation_dismissed');
    if (!relocationDismissed) {
      setTimeout(() => {
        relocationModal.classList.remove('hidden');
      }, 800); // Open after a slight delay
    }
    
    // Function to dismiss modal and save setting
    const dismissRelocation = () => {
      relocationModal.classList.add('hidden');
      localStorage.setItem('lqb_relocation_dismissed', 'true');
    };

    if (closeRelocationModal) {
      closeRelocationModal.addEventListener('click', dismissRelocation);
    }
    if (closeRelocationModalBtn) {
      closeRelocationModalBtn.addEventListener('click', dismissRelocation);
    }

    // Tap on the backdrop to close
    const relocationScroll = document.getElementById('relocation-modal-scroll');
    if (relocationScroll) {
      relocationScroll.addEventListener('click', (e) => {
        if (e.target === relocationScroll) {
          dismissRelocation();
        }
      });
    }
    // Manual trigger button (e.g., from header notice banner)
    const openRelocationButtons = document.querySelectorAll('.js-open-relocation-modal');
    openRelocationButtons.forEach(btn => btn.addEventListener('click', () => {
      relocationModal.classList.remove('hidden');
    }));
  }

  // Cookie Consent Logic
  const cookieBanner = document.getElementById('cookie-consent-banner');
  const acceptCookiesButton = document.getElementById('accept-cookies');
  const declineCookiesButton = document.getElementById('decline-cookies');

  function handleCookieChoice(consent) {
    localStorage.setItem('cookie_consent_given', consent);
    cookieBanner.classList.add('translate-y-full');
    if (consent === 'true') {
      initializeGoogleAnalytics();
    }
  }

  const savedConsent = localStorage.getItem('cookie_consent_given');
  if (savedConsent === 'true') {
    initializeGoogleAnalytics();
  } else if (!savedConsent) {
    setTimeout(() => cookieBanner.classList.remove('translate-y-full'), 2000);
  }
  
  acceptCookiesButton.addEventListener('click', () => handleCookieChoice('true'));
  declineCookiesButton.addEventListener('click', () => handleCookieChoice('false'));

  // GA4: booking outbound links (modal, footer, etc.) — only fires when gtag is loaded (cookie consent)
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href*="book.lesliequigleybeauty.ie"]');
    if (!a || typeof window.trackBookOnlineClick !== 'function') return;
    let source = a.getAttribute('data-ga-location');
    if (!source) {
      if (a.closest('#booking-modal')) source = 'modal';
      else if (a.closest('footer')) source = 'footer';
      else if (a.closest('header')) source = 'header';
      else source = 'other';
    }
    window.trackBookOnlineClick(source, a.href);
  }, true);

  // Gallery Lightbox Logic
  const lightbox = document.getElementById('gallery-lightbox');
  if (lightbox) {
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxCounter = document.getElementById('lightbox-counter');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');
    
    const galleryImgs = Array.from(document.querySelectorAll('#gallery .grid img'));
    let currentIndex = 0;
    
    function showImage(index) {
      if (index < 0) index = galleryImgs.length - 1;
      if (index >= galleryImgs.length) index = 0;
      currentIndex = index;
      
      const img = galleryImgs[currentIndex];
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCaption.textContent = img.alt;
      lightboxCounter.textContent = `${currentIndex + 1} / ${galleryImgs.length}`;
    }
    
    function openLightbox(index) {
      showImage(index);
      lightbox.classList.remove('hidden');
      // Force repaint to make opacity transition work
      lightbox.offsetHeight;
      lightbox.classList.add('opacity-100');
      document.body.classList.add('lightbox-open');
    }
    
    function closeLightbox() {
      lightbox.classList.remove('opacity-100');
      // Wait for opacity transition to finish
      setTimeout(() => {
        lightbox.classList.add('hidden');
        document.body.classList.remove('lightbox-open');
      }, 300);
    }
    
    galleryImgs.forEach((img, index) => {
      img.addEventListener('click', () => {
        openLightbox(index);
      });
    });
    
    closeBtn.addEventListener('click', closeLightbox);
    
    // Click outside to close (backdrop)
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target === lightboxImg.parentElement || e.target === lightboxImg.parentElement.parentElement) {
        closeLightbox();
      }
    });
    
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showImage(currentIndex - 1);
    });
    
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showImage(currentIndex + 1);
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (lightbox.classList.contains('hidden')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
      if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    });
    
    // Mobile Touch/Swipe Gestures
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;
    
    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    
    lightbox.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
      const swipeDistanceX = touchEndX - touchStartX;
      const swipeDistanceY = touchEndY - touchStartY;
      
      // Horizontal swipe to navigate
      if (Math.abs(swipeDistanceX) > 50 && Math.abs(swipeDistanceX) > Math.abs(swipeDistanceY)) {
        if (swipeDistanceX > 0) {
          // Swipe right -> prev image
          showImage(currentIndex - 1);
        } else {
          // Swipe left -> next image
          showImage(currentIndex + 1);
        }
      }
      // Vertical swipe down to close
      else if (Math.abs(swipeDistanceY) > 80 && Math.abs(swipeDistanceY) > Math.abs(swipeDistanceX)) {
        if (swipeDistanceY > 0) {
          // Swipe down -> close
          closeLightbox();
        }
      }
    }
  }
});