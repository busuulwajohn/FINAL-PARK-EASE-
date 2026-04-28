const BOOKINGS_KEY = "parkease_bookings"
const PAYMENTS_KEY = "parkease_payments"
const CURRENT_USER_KEY = "parkease_currentUser"

/* VALIDATION */

function validateName(name){
return /^[A-Z][a-zA-Z ]+$/.test(name)
}

function validatePhone(phone){
return /^07\d{8}$/.test(phone)
}

/* CREATE BOOKING */

function createBooking(){

const name = document.getElementById("name").value.trim()
const type = document.getElementById("vehicleType").value.trim()
const id = document.getElementById("vehicleId").value.trim().toUpperCase()
const phone = document.getElementById("phone").value.trim()

const service = document.getElementById("service").value
const rate = Number(document.getElementById("plan").value)

const date = document.getElementById("date").value
const time = document.getElementById("time").value
const hours = Number(document.getElementById("hours").value || 1)

if(!name || !type || !id || !phone || !date || !time){
alert("Fill all fields")
return
}

if(!validateName(name)){
alert("Invalid name")
return
}

if(!validatePhone(phone)){
alert("Invalid phone")
return
}

let amount = 0

if(service === "Parking" || service === "Charging"){
amount = rate * hours
}else{
amount = rate
}

const receipt = "BKG-" + Date.now()

const user = JSON.parse(localStorage.getItem(CURRENT_USER_KEY))

/* SAVE BOOKING */

let bookings = JSON.parse(localStorage.getItem(BOOKINGS_KEY)) || []

bookings.push({
name,
type,
id,
phone,
service,
receipt,
amount,
date,
time,
hours,
userEmail: user?.email
})

localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings))

/* SAVE PAYMENT */

let payments = JSON.parse(localStorage.getItem(PAYMENTS_KEY)) || []

payments.push({
id: receipt,
transactionId: receipt,
service: "Booking - " + service,
amount,
date: new Date().toLocaleDateString(),
time: new Date().toLocaleTimeString(),
userEmail: user?.email
})

localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments))

/* RESULT */

document.getElementById("result").innerHTML = `
<p>✅ Booking Confirmed</p>
<p>Service: ${service}</p>
<p>Receipt: ${receipt}</p>
<p>Amount: UGX ${amount.toLocaleString()}</p>
<p>Date: ${date}</p>
<p>Time: ${time}</p>
`
}