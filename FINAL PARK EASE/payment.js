const PAYMENTS_KEY="parkease_payments"
const CURRENT_USER_KEY="parkease_currentUser"

const list=document.getElementById("activityList")
const totalAmount=document.getElementById("totalAmount")
const count=document.getElementById("transactionCount")
const searchInput=document.getElementById("searchInput")

let transactions=[]

/* LOAD USER TRANSACTIONS */

function loadTransactions(){

const user=JSON.parse(localStorage.getItem(CURRENT_USER_KEY))

if(!user) return []

let all=JSON.parse(localStorage.getItem(PAYMENTS_KEY))||[]

return all.filter(t=>t.userEmail===user.email)

}

transactions=loadTransactions()

renderActivities("all")

/* FILTER BUTTONS */

document.querySelectorAll(".filter").forEach(btn=>{

btn.addEventListener("click",()=>{

document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"))

btn.classList.add("active")

renderActivities(btn.dataset.type)

})

})

/* SEARCH FUNCTION */

searchInput.addEventListener("input",()=>{

renderActivities(
document.querySelector(".filter.active").dataset.type
)

})

/* RENDER FUNCTION */

function renderActivities(type){

list.innerHTML=""

let filtered=loadTransactions()

if(type!=="all"){

filtered=filtered.filter(t=>t.service.toLowerCase().includes(type))

}

/* SEARCH FILTER */

const keyword=searchInput.value.toLowerCase()

if(keyword){

filtered=filtered.filter(t=>

(t.transactionId && t.transactionId.toLowerCase().includes(keyword)) ||

(t.service && t.service.toLowerCase().includes(keyword)) ||

(t.date && new Date(t.date).toLocaleString().toLowerCase().includes(keyword))

)

}

let total=0

filtered.forEach(t=>{

total+=Number(t.amount)

list.innerHTML+=createCard(t)

})

count.textContent=filtered.length
totalAmount.textContent="UGX "+total.toLocaleString()

}

/* CARD TEMPLATE */

function createCard(t){

let icon="fa-receipt"

if(t.service.includes("Parking")) icon="fa-car"
if(t.service.includes("Charging")) icon="fa-bolt"
if(t.service.includes("Booking")) icon="fa-calendar-check"
if(t.service.includes("Washing")) icon="fa-soap"

return `

<div class="activity-card">

<div class="activity-top">

<div class="activity-title">
<i class="fa-solid ${icon}"></i>
${t.service}
</div>

<div class="amount">
UGX ${Number(t.amount).toLocaleString()}
</div>

</div>

<div class="tags">

<span class="tag">TX: ${t.transactionId || "N/A"}</span>

${t.station ? `<span class="tag">Station: ${t.station}</span>`:""}

${t.energy ? `<span class="tag">Energy: ${t.energy} kWh</span>`:""}

</div>

<div class="time">

${new Date(t.date).toLocaleString("en-UG", {
    timeZone: "Africa/Kampala",
    dateStyle: "medium",
    timeStyle: "short"
})}

</div>

</div>

`

}

/* INITIAL LOAD */

renderActivities("all")

/* AUTO REFRESH WHEN PAGE FOCUSED */

window.addEventListener("focus", ()=>{

renderActivities("all")

})