const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")

const app = express()

app.use(cors())
app.use(bodyParser.json())

/* ROUTES */
app.use("/api/auth", require("./routes/auth"))
app.use("/api/services", require("./routes/services"))
app.use("/api/reports", require("./routes/reports"))

app.listen(3000, () => {
console.log("Server running on http://localhost:3000")
})