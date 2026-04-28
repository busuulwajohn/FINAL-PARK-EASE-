const express = require("express")
const router = express.Router()
const db = require("../db")

/* REGISTER */
router.post("/register", (req,res)=>{

const {fullName,email,phone,password,role} = req.body

db.run(
`INSERT INTO users(fullName,email,phone,password,role)
VALUES(?,?,?,?,?)`,
[fullName,email,phone,password,role || "user"],
function(err){
if(err) return res.json({success:false,message:"Email exists"})
res.json({success:true})
})

})

/* LOGIN */
router.post("/login",(req,res)=>{

const {email,password} = req.body

db.get(
`SELECT * FROM users WHERE email=? AND password=?`,
[email,password],
(err,user)=>{
if(!user) return res.json({success:false})
res.json({success:true,user})
})

})

module.exports = router