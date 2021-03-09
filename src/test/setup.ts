require('dotenv').config()

// Internal imports
import DatabaseConnection from "../DatabaseConnection"
import Server from "../server/Server"

let server:Server

before(async () => {
    let databaseConnection = new DatabaseConnection()
    await databaseConnection.startTestDb()
    server = new Server()
})
