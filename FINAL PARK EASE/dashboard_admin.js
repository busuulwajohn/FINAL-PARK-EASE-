document.addEventListener("DOMContentLoaded", () => {

    const CURRENT_USER_KEY = "parkease_currentUser";
    const USERS_KEY = "parkease_users";

    const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));

    if (!currentUser) {
        window.location.href = "index.html";
        return;
    }

    const role = currentUser.role;

    /* ================= BASIC INFO ================= */

    document.getElementById("userName").innerText = currentUser.fullName;
    document.getElementById("userEmail").innerText = currentUser.email;
    document.getElementById("userPlate").innerText = currentUser.plate;

    document.getElementById("welcomeMessage").innerText =
        "Welcome Back, " + currentUser.fullName;

    /* ================= CLOCK ================= */

    function updateClock() {
        document.getElementById("nycClock").innerText =
            new Date().toLocaleString("en-UG", { timeZone: "Africa/Kampala" });
    }

    setInterval(updateClock, 1000);
    updateClock();

    /* ================= LOAD ATTENDANTS ================= */

    if (role === "admin" || role === "manager") {

        const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
        const attendants = users.filter(u => u.role === "user");

        const container = document.getElementById("attendantContainer");

        container.innerHTML = "";

        attendants.forEach(att => {

            const card = document.createElement("div");
            card.className = "analytics-card";

            card.innerHTML = `
                <h3>${att.fullName}</h3>
                <p>${att.email}</p>
                <button onclick="openServices('${att.email}')">
                    View Services
                </button>
            `;

            container.appendChild(card);
        });

    } else {
        document.getElementById("attendantSection").style.display = "none";
    }

});

/* ================= SIDEBAR ================= */

function toggleSidebar(){
    document.getElementById("sidebar").classList.toggle("active");
    document.getElementById("overlay").classList.toggle("active");
}

/* ================= SERVICES POPUP ================= */

function openServices(email){

    const modal = document.getElementById("servicesModal");
    const body = document.getElementById("servicesBody");

    const parking = JSON.parse(localStorage.getItem("parkease_parking")) || [];
    const charging = JSON.parse(localStorage.getItem("parkease_charging")) || [];
    const washing = JSON.parse(localStorage.getItem("parkease_washing")) || [];
    const booking = JSON.parse(localStorage.getItem("parkease_bookings")) || [];

    const count = (data) => data.filter(d => d.userEmail === email).length;

    body.innerHTML = `
        <h3>Services for ${email}</h3>

        <button onclick="openReceipts('${email}','Parking')">
            Parking (${count(parking)})
        </button>

        <button onclick="openReceipts('${email}','Charging')">
            Charging (${count(charging)})
        </button>

        <button onclick="openReceipts('${email}','Washing')">
            Washing (${count(washing)})
        </button>

        <button onclick="openReceipts('${email}','Booking')">
            Booking (${count(booking)})
        </button>
    `;

    modal.style.display = "flex";
}

function closeServices(){
    document.getElementById("servicesModal").style.display = "none";
}

/* ================= RECEIPTS POPUP ================= */

function openReceipts(email, service){

    const modal = document.getElementById("receiptsModal");
    const body = document.getElementById("receiptsBody");

    let data = [];

    if(service === "Parking")
        data = JSON.parse(localStorage.getItem("parkease_parking")) || [];

    if(service === "Charging")
        data = JSON.parse(localStorage.getItem("parkease_charging")) || [];

    if(service === "Washing")
        data = JSON.parse(localStorage.getItem("parkease_washing")) || [];

    if(service === "Booking")
        data = JSON.parse(localStorage.getItem("parkease_bookings")) || [];

    const filtered = data.filter(d => d.userEmail === email);

    body.innerHTML = `<h3>${service} Receipts</h3>`;

    filtered.forEach(v => {

        body.innerHTML += `
            <div class="report-card">
                <p>Name: ${v.driver || v.owner || v.name}</p>
                <p>ID: ${v.plate || v.batteryId || v.id}</p>
                <p>Amount: UGX ${v.amount}</p>
                <p>Date: ${v.date}</p>
            </div>
        `;
    });

    modal.style.display = "flex";
}

function closeReceipts(){
    document.getElementById("receiptsModal").style.display = "none";
}