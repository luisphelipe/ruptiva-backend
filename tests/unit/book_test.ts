import { expect } from "chai";

import UserFactory from "../factories/user.factory";
import BookFactory from "../factories/book.factory";
import models from "../../models/index";

const User = models.User;
const Book = models.Book;

describe("BOOK", () => {
  describe("Create", () => {
    it("From valid data", async () => {
      const user = await User.create(UserFactory.build());

      const book_data = {
        title: "This is something",
        review: "This is a long text",
        rating: 3,
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/b/bd/Draw_book.png",
        userId: user.id,
      };
      const book = await Book.create(book_data);

      expect(book.title).to.eql("This is something");
      expect(book.review).to.eql("This is a long text");
      expect(book.rating).to.eql(3);
      expect(book.image_url).to.eql(
        "https://upload.wikimedia.org/wikipedia/commons/b/bd/Draw_book.png"
      );
      expect(book.userId).to.eql(user.id);
    });

    it("From factory data", async () => {
      const book_data = BookFactory.build();

      const book = await Book.create(
        {
          ...book_data,
          User: UserFactory.build(),
        },
        { include: [User] }
      );

      expect(book.title).to.eql(book_data.title);
      expect(book.review).to.eql(book_data.review);
      expect(book.rating).to.eql(book_data.rating);
      expect(book.image_url).to.eql(book_data.image_url);
    });
  });

  describe("Associations", () => {
    it("BelongsTo User", async () => {
      let user = await User.create(UserFactory.build());
      let book_data = BookFactory.build({ userId: user.id });

      let book = await user.createBook(book_data);
      let book_owner = await book.getUser();

      expect(book_owner.id).to.eql(user.id);
      expect(book_owner.email).to.eql(user.email);
    });
  });
});
