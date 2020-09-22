import app from '../app'

import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'

import models from '../../models'
import UserFactory from '../factories/user.factory'
import BookFactory from '../factories/book.factory'

const User = models.User
const Book = models.Book

chai.use(chaiHttp)

describe('GET /books', () => {
  let user, token

  beforeEach(async () => {
    user = await User.create(UserFactory.build())
    token = user.generateAuthToken()
  })

  it('Expects the user to be authenticated', async () => {
    const res = await chai.request(app).get('/books')

    expect(res.status).to.eql(401)
    expect(res.body.message).to.eql('Missing authentication token.')
  })

  describe('Should return list of owned books and count', () => {
    it('With 0 owned books', async () => {
      // Add books for another user. To verify that only owned books are returned.
      const another = await User.create(UserFactory.build())
      await Book.bulkCreate(BookFactory.buildList(3, { userId: another.id }))

      const res = await chai
        .request(app)
        .get('/books')
        .set('Authorization', `Bearer ${token}`)

      expect(res.body).to.eql({ count: 0, books: [] })
    })

    it('With 1 owned books', async () => {
      const book_data = BookFactory.build()
      await user.createBook(book_data)

      const res = await chai
        .request(app)
        .get('/books')
        .set('Authorization', `Bearer ${token}`)

      expect(res.body.count).to.eql(1)
      expect(res.body.books.length).to.eql(1)
      expect(res.body.books[0].title).to.eql(book_data.title)
    })
  })
})

describe('POST /books', () => {
  let user, token

  beforeEach(async () => {
    user = await User.create(UserFactory.build())
    token = user.generateAuthToken()
  })

  describe('Valid', () => {
    it('Creates a book', async () => {
      const book_count = await Book.count()
      const book_data = BookFactory.build()

      const res = await chai
        .request(app)
        .post('/books')
        .set('Authorization', `Bearer ${token}`)
        .send(book_data)

      expect(res.status).to.eql(200)
      expect(await Book.count()).to.eql(book_count + 1)
    })

    it('Returns created book', async () => {
      const book_data = BookFactory.build()

      const res = await chai
        .request(app)
        .post('/books')
        .set('Authorization', `Bearer ${token}`)
        .send(book_data)

      expect(res.status).to.eql(200)
      expect(res.body.message).to.eql('Book created successfully.')
      expect(res.body.book.title).to.eql(book_data.title)
      expect(res.body.book.review).to.eql(book_data.review)
      expect(res.body.book.rating).to.eql(book_data.rating)
      expect(res.body.book.image_url).to.eql(book_data.image_url)
    })
  })

  describe('Invalid', () => {
    it('Returns validation errors', async () => {
      const res = await chai
        .request(app)
        .post('/books')
        .set('Authorization', `Bearer ${token}`)
        .send({})

      expect(res.status).to.eql(406)
      expect(res.body.message).to.eql('Failed validation.')
      expect(res.body.error.details[0].message).to.eql('"title" is required')
    })
  })
})

describe('GET /books/:id', () => {
  let user, token

  beforeEach(async () => {
    user = await User.create(UserFactory.build())
    token = user.generateAuthToken()
  })

  it('Returns owned book details', async () => {
    let book = await Book.create(BookFactory.build({ userId: user.id }))

    const res = await chai
      .request(app)
      .get(`/books/${book.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).to.eql(200)
    expect(res.body.title).to.eql(book.title)
    expect(res.body.review).to.eql(book.review)
    expect(res.body.rating).to.eql(book.rating)
    expect(res.body.image_url).to.eql(book.image_url)
  })

  it('Returns not found for not owned books', async () => {
    let another = await User.create(UserFactory.build())
    let book = await Book.create(BookFactory.build({ userId: another.id }))

    const res = await chai
      .request(app)
      .get(`/books/${book.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).to.eql(404)
    expect(res.body.message).to.eql('Book not found.')
  })
})

describe('PUT /books/:id', () => {
  let user, token

  beforeEach(async () => {
    user = await User.create(UserFactory.build())
    token = user.generateAuthToken()
  })

  it('Returns book not found for not owned books', async () => {
    const another = await User.create(UserFactory.build())
    const book = await Book.create(BookFactory.build({ userId: another.id }))

    const res = await chai
      .request(app)
      .put(`/books/${book.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Whatever' })

    expect(res.status).to.eql(404)
    expect(res.body.message).to.eql('Book not found.')
  })

  describe('Valid', () => {
    it('Updates the book data and return updated book', async () => {
      const old_data = BookFactory.build({ userId: user.id })
      const new_data = BookFactory.build()

      const book = await Book.create(old_data)

      const res = await chai
        .request(app)
        .put(`/books/${book.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(new_data)

      expect(res.status).to.eql(200)
      expect(res.body.message).to.eql('Book updated successfully.')
      expect(res.body.book.title).to.not.eql(old_data.title)
      expect(res.body.book.title).to.eql(new_data.title)
    })
  })

  describe('Invalid', () => {
    it('Returns validation errors', async () => {
      const old_data = BookFactory.build({ userId: user.id })
      const new_data = { rating: 'nice' }

      const book = await Book.create(old_data)

      const res = await chai
        .request(app)
        .put(`/books/${book.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(new_data)

      expect(res.status).to.eql(406)
      expect(res.body.message).to.eql('Failed validation.')
      expect(res.body.error.details).to.have.lengthOf(1)
      expect(res.body.error.details[0].message).to.eql(
        '"rating" must be a number'
      )
    })
  })
})

describe('DELETE /books/:id', () => {
  let user, token

  beforeEach(async () => {
    user = await User.create(UserFactory.build())
    token = user.generateAuthToken()
  })

  it('Deletes owned book and returns it', async () => {
    const book = await Book.create(BookFactory.build({ userId: user.id }))
    const book_count = await Book.count()

    const res = await chai
      .request(app)
      .delete(`/books/${book.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).to.eql(200)
    expect(res.body.message).to.eql('Book deleted successfully.')
    expect(await Book.count()).to.eql(book_count - 1)
    expect(res.body.book.title).to.eql(book.title)
  })

  it('Returns book not found for not owned books', async () => {
    const another = await User.create(UserFactory.build())
    const book = await Book.create(BookFactory.build({ userId: another.id }))

    const res = await chai
      .request(app)
      .put(`/books/${book.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Whatever' })

    expect(res.status).to.eql(404)
    expect(res.body.message).to.eql('Book not found.')
  })
})
