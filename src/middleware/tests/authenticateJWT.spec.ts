var request = require("supertest")
import Server from "../../server/Server"

const port = Server.port

describe("authenticateJWT middleware", function() {
    
    it ('Responds with 401 when the authorization header does not exist', function(done) {
        request(`http://localhost:${port}`)
            .get("/test/authenticate-jwt-test")
            .expect(401, done)
    })

    it('Responds with 403 when invalid session token is provided', function(done) {
        request(`http://localhost:${port}`)
            .get("/test/authenticate-jwt-test")
            .set({Authorization: 'Bearer syJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImVtaWxzYmVlIiwiaWF0IjoxNjE0NTQ0MjAyfs.WuetoHc36T5OnunY3cYSqwLvWOusnQlbMrdqxXAT1TY'})
            .expect(403, done)
    })

    it('Responds with 200 when a valid session token is provided', function(done) {
        request(`http://localhost:${port}`)
            .get("/test/authenticate-jwt-test")
            .set({Authorization: 'Bearer '+process.env.TEST_VALID_SESSION_TOKEN})
            .expect(200, done)
    })
})