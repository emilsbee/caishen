// External imports
import "reflect-metadata";
require('dotenv').config()

// Internal imports
import DatabaseConnection from "./DatabaseConnection";
import Server  from "./Server";

const server:Server = new Server()

const databaseConnection:DatabaseConnection = new DatabaseConnection()