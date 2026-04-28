const CURRENT_USER_KEY = "parkease_currentUser"

/* ================= ROLE ACCESS ================= */

function checkAccess(allowedRoles){

    const user = JSON.parse(localStorage.getItem(CURRENT_USER_KEY))

    if(!user){
        alert("Login required")
        window.location.href = "index.html"
        return
    }

    if(!allowedRoles.includes(user.role)){
        alert("Access Denied")
        window.location.href = "dashboard.html"
    }
}

/* ================= AUTO CONTROL ================= */

document.addEventListener("DOMContentLoaded", () => {

    const user = JSON.parse(localStorage.getItem(CURRENT_USER_KEY))
    if(!user) return

    const role = user.role

    /* HIDE UI */
    if(role === "user"){
        document.querySelectorAll(".admin-only,.manager-only")
        .forEach(el => el.style.display="none")
    }

    if(role === "manager"){
        document.querySelectorAll(".admin-only")
        .forEach(el => el.style.display="none")
    }
})