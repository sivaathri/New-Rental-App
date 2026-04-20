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
            // Default to 'user' for all mobile logins from this app
            const role = 'user';
            await db.query('INSERT INTO users (mobile_number, otp, unique_id, role) VALUES (?, ?, ?, ?)', [mobile, otp, unique_id, role]);
        } else {
            // Ensure the role is set to 'user' even for existing users logging into this app
            await db.query('UPDATE users SET otp = ?, role = ? WHERE mobile_number = ?', [otp, 'user', mobile]);
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
            res.json({ 
                message: 'Login successful', 
                token, 
                user: {
                    id: user.id,
                    mobile: user.mobile_number,
                    full_name: user.full_name,
                    role: user.role,
                    unique_id: user.unique_id,
                    isComplete: !!user.full_name // Check if profile is complete
                }
            });
        } else {
            res.status(400).json({ error: 'Invalid OTP' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update Profile (Name)
router.post('/update-name', async (req, res) => {
    const { mobile, full_name } = req.body;
    if (!mobile || !full_name) return res.status(400).json({ error: 'Mobile and Name required' });

    try {
        await db.query('UPDATE users SET full_name = ? WHERE mobile_number = ?', [full_name, mobile]);
        const [rows] = await db.query('SELECT * FROM users WHERE mobile_number = ?', [mobile]);
        if (rows.length > 0) {
            const user = rows[0];
            res.json({ message: 'Profile updated', user });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Admin Credential Login
router.post('/admin-login', async (req, res) => {
    const { id, password } = req.body;
    // Hardcoded for master admin access as requested
    if (id === '123456' && password === '123456') {
        const token = jwt.sign(
            { id: 0, mobile: '0000000000', role: 'master' }, 
            process.env.JWT_SECRET || 'secret', 
            { expiresIn: '7d' }
        );
        return res.json({ 
            message: 'Master access granted', 
            token, 
            user: { id: 0, full_name: 'Master Admin', role: 'master', unique_id: 'MASTER' } 
        });
    }
    res.status(401).json({ error: 'Invalid credentials' });
});

module.exports = router;
