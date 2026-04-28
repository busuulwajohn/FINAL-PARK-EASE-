const USERS_KEY = "parkease_users"
const CURRENT_USER_KEY="parkease_currentUser"
const SESSION_KEY="parkease_sessions"

let selectedUserIndex=null
let selectedUserEmail=null

/* ================= AUTH ================= */

function verifyAccess(){

const user = JSON.parse(localStorage.getItem(CURRENT_USER_KEY))
const pass = document.getElementById("authPassword").value

if(!user || pass !== user.password){
alert("Authentication failed")
return
}

document.getElementById("securityBox").style.display="none"
loadSessions()
}

/* LOAD ATTENDANTS */
function loadAttendants(){

allUsers = JSON.parse(localStorage.getItem(USERS_KEY)) || []

renderAttendants(allUsers)
}

/* RENDER */
function renderAttendants(users){

const container = document.getElementById("attendantsContainer")
container.innerHTML=""

if(users.length === 0){
container.innerHTML = "<p style='opacity:0.7'>No attendants found</p>"
return
}

users.forEach(u=>{

container.innerHTML+=`
<div class="card" onclick="openServices('${u.email}','${u.fullName}')">
<h3>${u.fullName || "No Name"}</h3>
<p>${u.email}</p>
<p>${u.role || "attendant"}</p>
</div>
`
})
}

/* =========================
🔍 FIXED SEARCH (NAME + EMAIL)
========================= */
function searchAttendants(){

const q = document.getElementById("attendantSearch").value.toLowerCase().trim()

if(!q){
renderAttendants(allUsers)
return
}

const filtered = allUsers.filter(u => {

const name = (u.fullName || "").toLowerCase()
const email = (u.email || "").toLowerCase()

return name.includes(q) || email.includes(q)
})

renderAttendants(filtered)
}

/* =========================
🔐 REQUEST REFRESH (SHOW AUTH BOX)
========================= */
function requestPaymentRefresh() {

    document.getElementById("paymentSecurityBox").style.display = "block"

    // optional: focus input
    document.getElementById("paymentAuthPassword").focus()
}

/* =========================
🔐 VERIFY & REFRESH
========================= */
function verifyPaymentAccess() {

    const user = JSON.parse(localStorage.getItem(CURRENT_USER_KEY))
    const inputPassword = document.getElementById("paymentAuthPassword").value

    if (!user) {
        alert("Session expired. Please login again.")
        window.location.href = "index.html"
        return
    }

    if (inputPassword !== user.password) {
        alert("❌ Authentication failed")
        return
    }

    // ✅ SUCCESS
    document.getElementById("paymentSecurityBox").style.display = "none"
    document.getElementById("paymentAuthPassword").value = ""

    // 🔥 SAFE REFRESH (NO DATA LOSS)
    renderActivities(activeFilter)
}
/* CLEAR DISPLAY ONLY */
document.getElementById("attendantsContainer").innerHTML = `
<p style="text-align:center;opacity:0.6;margin-top:40px;">
✔ Cleared successfully. Click refresh again or reload page to restore.
</p>
`

document.getElementById("attendantSearch").value = ""


/* GET DATA */
function getData(key){
return JSON.parse(localStorage.getItem(key)) || []
}

/* SERVICES */
function openServices(email,name){

selectedEmail = email

document.getElementById("attendantTitle").innerText = name

const services=[
{key:"parkease_parking",name:"Parking"},
{key:"parkease_charging",name:"Charging"},
{key:"parkease_washing",name:"Washing"},
{key:"parkease_bookings",name:"Booking"}
]

const list=document.getElementById("servicesList")
list.innerHTML=""

services.forEach(s=>{

const data=getData(s.key).filter(d=>d.userEmail===email)

list.innerHTML+=`
<button class="service-btn" onclick="openTransactions('${s.key}','${s.name}')">
${s.name} (${data.length})
</button>
`
})

document.getElementById("servicesModal").style.display="flex"
}

function closeServices(){
document.getElementById("servicesModal").style.display="none"
}

/* TRANSACTIONS */

function openTransactions(key,name){

const data=getData(key).filter(d=>d.userEmail===selectedEmail)

allTransactions=data

document.getElementById("transactionTitle").innerText=name+" Transactions"

renderTransactions(data)

document.getElementById("transactionsModal").style.display="block"
}

/* RENDER TRANSACTIONS */
function renderTransactions(data){

const list=document.getElementById("transactionsList")
list.innerHTML=""

if(data.length===0){
list.innerHTML="<p>No transactions found</p>"
return
}

data.forEach((t,index)=>{

const id=t.receipt || "TXN-"+(index+1)+"-"+Date.now()

list.innerHTML+=`
<div class="tx-card">
<p><strong>ID/NUMBER PLATE:</strong> ${id}</p>
<p><strong>Amount:</strong> UGX ${t.amount}</p>
<p><strong>Date:</strong> ${t.date}</p>
<p><strong>Time:</strong> ${
    new Date(t.date).toLocaleTimeString("en-UG", {
        timeZone: "Africa/Kampala",
        hour: "2-digit",
        minute: "2-digit"
    })
}</p>
</div>
`
})
}

/* SEARCH TRANSACTIONS */
function filterTransactions(){

const q=document.getElementById("searchBar").value.toLowerCase()

const filtered=allTransactions.filter(t=>{

const id=(t.receipt||"").toLowerCase()
const service=(t.serviceDone||"").toLowerCase()
const time=new Date(t.date).toLocaleTimeString().toLowerCase()

return id.includes(q)||service.includes(q)||time.includes(q)
})

renderTransactions(filtered)
}

function closeTransactions(){
document.getElementById("transactionsModal").style.display="none"
}

/* INIT */
loadAttendants()