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
  inquiryForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!inquiryForm.reportValidity()) return;
    inquiryForm.classList.add('submitted');
    document.getElementById('form-status').classList.add('show');
    document.getElementById('form-status').scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}