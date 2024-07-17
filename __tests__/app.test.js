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

   describe("PATCH request", () => {
      test("PATCH 200: Responds with successefuly updated article by its id as an object", () => {
         const patchData = { inc_votes: 2000 };

         return request(app)
            .patch("/api/articles/4")
            .send(patchData)
            .expect(200)
            .then(({ body: { article } }) => {
               expect(article).toEqual({
                  article_id: 4,
                  title: "Student SUES Mitch!",
                  topic: "mitch",
                  author: "rogersop",
                  body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
                  created_at: "2020-05-06T01:14:00.000Z",
                  votes: 2000,
                  article_img_url:
                     "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
               });
            });
      });

      test("PATCH 404: Responds with error msg 'Article not found' when passed an article id that does not exist", () => {
         const patchData = { inc_votes: 3200 };

         return request(app)
            .patch("/api/articles/53534")
            .send(patchData)
            .expect(404)
            .then(({ body: { msg } }) => {
               expect(msg).toBe("Article not found");
            });
      });

      test("PATCH 400: Responds with err message 'Bad request' when passed an empty object", () => {
         const patchData = {};

         return request(app)
            .patch("/api/articles/4")
            .send(patchData)
            .expect(400)
            .then(({ body: { msg } }) => {
               expect(msg).toBe("Bad request");
            });
      });

      test("PATCH 400: Responds with err message 'Bad request' when does not contain 'inc_votes' property", () => {
         const patchData = { increment_votes: 2000 };

         return request(app)
            .patch("/api/articles/4")
            .send(patchData)
            .expect(400)
            .then(({ body: { msg } }) => {
               expect(msg).toBe("Bad request");
            });
      });

      test("PATCH 400: Responds with error msg 'Bad request' when passed an invalid data type as article id", () => {
         const patchData = { inc_votes: 3200 };

         return request(app)
            .patch("/api/articles/threethousand")
            .send(patchData)
            .expect(400)
            .then(({ body: { msg } }) => {
               expect(msg).toBe("Bad request");
            });
      });

      test("PATCH 400: Responds with error msg 'Bad request' when inc_votes property value has an invalid data type", () => {
         const patchData = { inc_votes: "threethousand" };

         return request(app)
            .patch("/api/articles/2")
            .send(patchData)
            .expect(400)
            .then(({ body: { msg } }) => {
               expect(msg).toBe("Bad request");
            });
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

   test("GET 200: Should respond with all articles sorted by date created in descending order by default", () => {
      return request(app)
         .get("/api/articles")
         .expect(200)
         .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("created_at", {
               descending: true,
            });
         });
   });

   describe("GET Request: Sorting queries", () => {
      test("GET 200: Should respond with all articles sorted by votes and by default: in descending order", () => {
         return request(app)
            .get("/api/articles?sort_by=votes")
            .expect(200)
            .then(({ body: { articles } }) => {
               expect(articles).toBeSortedBy("votes", {
                  descending: true,
               });
            });
      });

      test("GET 200: Should respond with all articles sorted by votes and in ascending order (case insensitive)", () => {
         return request(app)
            .get("/api/articles?sort_by=votes&order=ASC")
            .expect(200)
            .then(({ body: { articles } }) => {
               expect(articles).toBeSortedBy("votes", {
                  ascending: true,
               });
            });
      });

      test("GET 400: Should respond with err message 'Invalid query' when passed an invalid sort_by or order value", () => {
         return request(app)
            .get("/api/articles?sort_by=vote$&order=de $ c")
            .expect(400)
            .then(({ body: { msg } }) => {
               expect(msg).toBe("Invalid query");
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
            expect(comments.length).toBe(2);
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

   test("GET 200: Responds with an empty array when passed a valid article_id without comments", () => {
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

   describe("POST request", () => {
      test("POST 201: Responds with the successfully inserted comment to an article by its id as an object", () => {
         const newComment = {
            username: "rogersop",
            body: "Some comment!!!",
         };

         return request(app)
            .post("/api/articles/10/comments")
            .send(newComment)
            .expect(201)
            .then(({ body: { comment } }) => {
               expect(comment).toEqual({
                  comment_id: expect.any(Number),
                  body: "Some comment!!!",
                  article_id: 10,
                  author: "rogersop",
                  votes: 0,
                  created_at: expect.any(String),
               });
            });
      });

      test("POST 404: Responds with error msg 'Username does not exist' when username does not exist in database", () => {
         const newComment = {
            username: "some-panda",
            body: "A panda was here!!!!",
         };

         return request(app)
            .post("/api/articles/1/comments")
            .send(newComment)
            .expect(404)
            .then(({ body: { msg } }) => {
               expect(msg).toBe("Username does not exist");
            });
      });

      test("POST 404: Responds with error msg 'Article not found' when passed an article id that does not exist", () => {
         const newComment = {
            username: "rogersop",
            body: "Some comment!!!",
         };

         return request(app)
            .post("/api/articles/00999/comments")
            .send(newComment)
            .expect(404)
            .then(({ body: { msg } }) => {
               expect(msg).toBe("Article not found");
            });
      });

      test("POST 400: Responds with error msg 'Missing fields' when post does not contain both username and body", () => {
         const newComment = {
            body: "Cccccommmmeentt!!",
         };

         return request(app)
            .post("/api/articles/10/comments")
            .send(newComment)
            .expect(400)
            .then(({ body: { msg } }) => {
               expect(msg).toBe("Missing fields");
            });
      });

      test("POST 400: Responds with error msg 'Bad request' when passed an invalid data type as article id", () => {
         const newComment = {
            username: "butter_bridge",
            body: "Hello!!",
         };

         return request(app)
            .post("/api/articles/oneone$$one/comments")
            .send(newComment)
            .expect(400)
            .then(({ body: { msg } }) => {
               expect(msg).toBe("Bad request");
            });
      });

      test("POST 400: Responds with error msg 'Bad request' when passed an invalid data type as property value", () => {
         const newComment = {
            username: "butter_bridge",
            body: 123456789,
         };

         return request(app)
            .post("/api/articles/oneone$$one/comments")
            .send(newComment)
            .expect(400)
            .then(({ body: { msg } }) => {
               expect(msg).toBe("Bad request");
            });
      });
   });
});

describe("/api/comments/:comment_id", () => {
   describe("DELETE request", () => {
      test("DELETE 204: Should respond with status 204 and no content to return", () => {
         return request(app).delete("/api/comments/4").expect(204);
      });

      test("DELETE 404: Should respond with error msg 'Comment not found' when passed a comment_id that does not exist in database", () => {
         return request(app)
            .delete("/api/comments/123456")
            .expect(404)
            .then(({ body: { msg } }) => {
               expect(msg).toBe("Comment not found");
            });
      });

      test("DELETE 400: Should respond with error msg 'Bad request' when passed an invalid data type as comment_id", () => {
         return request(app)
            .delete("/api/comments/onetwothree$- four -")
            .expect(400)
            .then(({ body: { msg } }) => {
               expect(msg).toBe("Bad request");
            });
      });
   });
});

describe("/api/users", () => {
   describe("GET request", () => {
      test("GET 200: Should respond with an array of objects with username, name, avatar_url as properties of all users", () => {
         return request(app)
            .get("/api/users")
            .expect(200)
            .then(({ body: { users } }) => {
               expect(users.length).toBe(4);
               users.forEach((user) => {
                  expect(user).toEqual({
                     username: expect.any(String),
                     name: expect.any(String),
                     avatar_url: expect.any(String),
                  });
               });
            });
      });
   });
});
