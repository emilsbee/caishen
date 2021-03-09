// External imports
const bent = require('bent')
var request = require("supertest")

// Internal imports
import Server from "../../server/Server"

// Constants
const port:number = Server.port
const testPayeeName:string = "Sam"

describe("extract or create payee middleware", function() {
    it ('Responds with 400 when no payee information is provided', function(done) {
        request(`http://localhost:${port}`)
            .get("/test/extract-or-create-payee")
            .set({Authorization: 'Bearer '+process.env.TEST_VALID_SESSION_TOKEN})
            .expect(400, done)
    })


    it('Creates and returns a new payee when one with the given name does not exist', function(done) {
        request(`http://localhost:${port}`)
            .get("/test/extract-or-create-payee")
            .send({payeeName: testPayeeName})
            .set({Authorization: 'Bearer '+process.env.TEST_VALID_SESSION_TOKEN})
            .expect(200)
            .expect(function(res) {
                let payee = res.body.payee
                if (payee && payee.name === testPayeeName && payee.iban == null && typeof payee.id === "string") {
                    return true
                } else {
                    throw new Error("Returned payee doesn't match the expected payee values.")
                }
                
            })
            .end(done)
            
    })
    
    var jsonPayee;
    before(async () => {        
        const getStream = bent(`http://localhost:${port}`, {Authorization: 'Bearer '+process.env.TEST_VALID_SESSION_TOKEN})
        try {
            let payee = await getStream('/test/extract-or-create-payee', {payeeName: testPayeeName})
            jsonPayee = await payee.json() 
        } catch (e) {
            throw new Error("Failed to fetch the payee by name before fetching it by id.")
        }
    })
    it('Fetches an existing payee when provided the payeeid', function(done) {
        
        request(`http://localhost:${port}`)
            .get("/test/extract-or-create-payee")
            .send({payeeid: jsonPayee.payee.id})
            .set({Authorization: 'Bearer '+process.env.TEST_VALID_SESSION_TOKEN})
            .expect(200)
            .expect(function(res) {
                let payeeByid = res.body.payee
                
                if (payeeByid && (payeeByid.name === testPayeeName) && (payeeByid.iban == null) && (typeof payeeByid.id === "string")) {
                    return true
                } else {
                    throw new Error("Returned payee doesn't match the expected payee values.")
                }
                
            })
            .end(done)
    })

    it("Returns 400 when an invalid payeeid is provided", function(done) {
        request(`http://localhost:${port}`)
            .get("/test/extract-or-create-payee")
            .send({payeeid: "badid"})
            .set({Authorization: 'Bearer '+process.env.TEST_VALID_SESSION_TOKEN})
            .expect(400, done)
    })

    it("Returns 400 when the payeeid is not a string", function(done) {
        request(`http://localhost:${port}`)
            .get("/test/extract-or-create-payee")
            .send({payeeid: 42})
            .set({Authorization: 'Bearer '+process.env.TEST_VALID_SESSION_TOKEN})
            .expect(400, done)
    })
})