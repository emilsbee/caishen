require('dotenv').config()

// Internal imports
import DatabaseConnection from "../DatabaseConnection"
import Server from "../server/Server"

export let database:DatabaseConnection
export let server:Server

/**
 * Sets up the server before all tests.
 */
before(async () => {
    server = new Server()
    server.startServer()
})

/**
 * Before each test, the database is dropped and a new connection made.
 */
beforeEach(async () => {
    if (database && database.getConnection().isConnected) {
        await database.getConnection().dropDatabase()
        await database.close()
    }

    database = new DatabaseConnection()
    await database.startTestDb()
})

/**
 * After all the tests, drops the database and closes connection.
 */
after(async () => {
    await database.getConnection().dropDatabase()
    await database.close()
})