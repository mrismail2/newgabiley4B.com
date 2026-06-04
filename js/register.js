document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('registerForm')?.addEventListener('submit', handleRegisterSubmit);
  if (typeof lucide !== 'undefined') lucide.createIcons();
});

async function handleRegisterSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('[type="submit"]');
  const msg = document.getElementById('registerMsg');

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
    if (msg) { msg.className = 'alert alert-success'; msg.textContent = '✓ Request submitted! Check your email for next steps.'; }
  } catch (err) {
    if (msg) { msg.className = 'alert alert-error'; msg.textContent = 'Submission failed. Please try again.'; }
  } finally {
    hideLoading(btn);
  }
}
