import express from 'express'
import { protect, adminOnly } from '../middleware/authMiddleware.js'
import {
    runDraw,
    getAllDraws,
    getPublishedDraws,
    getMyDrawHistory
} from '../controllers/drawController.js'

const router = express.Router()

// Public
router.get('/published', getPublishedDraws)

// User
router.get('/my-history', protect, getMyDrawHistory)

// Admin
router.post('/run', protect, adminOnly, runDraw)
router.get('/all', protect, adminOnly, getAllDraws)

export default router