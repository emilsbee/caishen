// External imports
var request = require("supertest")
import chai from "chai"

// Internal imports
import Server from "../../server/Server"
import {accountFixture} from "../../test/fixtures"

var expect = chai.expect

// Constants
const port:number = Server.port


describe("account route", function() {
    
    it ('POST /account Responds with 400 when no account name is provided.', function(done) {
        request(`http://localhost:${port}`)
            .post("/account")
            .send(accountFixture.noName)
            .set({Authorization: 'Bearer '+process.env.TEST_VALID_SESSION_TOKEN})
            .expect(400, done)
    })

    it ('POST /account Responds with 400 when no account type is provided.', function(done) {
        request(`http://localhost:${port}`)
            .post("/account")
            .send(accountFixture.noType)
            .set({Authorization: 'Bearer '+process.env.TEST_VALID_SESSION_TOKEN})
            .expect(400, done)
    })


    it ('POST /account Responds with 400 when invalid account type is provided.', function(done) {
        request(`http://localhost:${port}`)
            .post("/account")
            .send(accountFixture.invalidType)
            .set({Authorization: 'Bearer '+process.env.TEST_VALID_SESSION_TOKEN})
            .expect(400, done)
    })

    it ('POST /account Responds with 400 when no currency is provided.', function(done) {
        request(`http://localhost:${port}`)
            .post("/account")
            .send(accountFixture.noCurrency)
            .set({Authorization: 'Bearer '+process.env.TEST_VALID_SESSION_TOKEN})
            .expect(400, done)
    })


    it ('POST /account Responds with 400 when invalid currency is provided.', function(done) {
        request(`http://localhost:${port}`)
            .post("/account")
            .send(accountFixture.invalidCurrency)
            .set({Authorization: 'Bearer '+process.env.TEST_VALID_SESSION_TOKEN})
            .expect(400, done)
    })

    it ('POST /account Responds with 202 and the created account.', function(done) {
        request(`http://localhost:${port}`)
            .post("/account")
            .send(accountFixture.valid)
            .set({Authorization: 'Bearer '+process.env.TEST_VALID_SESSION_TOKEN})
            .expect(202)
            .expect(function(res) {
                
                expect(res.body).to.have.length(1)
                expect(res.body[0].name).to.equal(accountFixture.valid.name)
            })
            .end(done)
    })
})