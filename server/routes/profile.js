const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../utils/authMiddleware');
const upload = require('../utils/upload');

// Update Profile
router.post('/setup', authMiddleware, upload.single('profile_photo'), async (req, res) => {
    const { full_name, address, city } = req.body;
    const profile_photo = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        let query = 'UPDATE users SET full_name = ?, address = ?, city = ?';
        let params = [full_name, address, city || 'Pondicherry'];

        if (profile_photo) {
            query += ', profile_photo = ?';
            params.push(profile_photo);
        }

        query += ' WHERE id = ?';
        params.push(req.user.id);

        await db.query(query, params);
        res.json({ message: 'Profile updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Upload verification docs
router.post('/verify', authMiddleware, upload.fields([{ name: 'aadhar', maxCount: 1 }, { name: 'license', maxCount: 1 }]), async (req, res) => {
    try {
        const aadharUrl = req.files['aadhar'] ? `/uploads/${req.files['aadhar'][0].filename}` : null;
        const licenseUrl = req.files['license'] ? `/uploads/${req.files['license'][0].filename}` : null;

        const [existing] = await db.query('SELECT * FROM verifications WHERE user_id = ?', [req.user.id]);
        if (existing.length > 0) {
            await db.query('UPDATE verifications SET aadhar_card_url = COALESCE(?, aadhar_card_url), driving_license_url = COALESCE(?, driving_license_url), status = "Pending" WHERE user_id = ?', [aadharUrl, licenseUrl, req.user.id]);
        } else {
            await db.query('INSERT INTO verifications (user_id, aadhar_card_url, driving_license_url) VALUES (?, ?, ?)', [req.user.id, aadharUrl, licenseUrl]);
        }

        res.json({ message: 'Verification documents uploaded' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/', authMiddleware, async (req, res) => {
    try {
        const [users] = await db.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
        const [verifs] = await db.query('SELECT * FROM verifications WHERE user_id = ?', [req.user.id]);
        res.json({ user: users[0], verification: verifs[0] });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/progress', authMiddleware, async (req, res) => {
    try {
        const { vehicleId } = req.query;
        const [users] = await db.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
        const user = users[0];
        if (!user || !user.full_name) return res.json({ step: 2, data: { user } });
        
        const [verifs] = await db.query('SELECT * FROM verifications WHERE user_id = ?', [req.user.id]);
        const verification = verifs[0];
        if (verifs.length === 0) return res.json({ step: 3, data: { user, verification } });

        let vehicle;
        if (vehicleId) {
            const [rows] = await db.query('SELECT * FROM vehicles WHERE id = ? AND user_id = ?', [vehicleId, req.user.id]);
            vehicle = rows[0];
        } else {
            const [rows] = await db.query('SELECT * FROM vehicles WHERE user_id = ?', [req.user.id]);
            vehicle = rows[0];
        }

        if (!vehicle) return res.json({ step: 4, data: { user, verification } });

        const [subs] = await db.query('SELECT * FROM subscriptions WHERE user_id = ? AND (vehicle_id = ? OR vehicle_id IS NULL)', [req.user.id, vehicle.id]);
        // Note: Subscriptions might need a vehicle_id column in the DB if we want to be precise for multiple vehicles.
        // For now, let's assume one sub per vehicle or shared sub logic.
        
        if (subs.length === 0) return res.json({ step: 6, vehicleId: vehicle.id, data: { user, verification, vehicle } });

        return res.json({ step: 7, data: { user, verification, vehicle } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
