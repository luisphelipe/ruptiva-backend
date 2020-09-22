import { Factory } from 'rosie'

const BookFactory = new Factory()
  .sequence('title', (i) => `Book #${i}`)
  .attr(
    'image_url',
    'https://upload.wikimedia.org/wikipedia/commons/b/bd/Draw_book.png'
  )
  .attr('review', 'This is a very good book')
  .attr('rating', 5)

export default BookFactory
