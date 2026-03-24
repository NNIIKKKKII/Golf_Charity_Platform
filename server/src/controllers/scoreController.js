import { supabaseAdmin } from '../config/supabaseClient.js'

export const addScore = async (req, res) => {
    try {
        const userId = req.user.id
        const { score, date } = req.body

        if (!score || !date) {
            return res.status(400).json({ error: 'Score and date are required' })
        }

        if (score < 1 || score > 45) {
            return res.status(400).json({ error: 'Score must be between 1 and 45' })
        }

        // Get current scores count
        const { data: existingScores, error: fetchError } = await supabaseAdmin
            .from('scores')
            .select('id, created_at')
            .eq('user_id', userId)
            .order('created_at', { ascending: true })

        if (fetchError) {
            return res.status(500).json({ error: 'Failed to fetch existing scores' })
        }

        // If already 5 scores, delete the oldest one
        if (existingScores.length >= 5) {
            const oldestId = existingScores[0].id
            await supabaseAdmin
                .from('scores')
                .delete()
                .eq('id', oldestId)
        }

        // Insert new score
        const { data, error } = await supabaseAdmin
            .from('scores')
            .insert({ user_id: userId, score, date })
            .select()
            .single()

        if (error) {
            return res.status(500).json({ error: 'Failed to add score' })
        }

        return res.status(201).json({ message: 'Score added successfully', data })

    } catch (err) {
        return res.status(500).json({ error: 'Server error adding score' })
    }
}

export const getMyScores = async (req, res) => {
    try {
        const userId = req.user.id

        const { data, error } = await supabaseAdmin
            .from('scores')
            .select('*')
            .eq('user_id', userId)
            .order('date', { ascending: false })

        if (error) {
            return res.status(500).json({ error: 'Failed to fetch scores' })
        }

        return res.status(200).json({ scores: data })

    } catch (err) {
        return res.status(500).json({ error: 'Server error fetching scores' })
    }
}

export const updateScore = async (req, res) => {
    try {
        const userId = req.user.id
        const { id } = req.params
        const { score, date } = req.body

        if (score && (score < 1 || score > 45)) {
            return res.status(400).json({ error: 'Score must be between 1 and 45' })
        }

        // Make sure score belongs to this user
        const { data: existing, error: fetchError } = await supabaseAdmin
            .from('scores')
            .select('*')
            .eq('id', id)
            .eq('user_id', userId)
            .single()

        if (fetchError || !existing) {
            return res.status(404).json({ error: 'Score not found' })
        }

        const { data, error } = await supabaseAdmin
            .from('scores')
            .update({ score, date })
            .eq('id', id)
            .select()
            .single()

        if (error) {
            return res.status(500).json({ error: 'Failed to update score' })
        }

        return res.status(200).json({ message: 'Score updated successfully', data })

    } catch (err) {
        return res.status(500).json({ error: 'Server error updating score' })
    }
}