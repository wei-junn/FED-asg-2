const restdbUrl = "https://mokesellasg2-66c7.restdb.io/rest/db-users";
const apiKey = "6785c0de630e8a0e140b141d";

const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});
loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

// Toggle between login and sign-up forms
function toggleForm() {
    container.classList.toggle("active");
}

// Ensure page loads with the login form
window.onload = function () {
    container.classList.remove("active");
};

// Sign-Up Function
function signUp(event) {
    event.preventDefault(); // Prevent form refresh

    const username = document.getElementById("signup-name").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    if (!username || !email || !password) {
        alert("Please fill in all fields.");
        return;
    }

    const userData = { username, "user-email": email, password };

    fetch(restdbUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-apikey": apiKey,
        },
        body: JSON.stringify(userData),
    })
    .then(response => response.json())
    .then((data) => {
        alert("Sign up successful! Redirecting to listings...");
        localStorage.setItem("loggedInUser", JSON.stringify(data)); // Store user session
        window.location.href = "listings.html"; // Redirect to listings page
    })
    .catch(error => {
        console.error("Sign Up Error:", error);
        alert("Sign up failed. Try again.");
    });
}

// Login Function
function logIn(event) {
    event.preventDefault(); // Prevent form refresh

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    if (!email || !password) {
        alert("Please enter your email and password.");
        return;
    }

    fetch(`${restdbUrl}?q={"user-email": "${email}", "password": "${password}"}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-apikey": apiKey,
        },
    })
    .then(response => response.json())
    .then(data => {
        if (data.length > 0) {
            alert("✅ Login successful!");

            // Store user email in localStorage
            localStorage.setItem("user_email", data[0]["user-email"]);

            // Redirect to `listings.html` instead of `account.html`
            window.location.href = "./listings.html";
        } else {
            alert("❌ Invalid email or password. Try again.");
        }
    })
    .catch(error => {
        console.error("Login Error:", error);
        alert("⚠️ Login failed. Try again.");
    });
}

// Logout Function
function logOut() {
    localStorage.removeItem("user_email");
    alert("✅ Logged out successfully.");
    window.location.href = "./index.html"; // Redirect to login page
}


// Protect Pages (Redirect if Not Logged In)
function checkAuth() {
    const user = localStorage.getItem("loggedInUser");
    if (!user) {
        window.location.href = "./index.html";
    }
}