import express from 'express'
import { protect, adminOnly } from '../middleware/authMiddleware.js'
import {
    getMyWinnings,
    uploadProof,
    getAllWinners,
    verifyWinner,
    markAsPaid
} from '../controllers/winnerController.js'

const router = express.Router()

// User routes
router.get('/my-winnings', protect, getMyWinnings)
router.put('/:id/proof', protect, uploadProof)

// Admin routes
router.get('/all', protect, adminOnly, getAllWinners)
router.put('/:id/verify', protect, adminOnly, verifyWinner)
router.put('/:id/pay', protect, adminOnly, markAsPaid)

export default router