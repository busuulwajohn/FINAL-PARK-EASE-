const CHARGING_KEY = "parkease_charging"
const PAYMENTS_KEY = "parkease_payments"
const CURRENT_USER_KEY = "parkease_currentUser"

let currentChargeId = null

/* ================= VALIDATION ================= */

function validateName(name){
return /^[A-Z][a-zA-Z ]+$/.test(name)
}

function validatePhone(phone){
return /^07\d{8}$/.test(phone)
}

function validateBatteryId(id){
return id.length >= 3
}

/* ================= REGISTER ================= */

function registerBattery(){

const owner = document.getElementById("ownerName").value.trim()
const type = document.getElementById("batteryType").value.trim()
const batteryId = document.getElementById("batteryId").value.trim().toUpperCase()
const phone = document.getElementById("phone").value.trim()
const date = document.getElementById("date").value
const time = document.getElementById("time").value

if(!owner || !type || !batteryId || !phone || !date || !time){
alert("Fill all fields")
return
}

if(!validateName(owner)){
alert("Invalid name")
return
}

if(!validatePhone(phone)){
alert("Invalid phone number (use 07XXXXXXXX)")
return
}

if(!validateBatteryId(batteryId)){
alert("Invalid Battery ID")
return
}

const receipt = "CHG-" + Date.now()
currentChargeId = receipt

const user = JSON.parse(localStorage.getItem(CURRENT_USER_KEY))

let charging = JSON.parse(localStorage.getItem(CHARGING_KEY)) || []

charging.push({
owner,
type,
batteryId,
phone,
receipt,
date,
time,
amount: 0,
service: "Charging",
userEmail: user?.email
})

localStorage.setItem(CHARGING_KEY, JSON.stringify(charging))

alert("Battery Registered\nReceipt: " + receipt)

}

/* ================= PAYMENT ================= */

document.getElementById("chargingForm").addEventListener("submit", function(e){

e.preventDefault()

if(!currentChargeId){
alert("Register battery first")
return
}

const hours = Number(document.getElementById("hours").value)
const rate = Number(document.getElementById("rate").value)

if(hours <= 0){
alert("Enter valid hours")
return
}

const amount = hours * rate
const now = new Date()

const user = JSON.parse(localStorage.getItem(CURRENT_USER_KEY))

/* SAVE PAYMENT */

let payments = JSON.parse(localStorage.getItem(PAYMENTS_KEY)) || []

payments.push({
id: currentChargeId,
transactionId: currentChargeId,
service: "Charging",
amount: amount,
date: now.toLocaleDateString(),
time: now.toLocaleTimeString(),
userEmail: user?.email
})

localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments))

/* UPDATE CHARGING RECORD */

let charging = JSON.parse(localStorage.getItem(CHARGING_KEY)) || []

let item = charging.find(c => c.receipt === currentChargeId)

if(item){
item.amount = amount
}

localStorage.setItem(CHARGING_KEY, JSON.stringify(charging))

/* RESULT UI */

document.getElementById("result").innerHTML = `
<p>✅ Charging Payment Saved</p>
<p>Receipt: ${currentChargeId}</p>
<p>Amount: UGX ${amount.toLocaleString()}</p>
`

})