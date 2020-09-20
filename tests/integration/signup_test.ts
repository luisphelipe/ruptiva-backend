import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import UserFactory from "../factories/user.factory";

import app from "../app";
import models from "../../models";

const User = models.User;

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
    it("User already registered", async () => {
      const user_data = UserFactory.build();
      await User.create(user_data);

      const res = await chai.request(app).post("/auth/signup").send(user_data);
      expect(res).to.have.status(400);
      expect(res.body.message).to.eql("E-mail already registered.");
    });

    // Bellow we are testing the validation logic again... And I don't think it is necessary.
    // Would be better to test the controller especifically, and assert that it calls the validator
    it("E-mail must have valid e-mail format", async () => {
      const user_data = UserFactory.build();
      user_data.email = "not-a-valid-email";

      const res = await chai.request(app).post("/auth/signup").send(user_data);

      expect(res).to.have.status(406);
      expect(res.body.message).to.eql("Failed validation.");
      expect(res.body.error.details[0].message).to.eql(
        '"email" must be a valid email'
      );
    });

    it("Password must have lenght of at least 8 characters", async () => {
      const user_data = UserFactory.build();
      user_data.password = "tiny";

      const res = await chai.request(app).post("/auth/signup").send(user_data);

      expect(res).to.have.status(406);
      expect(res.body.message).to.eql("Failed validation.");
      expect(res.body.error.details[0].message).to.eql(
        '"password" length must be at least 8 characters long'
      );
    });
  });
});
