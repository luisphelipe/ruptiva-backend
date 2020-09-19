import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import UserFactory from "../factories/user.factory";

import app from "../app";

chai.use(chaiHttp);

describe("POST /auth/signup", () => {
  describe("Valid", () => {
    it("Returns auth token", async () => {
      const data = UserFactory.build();

      const res = await chai.request(app).post("/auth/signup").send(data);

      expect(res).to.have.status(200);
      expect(res.body).to.haveOwnProperty("token");
      expect(res.body).to.haveOwnProperty("user");
      expect(res.body).to.haveOwnProperty("message");
      expect(res.body.user).to.not.haveOwnProperty("password");
      expect(res.body.user.email).to.eql(data.email);
    });
  });

  describe("Invalid", () => {
    it("User already registered");
    it("E-mail must have valid e-mail format");
    it("Password must have lenght of at least 8 characters");
  });
});
