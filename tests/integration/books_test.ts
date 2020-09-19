import app from "../app";

import chai, { expect } from "chai";
import chaiHttp from "chai-http";

import models from "../../models";
import UserFactory from "../factories/user.factory";
import BookFactory from "../factories/book.factory";

const User = models.User;

chai.use(chaiHttp);

describe("GET /books", () => {
  let user, token;

  beforeEach(async () => {
    user = await User.create(UserFactory.build());
    token = user.generateAuthToken();
  });

  it("Expects the user to be authenticated", async () => {
    const res = await chai.request(app).get("/books");

    expect(res.status).to.eql(401);
    expect(res.body.message).to.eql("Missing authentication token.");
  });

  describe("Should return list of owned books", () => {
    it("With 0 owned books", async () => {
      const res = await chai
        .request(app)
        .get("/books")
        .set("Authorization", `Bearer ${token}`);

      expect(res.body).to.eql([]);
    });

    it("With 1 owned books", async () => {
      const book_data = BookFactory.build();
      await user.createBook(book_data);

      const res = await chai
        .request(app)
        .get("/books")
        .set("Authorization", `Bearer ${token}`);

      expect(res.body.length).to.eql(1);
      expect(res.body[0].title).to.eql(book_data.title);
    });
  });
});

describe("POST /books", () => {});
describe("GET /books/:id", () => {});
describe("PUT /books/:id", () => {});
describe("DELETE /books/:id", () => {});
