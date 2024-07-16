const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const db = require("../db/connection");
const comments = require("../db/data/test-data/comments");

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

describe("/api/articles/:article_id", () => {
   test("GET 200: Should respond an object of the article by its id with following properties: author, title, article_id, body, topic, created_at, votes, article_img_url", () => {
      return request(app)
         .get("/api/articles/3")
         .expect(200)
         .then(({ body: { article } }) => {
            expect(typeof article).toBe("object");
            expect(article).toEqual({
               article_id: 3,
               title: "Eight pug gifs that remind me of mitch",
               topic: "mitch",
               author: "icellusedkars",
               body: "some gifs",
               created_at: "2020-11-03T09:12:00.000Z",
               votes: 0,
               article_img_url:
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            });
         });
   });

   test("GET 404: Responds with error msg 'Article not found' when passed an article id that does not exist", () => {
      return request(app)
         .get("/api/articles/101")
         .expect(404)
         .then(({ body: { msg } }) => {
            expect(msg).toBe("Article not found");
         });
   });

   test("GET 400: Responds with error msg 'Bad request' when passed an invalid data type as article id", () => {
      return request(app)
         .get("/api/articles/onetwothree")
         .expect(400)
         .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad request");
         });
   });
});

describe("/api/articles", () => {
   test("GET 200: Should respond with all articles as an array of objects without body property", () => {
      return request(app)
         .get("/api/articles")
         .expect(200)
         .then(({ body: { articles } }) => {
            expect(articles.length).toBeGreaterThan(0);
            articles.forEach((article) => {
               expect(article).toMatchObject({
                  author: expect.any(String),
                  title: expect.any(String),
                  article_id: expect.any(Number),
                  topic: expect.any(String),
                  created_at: expect.any(String),
                  votes: expect.any(Number),
                  article_img_url: expect.any(String),
                  comment_count: expect.any(Number),
               });
               expect(article).not.toHaveProperty("body");
            });
         });
   });

   test("GET 200: Should respond with all articles sorted by date created in descending order", () => {
      return request(app)
         .get("/api/articles")
         .expect(200)
         .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("created_at", {
               descending: true,
            });
         });
   });
});

describe("/api/articles/:article_id/comments", () => {
   test("GET 200: Should respond with an array of all comments for the article of a specific article_id", () => {
      return request(app)
         .get("/api/articles/5/comments")
         .expect(200)
         .then(({ body: { comments } }) => {
            expect(comments.length).toBeGreaterThan(0);
            comments.forEach((comment) => {
               expect(comment).toMatchObject({
                  comment_id: expect.any(Number),
                  body: expect.any(String),
                  article_id: expect.any(Number),
                  author: expect.any(String),
                  votes: expect.any(Number),
                  created_at: expect.any(String),
               });
            });
         });
   });

   test("GET 200: Responds with all comments for the article sorted by created_at in descending order", () => {
      return request(app)
         .get("/api/articles/1/comments")
         .expect(200)
         .then(({ body: { comments } }) => {
            expect(comments).toBeSortedBy("created_at", {
               descending: true,
            });
         });
   });

   test("GET 200; Responds with an empty array when passed a valid article_id without comments", () => {
      return request(app)
         .get("/api/articles/10/comments")
         .expect(200)
         .then(({ body: { comments } }) => {
            expect(comments).toEqual([]);
         });
   });

   test("GET 404: Responds with error msg 'Article not found' when passed an article id that does not exist", () => {
      return request(app)
         .get("/api/articles/4282/comments")
         .expect(404)
         .then(({ body: { msg } }) => {
            expect(msg).toBe("Article not found");
         });
   });

   test("GET 400: Responds with error msg 'Bad request' when passed an invalid data type as article id", () => {
      return request(app)
         .get("/api/articles/ninenine/comments")
         .expect(400)
         .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad request");
         });
   });
});
