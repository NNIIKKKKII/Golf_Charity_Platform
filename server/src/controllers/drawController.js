import { supabaseAdmin } from '../config/supabaseClient.js'
import { sendEmail } from '../config/mailer.js'
import { drawResultsEmail } from '../config/emailTemplates.js'

// Helper: generate random winning numbers
const generateRandomNumbers = () => {
    const numbers = new Set()
    while (numbers.size < 5) {
        numbers.add(Math.floor(Math.random() * 45) + 1)
    }
    return Array.from(numbers)
}

// Helper: generate algorithmic numbers based on most frequent scores
const generateAlgorithmicNumbers = async () => {
    try {
        const { data: scores } = await supabaseAdmin
            .from('scores')
            .select('score')

        if (!scores || scores.length === 0) return generateRandomNumbers()

        // Count frequency of each score
        const frequency = {}
        scores.forEach(({ score }) => {
            frequency[score] = (frequency[score] || 0) + 1
        })

        // Sort by frequency descending
        const sorted = Object.entries(frequency)
            .sort((a, b) => b[1] - a[1])
            .map(([score]) => parseInt(score))

        // Take top 5 most frequent, fill rest randomly if needed
        const result = sorted.slice(0, 5)
        while (result.length < 5) {
            const rand = Math.floor(Math.random() * 45) + 1
            if (!result.includes(rand)) result.push(rand)
        }

        return result

    } catch (err) {
        return generateRandomNumbers()
    }
}

// Helper: calculate prize pools
const calculatePrizePools = (subscriberCount, planAmounts) => {
    const total = planAmounts.reduce((sum, amount) => sum + amount, 0)
    return {
        total_amount: total,
        five_match_pool: total * 0.40,
        four_match_pool: total * 0.35,
        three_match_pool: total * 0.25
    }
}

// Helper: count matches between user scores and winning numbers
const countMatches = (userScores, winningNumbers) => {
    return userScores.filter(score => winningNumbers.includes(score)).length
}

// ADMIN — Run draw simulation or official draw
export const runDraw = async (req, res) => {
    try {
        const { month, year, draw_type, status, total_pool_amount } = req.body

        if (!month || !year || !draw_type || !status) {
            return res.status(400).json({ error: 'month, year, draw_type and status are required' })
        }

        if (!['random', 'algorithmic'].includes(draw_type)) {
            return res.status(400).json({ error: 'draw_type must be random or algorithmic' })
        }

        if (!['simulation', 'published'].includes(status)) {
            return res.status(400).json({ error: 'status must be simulation or published' })
        }

        // Check if published draw already exists for this month/year
        if (status === 'published') {
            const { data: existing } = await supabaseAdmin
                .from('draws')
                .select('id')
                .eq('month', month)
                .eq('year', year)
                .eq('status', 'published')
                .single()

            if (existing) {
                return res.status(400).json({ error: 'A published draw already exists for this month' })
            }
        }

        // Generate winning numbers
        const drawnNumbers = draw_type === 'algorithmic'
            ? await generateAlgorithmicNumbers()
            : generateRandomNumbers()

        // Get all active subscribers with their scores
        const { data: activeSubscriptions, error: subError } = await supabaseAdmin
            .from('subscriptions')
            .select('user_id, plan')
            .eq('status', 'active')

        if (subError) {
            return res.status(500).json({ error: 'Failed to fetch active subscribers' })
        }

        if (!activeSubscriptions || activeSubscriptions.length === 0) {
            return res.status(400).json({ error: 'No active subscribers found' })
        }

        // Get scores for each active subscriber
        const entries = []
        for (const sub of activeSubscriptions) {
            const { data: scores } = await supabaseAdmin
                .from('scores')
                .select('score')
                .eq('user_id', sub.user_id)
                .order('date', { ascending: false })
                .limit(5)

            if (scores && scores.length > 0) {
                entries.push({
                    user_id: sub.user_id,
                    scores_snapshot: scores.map(s => s.score),
                    plan: sub.plan
                })
            }
        }

        // Calculate prize pool
        const planAmounts = activeSubscriptions.map(sub =>
            sub.plan === 'yearly' ? 9999 / 12 : 999
        )
        const pools = calculatePrizePools(activeSubscriptions.length, planAmounts)

        // Check for jackpot carryover from previous month
        const prevMonth = month === 1 ? 12 : month - 1
        const prevYear = month === 1 ? year - 1 : year

        const { data: prevDraw } = await supabaseAdmin
            .from('draws')
            .select('jackpot_amount')
            .eq('month', prevMonth)
            .eq('year', prevYear)
            .eq('status', 'published')
            .single()

        const carriedJackpot = prevDraw?.jackpot_amount || 0
        pools.five_match_pool += carriedJackpot

        // Find winners
        const winners = []
        entries.forEach(entry => {
            const matches = countMatches(entry.scores_snapshot, drawnNumbers)
            if (matches >= 3) {
                winners.push({
                    user_id: entry.user_id,
                    match_type: matches,
                    scores_snapshot: entry.scores_snapshot
                })
            }
        })

        // Group winners by match type
        const fiveMatch = winners.filter(w => w.match_type === 5)
        const fourMatch = winners.filter(w => w.match_type === 4)
        const threeMatch = winners.filter(w => w.match_type === 3)

        // Calculate individual prize amounts
        const prizePerFive = fiveMatch.length > 0 ? pools.five_match_pool / fiveMatch.length : 0
        const prizePerFour = fourMatch.length > 0 ? pools.four_match_pool / fourMatch.length : 0
        const prizePerThree = threeMatch.length > 0 ? pools.three_match_pool / threeMatch.length : 0

        // Jackpot carries over if no 5-match winner
        const jackpotAmount = fiveMatch.length === 0 ? pools.five_match_pool : 0

        // Save draw to database
        const { data: draw, error: drawError } = await supabaseAdmin
            .from('draws')
            .insert({
                month,
                year,
                status,
                draw_type,
                drawn_numbers: drawnNumbers,
                jackpot_amount: jackpotAmount
            })
            .select()
            .single()

        if (drawError) {
            return res.status(500).json({ error: 'Failed to save draw' })
        }

        // Save prize pool
        await supabaseAdmin
            .from('prize_pools')
            .insert({
                draw_id: draw.id,
                total_amount: pools.total_amount,
                five_match_pool: pools.five_match_pool,
                four_match_pool: pools.four_match_pool,
                three_match_pool: pools.three_match_pool,
                jackpot_carried_over: carriedJackpot > 0
            })

        // Save draw entries
        if (entries.length > 0) {
            await supabaseAdmin
                .from('draw_entries')
                .insert(entries.map(e => ({
                    draw_id: draw.id,
                    user_id: e.user_id,
                    scores_snapshot: e.scores_snapshot
                })))
        }

        // Save winners (only if published)
        if (status === 'published' && winners.length > 0) {
            const winnerRows = [
                ...fiveMatch.map(w => ({
                    draw_id: draw.id,
                    user_id: w.user_id,
                    match_type: 5,
                    prize_amount: prizePerFive,
                    verification_status: 'pending',
                    payment_status: 'pending'
                })),
                ...fourMatch.map(w => ({
                    draw_id: draw.id,
                    user_id: w.user_id,
                    match_type: 4,
                    prize_amount: prizePerFour,
                    verification_status: 'pending',
                    payment_status: 'pending'
                })),
                ...threeMatch.map(w => ({
                    draw_id: draw.id,
                    user_id: w.user_id,
                    match_type: 3,
                    prize_amount: prizePerThree,
                    verification_status: 'pending',
                    payment_status: 'pending'
                }))
            ]

            await supabaseAdmin.from('winners').insert(winnerRows)
        }

        // Send draw result emails
        // if (status === 'published') {
        //     const { data: allUsers } = await supabaseAdmin
        //         .from('profiles')
        //         .select('id, email')

        //     if (allUsers) {
        //         const winnerIds = new Set(winners.map(w => w.user_id))
        //         for (const user of allUsers) {
        //             const hasWon = winnerIds.has(user.id)
        //             sendEmail(drawResultsEmail(user.email, draw, hasWon))
        //         }
        //     }
        // }

        return res.status(200).json({
            message: `Draw ${status} successfully`,
            draw: {
                id: draw.id,
                month,
                year,
                status,
                drawn_numbers: drawnNumbers,
                total_entries: entries.length,
                prize_pools: pools,
                jackpot_carried_over: carriedJackpot > 0,
                jackpot_amount: jackpotAmount,
                winners: {
                    five_match: fiveMatch.length,
                    four_match: fourMatch.length,
                    three_match: threeMatch.length,
                    details: winners.map(w => ({
                        user_id: w.user_id,
                        match_type: w.match_type,
                        prize: w.match_type === 5 ? prizePerFive :
                            w.match_type === 4 ? prizePerFour : prizePerThree
                    }))
                }
            }
        })

    } catch (err) {
        console.error('Draw error:', err)
        return res.status(500).json({ error: 'Server error running draw' })
    }
}

// ADMIN — Get all draws
export const getAllDraws = async (req, res) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('draws')
            .select(`
        *,
        prize_pools (*)
      `)
            .order('created_at', { ascending: false })

        if (error) return res.status(500).json({ error: 'Failed to fetch draws' })

        return res.status(200).json({ draws: data })

    } catch (err) {
        return res.status(500).json({ error: 'Server error fetching draws' })
    }
}

// PUBLIC — Get published draws
export const getPublishedDraws = async (req, res) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('draws')
            .select(`
        *,
        prize_pools (*)
      `)
            .eq('status', 'published')
            .order('created_at', { ascending: false })

        if (error) return res.status(500).json({ error: 'Failed to fetch draws' })

        return res.status(200).json({ draws: data })

    } catch (err) {
        return res.status(500).json({ error: 'Server error fetching draws' })
    }
}

// USER — Get my draw history and winnings
export const getMyDrawHistory = async (req, res) => {
    try {
        const userId = req.user.id

        const { data, error } = await supabaseAdmin
            .from('draw_entries')
            .select(`
        *,
        draws (
          id, month, year, status, drawn_numbers
        )
      `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

        if (error) return res.status(500).json({ error: 'Failed to fetch draw history' })

        return res.status(200).json({ history: data })

    } catch (err) {
        return res.status(500).json({ error: 'Server error fetching draw history' })
    }
}