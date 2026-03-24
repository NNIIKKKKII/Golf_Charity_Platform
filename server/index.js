import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import authRoutes from './src/routes/authRoutes.js'
import subscriptionRoutes from './src/routes/subscriptionRoutes.js'
import scoreRoutes from './src/routes/scoreRoutes.js'
import charityRoutes from './src/routes/charityRoutes.js'
import drawRoutes from './src/routes/drawRoutes.js'
import winnerRoutes from './src/routes/winnerRoutes.js'
import adminRoutes from './src/routes/adminRoutes.js'
const app = express()

// CORS
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}))

// Raw body ONLY for Stripe webhook — must come BEFORE express.json()
app.use('/api/subscription/webhook', express.raw({ type: 'application/json' }))

// JSON parsing for everything else
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/subscription', subscriptionRoutes)
app.use('/api/scores', scoreRoutes)
app.use('/api/charities', charityRoutes)
app.use('/api/draws', drawRoutes)
app.use('/api/winners', winnerRoutes)
app.use('/api/admin', adminRoutes)
// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' })
})


import { sendEmail } from './src/config/mailer.js'

// app.get('/api/test-email', async (req, res) => {
//     await sendEmail({
//         to: 'nikhilpareeshwad@gmail.com',
//         subject: 'Test',
//         html: '<p>Email working</p>'
//     })
//     res.json({ message: 'Email sent' })
// })


// Server setup
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})