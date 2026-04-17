const express = require('express');
const router = express.Router();
const db = require('../db');

// Simple admin middleware might be needed. Skipping for MVP scope where we just expose endpoints.

// Get all users
router.get('/users', async (req, res) => {
    try {
        const [users] = await db.query('SELECT * FROM users');
        res.json({ users });
    } catch(err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all pending verifications
router.get('/verifications/pending', async (req, res) => {
    try {
        const [verifs] = await db.query('SELECT * FROM verifications WHERE status = "Pending"');
        res.json({ verifications: verifs });
    } catch(err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Approve or reject verification
router.post('/verifications/:id/status', async (req, res) => {
    const { status, reason } = req.body; // status: Verified or Rejected
    try {
        await db.query('UPDATE verifications SET status = ?, rejection_reason = ? WHERE id = ?', [status, reason || null, req.params.id]);
        res.json({ message: `Verification ${status}` });
    } catch(err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all pending vehicles
router.get('/vehicles/pending', async (req, res) => {
    try {
        const [vehicles] = await db.query(`
            SELECT v.*, 
                   u.full_name as owner_name, 
                   u.mobile_number as owner_mobile, 
                   u.email as owner_email, 
                   u.address as owner_address, 
                   u.city as owner_city,
                   ver.aadhar_card_url,
                   ver.driving_license_url
            FROM vehicles v
            LEFT JOIN users u ON v.user_id = u.id
            LEFT JOIN verifications ver ON v.user_id = ver.user_id
            WHERE v.status = "Waiting for Approval"
        `);

        // For each vehicle, fetch its media
        const vehiclesWithMedia = await Promise.all(vehicles.map(async (v) => {
            const [media] = await db.query('SELECT * FROM vehicle_media WHERE vehicle_id = ? ORDER BY sort_order ASC, id ASC', [v.id]);
            return { ...v, media };
        }));

        res.json({ vehicles: vehiclesWithMedia });
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Approve or reject vehicle
router.post('/vehicles/:id/status', async (req, res) => {
    const { status, reason } = req.body; // status: Approved or Rejected
    try {
        await db.query('UPDATE vehicles SET status = ?, rejection_reason = ? WHERE id = ?', [status, reason || null, req.params.id]);
        res.json({ message: `Vehicle ${status}` });
    } catch(err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
