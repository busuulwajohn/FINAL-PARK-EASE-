const API = "http://localhost:3000/api"

/* LOGIN */
async function login(email,password){

const res = await fetch(API+"/auth/login",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({email,password})
})

return res.json()
}

/* REGISTER */
async function register(data){

const res = await fetch(API+"/auth/register",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify(data)
})

return res.json()
}

/* SAVE SERVICE */
async function saveService(data){

const res = await fetch(API+"/services/add",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify(data)
})

return res.json()
}

/* GET REPORT */
async function getReport(email,role){

const res = await fetch(API+`/reports/${email}/${role}`)
return res.json()

}