/* ================= KEYS ================= */
const PAYMENTS_KEY = "parkease_payments"
const CURRENT_USER_KEY = "parkease_currentUser"

/* ================= ELEMENTS ================= */
const list = document.getElementById("activityList")
const totalAmount = document.getElementById("totalAmount")
const count = document.getElementById("transactionCount")
const searchInput = document.getElementById("searchInput")

let transactions = []

/* =========================
   SAFE LOAD TRANSACTIONS
========================= */
function loadTransactions() {
    const user = JSON.parse(localStorage.getItem(CURRENT_USER_KEY))
    if (!user) return []

    const all = JSON.parse(localStorage.getItem(PAYMENTS_KEY)) || []

    return all
        .filter(t => t.userEmail === user.email)
        .map(t => {
            // 🔥 FIX OLD BROKEN DATES (date only → add midday time)
            if (t.date && t.date.length <= 10) {
                t.date = new Date(t.date + "T12:00:00").toISOString()
            }

            // fallback if date missing
            if (!t.date) {
                t.date = new Date().toISOString()
            }

            return t
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date))
}

/* =========================
   DATE FORMATTER (SAFE)
========================= */
function formatDate(dateValue) {
    if (!dateValue) return "N/A"

    const d = new Date(dateValue)
    if (isNaN(d.getTime())) return "Invalid date"

    return d.toLocaleDateString("en-UG", {
        timeZone: "Africa/Kampala",
        dateStyle: "medium"
    })
}

/* =========================
   TIME FORMATTER (FIXED)
========================= */
function formatTime(dateValue) {
    if (!dateValue) return "N/A"

    const d = new Date(dateValue)
    if (isNaN(d.getTime())) return "Invalid time"

    return d.toLocaleTimeString("en-UG", {
        timeZone: "Africa/Kampala",
        hour: "2-digit",
        minute: "2-digit"
    })
}

/* INITIAL LOAD */
transactions = loadTransactions()
renderActivities("all")

/* =========================
   FILTER BUTTONS
========================= */
document.querySelectorAll(".filter").forEach(btn => {
    btn.addEventListener("click", () => {

        document.querySelectorAll(".filter")
            .forEach(b => b.classList.remove("active"))

        btn.classList.add("active")

        renderActivities(btn.dataset.type)
    })
})

/* =========================
   SEARCH INPUT
========================= */
searchInput.addEventListener("input", () => {
    renderActivities(document.querySelector(".filter.active").dataset.type)
})

/* =========================
   CORE RENDER ENGINE
========================= */
function renderActivities(type) {

    list.innerHTML = ""

    let filtered = loadTransactions()

    /* FILTER BY TYPE */
    if (type !== "all") {
        filtered = filtered.filter(t =>
            (t.service || "").toLowerCase().includes(type)
        )
    }

    /* SEARCH FILTER */
    const keyword = searchInput.value.toLowerCase().trim()

    if (keyword) {
        filtered = filtered.filter(t =>
            (t.transactionId || "").toLowerCase().includes(keyword) ||
            (t.service || "").toLowerCase().includes(keyword) ||
            formatDate(t.date).toLowerCase().includes(keyword) ||
            formatTime(t.date).toLowerCase().includes(keyword)
        )
    }

    let total = 0

    /* EMPTY STATE */
    if (filtered.length === 0) {
        list.innerHTML = `
        <div class="empty-state">
            <i class="fa-solid fa-box-open"></i>
            <p>No transactions found</p>
        </div>`
        count.textContent = 0
        totalAmount.textContent = "UGX 0"
        return
    }

    /* RENDER CARDS */
    filtered.forEach(t => {
        total += Number(t.amount || 0)
        list.innerHTML += createCard(t)
    })

    count.textContent = filtered.length
    totalAmount.textContent = "UGX " + total.toLocaleString()
}

/* =========================
   CARD TEMPLATE (FINAL FIX)
========================= */
function createCard(t) {

    const service = (t.service || "").toLowerCase()

    let icon = "fa-receipt"

    if (service.includes("parking")) icon = "fa-car"
    else if (service.includes("charging")) icon = "fa-bolt"
    else if (service.includes("booking")) icon = "fa-calendar-check"
    else if (service.includes("washing")) icon = "fa-soap"

    return `
    <div class="activity-card">

        <div class="activity-top">

            <div class="activity-title">
                <i class="fa-solid ${icon}"></i>
                ${t.service || "Unknown Service"}
            </div>

            <div class="amount">
                UGX ${Number(t.amount || 0).toLocaleString()}
            </div>

        </div>

        <div class="tags">
            <span class="tag">TX: ${t.transactionId || "N/A"}</span>

            ${t.station ? `<span class="tag">Station: ${t.station}</span>` : ""}

            ${t.energy ? `<span class="tag">Energy: ${t.energy} kWh</span>` : ""}
        </div>

        <p><strong>Date:</strong> ${formatDate(t.date)}</p>
        <p><strong>Time:</strong> ${formatTime(t.date)}</p>

    </div>
    `
}

/* =========================
   AUTO REFRESH ON FOCUS
========================= */
window.addEventListener("focus", () => {
    transactions = loadTransactions()
    renderActivities("all")
})