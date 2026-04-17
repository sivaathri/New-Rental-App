const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../utils/authMiddleware');

const PLANS = {
    "1 Month": { price: 600, duration: 30 },
    "3 Month": { price: 1200, duration: 90 },
    "6 Month": { price: 2000, duration: 180 },
    "12 Month": { price: 3000, duration: 365 }
};

// Get current active/stacked plans
router.get('/status', authMiddleware, async (req, res) => {
    try {
        const now = new Date();
        
        // 1. Mark expired active plans
        await db.query('UPDATE subscriptions SET status = "Expired" WHERE user_id = ? AND status = "Active" AND end_date < ?', [req.user.id, now]);

        // 2. Activate stacked plans that should be active now
        // Find if there's no active plan but there are stacked ones
        const [active] = await db.query('SELECT * FROM subscriptions WHERE user_id = ? AND status = "Active"', [req.user.id]);
        if (active.length === 0) {
            const [nextStacked] = await db.query('SELECT * FROM subscriptions WHERE user_id = ? AND status = "Stacked" AND start_date <= ? ORDER BY start_date ASC LIMIT 1', [req.user.id, now]);
            if (nextStacked.length > 0) {
                await db.query('UPDATE subscriptions SET status = "Active" WHERE id = ?', [nextStacked[0].id]);
            }
        }

        const [subs] = await db.query('SELECT * FROM subscriptions WHERE user_id = ? ORDER BY end_date DESC', [req.user.id]);
        res.json({ subscriptions: subs });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Purchase/Upgrade Plan
router.post('/purchase', authMiddleware, async (req, res) => {
    const { planName } = req.body;
    const plan = PLANS[planName];
    if (!plan) return res.status(400).json({ error: 'Invalid plan' });

    try {
        // Get the latest end date of any active/stacked plan
        const [lastSub] = await db.query('SELECT MAX(end_date) as lastEnd FROM subscriptions WHERE user_id = ? AND (status = "Active" OR status = "Stacked")', [req.user.id]);
        
        let startDate = new Date();
        const lastEnd = lastSub[0].lastEnd;
        
        if (lastEnd && new Date(lastEnd) > startDate) {
            startDate = new Date(lastEnd);
        }

        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + plan.duration);

        // If there's already an active plan, this one is 'Stacked'
        let status = 'Active';
        const [activeSubs] = await db.query('SELECT * FROM subscriptions WHERE user_id = ? AND status = "Active"', [req.user.id]);
        if (activeSubs.length > 0 && new Date(activeSubs[0].end_date) > new Date()) {
            status = 'Stacked';
        }

        await db.query(`
            INSERT INTO subscriptions (user_id, plan_name, duration_days, plan_price, status, start_date, end_date)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [req.user.id, planName, plan.duration, plan.price, status, startDate, endDate]);

        res.json({ message: 'Plan purchased successfully', startDate, endDate, status });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
