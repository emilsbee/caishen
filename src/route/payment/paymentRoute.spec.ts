// External imports
var request = require("supertest")
import {Connection} from "typeorm";
import chai from "chai"

// Internal imports
import { Account } from "../../entity/account/account"
import Server from "../../server/Server"
import {database} from "../../test/setup"
import {accountFixture, paymentFixture} from "../../test/fixtures"

var expect = chai.expect

// Constants
const port:number = Server.port
let connection:Connection

beforeEach( async () => {
    connection = database.getConnection()
    await connection.getRepository(Account).save(accountFixture.valid)
})

describe("payment route", function() {
    it ('POST /payment Responds with 400 when invalid accountid is provided.', function(done) {
        request(`http://localhost:${port}`)
            .post("/payment")
            .send(paymentFixture.invalidAccountid)
            .set({Authorization: 'Bearer '+process.env.TEST_VALID_SESSION_TOKEN})
            .expect(400, done)
    })

    

    it ("POST /payment Responds with 202 and the created payment, payee and payment category when payment succesfully created.", function(done) {
        request(`http://localhost:${port}`)
            .post("/payment")
            .send(paymentFixture.valid)
            .set({Authorization: 'Bearer '+process.env.TEST_VALID_SESSION_TOKEN})
            .expect(202)
            .expect(function(res) {
                expect(res.body).to.have.length(1)
                expect(res.body[0].payee).to.exist
                expect(res.body[0].payee.name).to.equal(paymentFixture.valid.payeeName)
                expect(res.body[0].category).to.exist
                expect(res.body[0].category.name).to.equal(paymentFixture.valid.paymentCategory)
            })
            .end(done)
        
    })
})