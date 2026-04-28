const express = require("express")
const router = express.Router()
const db = require("../db")

/* SAVE SERVICE (Parking, Charging, Washing, Booking) */
router.post("/add",(req,res)=>{

const {service,name,identifier,phone,amount,receipt,userEmail} = req.body

const date = new Date().toISOString()

db.run(
`INSERT INTO services(service,name,identifier,phone,amount,receipt,date,userEmail)
VALUES(?,?,?,?,?,?,?,?)`,
[service,name,identifier,phone,amount,receipt,date,userEmail],
(err)=>{
if(err) return res.json({success:false})
res.json({success:true})
})

})

module.exports = router