require('dotenv').config()

// Internal imports
import DatabaseConnection from "../DatabaseConnection"
import Server from "../server/Server"


before(async () => {
    let databaseConnection = new DatabaseConnection()
    let server:Server = new Server()
    await databaseConnection.startTestDb()
    await server.startServer()
})
