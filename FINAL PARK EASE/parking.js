const PARKING_KEY = "parkease_parking"
const PAYMENTS_KEY = "parkease_payments"
const CURRENT_USER_KEY = "parkease_currentUser"

let currentReceipt = null

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

const now = new Date()
const receipt = "RCPT-" + Date.now()

currentReceipt = receipt

const user = JSON.parse(localStorage.getItem(CURRENT_USER_KEY))

let parking = JSON.parse(localStorage.getItem(PARKING_KEY)) || []

parking.push({
driver,
type,         
plate,
phone,
receipt,
date,          
time,          
arrival: now.toISOString(),
status: "parked",
amount: 0,
userEmail: user?.email
})

localStorage.setItem(PARKING_KEY, JSON.stringify(parking))

alert("Vehicle Registered\nReceipt: " + receipt)

}

/* ================= PAYMENT ================= */

document.getElementById("parkingForm").addEventListener("submit", function(e){

e.preventDefault()

if(!currentReceipt){
alert("Register vehicle first")
return
}

const hours = Number(document.getElementById("hours").value)
const rate = Number(document.getElementById("plan").value)

const amount = hours * rate

const now = new Date()

const user = JSON.parse(localStorage.getItem(CURRENT_USER_KEY))

/* SAVE PAYMENT */

let payments = JSON.parse(localStorage.getItem(PAYMENTS_KEY)) || []

payments.push({
id: currentReceipt,
transactionId: currentReceipt,
service: "Parking",
amount: amount,
date: now.toLocaleDateString(), 
time: now.toLocaleTimeString(),
userEmail: user?.email
})

localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments))

/* UPDATE PARKING RECORD */

let parking = JSON.parse(localStorage.getItem(PARKING_KEY)) || []

let vehicle = parking.find(v => v.receipt === currentReceipt)

if(vehicle){
vehicle.amount = amount
}

localStorage.setItem(PARKING_KEY, JSON.stringify(parking))

document.getElementById("result").innerHTML = `
<p>Payment Saved</p>
<p>Receipt: ${currentReceipt}</p>
<p>Amount: UGX ${amount}</p>
`

})