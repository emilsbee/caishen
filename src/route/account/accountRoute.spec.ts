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

    // Saves a valid account before each test.
    beforeEach(async () => {
        connection = database.getConnection()
        await connection.getRepository(Account).save(accountFixture.valid)
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
            .expect(201)
            .expect(function(res) {
                expect(res.body).to.have.length(1)
                expect(res.body[0].name).to.equal(accountFixture.valid.name)
            })
            .end(done)
    })
})