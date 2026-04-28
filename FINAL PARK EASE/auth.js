const USERS_KEY = "parkease_users";
const CURRENT_USER_KEY = "parkease_currentUser";
const SESSION_KEY = "parkease_sessions";

/* ================= USERS ================= */

function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
}

function setCurrentUser(user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

/* ================= VALIDATION ================= */

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
    return /^\+?\d{10,15}$/.test(phone);
}

function validatePlate(plate) {
    return /^[A-Z]{2,3}[-\s]?\d{3,4}[A-Z]?$/i.test(plate);
}

function validatePassword(password) {
    return password.length >= 6;
}

/* ================= REGISTER ================= */

function registerUser(data) {

    const users = getUsers();

    const email = data.email.toLowerCase().trim();
    const plate = data.plate.toUpperCase().trim();

    if (!validateEmail(email)) {
        alert("Invalid email format");
        return false;
    }

    if (!validatePhone(data.phone)) {
        alert("Invalid phone number");
        return false;
    }

    if (!validatePlate(plate)) {
        alert("Invalid Membership ID");
        return false;
    }

    if (!validatePassword(data.password)) {
        alert("Password must be at least 6 characters");
        return false;
    }

    if (users.some(u => u.email === email)) {
        alert("Email already exists");
        return false;
    }

    if (users.some(u => u.plate === plate)) {
        alert("Membership ID already exists");
        return false;
    }

    const newUser = {
        id: Date.now(),
        fullName: data.fullName.trim(),
        email,
        phone: data.phone.trim(),
        plate,
        password: data.password.trim(),
        role: data.role,
        profilePic: null
    };

    users.push(newUser);
    saveUsers(users);

    return true;
}

/* ================= LOGIN ================= */

function loginUser(email, password, role) {

    const users = getUsers();

    const user = users.find(u =>
        u.email === email.toLowerCase().trim() &&
        u.password === password.trim() &&
        u.role === role
    );

    if (!user) return false;

    setCurrentUser(user);

    let sessions = JSON.parse(localStorage.getItem(SESSION_KEY)) || [];

    sessions.push({
        username: user.fullName,
        email: user.email,
        role: user.role,
        loginTime: new Date().toLocaleString(),
        logoutTime: null
    });

    localStorage.setItem(SESSION_KEY, JSON.stringify(sessions));

    return true;
}

/* ================= LOGOUT ================= */

function logout() {

    let sessions = JSON.parse(localStorage.getItem(SESSION_KEY)) || [];

    if (sessions.length) {
        sessions[sessions.length - 1].logoutTime = new Date().toLocaleString();
        localStorage.setItem(SESSION_KEY, JSON.stringify(sessions));
    }

    localStorage.removeItem(CURRENT_USER_KEY);
    window.location.href = "index.html";
}

/* ================= UPDATE PROFILE ================= */

function updateProfile(updatedData) {

    const users = getUsers();
    const currentUser = getCurrentUser();

    const index = users.findIndex(u => u.id === currentUser.id);

    users[index] = { ...users[index], ...updatedData };

    saveUsers(users);
    setCurrentUser(users[index]);

    return users[index];
}

/* ================= FORM HANDLERS ================= */

document.addEventListener("DOMContentLoaded", () => {

    /* LOGIN */
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const email = document.getElementById("loginEmail").value;
            const password = document.getElementById("loginPassword").value;
            const role = document.getElementById("loginRole").value;

            const success = loginUser(email, password, role);

            if (!success) {
                alert("Invalid credentials");
                return;
            }

            const user = getCurrentUser();

            if (user.role === 'admin') window.location.href = "dashboard_admin.html";
            if (user.role === 'manager') window.location.href = "dashboard_manager.html";
            if (user.role === 'attendant') window.location.href = "dashboard_attendant.html";
        });
    }

    /* ================= TRACK SIGNED-IN USERS ================= */

const SIGNED_IN_KEY = "parkease_signedInUsers";

function trackSignedInUser(user){

    let signedIn = JSON.parse(localStorage.getItem(SIGNED_IN_KEY)) || [];

    const exists = signedIn.find(u => u.email === user.email);

    if(!exists){
        signedIn.push(user);
        localStorage.setItem(SIGNED_IN_KEY, JSON.stringify(signedIn));
    }
}

    /* REGISTER */
    const registerForm = document.getElementById("registerForm");

    if (registerForm) {
        registerForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const data = {
                fullName: fullName.value,
                email: email.value,
                phone: phone.value,
                plate: plate.value,
                password: password.value,
                role: regRole.value
            };

            const success = registerUser(data);

            if (success) {
                alert("Account created successfully");
                window.location.href = "index.html";
            }
        });
    }

});