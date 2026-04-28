document.addEventListener("DOMContentLoaded", () => {

    const CURRENT_USER_KEY = "parkease_currentUser";
    const SIGNED_IN_KEY = "parkease_signedInUsers";

    const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));

    if (!currentUser) {
        window.location.href = "index.html";
        return;
    }

    const role = currentUser.role;

    /* ================= USER INFO ================= */

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

    /* ================= LOAD SIGNED-IN ATTENDANTS ================= */

    if (role === "admin" || role === "manager") {

        const signedIn = JSON.parse(localStorage.getItem(SIGNED_IN_KEY)) || [];

        const attendants = signedIn.filter(u => u.role === "user");

        const container = document.getElementById("attendantContainer");

        container.innerHTML = "";

        if(attendants.length === 0){
            container.innerHTML = "<p>No attendants signed in yet</p>";
            return;
        }

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

/* ================= DATA HELPERS ================= */

function getServiceData(service){

    if(service === "Parking")
        return JSON.parse(localStorage.getItem("parkease_parking")) || [];

    if(service === "Charging")
        return JSON.parse(localStorage.getItem("parkease_charging")) || [];

    if(service === "Washing")
        return JSON.parse(localStorage.getItem("parkease_washing")) || [];

    if(service === "Booking")
        return JSON.parse(localStorage.getItem("parkease_bookings")) || [];

    return [];
}

/* ================= SERVICES MODAL ================= */

function openServices(email){

    const modal = document.getElementById("servicesModal");
    const body = document.getElementById("servicesBody");

    const services = ["Parking","Charging","Washing","Booking"];

    body.innerHTML = `<h3>Services for ${email}</h3>`;

    services.forEach(service => {

        const data = getServiceData(service);

        const count = data.filter(d => d.userEmail === email).length;

        body.innerHTML += `
            <button onclick="openReceipts('${email}','${service}')">
                ${service} (${count})
            </button>
        `;
    });

    modal.style.display = "flex";
}

/* ================= RECEIPTS MODAL ================= */

function openReceipts(email, service){

    const modal = document.getElementById("receiptsModal");
    const body = document.getElementById("receiptsBody");

    const data = getServiceData(service);

    const filtered = data.filter(d => d.userEmail === email);

    body.innerHTML = `<h3>${service} Receipts</h3>`;

    if(filtered.length === 0){
        body.innerHTML += "<p>No records found</p>";
    }

    filtered.forEach(v => {

        body.innerHTML += `
            <div class="report-card">
                <p><b>Name:</b> ${v.driver || v.owner || v.name}</p>
                <p><b>ID:</b> ${v.plate || v.batteryId || v.id}</p>
                <p><b>Amount:</b> UGX ${v.amount || 0}</p>
                <p><b>Date:</b> ${v.date || "N/A"}</p>
            </div>
        `;
    });

    modal.style.display = "flex";
}

/* ================= CLOSE MODALS ================= */

function closeServices(){
    document.getElementById("servicesModal").style.display = "none";
}

function closeReceipts(){
    document.getElementById("receiptsModal").style.display = "none";
}

/* ================= SIDEBAR ================= */

function toggleSidebar(){
    document.getElementById("sidebar").classList.toggle("active");
    document.getElementById("overlay").classList.toggle("active");
}