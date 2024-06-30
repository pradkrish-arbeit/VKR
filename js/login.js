document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

     // Hash the input password
     const hashedPassword = CryptoJS.SHA256(password).toString();

    fetch(`${BASE_API_URL}/users`)
    .then(response => response.json())
    .then(data => {
        const user = data.find(u => (u.userName === username) && u.password === hashedPassword);
        debugger;
        if (user) {
            
            localStorage.setItem('isAuthenticated', true);
            localStorage.setItem('loggedInUser', JSON.stringify(user));
            // Redirect to home page
            if(user.isAdmin){
                localStorage.setItem('isAdmin', true);
                window.location.href = 'profile.html';
            }else{
                localStorage.setItem('isAdmin', false);
                window.location.href = 'profile.html';
            }
            alert('Login successful!');
            
        } else {
            alert('Invalid email or password.');
        }
    });
});
