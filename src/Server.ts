// External imports
var express = require("express") 

// Internal imports
import paymentRouter from "./route/payment/paymentRoute"
import authRoute from "./route/authentication/authRoute"
import {authenticateJWT} from "./middleware/authenticateJWT"
import paymentListenerRouter from "./route/paymentListener/paymentListenerRoute"
import accountRouter from "./route/account/accountRoute"
import { Application } from "express";

export default class Server {
    static port:number = 3000

    app: Application

    constructor() {
        this.app = express()

        // Middleware
        this.app.use(express.json())
        
        // Routers
        this.app.use("/auth", authRoute)
        this.app.use("/payment", authenticateJWT, paymentRouter)
        this.app.use("/account", authenticateJWT, accountRouter)
        this.app.use("/paymentListener", paymentListenerRouter)
        
        // Error handlers
        this.startErrorHandler()

        // Server listener 
        this.startServer()
    } 

    /**
     * The final error handler route. 
     * 
     */
    startErrorHandler() {
        this.app.use(function (error, req, res, next) {
            let code:number = error.code || 500
            let message:string = error.message || "An error occured."

            res.status(code).send({ message})
        })
    }

    startServer() {
        this.app.listen(Server.port, () => {
            console.log("Server started on port ", Server.port)
        })
    }

    getApp() {
        return this.app
    }
}
