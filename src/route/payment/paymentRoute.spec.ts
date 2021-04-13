// External imports
var request = require("supertest")
import {Connection} from "typeorm";
import chai from "chai"

// Internal imports
import { Account } from "../../entity/account/account"
import Server from "../../server/Server"
import {database} from "../../test/setup"
import {accountFixture, paymentFixture} from "../../test/fixtures"
import { Payment } from "../../entity/payment/payment";
import { Payee } from "../../entity/payee/payee";
import { PaymentCategory } from "../../entity/paymentCategory/paymentCategory";

var expect = chai.expect

// Constants
const port:number = Server.port
let connection:Connection

describe("POST /payment", function() {
    // Creates an account before all tests.
    this.beforeAll(async () => {
        connection = database.getConnection()
        await connection.getRepository(Account).save(accountFixture.valid)
    })

    // Checks that one payment, payee and payment category is created after the tests.
    // Clears the account, payment, payee and payment category tables after all tests.
    this.afterAll(async () => {
        expect(await connection.getRepository(Payment).find()).to.have.length(1)
        expect(await connection.getRepository(Payee).find()).to.have.length(1)
        expect(await connection.getRepository(PaymentCategory).find()).to.have.length(1)


        connection = database.getConnection()
        await connection.getRepository(Payment).clear()
        await connection.getRepository(Payee).clear()
        await connection.getRepository(PaymentCategory).clear()
        await connection.getRepository(Account).clear()
    })

    it ('Responds with 400 when invalid accountid is provided.', function(done) {
        request(`http://localhost:${port}`)
            .post("/payment")
            .send(paymentFixture.invalidAccountid)
            .set({Authorization: 'Bearer '+process.env.TEST_VALID_SESSION_TOKEN})
            .expect(400, done)
    })

    

    it ("Responds with 201 and the created payment, payee and payment category when payment succesfully created.", function(done) {
        request(`http://localhost:${port}`)
            .post("/payment")
            .send(paymentFixture.valid)
            .set({Authorization: 'Bearer '+process.env.TEST_VALID_SESSION_TOKEN})
            .expect(201)
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