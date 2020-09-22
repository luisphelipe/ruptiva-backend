import BookFactory from '../factories/book.factory'
import {
  book_create_schema,
  book_update_schema
} from '../../controllers/validators/book.validator'
import { expect } from 'chai'

describe('book_create_schema', () => {
  describe('Valid', () => {
    it('Returns valid data', async () => {
      const book_data = BookFactory.build()

      const { error, value } = book_create_schema.validate(book_data)

      expect(error).to.eql(undefined)
      expect(value).to.eql(book_data)
    })
  })

  describe('Invalid', () => {
    describe('Title', () => {
      it('Is required', () => {
        const { error } = book_create_schema.validate({})

        expect(error).to.be.an('error')
        expect(error).to.have.nested.property('details[0].message')
        expect(error.details[0].message).to.eql('"title" is required')
      })

      it('Must be a string')
    })

    describe('Review', () => {
      it('Must be a string')
    })

    describe('Rating', () => {
      it('Must be number')
      it('Must be a integer')
      it('Must be greater than or equal to 0')
      it('Must be less than or euqal to 5')
    })
    describe('Title', () => {
      it('Is required')
      it('Must be a string')
    })
  })

  describe('BOOK_UPDATE_SCHEMA', () => {
    it('Title is not required', () => {
      const { error } = book_update_schema.validate({})

      expect(error).to.eql(undefined)
    })
  })
})
