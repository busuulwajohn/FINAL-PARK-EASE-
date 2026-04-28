const USERS_KEY="parkease_users"
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

/* ================= LOAD SESSIONS ================= */

function loadSessions(){

const sessions = JSON.parse(localStorage.getItem(SESSION_KEY)) || []

const list = document.getElementById("sessionList")

list.style.display="block"
list.innerHTML=""

sessions.forEach((s)=>{

list.innerHTML += `

<div class="session-card" onclick="openProfile('${s.email}')">

<i class="fa-solid fa-circle-user profile-icon"></i>

<div class="session-info">

<h4>${s.username}</h4>

<p><strong>Role:</strong> ${s.role}</p>

<p><strong>Login:</strong> ${s.loginTime}</p>

<p><strong>Logout:</strong> ${s.logoutTime ? s.logoutTime : "Still Active"}</p>

<p>
<strong>Status:</strong> 
${s.logoutTime ? 
'<span class="offline">🔴 Offline</span>' : 
'<span class="active">🟢 Active</span>'}
</p>
</div>

<button 
class="delete-user"
onclick="deleteAccount('${s.email}', event)">
Delete
</button>

</div>
`
})
}

/* ================= PROFILE ================= */

function openProfile(email){

const users = JSON.parse(localStorage.getItem(USERS_KEY)) || []

const userIndex = users.findIndex(u => u.email === email)

if(userIndex === -1){
alert("User not found")
return
}

selectedUserIndex = userIndex
selectedUserEmail = email

const user = users[userIndex]

document.getElementById("editUsername").value = user.fullName
document.getElementById("editRole").value = user.role
document.getElementById("editEmail").value = user.email
document.getElementById("editMember").value = user.plate
document.getElementById("editPassword").value = user.password

document.getElementById("profileModal").style.display = "flex"
}

function closeProfile(){
document.getElementById("profileModal").style.display="none"
}

/* ================= SERVICES ================= */

function getServiceData(service){

if(service==="Parking")
return JSON.parse(localStorage.getItem("parkease_parking"))||[]

if(service==="Charging")
return JSON.parse(localStorage.getItem("parkease_charging"))||[]

if(service==="Washing")
return JSON.parse(localStorage.getItem("parkease_washing"))||[]

if(service==="Booking")
return JSON.parse(localStorage.getItem("parkease_bookings"))||[]

return []
}

function openUserServices(){

const modal=document.getElementById("servicesModal")
const list=document.getElementById("servicesList")

const services=["Parking","Charging","Washing","Booking"]

let totalRevenue=0
let totalTransactions=0
let todayCount=0

const today=new Date().toDateString()

list.innerHTML=""

services.forEach(service=>{

const data=getServiceData(service)

const filtered=data.filter(d=>d.userEmail===selectedUserEmail)

const count=filtered.length

totalTransactions+=count

filtered.forEach(v=>{
totalRevenue+=Number(v.amount||0)

if(new Date(v.date).toDateString()===today){
todayCount++
}
})

list.innerHTML+=`
<button class="service-btn" onclick="openServiceReceipts('${service}')">
${service} (${count})
</button>
`
})

document.getElementById("svcRevenue").innerText="UGX "+totalRevenue
document.getElementById("svcTransactions").innerText=totalTransactions
document.getElementById("svcToday").innerText=todayCount

modal.style.display="flex"
}

function closeServices(){
document.getElementById("servicesModal").style.display="none"
}

/* ================= RECEIPTS ================= */

function openServiceReceipts(service){

const modal = document.getElementById("receiptsModal")
const list = document.getElementById("receiptsList")
const title = document.getElementById("receiptTitle")

title.innerText = service + " Transactions"

const data = getServiceData(service)
const filtered = data.filter(d => d.userEmail === selectedUserEmail)

list.innerHTML = ""

if(filtered.length === 0){
list.innerHTML = "<p style='color:white'>No transactions found</p>"
}

filtered.forEach(v => {

const receiptId = v.receipt || "TXN-" + Math.floor(Math.random()*100000)

list.innerHTML += `
<div class="receipt-card">


<p><strong>Name:</strong> ${v.driver || v.owner || v.name}</p>
<p><strong>ID:</strong> ${v.plate || v.batteryId || v.id}</p>
<p><strong>Amount:</strong> UGX ${v.amount || 0}</p>
<p><strong>Date:</strong> ${v.date || "N/A"}</p>
<p><strong>Receipt:</strong> ${receiptId}</p>

<button class="download-btn"
onclick='downloadReceipt(${JSON.stringify({
    service,
    name: v.driver || v.owner || v.name,
    id: v.plate || v.batteryId || v.id,
    amount: v.amount,
    date: v.date,
    receipt: receiptId
})})'>
⬇ Download Receipt
</button>

</div>
`
})

modal.style.display = "block"
}

function closeReceipts(){
document.getElementById("receiptsModal").style.display="none"
}

/* ============ DOWNLOAD REPORT =====================*/

function downloadReceipt(data){

const content = `
PARKEASE RECEIPT
-------------------------
Service: ${data.service}
Name: ${data.name}
ID: ${data.id}
Amount: UGX ${data.amount}
Receipt ID: ${data.receipt}
Date: ${data.date}
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

/* ================= SAVE ================= */

function saveUser(){

const users = JSON.parse(localStorage.getItem(USERS_KEY))

users[selectedUserIndex].fullName =
document.getElementById("editUsername").value

users[selectedUserIndex].role =
document.getElementById("editRole").value

users[selectedUserIndex].email =
document.getElementById("editEmail").value

users[selectedUserIndex].plate =
document.getElementById("editMember").value

users[selectedUserIndex].password =
document.getElementById("editPassword").value

localStorage.setItem(USERS_KEY, JSON.stringify(users))

alert("Account updated successfully")

closeProfile()
loadSessions()
}
function deleteAccount(email, event) {

event.stopPropagation()

if (!confirm("Delete this account permanently? This will remove ALL related data.")) return

/* ================= USER DELETE ================= */
let users = JSON.parse(localStorage.getItem(USERS_KEY)) || []
users = users.filter(u => u.email !== email)
localStorage.setItem(USERS_KEY, JSON.stringify(users))

/* ================= SESSIONS DELETE ================= */
let sessions = JSON.parse(localStorage.getItem(SESSION_KEY)) || []
sessions = sessions.filter(s => s.email !== email)
localStorage.setItem(SESSION_KEY, JSON.stringify(sessions))

/* ================= SERVICE MODULE DATA DELETE ================= */
const serviceKeys = [
    "parkease_parking",
    "parkease_charging",
    "parkease_washing",
    "parkease_bookings"
]

serviceKeys.forEach(key => {
    let data = JSON.parse(localStorage.getItem(key)) || []
    data = data.filter(item => item.userEmail !== email)
    localStorage.setItem(key, JSON.stringify(data))
})

/* ================= 🔥 PAYMENT SYSTEM CASCADE FIX ================= */
let payments = JSON.parse(localStorage.getItem("parkease_payments")) || []

payments = payments.filter(p => p.userEmail !== email)

localStorage.setItem("parkease_payments", JSON.stringify(payments))

/* ================= CURRENT USER CLEANUP ================= */
const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY))

if (currentUser && currentUser.email === email) {
    localStorage.removeItem(CURRENT_USER_KEY)
}

/* ================= RESET STATE ================= */
selectedUserEmail = null
selectedUserIndex = null

alert("Account and ALL related data (including payments) deleted successfully")

loadSessions()
}

