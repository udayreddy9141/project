// login.js
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Login request
    fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            // Store token and redirect to index.html
            localStorage.setItem('authToken', data.token);
            window.location.href = 'index.html';
        } else {
            document.getElementById('loginMessage').innerText = 'Invalid username or password!';
        }
    })
    .catch(error => {
        document.getElementById('loginMessage').innerText = 'Error: ' + error.message;
    });
});
