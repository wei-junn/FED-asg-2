let container = document.getElementById('container')

toggle = () => {
	container.classList.toggle('sign-in')
	container.classList.toggle('sign-up')
}

setTimeout(() => {
	container.classList.add('sign-in')
}, 200)

//sign up and log in functions
const restdbUrl = 'https://your-database-name.restdb.io/rest/users';
const apiKey = '6785c0de630e8a0e140b141d';

function signUp() {
    const username = document.querySelector('.sign-up input[placeholder="Username"]').value;
    const email = document.querySelector('.sign-up input[placeholder="Email"]').value;
    const password = document.querySelector('.sign-up input[placeholder="Password"]').value;
    const confirmPassword = document.querySelector('.sign-up input[placeholder="Confirm password"]').value;

    if (!username || !email || !password || !confirmPassword) {
        alert('Please fill in all fields.');
        return;
    }
    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    const data = { username, email, password };

    fetch(restdbUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-apikey': apiKey,
            'cache-control': 'no-cache'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        alert('Sign up successful! Please log in.');
        toggle();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Sign up failed. Please try again.');
    });
}

function logIn() {
    const username = document.querySelector('.sign-in input[placeholder="Username"]').value;
    const password = document.querySelector('.sign-in input[placeholder="Password"]').value;

    if (!username || !password) {
        alert('Please fill in all fields.');
        return;
    }

    fetch(`${restdbUrl}?q={"username": "${username}", "password": "${password}"}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-apikey': apiKey,
            'cache-control': 'no-cache'
        }
    })
    .then(response => response.json())
    .then(result => {
        if (result.length > 0) {
            alert('Log in successful!');
            // Redirect or perform another action
        } else {
            alert('Invalid username or password.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Log in failed. Please try again.');
    });
}