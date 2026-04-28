const USERS_KEY = "parkease_users"
const CURRENT_USER_KEY = "parkease_currentUser"

/* ================= GET CURRENT USER ================= */
function getCurrentUser(){
    return JSON.parse(localStorage.getItem(CURRENT_USER_KEY))
}

/* ================= REQUIRE LOGIN ================= */
function requireLogin(){
    const user = getCurrentUser()
    if(!user){
        window.location.href = "index.html"
        return null
    }
    return user
}

const TRANSACTIONS_KEY = "parkease_transactions";

/* ================= TRANSACTIONS ================= */

function getTransactions() {
    return JSON.parse(localStorage.getItem(TRANSACTIONS_KEY)) || [];
}

function saveTransactions(data) {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(data));
}

// function addTransaction(amount, service = "Parking") {

//     const currentUser = getCurrentUser();
//     if (!currentUser) return;

//     const transactions = getTransactions();

//     const newTx = {
//         id: Date.now(),
//         userId: currentUser.id,
//         name: currentUser.fullName,
//         email: currentUser.email,
//         amount: Number(amount),
//         service: service,
//         date: new Date().toISOString(),
//         readableDate: new Date().toLocaleString()
//     };

//     transactions.push(newTx);
//     saveTransactions(transactions);
// }
function addTransaction(amount, service = "Parking") {

    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const transactions = getTransactions();

    const newTx = {
        id: Date.now(),
        userId: currentUser.id,
        name: currentUser.fullName,
        email: currentUser.email, 
        amount: Number(amount),
        service: service,
        date: new Date().toISOString(),
        readableDate: new Date().toLocaleString()
    };

    transactions.push(newTx);
    saveTransactions(transactions);
}
/* ================= DASHBOARD STATS ================= */

function getDashboardStats() {

    const transactions = getTransactions();

    const today = new Date().toDateString();

    let totalRevenue = 0;
    let totalTransactions = 0;
    let todayTransactions = 0;

    transactions.forEach(tx => {

        totalRevenue += tx.amount;
        totalTransactions++;

        if (new Date(tx.date).toDateString() === today) {
            todayTransactions++;
        }

    });

    return {
        totalRevenue,
        totalTransactions,
        todayTransactions
    };
}

/* ================= DELETE USER COMPLETELY ================= */
function deleteUserCompletely(userEmail){

    if(!userEmail) return

    /* REMOVE USER */
    let users = JSON.parse(localStorage.getItem(USERS_KEY)) || []
    users = users.filter(u => u.email !== userEmail)
    localStorage.setItem(USERS_KEY, JSON.stringify(users))

    /*  REMOVE FROM ALL SYSTEM DATA */
    const ALL_KEYS = [
        "parkease_parking",
        "parkease_charging",
        "parkease_washing",
        "parkease_bookings",
        "parkease_payments",
        "parkease_reports",  
        "parkease_receipts",  
        "parkease_sessions"
    ]

    ALL_KEYS.forEach(key => {
        let data = JSON.parse(localStorage.getItem(key)) || []
        data = data.filter(item =>
            item.userEmail !== userEmail &&
            item.email !== userEmail
        )
        localStorage.setItem(key, JSON.stringify(data))
    })

    /* LOGOUT IF CURRENT USER */
    const currentUser = getCurrentUser()

    if(currentUser?.email === userEmail){
        localStorage.removeItem(CURRENT_USER_KEY)
        window.location.href = "index.html"
    }

    alert("User and ALL related data deleted successfully")

    window.location.reload()
}