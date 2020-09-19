import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import UserFactory from "../factories/user.factory";

import models from "../../models";
import app from "../app";

const User = models.User;

chai.use(chaiHttp);

describe("POST /auth/login", () => {
  describe("Valid", () => {
    it("Returns auth token", async () => {
      const data = UserFactory.build();
      await User.create(data);

      const res = await chai.request(app).post("/auth/login").send(data);

      expect(res).to.have.status(200);
      expect(res.body).to.haveOwnProperty("token");
      expect(res.body).to.haveOwnProperty("user");
      expect(res.body).to.haveOwnProperty("message");
      expect(res.body.user).to.not.haveOwnProperty("password");
      expect(res.body.user.email).to.eql(data.email);
    });
  });

  describe("Invalid", () => {
    it("When invalid E-mail or password", async () => {
      const data = UserFactory.build({ password: "invalid" });
      await User.create(data);

      const res = await chai.request(app).post("/auth/login").send(data);

      expect(res).to.have.status(406);
      expect(res.body).to.not.haveOwnProperty("token");
      expect(res.body).to.haveOwnProperty("message");
      expect(res.body.message).to.eql("Invalid credentials.");
      expect(res.body).to.have.nested.property("error.details[0].message");
      expect(res.body.error.details[0].message).to.eql(
        '"password" length must be at least 8 characters long'
      );
    });
  });

  describe("Incorrect credentials", () => {
    it("When user is not found", async () => {
      const data = {
        email: "this-user-dont-exist@email.com",
        password: "password",
      };

      const res = await chai.request(app).post("/auth/login").send(data);

      expect(res).to.have.status(400);
      expect(res.body).to.not.haveOwnProperty("token");
      expect(res.body).to.not.haveOwnProperty("user");
      expect(res.body).to.haveOwnProperty("message");
      expect(res.body.message).to.eql("Incorrect credentials.");
    });

    it("When password don't match found user hash", async () => {
      const user_data = UserFactory.build();
      await User.create(user_data);

      const data = { ...user_data, password: "dont-match" };

      const res = await chai.request(app).post("/auth/login").send(data);

      expect(res).to.have.status(400);
      expect(res.body).to.not.haveOwnProperty("token");
      expect(res.body).to.not.haveOwnProperty("user");
      expect(res.body).to.haveOwnProperty("message");
      expect(res.body.message).to.eql("Incorrect credentials.");
    });
  });
});
