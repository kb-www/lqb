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
});