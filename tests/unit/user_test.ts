import { expect } from "chai";

import UserFactory from "../factories/user.factory";
import models from "../../models/index";

const User = models.User;

describe("USER", () => {
  describe("Create", () => {
    it("From valid data", async () => {
      const data = { email: "test@email.com", password: "password" };

      const user = await User.create(data);

      expect(user.email).to.eql(data.email);
      expect(user.password).to.eql(data.password);
    });

    it("From factory data", async () => {
      const data = UserFactory.build();

      const user = await User.create(data);

      expect(user.email).to.eql(data.email);
      expect(user.password).to.eql(data.password);
    });
  });

  describe("Validations", () => {
    describe("Email", () => {
      it("Must be unique");
      it("Must be a valid email");
    });
  });
});
