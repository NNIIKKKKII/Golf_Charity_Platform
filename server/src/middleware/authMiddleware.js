import { supabaseAdmin } from '../config/supabaseClient.js'

export const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' })
        }

        const token = authHeader.split(' ')[1]

        const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)

        if (error || !user) {
            return res.status(401).json({ error: 'Invalid token' })
        }

        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

        if (profileError || !profile) {
            return res.status(401).json({ error: 'Profile not found' })
        }

        req.user = profile
        next()

    } catch (err) {
        return res.status(500).json({ error: 'Server error in auth middleware' })
    }
}

export const adminOnly = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access only' })
    }
    next()
}