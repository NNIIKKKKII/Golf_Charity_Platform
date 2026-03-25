import { supabaseAdmin, supabaseAnon } from '../config/supabaseClient.js'
import { sendEmail } from '../config/mailer.js'
import { welcomeEmail } from '../config/emailTemplates.js'

export const signup = async (req, res) => {
    try {
        console.log('Signup started')
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' })
        }

        console.log('Creating user in Supabase...')
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true
        })
        console.log('Supabase response received')

        if (error) {
            return res.status(400).json({ error: error.message })
        }

        console.log('Sending response...')

        sendEmail(welcomeEmail(email))


        return res.status(201).json({
            message: 'User created successfully',
            user: data.user
        })

    } catch (err) {
        console.error('Signup error:', err)
        return res.status(500).json({ error: 'Server error during signup' })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' })
        }

        const { data, error } = await supabaseAnon.auth.signInWithPassword({
            email,
            password
        })

        if (error) {
            return res.status(401).json({ error: error.message })
        }

        return res.status(200).json({
            message: 'Login successful',
            session: data.session,
            user: data.user
        })

    } catch (err) {
        return res.status(500).json({ error: 'Server error during login' })
    }
}

export const getMe = async (req, res) => {
    return res.status(200).json({ user: req.user })
}