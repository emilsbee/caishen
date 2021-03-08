// External imports
import {createConnection} from "typeorm";



export default class DatabaseConnection {

    constructor() {

        if (process.env.NODE_ENV === "test") {
            this.startTestDb()
        } else {
            this.startDb()    
        }

    } 

    async startDb() {
        try {
            await createConnection()
            console.log("Database connection created.")
        } catch (e) {
            console.log("Failed to start the database. ERROR: ", e)
        }
    }

    async startTestDb() {
        try {
            await createConnection({
                
                type: "sqlite",
                database: "testdatabase.sqlite",
                dropSchema: true,
                synchronize: true,
                logging: false,
                entities: [
                    "src/entity/**/*.ts"
                ],
                migrations: [
                    "src/migration/**/*.ts"
                ],
                subscribers: [
                    "src/subscriber/**/*.ts"
                ],
                cli: {
                    entitiesDir: "src/entity",
                    migrationsDir: "src/migration",
                    subscribersDir: "src/subscriber"
                }
                 
            })
        } catch(e) {
            console.log("Failed to start the test database. ERROR: ", e)
        }
    }
}





