const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all favorites for a user
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const [rows] = await db.query(`
            SELECT v.*, u.mobile_number,
                   (SELECT media_url FROM vehicle_media WHERE vehicle_id = v.id ORDER BY sort_order ASC, id ASC LIMIT 1) as image
            FROM vehicles v
            JOIN user_favorites f ON v.id = f.vehicle_id
            LEFT JOIN users u ON v.user_id = u.id
            WHERE f.user_id = ?
        `, [userId]);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Toggle favorite
router.post('/toggle', async (req, res) => {
    const { userId, vehicleId } = req.body;
    if (!userId || !vehicleId) return res.status(400).json({ error: 'User ID and Vehicle ID required' });

    try {
        const [exists] = await db.query('SELECT id FROM user_favorites WHERE user_id = ? AND vehicle_id = ?', [userId, vehicleId]);
        
        if (exists.length > 0) {
            await db.query('DELETE FROM user_favorites WHERE user_id = ? AND vehicle_id = ?', [userId, vehicleId]);
            res.json({ message: 'Removed from favorites', isFavorite: false });
        } else {
            await db.query('INSERT INTO user_favorites (user_id, vehicle_id) VALUES (?, ?)', [userId, vehicleId]);
            res.json({ message: 'Added to favorites', isFavorite: true });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
