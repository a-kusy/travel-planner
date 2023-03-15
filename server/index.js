require('dotenv').config()
const express = require('express')
const cors = require('cors')
const userRoutes = require("./routes/users")
const tripRoutes = require("./routes/trips")
const authRoutes = require("./routes/auth")
const connection = require('./db')
const attractionRoutes = require("./routes/attractions")
const tokenVerification = require('./middleware/tokenVerification')
const app = express()

app.use(express.json())
app.use(cors())
const port = process.env.PORT || 8080

connection()

// routes
app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes)
app.use(tokenVerification)
app.use("/api/trips", tripRoutes)
app.use("/api/attractions", attractionRoutes)

app.listen(port, () => console.log(`Nasłuchiwanie na porcie ${port}`))
