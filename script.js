const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
if (toggle && nav) toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('.site-nav a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const ANALYTICS_ID = 'G-T6B1G8ELNJ';
const CONSENT_KEY = 'liveitup_analytics_consent';
let analyticsLoaded = false;

function loadAnalytics() {
  if (analyticsLoaded) return;
  analyticsLoaded = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(){ window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', ANALYTICS_ID);
  const tag = document.createElement('script');
  tag.async = true;
  tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + ANALYTICS_ID;
  document.head.appendChild(tag);
}

function createPrivacyBanner() {
  if (document.getElementById('privacy-banner')) return;
  const banner = document.createElement('section');
  banner.id = 'privacy-banner';
  banner.className = 'privacy-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-label', 'Privacy choices');
  banner.innerHTML = '<div class="privacy-banner-copy"><p class="privacy-banner-title">Your privacy choices</p><p>We use optional Google Analytics cookies to understand how visitors use our website. Analytics stays off unless you accept it. Your choice will not affect the website or your ability to submit an inquiry. <a href="privacy.html">Learn more</a>.</p></div><div class="privacy-banner-actions"><button type="button" class="privacy-decline" data-privacy-choice="denied">Decline analytics</button><button type="button" class="button privacy-accept" data-privacy-choice="granted">Accept analytics</button></div>';
  document.body.appendChild(banner);
  banner.querySelectorAll('[data-privacy-choice]').forEach(button => {
    button.addEventListener('click', () => {
      localStorage.setItem(CONSENT_KEY, button.dataset.privacyChoice);
      if (button.dataset.privacyChoice === 'granted') loadAnalytics();
      banner.classList.remove('show');
    });
  });
}

function showPrivacyBanner() {
  createPrivacyBanner();
  document.getElementById('privacy-banner').classList.add('show');
}

let savedConsent = null;
try { savedConsent = localStorage.getItem(CONSENT_KEY); } catch (error) {}
if (savedConsent === 'granted') loadAnalytics();
if (!savedConsent) showPrivacyBanner();

document.querySelectorAll('[data-open-privacy]').forEach(button => {
  button.addEventListener('click', showPrivacyBanner);
});

const inquiryForm = document.getElementById('inquiry-form');
if (inquiryForm) {
  const formEndpoint = 'https://formspree.io/f/mwlpjylz';
  const submitButton = inquiryForm.querySelector('button[type="submit"]');
  const formStatus = document.getElementById('form-status');

  const formError = document.createElement('p');
  formError.setAttribute('role', 'alert');
  formError.style.display = 'none';
  formError.style.color = '#b42318';
  formError.style.marginTop = '18px';
  formError.textContent = 'Something went wrong while sending your inquiry. Please try again or email contact@liveitupeventplanning.com.';
  inquiryForm.appendChild(formError);

  inquiryForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!inquiryForm.reportValidity()) return;
    formError.style.display = 'none';
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';

    const formData = new FormData(inquiryForm);
    formData.append('_subject', 'New Live It Up Event Inquiry');

    try {
      const response = await fetch(formEndpoint, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });
      if (!response.ok) throw new Error('Form submission failed');

      if (typeof window.gtag === 'function') {
        window.gtag('event', 'generate_lead', { method: 'contact_form' });
      }

      inquiryForm.classList.add('submitted');
      formStatus.classList.add('show');
      formStatus.scrollIntoView({ behavior: 'smooth', block: 'center' });
      inquiryForm.reset();
    } catch (error) {
      formError.style.display = 'block';
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  });
}
