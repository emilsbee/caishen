// External imports
import "reflect-metadata";
require('dotenv').config()

// Internal imports
import DatabaseConnection from "./DatabaseConnection";
import Server  from "./server/Server";

const databaseConnection:DatabaseConnection = new DatabaseConnection()

const server:Server = new Server()
