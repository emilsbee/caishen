// External imports
import "reflect-metadata";
require('dotenv').config()

// Internal imports
import DatabaseConnection from "./DatabaseConnection";
import Server  from "./server/Server";

const findArgvFlag = (flag:string):boolean => {
    let exists = false
    process.argv.forEach(arg => {
        if (arg === flag) {
            exists = true
        }
    }) 
    return exists
}

const startApp = async () => {
    const databaseConnection:DatabaseConnection = new DatabaseConnection()

    let logging = findArgvFlag("--log")
    const server:Server = new Server(logging)
    
    await databaseConnection.startDb()
    await server.startServer()

}

startApp()
