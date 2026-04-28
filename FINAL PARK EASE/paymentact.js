const PAYMENTS_KEY = "parkease_payments"
const CURRENT_USER_KEY = "parkease_currentUser"

const list = document.getElementById("activityList")
const totalAmount = document.getElementById("totalAmount")
const count = document.getElementById("transactionCount")
const searchInput = document.getElementById("searchInput")

let transactions = []

/* =========================
   SAFE DATE FORMATTERS
========================= */

/* FIXED TIME FUNCTION (NO MORE 00:00 BUG) */
function formatTime(dateValue) {
    const d = new Date(dateValue)

    if (isNaN(d.getTime())) return "Invalid time"

    return new Intl.DateTimeFormat("en-UG", {
        timeZone: "Africa/Kampala",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    }).format(d)
}

/* SAFE DATE */
function formatDate(dateValue) {
    const d = new Date(dateValue)

    if (isNaN(d.getTime())) return "Invalid date"

    return new Intl.DateTimeFormat("en-UG", {
        timeZone: "Africa/Kampala",
        day: "2-digit",
        month: "short",
        year: "numeric"
    }).format(d)
}

/* =========================
   LOAD TRANSACTIONS SAFELY
========================= */
function loadTransactions() {

    const user = JSON.parse(localStorage.getItem(CURRENT_USER_KEY))
    const all = JSON.parse(localStorage.getItem(PAYMENTS_KEY)) || []

    if (!user) return all

    let filtered = all.filter(t =>
        t.userEmail === user.email ||
        t.email === user.email
    )

    // fallback if mismatch
    if (filtered.length === 0) filtered = all

    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
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
   SEARCH
========================= */
searchInput.addEventListener("input", () => {
    renderActivities(document.querySelector(".filter.active").dataset.type)
})

/* =========================
   MAIN RENDER ENGINE
========================= */
function renderActivities(type) {

    list.innerHTML = ""

    let filtered = loadTransactions()

    /* FILTER TYPE */
    if (type !== "all") {
        filtered = filtered.filter(t =>
            (t.service || "").toLowerCase().includes(type)
        )
    }

    /* SEARCH */
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

    filtered.forEach(t => {
        total += Number(t.amount || 0)
        list.innerHTML += createCard(t)
    })

    count.textContent = filtered.length
    totalAmount.textContent = "UGX " + total.toLocaleString()
}

/* =========================
   CARD TEMPLATE
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
   AUTO REFRESH
========================= */
window.addEventListener("focus", () => {
    transactions = loadTransactions()
    renderActivities("all")
})