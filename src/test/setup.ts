require('dotenv').config()

// Internal imports
import DatabaseConnection from "../DatabaseConnection"
import Server from "../Server"

let server:Server

before(() => {
    server = new Server()
    new DatabaseConnection()
})
