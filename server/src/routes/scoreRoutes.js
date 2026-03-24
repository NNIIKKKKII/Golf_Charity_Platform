import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { addScore, getMyScores, updateScore } from '../controllers/scoreController.js'

const router = express.Router()

router.post('/', protect, addScore)
router.get('/me', protect, getMyScores)
router.put('/:id', protect, updateScore)

export default router