const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
if (toggle && nav) toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('.site-nav a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

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

      if (typeof gtag === 'function') {
        gtag('event', 'generate_lead', {
          method: 'contact_form'
        });
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