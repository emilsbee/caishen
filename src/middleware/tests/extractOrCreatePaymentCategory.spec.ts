// External imports
const bent = require('bent')
var request = require("supertest")

// Internal imports
import Server from "../../server/Server"

// Constants
const port:number = Server.port
const testPaymentCategoryName:string = "Groceries"

describe("extract or create payment category middleware", function() {
    it ('Responds with 400 when no payment category information is provided', function(done) {
        request(`http://localhost:${port}`)
            .get("/test/extract-or-create-payment-category")
            .set({Authorization: 'Bearer '+process.env.TEST_VALID_SESSION_TOKEN})
            .expect(400, done)
    })


    it('Creates and returns a new payment category when one with the given name does not exist', function(done) {
        request(`http://localhost:${port}`)
            .get("/test/extract-or-create-payment-category")
            .send({paymentCategoryName: testPaymentCategoryName})
            .set({Authorization: 'Bearer '+process.env.TEST_VALID_SESSION_TOKEN})
            .expect(200)
            .expect(function(res) {
                let paymentCategory = res.body.paymentCategory
    
                if (paymentCategory && paymentCategory.name === testPaymentCategoryName && typeof paymentCategory.id === "string") {
                    return true
                } else {
                    throw new Error("Returned payment category doesn't match the expected payment category values.")
                }
                
            })
            .end(done)
            
    })
    
    var jsonPaymentCategory;
    before(async () => {        
        const getStream = bent(`http://localhost:${port}`, {Authorization: 'Bearer '+process.env.TEST_VALID_SESSION_TOKEN})
        try {
            let payee = await getStream('/test/extract-or-create-payment-category', {paymentCategoryName: testPaymentCategoryName})
            jsonPaymentCategory = await payee.json()        
        } catch (e) {
            throw new Error("Failed to fetch the payment category by name before fetching it by id.")
        }
    })
    it('Fetches an existing payment category when provided the paymentCategoryid', function(done) {
        request(`http://localhost:${port}`)
            .get("/test/extract-or-create-payment-category")
            .send({paymentCategoryid: jsonPaymentCategory.paymentCategory.id})
            .set({Authorization: 'Bearer '+process.env.TEST_VALID_SESSION_TOKEN})
            .expect(200)
            .expect(function(res) {
                let paymentCategoryByid = res.body.paymentCategory
                
                if (paymentCategoryByid && (paymentCategoryByid.name === testPaymentCategoryName) && (typeof paymentCategoryByid.id === "string")) {
                    return true
                } else {
                    throw new Error("Returned payment category doesn't match the expected payment category values.")
                }
                
            })
            .end(done)
    })

    it("Returns 400 when an invalid paymentCategoryid is provided", function(done) {
        request(`http://localhost:${port}`)
            .get("/test/extract-or-create-payment-category")
            .send({paymentCategoryid: "badid"})
            .set({Authorization: 'Bearer '+process.env.TEST_VALID_SESSION_TOKEN})
            .expect(400)
            .end(done)
    })

    it("Returns 400 when the paymentCategoryid is not a string", function(done) {
        request(`http://localhost:${port}`)
            .get("/test/extract-or-create-payment-category")
            .send({paymentCategoryid: 42})
            .set({Authorization: 'Bearer '+process.env.TEST_VALID_SESSION_TOKEN})
            .expect(400)
            .end(done)
    })
})