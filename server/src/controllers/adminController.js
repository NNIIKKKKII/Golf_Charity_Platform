import { supabaseAdmin } from '../config/supabaseClient.js'

export const getAllUsers = async (req, res) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('profiles')
            .select(`
        *,
        subscriptions (
          plan, status, current_period_end
        )
      `)
            .order('created_at', { ascending: false })

        if (error) return res.status(500).json({ error: 'Failed to fetch users' })

        return res.status(200).json({ users: data })

    } catch (err) {
        return res.status(500).json({ error: 'Server error fetching users' })
    }
}