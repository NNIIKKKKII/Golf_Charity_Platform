import express from 'express'
import { protect, adminOnly } from '../middleware/authMiddleware.js'
import {
    getAllCharities,
    getCharity,
    createCharity,
    updateCharity,
    deleteCharity,
    selectCharity,
    getMyCharity
} from '../controllers/charityController.js'

const router = express.Router()

// Public routes
router.get('/', getAllCharities)
router.get('/:id', getCharity)

// User routes
router.post('/select', protect, selectCharity)
router.get('/my/selection', protect, getMyCharity)

// Admin routes
router.post('/', protect, adminOnly, createCharity)
router.put('/:id', protect, adminOnly, updateCharity)
router.delete('/:id', protect, adminOnly, deleteCharity)

export default router