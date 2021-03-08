import DatabaseConnection from "../DatabaseConnection"
import Server from "../Server"

before(() => {
    new Server()
    new DatabaseConnection()
})