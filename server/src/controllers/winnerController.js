import { supabaseAdmin } from '../config/supabaseClient.js'
import { sendEmail } from '../config/mailer.js'
import { winnerVerifiedEmail } from '../config/emailTemplates.js'

// USER — Get my winnings
export const getMyWinnings = async (req, res) => {
    try {
        const userId = req.user.id

        const { data, error } = await supabaseAdmin
            .from('winners')
            .select(`
        *,
        draws (
          id, month, year, drawn_numbers
        )
      `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

        if (error) return res.status(500).json({ error: 'Failed to fetch winnings' })

        return res.status(200).json({ winnings: data })

    } catch (err) {
        return res.status(500).json({ error: 'Server error fetching winnings' })
    }
}

// USER — Upload proof screenshot URL
export const uploadProof = async (req, res) => {
    try {
        const userId = req.user.id
        const { id } = req.params
        const { proof_url } = req.body

        if (!proof_url) {
            return res.status(400).json({ error: 'Proof URL is required' })
        }

        // Verify this winner record belongs to this user
        const { data: winner, error: fetchError } = await supabaseAdmin
            .from('winners')
            .select('*')
            .eq('id', id)
            .eq('user_id', userId)
            .single()

        if (fetchError || !winner) {
            return res.status(404).json({ error: 'Winner record not found' })
        }

        if (winner.verification_status === 'approved') {
            return res.status(400).json({ error: 'Already approved' })
        }

        const { data, error } = await supabaseAdmin
            .from('winners')
            .update({
                proof_url,
                verification_status: 'pending'
            })
            .eq('id', id)
            .select()
            .single()

        if (error) return res.status(500).json({ error: 'Failed to upload proof' })

        return res.status(200).json({ message: 'Proof submitted successfully', data })

    } catch (err) {
        return res.status(500).json({ error: 'Server error uploading proof' })
    }
}

// ADMIN — Get all winners
export const getAllWinners = async (req, res) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('winners')
            .select(`
        *,
        draws (id, month, year, drawn_numbers),
        profiles (id, email)
      `)
            .order('created_at', { ascending: false })

        if (error) return res.status(500).json({ error: 'Failed to fetch winners' })

        return res.status(200).json({ winners: data })

    } catch (err) {
        return res.status(500).json({ error: 'Server error fetching winners' })
    }
}

// ADMIN — Approve or reject winner
export const verifyWinner = async (req, res) => {
    try {
        const { id } = req.params
        const { verification_status } = req.body

        if (!['approved', 'rejected'].includes(verification_status)) {
            return res.status(400).json({ error: 'Status must be approved or rejected' })
        }

        const { data: winner, error: fetchError } = await supabaseAdmin
            .from('winners')
            .select('*')
            .eq('id', id)
            .single()

        if (fetchError || !winner) {
            return res.status(404).json({ error: 'Winner not found' })
        }

        if (!winner.proof_url) {
            return res.status(400).json({ error: 'Winner has not uploaded proof yet' })
        }

        const { data, error } = await supabaseAdmin
            .from('winners')
            .update({ verification_status })
            .eq('id', id)
            .select()
            .single()

        if (error) return res.status(500).json({ error: 'Failed to verify winner' })

        // Send email if approved
        // if (verification_status === 'approved') {
        //     const { data: profile } = await supabaseAdmin
        //         .from('profiles')
        //         .select('email')
        //         .eq('id', winner.user_id)
        //         .single()

        //     if (profile) {
        //         sendEmail(winnerVerifiedEmail(profile.email, winner.prize_amount))
        //     }
        // }

        return res.status(200).json({ message: `Winner ${verification_status}`, data })

    } catch (err) {
        return res.status(500).json({ error: 'Server error verifying winner' })
    }
}

// ADMIN — Mark winner as paid
export const markAsPaid = async (req, res) => {
    try {
        const { id } = req.params

        const { data: winner, error: fetchError } = await supabaseAdmin
            .from('winners')
            .select('*')
            .eq('id', id)
            .single()

        if (fetchError || !winner) {
            return res.status(404).json({ error: 'Winner not found' })
        }

        if (winner.verification_status !== 'approved') {
            return res.status(400).json({ error: 'Winner must be approved before marking as paid' })
        }

        const { data, error } = await supabaseAdmin
            .from('winners')
            .update({ payment_status: 'paid' })
            .eq('id', id)
            .select()
            .single()

        if (error) return res.status(500).json({ error: 'Failed to mark as paid' })

        return res.status(200).json({ message: 'Marked as paid', data })

    } catch (err) {
        return res.status(500).json({ error: 'Server error marking as paid' })
    }
}