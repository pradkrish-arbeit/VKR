document.getElementById('register-form').addEventListener('submit', function (event) {
  event.preventDefault();

  const firstName = document.getElementById('firstname').value;
  const lastName = document.getElementById('lastname').value;
  const userName = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Hash the password
  const hashedPassword = CryptoJS.SHA256(password).toString();

  async function fetchAndPost() {
    try {
      // Retrieve user data from Json Server
      const response = await fetch("http://localhost:3000/users");
      const users = await response.json();

      // Check if user already exists
      if (users.some(u => u.email === email)) {
        alert('User already exists with this email.');
        return;
      }

      // Add new user with hashed password
      const newUser = { firstName, lastName, userName, email, password: hashedPassword, isAdmin: false };

      const response2 = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      });

      const adduser = await response2.json();
      if (adduser.email) {
       // alert('Registration successful!');
        console.log('User added:', adduser);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('loggedInUser', JSON.stringify({ firstName, lastName, userName, email, password: hashedPassword, isAdmin: false }));
        console.log('Redirecting to index.html');
        // Redirect to home page
        window.location.href = 'index.html';
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  fetchAndPost();
});
