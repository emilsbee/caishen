// External imports
import "reflect-metadata";
require('dotenv').config()
import {createConnection} from "typeorm";
const express = require('express')

// Internal imports
import paymentRouter from "./route/payment/paymentRoute"
import authRoute,{authenticateJWT} from "./route/authentication/authRoute"

/**
 * Establishes connection to sqlite3 and creates an express server.
 * Also defines routes and middleware.
 */
createConnection().then(async connection => {

    const app = express()
    const port:number = 3000

    app.use(express.json())
    
    app.use("/payment", authenticateJWT, paymentRouter)
    app.use("/auth", authRoute)
    
    app.use(function (err, req, res, next) {
        console.log("ERROR:", err)
        res.status(400).send(err)
    })

    app.listen(port, () => {
        console.log("Listening on port ", port)
    })

}).catch(error => console.log(error));


