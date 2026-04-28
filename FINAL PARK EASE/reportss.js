const WASHING_KEY = "parkease_washing"
const PARKING_KEY = "parkease_parking"
const CHARGING_KEY = "parkease_charging"
const BOOKINGS_KEY = "parkease_bookings"
const CURRENT_USER_KEY = "parkease_currentUser"
const USERS_KEY = "parkease_users"

let GLOBAL_DATA = []

/* ================= LOAD REPORT ================= */

function loadReport(){

    const user = JSON.parse(localStorage.getItem(CURRENT_USER_KEY))
    const list = document.getElementById("reportList")
    const totalEl = document.getElementById("totalRevenue")

    if(!user){
        list.innerHTML = "<p>Please login</p>"
        totalEl.innerText = ""
        return
    }

    let parking = JSON.parse(localStorage.getItem(PARKING_KEY)) || []
    let charging = JSON.parse(localStorage.getItem(CHARGING_KEY)) || []
    let washing = JSON.parse(localStorage.getItem(WASHING_KEY)) || []
    let bookings = JSON.parse(localStorage.getItem(BOOKINGS_KEY)) || []
    let users = JSON.parse(localStorage.getItem(USERS_KEY)) || []

    const normalize = (data, serviceName, mapFn) => {
        return data.map(v => ({
            service: serviceName,
            name: mapFn.name(v),
            type: mapFn.type(v),
            id: mapFn.id(v),
            phone: mapFn.phone(v),
            receipt: v.receipt || "TXN-" + Date.now(),
            amount: Number(v.amount || 0),
            date: mapFn.date(v),
            time: mapFn.time(v),
            userEmail: v.userEmail || "N/A"
        }))
    }

    let allData = [
        ...normalize(parking,"Parking",{
            name:v=>v.driver,
            type:v=>v.type,
            id:v=>v.plate,
            phone:v=>v.phone,
            date:v=>v.date || new Date(v.arrival).toLocaleDateString(),
            time:v=>v.time || new Date(v.arrival).toLocaleTimeString()
        }),
        ...normalize(charging,"Charging",{
            name:v=>v.owner,
            type:v=>v.type,
            id:v=>v.batteryId,
            phone:v=>v.phone,
            date:v=>v.date,
            time:v=>v.time
        }),
        ...normalize(washing,"Washing",{
            name:v=>v.driver,
            type:v=>v.type,
            id:v=>v.plate,
            phone:v=>v.phone,
            date:v=>v.date,
            time:v=>v.time
        }),
        ...normalize(bookings,"Booking",{
            name:v=>v.name,
            type:v=>v.type,
            id:v=>v.id,
            phone:v=>v.phone,
            date:v=>v.date,
            time:v=>v.time
        })
    ]

    let filtered = user.role === "admin"
        ? allData
        : allData.filter(v => v.userEmail === user.email)

    filtered = filtered.filter(v =>
        users.some(u => u.email === v.userEmail)
    )

    GLOBAL_DATA = filtered

    renderReport(filtered)
}

/* ================= RENDER ================= */

function renderReport(data){

    const list = document.getElementById("reportList")
    const totalEl = document.getElementById("totalRevenue")

    list.innerHTML = ""
    let total = 0

    if(data.length === 0){
        list.innerHTML = "<p>No records found</p>"
        totalEl.innerText = ""
        return
    }

    data.forEach(v => {

        if(v.amount > 0){

            total += v.amount

            list.innerHTML += `
            <div class="report-card">
            <p><b>Service:</b> ${v.service}</p>
            <p><b>Name:</b> ${v.name}</p>
            <p><b>ID:</b> ${v.id}</p>
            <p><b>Phone:</b> ${v.phone}</p>
            <p><b>Receipt:</b> ${v.receipt}</p>
            <p><b>Amount:</b> UGX ${v.amount.toLocaleString()}</p>
            <p><b>Date:</b> ${v.date}</p>
            <p><b>Time:</b> ${v.time}</p>

            <button class="download-btn"
            onclick='downloadReceipt(${JSON.stringify(v)})'>
            Download Receipt
            </button>

            </div>
            `
        }

    })

    totalEl.innerText = "Total Revenue: UGX " + total.toLocaleString()
}

/* ================= SEARCH ================= */

// function setupSearch(){

//     const input = document.getElementById("searchInput")
//     const filter = document.getElementById("serviceFilter")

//     function runFilter(){

//         let text = input.value.toLowerCase()
//         let service = filter.value

//         let result = GLOBAL_DATA.filter(v => {

//             return (
//                 (v.name || "").toLowerCase().includes(text) ||
//                 (v.receipt || "").toLowerCase().includes(text) ||
//                 (v.service || "").toLowerCase().includes(text) ||
//                 (v.time || "").toLowerCase().includes(text)
//             ) &&
//             (service === "" || v.service === service)
//         })

//         renderReport(result)
//     }

//     input.addEventListener("input", runFilter)
//     filter.addEventListener("change", runFilter)
// }

/* ================= DOWNLOAD RECEIPT ================= */

function downloadReceipt(data){

    const content = `
    PARKEASE RECEIPT
    -------------------------
    Service: ${data.service}
    Name: ${data.name}
    ID: ${data.id}
    Phone: ${data.phone}
    Receipt: ${data.receipt}
    Amount: UGX ${data.amount}
    Date: ${data.date}
    Time: ${data.time}
    -------------------------
    Thank you for using ParkEase
    `

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = data.receipt + ".txt"
    a.click()

    URL.revokeObjectURL(url)
}

/* ================= INIT ================= */

document.addEventListener("DOMContentLoaded", () => {
    loadReport()
    setupSearch()
})

/* AUTO REFRESH */
setInterval(loadReport, 2000)
window.addEventListener("focus", loadReport)
window.addEventListener("storage", loadReport)