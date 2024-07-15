const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const db = require("../db/connection");

beforeEach(() => {
   return seed(testData);
});

afterAll(() => {
   return db.end();
});

describe("/api/topics", () => {
   test("GET 200: Should respond with all topics", () => {
      return request(app)
         .get("/api/topics")
         .expect(200)
         .then(({ body: { topics } }) => {
            expect(topics.length).toBeGreaterThan(0);
            topics.forEach((topic) => {
               expect(topic).toMatchObject({
                  description: expect.any(String),
                  slug: expect.any(String),
               });
            });
         });
   });
});

describe("/api", () => {
   test("GET 200: Should respond with all endpoints and description as an object", () => {
      return request(app)
         .get("/api")
         .expect(200)
         .then(({ body: { endpoints } }) => {
            const endpointsJson = require("../endpoints.json");

            expect(typeof endpoints).toBe("object");
            expect(endpoints).toEqual(endpointsJson);
         });
   });
});
