// External imports
import "reflect-metadata";
require('dotenv').config()
import {createConnection} from "typeorm";
const express = require('express')

// Internal imports
import paymentRouter from "./route/payment/paymentRoute"
import authRoute from "./route/authentication/authRoute"
import {authenticateJWT} from "./middleware/authenticateJWT"
import paymentListenerRouter from "./route/paymentListener/paymentListenerRoute"
import accountRouter from "./route/account/accountRoute"
/**
 * Establishes connection to sqlite3 and creates an express server.
 * Also defines routes and middleware.
 */
createConnection().then(async connection => {

    const app = express()
    const port:number = 3000

    app.use(express.json())
    
    app.use("/auth", authRoute)
    app.use("/payment", authenticateJWT, paymentRouter)
    app.use("/account", authenticateJWT, accountRouter)
    app.use("/paymentListener", paymentListenerRouter)

    app.get("/",authenticateJWT, (req, res) => {
        res.send("Hello there!")
    })

    app.use(function (error, req, res, next) {

        res.status(error.code).send({ message: error.message})
    })

    app.listen(port, () => {
        console.log("Listening on port ", port)
    })

}).catch(error => console.log(error));


