// function signOutVehicle(){

// const receipt = document.getElementById("receiptInput").value

// let records = JSON.parse(localStorage.getItem("parkease_parking")) || []

// let vehicle = records.find(v => v.receipt === receipt)

// if(!vehicle){
// alert("Invalid Receipt")
// return
// }

// let now = new Date()

// let hours = Math.ceil((now - new Date(vehicle.arrival)) / (1000*60*60))

// let fee = calculateFee(vehicle.type, hours, now.getHours())

// vehicle.status = "out"
// vehicle.exit = now.toISOString()
// vehicle.amount = fee

// localStorage.setItem("parkease_parking", JSON.stringify(records))

// alert("Vehicle Signed Out\nFee: UGX " + fee)

// }


const PARKING_KEY="parkease_parking"

/* CALCULATE FEES */

function calculateFee(type, hours, hourNow){

let night = (hourNow >= 19 || hourNow < 6)

if(type === "Truck"){
if(hours < 3) return 2000
return night ? 10000 : 5000
}

if(type === "Personal Car" || type==="Taxi"){
if(hours < 3) return 2000
return night ? 2000 : 3000
}

if(type === "Coaster"){
if(hours < 3) return 3000
return night ? 2000 : 4000
}

if(type === "Boda-boda"){
if(hours < 3) return 1000
return 2000
}

return 0
}

/* SIGN OUT */

function signOutVehicle(){

const receipt = document.getElementById("receiptInput").value

let data = JSON.parse(localStorage.getItem(PARKING_KEY)) || []

let vehicle = data.find(v=>v.receipt===receipt)

if(!vehicle){
alert("Invalid Receipt")
return
}

let now = new Date()

let hours = Math.ceil((now - new Date(vehicle.arrival))/(1000*60*60))

let fee = calculateFee(vehicle.type, hours, now.getHours())

vehicle.exit = now.toISOString()
vehicle.amount = fee
vehicle.status="out"
vehicle.exit = new Date().toISOString()
vehicle.amount = fee

localStorage.setItem(PARKING_KEY, JSON.stringify(data))

alert("Signed Out\nFee: UGX "+fee)

}

// UPDATE PAYMENT RECORD
let payments = JSON.parse(localStorage.getItem("parkease_payments")) || []

let payment = payments.find(p => p.id === vehicle.receipt)

if(payment){
payment.amount = fee
}

localStorage.setItem("parkease_payments", JSON.stringify(payments))