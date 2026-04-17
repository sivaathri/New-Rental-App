const express = require('express');
const router = express.Router();
const multer = require('multer');
const db = require('../db');
const authMiddleware = require('../utils/authMiddleware');
const upload = require('../utils/upload');

// Update Profile and KYC Docs in one go
router.post('/setup', authMiddleware, (req, res, next) => {
    upload.fields([
        { name: 'aadhar', maxCount: 1 },
        { name: 'license', maxCount: 1 }
    ])(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            console.error('Multer Error in /setup:', err.message, 'Field:', err.field);
            return res.status(400).json({ error: `Multer error: ${err.message} on field ${err.field}` });
        } else if (err) {
            console.error('Unknown upload error:', err);
            return res.status(500).json({ error: 'Upload error' });
        }
        next();
    });
}, async (req, res) => {
    const { full_name, email, address, city } = req.body;
    const aadharUrl = req.files['aadhar'] ? `/uploads/${req.files['aadhar'][0].filename}` : null;
    const licenseUrl = req.files['license'] ? `/uploads/${req.files['license'][0].filename}` : null;

    try {
        // 1. Update User Profile
        await db.query('UPDATE users SET full_name = ?, email = ?, address = ?, city = ? WHERE id = ?', [
            full_name, 
            email,
            address, 
            city || 'Pondicherry', 
            req.user.id
        ]);

        // 2. Update/Insert Verification Docs
        if (aadharUrl || licenseUrl) {
            const [existing] = await db.query('SELECT * FROM verifications WHERE user_id = ?', [req.user.id]);
            if (existing.length > 0) {
                await db.query('UPDATE verifications SET aadhar_card_url = COALESCE(?, aadhar_card_url), driving_license_url = COALESCE(?, driving_license_url), status = "Pending" WHERE user_id = ?', [aadharUrl, licenseUrl, req.user.id]);
            } else {
                await db.query('INSERT INTO verifications (user_id, aadhar_card_url, driving_license_url) VALUES (?, ?, ?)', [req.user.id, aadharUrl, licenseUrl]);
            }
        }

        res.json({ message: 'Profile and Verification updated' });
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

// Request Email Change
router.post('/request-email-change', authMiddleware, async (req, res) => {
    const { newEmail } = req.body;
    if (!newEmail) return res.status(400).json({ error: 'New email required' });

    try {
        const otp = '654321'; // Mock OTP for email
        // Store in a temporary column or just 'otp' column
        await db.query('UPDATE users SET otp = ? WHERE id = ?', [otp, req.user.id]);
        console.log(`Email OTP for ${newEmail}: ${otp}`);
        res.json({ message: 'OTP sent to ' + newEmail + ' (use 654321)' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Verify Email Change
router.post('/verify-email-change', authMiddleware, async (req, res) => {
    const { newEmail, otp } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE id = ? AND otp = ?', [req.user.id, otp]);
        if (rows.length > 0) {
            await db.query('UPDATE users SET email = ?, otp = NULL WHERE id = ?', [newEmail, req.user.id]);
            res.json({ message: 'Email updated successfully' });
        } else {
            res.status(400).json({ error: 'Invalid OTP' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
