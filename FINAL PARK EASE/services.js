// ================================
// SERVICES SYSTEM (PER USER)
// ================================

function getPayments() {
    return JSON.parse(localStorage.getItem("parkease_payments")) || [];
}

function savePayments(payments) {
    localStorage.setItem("parkease_payments", JSON.stringify(payments));
}

// Save payment PER USER
function savePayment(service, amount) {

    const currentUser = getCurrentUser();
    if (!currentUser) return;

    let payments = getPayments();

    const payment = {
        id: "TXN" + Date.now(),
        userEmail: currentUser.email,
        service: service,
        amount: Number(amount),
        status: "Completed",
        date: new Date().toISOString()
    };

    payments.push(payment);
    savePayments(payments);

    return payment;
}

// Generic form processor
function activateService(formId, hoursId, planId, resultId, serviceName) {

    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const hoursElement = hoursId ? document.getElementById(hoursId) : null;
        const rate = Number(document.getElementById(planId).value);

        let total = rate;

        if (hoursElement) {
            const hours = Number(hoursElement.value);
            total = hours * rate;
        }

        const payment = savePayment(serviceName, total);

        document.getElementById(resultId).innerHTML =
            `Payment Successful<br>
             ID: ${payment.id}<br>
             Amount: $${total}`;
    });
}


document.addEventListener("DOMContentLoaded", () => {

    requireLogin();

    activateService("parkingForm", "parkingHours", "parkingPlan", "parkingResult", "Parking");
    activateService("chargingForm", "chargingHours", "chargingPlan", "chargingResult", "Charging");
    activateService("washForm", null, "washPlan", "washResult", "Car Wash");
    activateService("bookingForm", "bookingHours", "bookingPlan", "bookingResult", "Booking");
});

function activateService(formId, hoursId, planId, resultId, serviceName){

    const form = document.getElementById(formId);
    if(!form) return;

    form.addEventListener("submit", function(e){
        e.preventDefault();

        const rate = Number(document.getElementById(planId).value);
        let total = rate;

        if(hoursId){
            const hours = Number(document.getElementById(hoursId).value);
            total = hours * rate;
        }

        const payment = savePayment(serviceName,total);

        document.getElementById(resultId).innerHTML =
            `Payment Successful <br>
             ID: ${payment.id} <br>
             Amount: UGX ${total.toLocaleString()}`;
    });
}


// =======PARKING FEE GENERATION======//
const PARKING_KEY = "parkease_parking"

function calculateFee(type, hours, time){

let isNight = (time >= 19 || time < 6)

if(type === "Truck"){
if(hours < 3) return 2000
return isNight ? 10000 : 5000
}

if(type === "Personal Car" || type === "Taxi"){
if(hours < 3) return 2000
return isNight ? 2000 : 3000
}

if(type === "Coaster"){
if(hours < 3) return 3000
return isNight ? 2000 : 4000
}

if(type === "Boda-boda"){
if(hours < 3) return 1000
return 2000
}

return 0
}


// ==========REGISTER VEHICLE RECIEPT==========//
function registerVehicle(){

const driver = document.getElementById("driverName").value
const type = document.getElementById("vehicleType").value
const plate = document.getElementById("numberPlate").value

const now = new Date()

const receipt = "RCPT-" + Math.floor(Math.random()*1000000)

let records = JSON.parse(localStorage.getItem(PARKING_KEY)) || []

records.push({
driver,
type,
plate,
arrival: now.toISOString(),
receipt,
status: "parked"
})

localStorage.setItem(PARKING_KEY, JSON.stringify(records))

alert("Vehicle Registered\nReceipt: " + receipt)

}


// =======RECIEPT VALIDATION==========//
function validateName(name){
return /^[A-Z][a-zA-Z ]+$/.test(name)
}

function validatePlate(plate){
return /^U[A-Z0-9]{1,5}$/.test(plate)
}

function validatePhone(phone){
return /^07\d{8}$/.test(phone)
}