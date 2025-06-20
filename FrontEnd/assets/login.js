document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const errorMsg = document.getElementById('login-error');
  errorMsg.style.display = 'none';  // Masquer l'erreur avant de tester

  try {
    const response = await fetch('http://localhost:5678/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.token);
      window.location.href = 'index.html';
    } else {
      errorMsg.style.display = 'block';
    }
  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
    errorMsg.textContent = 'Une erreur est survenue. Veuillez réessayer.';
    errorMsg.style.display = 'block';
  }
});




