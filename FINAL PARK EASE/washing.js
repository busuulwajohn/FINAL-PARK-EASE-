const WASHING_KEY = "parkease_washing"
const PAYMENTS_KEY = "parkease_payments"
const CURRENT_USER_KEY = "parkease_currentUser"

let currentWashReceipt = null

/* ================= VALIDATION ================= */

function validateName(name){
return /^[A-Z][a-zA-Z ]+$/.test(name)
}

function validatePhone(phone){
return /^07\d{8}$/.test(phone)
}

function validatePlate(plate){
return plate.length >= 3
}

/* ================= REGISTER ================= */

function registerVehicle(){

const driver = document.getElementById("driverName").value.trim()
const type = document.getElementById("vehicleType").value.trim()
const plate = document.getElementById("numberPlate").value.trim().toUpperCase()
const phone = document.getElementById("phone").value.trim()
const date = document.getElementById("date").value
const time = document.getElementById("time").value

if(!driver || !type || !plate || !phone || !date || !time){
alert("Fill all fields")
return
}

if(!validateName(driver)){
alert("Invalid name")
return
}

if(!validatePhone(phone)){
alert("Invalid phone (use 07XXXXXXXX)")
return
}

if(!validatePlate(plate)){
alert("Invalid plate")
return
}

const receipt = "WSH-" + Date.now()
currentWashReceipt = receipt

const user = JSON.parse(localStorage.getItem(CURRENT_USER_KEY))

let washing = JSON.parse(localStorage.getItem(WASHING_KEY)) || []

washing.push({
driver,
type,
plate,
phone,
receipt,
date,
time,
amount: 0,
service: "Washing",
userEmail: user?.email
})

localStorage.setItem(WASHING_KEY, JSON.stringify(washing))

alert("Vehicle Registered\nReceipt: " + receipt)

}

/* ================= PAYMENT ================= */

document.getElementById("washingForm").addEventListener("submit", function(e){

e.preventDefault()

if(!currentWashReceipt){
alert("Register vehicle first")
return
}

const amount = Number(document.getElementById("washType").value)

const now = new Date()

const user = JSON.parse(localStorage.getItem(CURRENT_USER_KEY))

/* SAVE PAYMENT */

let payments = JSON.parse(localStorage.getItem(PAYMENTS_KEY)) || []

payments.push({
id: currentWashReceipt,
transactionId: currentWashReceipt,
service: "Washing",
amount: amount,
date: now.toLocaleDateString(),
time: now.toLocaleTimeString(),
userEmail: user?.email
})

localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments))

/* UPDATE WASH RECORD */

let washing = JSON.parse(localStorage.getItem(WASHING_KEY)) || []

let vehicle = washing.find(v => v.receipt === currentWashReceipt)

if(vehicle){
vehicle.amount = amount
}

localStorage.setItem(WASHING_KEY, JSON.stringify(washing))

/* RESULT */

document.getElementById("result").innerHTML = `
<p>✅ Washing Payment Saved</p>
<p>Receipt: ${currentWashReceipt}</p>
<p>Amount: UGX ${amount.toLocaleString()}</p>
`

})