// Internal imports
require('dotenv').config()
import DatabaseConnection from "../DatabaseConnection"
import Server from "../server/Server"


export let database:DatabaseConnection
export let server:Server

/**
 * Sets up the server and database connection before all tests.
 */
before(async () => {
    database = new DatabaseConnection()
    await database.startTestDb()    
    server = new Server(false)
    server.startServer()
})

/**
 * After all the tests, drops the database and closes connection.
 */
after(async () => {
    await database.getConnection().dropDatabase()
    await database.close()
})