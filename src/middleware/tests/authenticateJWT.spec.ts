const request = require("supertest")

describe("authenticateJWT middleware", function() {
    it ('Responds with 401 without an authorization header', function(done) {
        request("http://localhost:3000")
            .get("/authenticate-jwt-test")
            .expect(401, done)
    })

    it('Responds with 403 with invalid session token', function(done) {
        request("http://localhost:3000")
            .get("/authenticate-jwt-test")
            .set({Authorization: 'Bearer syJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImVtaWxzYmVlIiwiaWF0IjoxNjE0NTQ0MjAyfs.WuetoHc36T5OnunY3cYSqwLvWOusnQlbMrdqxXAT1TY'})
            .expect(403, done)
    })

    it('Responds with 200 with a valid session token', function(done) {
        request("http://localhost:3000")
            .get("/authenticate-jwt-test")
            .set({Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImVtaWxzYmVlIiwiaWF0IjoxNjE1MjE1ODk4fQ.TrWgQSlkNLlyGm1Fz9tCOqtRhvB2lGoXeDlduVPgkMI'})
            .expect(200, done)
    })
})