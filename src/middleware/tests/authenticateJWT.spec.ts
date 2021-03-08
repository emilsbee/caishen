const request = require("supertest")

describe("authenticateJWT middleware", function() {
    it ('Responds with 401 without an authorization header', function(done) {
        request("localhost:3000")
            .get("/account")
            .expect(401, done)
    })

    it('Responds with 403 with invalid session token', function(done) {
        request("localhost:3000")
            .get("/account")
            .set({Authorization: 'Bearer syJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImVtaWxzYmVlIiwiaWF0IjoxNjE0NTQ0MjAyfs.WuetoHc36T5OnunY3cYSqwLvWOusnQlbMrdqxXAT1TY'})
            .expect(403, done)
    })

    // it('Responds with')
})