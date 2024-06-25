document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

     // Hash the input password
     const hashedPassword = CryptoJS.SHA256(password).toString();

    fetch('http://localhost:3000/users')
    .then(response => response.json())
    .then(data => {
        const user = data.find(u => (u.email === username || u.userName === username) && u.password === hashedPassword);
        if (user) {
            alert('Login successful!');
            if(user.isAdmin){
                localStorage.setItem('isAdmin', 'true');
            }
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('loggedInUser', JSON.stringify(user));
            // Redirect to home page
            window.location.href = 'index.html';
        } else {
            alert('Invalid email or password.');
        }
    });
});
