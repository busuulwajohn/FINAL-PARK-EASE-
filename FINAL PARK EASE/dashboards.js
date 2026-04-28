document.addEventListener("DOMContentLoaded", () => {

    const CURRENT_USER_KEY = "parkease_currentUser";

    const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));

    if (!currentUser) {
        window.location.href = "index.html";
        return;
    }


    /* ================= USER INFO ================= */

    const userName = document.getElementById("userName");
    const userEmail = document.getElementById("userEmail");
    const userPlate = document.getElementById("userPlate");
    const welcomeMessage = document.getElementById("welcomeMessage");

    if (userName) userName.innerText = currentUser.fullName || "N/A";
    if (userEmail) userEmail.innerText = currentUser.email || "N/A";
    if (userPlate) userPlate.innerText = currentUser.plate || "N/A";

    if (welcomeMessage) {
        welcomeMessage.innerText = "Welcome Back, " + (currentUser.fullName || "User");
    }

    /* ================= CLOCK ================= */

    function updateClock() {
        const clock = document.getElementById("nycClock");

        if (!clock) return;

        const time = new Date().toLocaleString("en-UG", {
            timeZone: "Africa/Kampala"
        });

        clock.innerText = time;
    }

    setInterval(updateClock, 1000);
    updateClock();

    /* ================= PROFILE SYSTEM =============*/

    const sidebarProfilePic = document.getElementById("sidebarProfilePic");
    const profileModal = document.getElementById("profileModal");
    const closeProfile = document.getElementById("closeProfile");

    const profilePreview = document.getElementById("profilePreview");
    const profileUpload = document.getElementById("profileUpload");

    const editName = document.getElementById("editName");
    const editEmail = document.getElementById("editEmail");
    const editPhone = document.getElementById("editPhone");
    const editVehicle = document.getElementById("editVehicle");
    const saveProfile = document.getElementById("saveProfile");

    /* LOAD PROFILE DATA */

    if (editName) editName.value = currentUser.fullName;
    if (editEmail) editEmail.value = currentUser.email;
    if (editPhone) editPhone.value = currentUser.phone;
    if (editVehicle) editVehicle.value = currentUser.plate;

    if (currentUser.profilePic) {

        if(sidebarProfilePic) sidebarProfilePic.src = currentUser.profilePic;
        if(profilePreview) profilePreview.src = currentUser.profilePic;
    }

    /* OPEN PROFILE */

    if(sidebarProfilePic){
        sidebarProfilePic.addEventListener("click", () => {
            profileModal.style.display = "flex";
        });
    }

    /* CLOSE PROFILE */

    if(closeProfile){
        closeProfile.addEventListener("click", () => {
            profileModal.style.display = "none";
        });
    }

    /* PROFILE IMAGE */

    if(profileUpload){
        profileUpload.addEventListener("change", () => {

            const file = profileUpload.files[0];
            if (!file) return;

            const reader = new FileReader();

            reader.onload = function (e) {

                profilePreview.src = e.target.result;
                sidebarProfilePic.src = e.target.result;

                currentUser.profilePic = e.target.result;

                localStorage.setItem(
                    CURRENT_USER_KEY,
                    JSON.stringify(currentUser)
                );

                updateUsersList();
            };

            reader.readAsDataURL(file);
        });
    }

    /* SAVE PROFILE */

    if(saveProfile){
        saveProfile.addEventListener("click", () => {

            currentUser.fullName = editName.value;
            currentUser.email = editEmail.value;
            currentUser.phone = editPhone.value;
            currentUser.plate = editVehicle.value;

            localStorage.setItem(
                CURRENT_USER_KEY,
                JSON.stringify(currentUser)
            );

            updateUsersList();

            document.getElementById("userName").innerText = currentUser.fullName;
            document.getElementById("userEmail").innerText = currentUser.email;
            document.getElementById("userPlate").innerText = currentUser.plate;

            document.getElementById("welcomeMessage").innerText =
                "Welcome Back, " + currentUser.fullName;

            alert("Profile updated successfully");

            profileModal.style.display = "none";
        });
    }

    /* UPDATE USERS DATABASE */

    function updateUsersList() {

        let users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];

        const index = users.findIndex(
            u => u.email === currentUser.email
        );

        if (index !== -1) {

            users[index] = currentUser;

            localStorage.setItem(
                USERS_KEY,
                JSON.stringify(users)
            );
        }
    }
        /* ===============================
       LOAD PAYMENTS
    ================================= */

    const payments =
        JSON.parse(localStorage.getItem("parkease_payments")) || [];

    const userPayments = payments.filter(
        p => p.userEmail === currentUser.email
    );

    const totalRevenue = userPayments.reduce(
        (sum, p) => sum + p.amount,
        0
    );

    const totalTransactions = userPayments.length;

    const today = new Date().toDateString();

    const activeToday = userPayments.filter(p =>
        new Date(p.date).toDateString() === today
    ).length;

    if(document.getElementById("totalRevenue"))
        document.getElementById("totalRevenue").innerText = "UGX " + totalRevenue.toFixed(2);

    if(document.getElementById("totalTransactions"))
        document.getElementById("totalTransactions").innerText = totalTransactions;

    if(document.getElementById("activeServices"))
        document.getElementById("activeServices").innerText = activeToday;

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
    /* ===============================
       SERVICE BREAKDOWN
    ================================= */

    const breakdown = {};
    userPayments.forEach(p => {
        breakdown[p.service] = (breakdown[p.service] || 0) + 1;
    });

    const list = document.getElementById("serviceBreakdown");

    if (list) {

        list.innerHTML = "";

        for (let service in breakdown) {

            const li = document.createElement("li");
            li.innerText = service + ": " + breakdown[service];

            list.appendChild(li);
        }
    }

function toggleSidebar(){
    const sidebar = document.getElementById("sidebar")
    const overlay = document.getElementById("overlay")

    sidebar.classList.toggle("active")
    overlay.classList.toggle("active")
}

