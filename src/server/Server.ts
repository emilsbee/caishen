// External imports
var express = require("express") 
import { Application } from "express";

// Internal imports
import paymentRouter from "../route/payment/paymentRoute"
import authRoute from "../route/authentication/authRoute"
import paymentListenerRouter from "../route/paymentListener/paymentListenerRoute"
import accountRouter from "../route/account/accountRoute"
import paymentCategoryRouter from "../route/paymentCategory/paymentCategoryRoute"
import continuousDeploymentRouter from "../route/continuousDeployment/continuousDeploymentRoute"
import {authenticateJWT} from "../middleware/authenticateJWT"
import testRoutes from "../test/testRoutes"
import logger from "../middleware/logger"

/**
 * After creating a new instance of a server, the method startServer() method
 * has to be called to start the server listening.
 */
export default class Server {
    public static port:number = 3000 // Port on which server is always started

    private app: Application // Express app instance

    public constructor(logging:boolean) {
        this.app = express()

        // Middleware
        this.app.use(express.json())

        if (process.env.NODE_ENV === "development" && logging) {
            this.app.use(logger)
        }
        
        // Routers
        this.app.use("/auth", authRoute)
        this.app.use("/payment", authenticateJWT, paymentRouter)
        this.app.use("/account", authenticateJWT, accountRouter)
        this.app.use("/paymentListener", paymentListenerRouter)
        this.app.use("/payment-category", paymentCategoryRouter)
        this.app.use("/continuous-deployment", continuousDeploymentRouter)
        
        // Setup test routes
        if (process.env.NODE_ENV === "test") {
            this.app.use("/test", testRoutes)
        }

        // Error handlers
        this.startErrorHandler()
    } 

    

    /**
     * The final error handler route. 
     */
    public startErrorHandler():void {
        this.app.use(function (error, req, res, next) {
            let code:number = error.code || 500
            let message:string = error.message || "An error occured."

            res.status(code).json({message})
        })
    }

    /**
     * Starts the server.
     */
    public startServer():void {
        this.app.listen(Server.port)
    }

    /**
     * Getter for express app instance.
     * @returns Express app instance.
     */
    public getApp():Application {
        return this.app
    }
}
