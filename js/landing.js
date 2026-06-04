document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav toggle
  document.querySelector('.navbar-toggle')?.addEventListener('click', () => {
    document.querySelector('.mobile-menu')?.classList.toggle('open');
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  // Sticky nav shadow on scroll
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (navbar) navbar.style.boxShadow = window.scrollY > 10 ? '0 4px 24px rgba(0,0,0,0.18)' : 'none';
  });

  // Trial request form
  document.getElementById('trialForm')?.addEventListener('submit', handleTrialSubmit);

  if (typeof lucide !== 'undefined') lucide.createIcons();
});

async function handleTrialSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('[type="submit"]');
  const msg = document.getElementById('trialMsg');

  const data = {
    school_name:   form.school_name?.value?.trim(),
    school_type:   form.school_type?.value,
    student_count: form.student_count?.value,
    contact_name:  form.contact_name?.value?.trim(),
    email:         form.email?.value?.trim(),
    phone:         form.phone?.value?.trim(),
    plan:          form.plan?.value,
    status:        'pending',
  };

  if (!data.school_name || !data.email || !data.contact_name) {
    if (msg) { msg.className = 'alert alert-error'; msg.textContent = 'Please fill in all required fields.'; }
    return;
  }
  if (!validateEmail(data.email)) {
    if (msg) { msg.className = 'alert alert-error'; msg.textContent = 'Please enter a valid email address.'; }
    return;
  }

  showLoading(btn, 'Submitting...');
  if (msg) msg.className = 'hidden';

  try {
    const db = getSupabase();
    if (db) {
      const { error } = await db.from('trial_requests').insert([data]);
      if (error) throw error;
    }
    form.reset();
    if (msg) { msg.className = 'alert alert-success'; msg.textContent = '✓ Trial request submitted! We will contact you within 24 hours.'; }
  } catch (err) {
    console.error('Trial submit error:', err);
    if (msg) { msg.className = 'alert alert-error'; msg.textContent = 'Submission failed. Please try again or email us directly.'; }
  } finally {
    hideLoading(btn);
  }
}
