document.addEventListener("DOMContentLoaded",()=>{

const modal=document.getElementById("authModal");

// FIXED OPEN
function openModal(){modal.classList.add("show");}
function closeModal(){modal.classList.remove("show");}

// EVENTS
document.getElementById("profileBtn").onclick=openModal;
document.getElementById("ctaBtn").onclick=openModal;
document.getElementById("closeBtn").onclick=closeModal;

window.onclick=(e)=>{if(e.target===modal)closeModal();};

// TABS
document.querySelectorAll(".tab").forEach(tab=>{
 tab.onclick=()=>{
  document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
  document.querySelectorAll(".tab-content").forEach(c=>c.classList.remove("active"));
  tab.classList.add("active");
  document.getElementById(tab.dataset.tab).classList.add("active");
 }
});

// REGISTER
document.getElementById("registerBtn").onclick=()=>{
const user={
 name:regName.value,
 email:regEmail.value,
 phone:regPhone.value,
 role:regRole.value,
 password:regPassword.value
};
let users=JSON.parse(localStorage.getItem("parkease_users")||"[]");
users.push(user);
localStorage.setItem("parkease_users",JSON.stringify(users));
alert("Account created");
};

// LOGIN
document.getElementById("loginBtn").onclick=()=>{
let users=JSON.parse(localStorage.getItem("parkease_users")||"[]");
const user=users.find(u=>u.email===loginEmail.value && u.password===loginPassword.value && u.role===loginRole.value);
if(!user){alert("Invalid credentials");return;}
localStorage.setItem("parkease_currentUser",JSON.stringify(user));
if(user.role==='admin')location.href="admindb.html";
if(user.role==='manager')location.href="managerdb.html";
if(user.role==='attendant')location.href="attendantdb.html";
};

});