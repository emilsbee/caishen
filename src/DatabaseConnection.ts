// External imports
import {Connection, createConnection} from "typeorm";

/**
 * Manages the connection to the database.
 */
export default class DatabaseConnection {
    private connection: Connection

    /**
     * Getter for connection.
     * @returns Connection to the database.
     */
    public getConnection = ():Connection => {
        return this.connection
    }

    /**
     * Starts the development/test database.
     */
    public async startDb():Promise<void> {
        try {
            this.connection = await createConnection({
                    type: "postgres",
                    host: process.env.DB_IP,
                    port: 5432,
                    username: "postgres",
                    password: process.env.DB_PASS,
                    database: "postgres",
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
            console.info("Database connection created.")
        } catch (e) {
            console.error("Failed to start the database. ERROR: ", e)
        }
    }

    /**
     * Starts the test database.
     */
    public async startTestDb():Promise<void> {
        try {
            this.connection = await createConnection({
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
        } catch (e) {
            console.error("Failed to start the test database. ERROR: ", e)
        }
    }

    /**
     * Closes the current database connection if it exists.
     */
    public async close():Promise<void> {
        if (this.connection && this.connection.isConnected) {
            try {
                await this.connection.close()
            } catch (e) {
                console.error(e)
            }
        }
    }
}





