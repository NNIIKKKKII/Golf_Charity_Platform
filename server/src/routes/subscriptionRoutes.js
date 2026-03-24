import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import {
    createCheckoutSession,
    handleWebhook,
    getMySubscription,
    mockSubscribe
} from '../controllers/subscriptionController.js'

const router = express.Router()

router.post('/create-checkout', protect, createCheckoutSession)
router.post('/webhook', handleWebhook)
router.get('/me', protect, getMySubscription)

// TEMP: Mock subscription for testing — remove in production
router.post('/mock-subscribe', protect, mockSubscribe)

export default router