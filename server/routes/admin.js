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
        const [vehicles] = await db.query('SELECT * FROM vehicles WHERE status = "Waiting for Approval"');
        res.json({ vehicles });
    } catch(err) {
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
