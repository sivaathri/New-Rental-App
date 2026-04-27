const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../utils/authMiddleware');

// Get all favorites for the current user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT v.*, 
                   (SELECT media_url FROM vehicle_media WHERE vehicle_id = v.id ORDER BY sort_order ASC, id ASC LIMIT 1) as image
            FROM vehicles v
            JOIN user_favorites f ON v.id = f.vehicle_id
            WHERE f.user_id = ?
        `, [req.user.id]);
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Toggle favorite
router.post('/toggle', authMiddleware, async (req, res) => {
    const { vehicleId } = req.body;
    if (!vehicleId) return res.status(400).json({ error: 'Vehicle ID required' });

    try {
        const [exists] = await db.query('SELECT id FROM user_favorites WHERE user_id = ? AND vehicle_id = ?', [req.user.id, vehicleId]);
        
        if (exists.length > 0) {
            await db.query('DELETE FROM user_favorites WHERE user_id = ? AND vehicle_id = ?', [req.user.id, vehicleId]);
            res.json({ success: true, message: 'Removed from favorites', isFavorite: false });
        } else {
            await db.query('INSERT INTO user_favorites (user_id, vehicle_id) VALUES (?, ?)', [req.user.id, vehicleId]);
            res.json({ success: true, message: 'Added to favorites', isFavorite: true });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
