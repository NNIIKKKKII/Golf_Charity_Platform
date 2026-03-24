import { supabaseAdmin } from '../config/supabaseClient.js'

// PUBLIC — Get all active charities
export const getAllCharities = async (req, res) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('charities')
            .select('*')
            .eq('is_active', true)
            .order('is_featured', { ascending: false })

        if (error) return res.status(500).json({ error: 'Failed to fetch charities' })

        return res.status(200).json({ charities: data })

    } catch (err) {
        return res.status(500).json({ error: 'Server error fetching charities' })
    }
}

// PUBLIC — Get single charity
export const getCharity = async (req, res) => {
    try {
        const { id } = req.params

        const { data, error } = await supabaseAdmin
            .from('charities')
            .select('*')
            .eq('id', id)
            .eq('is_active', true)
            .single()

        if (error || !data) return res.status(404).json({ error: 'Charity not found' })

        return res.status(200).json({ charity: data })

    } catch (err) {
        return res.status(500).json({ error: 'Server error fetching charity' })
    }
}

// ADMIN — Create charity
export const createCharity = async (req, res) => {
    try {
        const { name, description, images, is_featured } = req.body

        if (!name) return res.status(400).json({ error: 'Charity name is required' })

        const { data, error } = await supabaseAdmin
            .from('charities')
            .insert({
                name,
                description,
                images: images || [],
                is_featured: is_featured || false,
                is_active: true
            })
            .select()
            .single()

        if (error) return res.status(500).json({ error: 'Failed to create charity' })

        return res.status(201).json({ message: 'Charity created', charity: data })

    } catch (err) {
        return res.status(500).json({ error: 'Server error creating charity' })
    }
}

// ADMIN — Update charity
export const updateCharity = async (req, res) => {
    try {
        const { id } = req.params
        const { name, description, images, is_featured, is_active } = req.body

        const { data, error } = await supabaseAdmin
            .from('charities')
            .update({ name, description, images, is_featured, is_active })
            .eq('id', id)
            .select()
            .single()

        if (error) return res.status(500).json({ error: 'Failed to update charity' })

        return res.status(200).json({ message: 'Charity updated', charity: data })

    } catch (err) {
        return res.status(500).json({ error: 'Server error updating charity' })
    }
}

// ADMIN — Delete charity (soft delete)
export const deleteCharity = async (req, res) => {
    try {
        const { id } = req.params

        const { error } = await supabaseAdmin
            .from('charities')
            .update({ is_active: false })
            .eq('id', id)

        if (error) return res.status(500).json({ error: 'Failed to delete charity' })

        return res.status(200).json({ message: 'Charity deleted' })

    } catch (err) {
        return res.status(500).json({ error: 'Server error deleting charity' })
    }
}

// USER — Select charity
export const selectCharity = async (req, res) => {
    try {
        const userId = req.user.id
        const { charity_id, contribution_percentage } = req.body

        if (!charity_id) {
            return res.status(400).json({ error: 'Charity ID is required' })
        }

        const percentage = contribution_percentage || 10
        if (percentage < 10 || percentage > 100) {
            return res.status(400).json({ error: 'Contribution must be between 10% and 100%' })
        }

        // Verify charity exists
        const { data: charity, error: charityError } = await supabaseAdmin
            .from('charities')
            .select('id')
            .eq('id', charity_id)
            .eq('is_active', true)
            .single()

        if (charityError || !charity) {
            return res.status(404).json({ error: 'Charity not found' })
        }

        // Upsert user charity selection
        const { data, error } = await supabaseAdmin
            .from('user_charities')
            .upsert({
                user_id: userId,
                charity_id,
                contribution_percentage: percentage
            })
            .select()
            .single()

        if (error) return res.status(500).json({ error: 'Failed to select charity' })

        return res.status(200).json({ message: 'Charity selected', data })

    } catch (err) {
        return res.status(500).json({ error: 'Server error selecting charity' })
    }
}

// USER — Get my charity selection
export const getMyCharity = async (req, res) => {
    try {
        const userId = req.user.id

        const { data, error } = await supabaseAdmin
            .from('user_charities')
            .select(`
        *,
        charities (
          id,
          name,
          description,
          images,
          is_featured
        )
      `)
            .eq('user_id', userId)
            .single()

        if (error || !data) {
            return res.status(404).json({ error: 'No charity selected yet' })
        }

        return res.status(200).json({ selection: data })

    } catch (err) {
        return res.status(500).json({ error: 'Server error fetching charity selection' })
    }
}