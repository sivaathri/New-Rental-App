const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');

async function generateUniqueId() {
    let id;
    let exists = true;
    while (exists) {
        id = Math.floor(10000 + Math.random() * 90000).toString();
        const [rows] = await db.query('SELECT id FROM users WHERE unique_id = ?', [id]);
        if (rows.length === 0) exists = false;
    }
    return id;
}

// Send OTP
router.post('/send-otp', async (req, res) => {
    const { mobile } = req.body;
    if (!mobile) return res.status(400).json({ error: 'Mobile number required' });

    try {
        const otp = '123456'; // Mock OTP
        let [rows] = await db.query('SELECT * FROM users WHERE mobile_number = ?', [mobile]);
        
        if (rows.length === 0) {
            const unique_id = await generateUniqueId();
            await db.query('INSERT INTO users (mobile_number, otp, unique_id, role) VALUES (?, ?, ?, ?)', [mobile, otp, unique_id, 'vehicle-owners']);
        } else {
            const user = rows[0];
            let unique_id = user.unique_id;
            if (!unique_id) {
                unique_id = await generateUniqueId();
                await db.query('UPDATE users SET otp = ?, unique_id = ? WHERE mobile_number = ?', [otp, unique_id, mobile]);
            } else {
                await db.query('UPDATE users SET otp = ? WHERE mobile_number = ?', [otp, mobile]);
            }
        }
        res.json({ message: 'OTP sent (use 123456)' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
    const { mobile, otp } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE mobile_number = ? AND otp = ?', [mobile, otp]);
        if (rows.length > 0) {
            const user = rows[0];
            const token = jwt.sign(
                { id: user.id, mobile: user.mobile_number, role: user.role }, 
                process.env.JWT_SECRET || 'secret', 
                { expiresIn: '7d' }
            );
            res.json({ message: 'Login successful', token, user });
        } else {
            res.status(400).json({ error: 'Invalid OTP' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
