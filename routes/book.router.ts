import { Router } from 'express'
import book_controller from '../controllers/books.controller'

const router = Router()

router.get('/', book_controller.index)
router.post('/', book_controller.create)

router.get('/:id', book_controller.get)
router.put('/:id', book_controller.update)
router.delete('/:id', book_controller.destroy)

export default router
