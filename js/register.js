// js/register.js

document.addEventListener('DOMContentLoaded', function() {
  const registerForm = document.getElementById('registerForm');
  const registerError = document.getElementById('registerError');

  registerForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    registerError.style.display = 'none';
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      window.location.href = '/pages/login.html';
    } catch (err) {
      registerError.textContent = err.message;
      registerError.style.display = 'block';
    }
  });
});
