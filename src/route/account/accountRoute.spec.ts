// External imports
var request = require("supertest")
import chai from "chai"
import { Connection } from "typeorm"

// Internal imports
import { Account } from "../../entity/account/account"
import Server from "../../server/Server"
import {accountFixture} from "../../test/fixtures"
import {database} from "../../test/setup"

var expect = chai.expect

// Constants
const port:number = Server.port
let connection:Connection


describe("DELETE /account", function() {
    // Saves a valid account before the tests.
    this.beforeAll(async () => {
        connection = database.getConnection()
        await connection.getRepository(Account).save(accountFixture.valid)
    })

    // Checks in the database that indeed the account was deleted after all the tests.
    this.afterAll(async () => {
        connection = database.getConnection()
        expect(await connection.getRepository(Account).find()).to.have.length(0)
    })

    
    it("Responds with 404 when no accountid is provided.", function(done) {
        request(`http://localhost:${port}`)
            .del("/account")
            .send()
            .set({Authorization: 'Bearer '+process.env.TEST_VALID_SESSION_TOKEN})
            .expect(404, done)
    })

    it("Responds with 404 when provided with invalid accountid.", function(done) {
        request(`http://localhost:${port}`)
            .del("/account")
            .send({accountid: "badid"})
            .set({Authorization: 'Bearer '+process.env.TEST_VALID_SESSION_TOKEN})
            .expect(404, done)
    })


    it("Responds with 200 when provided with a valid accountid and checks that the account was deleted.", function(done) {
        request(`http://localhost:${port}`)
            .del("/account")
            .send({accountid: accountFixture.valid.id})
            .set({Authorization: 'Bearer '+process.env.TEST_VALID_SESSION_TOKEN})
            .expect(200, done)
    })
})


describe("POST /account", function() {
    // Checks that after all tests that there's only one created account
    this.afterAll(async () => {        
        connection = database.getConnection()
        expect(await connection.getRepository(Account).find()).to.have.length(1)
    })

    it ('Responds with 400 when no account name is provided.', function(done) {
        request(`http://localhost:${port}`)
            .post("/account")
            .send(accountFixture.noName)
            .set({Authorization: 'Bearer '+process.env.TEST_VALID_SESSION_TOKEN})
            .expect(400, done)
    })

    it ('Responds with 400 when no account type is provided.', function(done) {
        request(`http://localhost:${port}`)
            .post("/account")
            .send(accountFixture.noType)
            .set({Authorization: 'Bearer '+process.env.TEST_VALID_SESSION_TOKEN})
            .expect(400, done)
    })


    it ('Responds with 400 when invalid account type is provided.', function(done) {
        request(`http://localhost:${port}`)
            .post("/account")
            .send(accountFixture.invalidType)
            .set({Authorization: 'Bearer '+process.env.TEST_VALID_SESSION_TOKEN})
            .expect(400, done)
    })

    it ('Responds with 400 when no currency is provided.', function(done) {
        request(`http://localhost:${port}`)
            .post("/account")
            .send(accountFixture.noCurrency)
            .set({Authorization: 'Bearer '+process.env.TEST_VALID_SESSION_TOKEN})
            .expect(400, done)
    })


    it ('Responds with 400 when invalid currency is provided.', function(done) {
        request(`http://localhost:${port}`)
            .post("/account")
            .send(accountFixture.invalidCurrency)
            .set({Authorization: 'Bearer '+process.env.TEST_VALID_SESSION_TOKEN})
            .expect(400, done)
    })


    it ('Responds with 201 and the created account. Also checks that the account was indeed created in database.', function(done) {
        request(`http://localhost:${port}`)
            .post("/account")
            .send(accountFixture.valid)
            .set({Authorization: 'Bearer '+process.env.TEST_VALID_SESSION_TOKEN})
            .expect(function(res) {
                expect(res.body).to.have.length(1)
                expect(res.body[0].name).to.equal(accountFixture.valid.name)
            })
            .expect(201)
            .end(done)
    })
})

describe("GET /account/all", function() {
    // Saves two accounts before the test.
    this.beforeAll(async () => {
        connection = database.getConnection()
        await connection.getRepository(Account).save(accountFixture.valid)
        await connection.getRepository(Account).save(accountFixture.valid2)
    })

    // Clears the database of accounts after all tests.
    this.afterAll(async () => {
        connection = database.getConnection()
        await connection.getRepository(Account).clear()
    })

    it("Responds with 200 and returns all accounts currently in database.", function(done) {
        request(`http://localhost:${port}`)
            .get("/account/all")
            .set({Authorization: 'Bearer '+process.env.TEST_VALID_SESSION_TOKEN})
            .expect(function(res) {
                expect(res.body).to.have.length(2)
            })
            .expect(200)
            .end(done)
    })
})

describe("GET /account", function() {
    // Populate database with an account before the tests.
    this.beforeAll(async () => {
        connection = database.getConnection()
        await connection.getRepository(Account).save(accountFixture.valid)
    })

    // Clears the database of accounts after all tests.
    this.afterAll(async () => {
        connection = database.getConnection()
        await connection.getRepository(Account).clear()
    })


    it("Responds with 200 and the account currently saved in the database.", function(done) {
        request(`http://localhost:${port}`)
            .get("/account")
            .send({accountid: accountFixture.valid.id})
            .set({Authorization: 'Bearer '+process.env.TEST_VALID_SESSION_TOKEN})
            .expect(function(res) {
                expect(res.body).to.have.length(1)
            })
            .expect(200)
            .end(done)
    })

    it("Responds with 200 when invalid accountid is provided but retrieves no account.", function(done) {
        request(`http://localhost:${port}`)
            .get("/account")
            .send({accountid: "badid"})
            .set({Authorization: 'Bearer '+process.env.TEST_VALID_SESSION_TOKEN})
            .expect(function(res) {
                expect(res.body).to.have.length(0)
            })
            .expect(200)
            .end(done)
    })

    it("Responds with 400 when no accountid is provided.", function(done) {
        request(`http://localhost:${port}`)
            .get("/account")
            .set({Authorization: 'Bearer '+process.env.TEST_VALID_SESSION_TOKEN})
            .expect(400)
            .end(done)
    })
})