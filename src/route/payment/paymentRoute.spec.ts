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
    await connection.getRepository(Account).save(accountFixture)
})

describe("payment route", function() {
    it ('Responds with 400 when no valid accountid is provided.', function(done) {
        request(`http://localhost:${port}`)
            .post("/payment")
            .send({
                "payeeName": "Jumbo",
                "paymentCategory": "Groceries",
                "amount": 2000,
                "accountid": "bfcf5872-1999-4b62-b7f7-09f224f7c53d",
                "description": "Eggs, milk and chocolate.",
                
            })
            .set({Authorization: 'Bearer '+process.env.TEST_VALID_SESSION_TOKEN})
            .expect(400, done)
    })

    

    it ("Responds with 202 and the created payment, payee and payment category when payment succesfully created.", function(done) {
        request(`http://localhost:${port}`)
            .post("/payment")
            .send(paymentFixture)
            .set({Authorization: 'Bearer '+process.env.TEST_VALID_SESSION_TOKEN})
            .expect(202)
            .expect(function(res) {
                expect(res.body).to.have.length(1)
                expect(res.body[0].payee).to.exist
                expect(res.body[0].payee.name).to.equal(paymentFixture.payeeName)
                expect(res.body[0].category).to.exist
                expect(res.body[0].category.name).to.equal(paymentFixture.paymentCategory)
            })
            .end(done)
        
    })
})