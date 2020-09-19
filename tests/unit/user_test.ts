import { expect } from "chai";

import UserFactory from "../factories/user.factory";
import BookFactory from "../factories/book.factory";
import models from "../../models/index";

const User = models.User;
const Book = models.Book;

describe("USER", () => {
  describe("Create", () => {
    it("From valid data", async () => {
      const data = { email: "test@email.com", password: "password" };

      const user = await User.create(data);

      expect(user.email).to.eql(data.email);
      expect(user.password).to.not.eql(data.password);
    });

    it("From factory data", async () => {
      const data = UserFactory.build();

      const user = await User.create(data);

      expect(user.email).to.eql(data.email);
      expect(user.password).to.not.eql(data.password);
    });
  });

  it("DefaultScope excludes password", async () => {
    let user = await User.create(UserFactory.build());

    let found = (await User.findByPk(user.id)).get();

    expect(found).to.have.ownProperty("email");
    expect(found).to.not.have.ownProperty("password");
  });

  it("Has beforeSave hook for encrypting password");

  describe("Validations", () => {
    describe("Email", () => {
      it("Must be unique");
      it("Must be a valid email");
    });
  });

  describe("Associations", () => {
    it("HasMany Books", async () => {
      let user = await User.create(UserFactory.build());

      await Book.bulkCreate(BookFactory.buildList(10, { userId: user.id }));

      expect(await user.countBooks()).to.eql(10);
    });
  });
});
