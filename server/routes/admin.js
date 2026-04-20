const express = require('express');
const router = express.Router();
const db = require('../db');

// Simple admin middleware might be needed. Skipping for MVP scope where we just expose endpoints.

// Get all users
router.get('/users', async (req, res) => {
    try {
        const [users] = await db.query(`
            SELECT u.*, v.aadhar_card_url, v.driving_license_url, v.status as verification_status 
            FROM users u
            LEFT JOIN verifications v ON u.id = v.user_id
        `);
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
                   u.unique_id as owner_unique_id,
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
// Get all rejected vehicles
router.get('/vehicles/rejected', async (req, res) => {
    try {
        const [vehicles] = await db.query(`
            SELECT v.*, 
                   u.full_name as owner_name, 
                   u.mobile_number as owner_mobile, 
                   u.email as owner_email,
                   u.unique_id as owner_unique_id,
                   ver.aadhar_card_url,
                   ver.driving_license_url
            FROM vehicles v
            LEFT JOIN users u ON v.user_id = u.id
            LEFT JOIN verifications ver ON v.user_id = ver.user_id
            WHERE v.status = "Rejected"
        `);
        const vehiclesWithMedia = await Promise.all(vehicles.map(async (v) => {
            const [media] = await db.query('SELECT * FROM vehicle_media WHERE vehicle_id = ? ORDER BY sort_order ASC, id ASC', [v.id]);
            return { ...v, media };
        }));
        res.json({ vehicles: vehiclesWithMedia });
    } catch(err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all approved vehicles
router.get('/vehicles/approved', async (req, res) => {
    try {
        const [vehicles] = await db.query(`
            SELECT v.*, 
                   u.full_name as owner_name, 
                   u.mobile_number as owner_mobile, 
                   u.email as owner_email,
                   u.address as owner_address,
                   u.city as owner_city,
                   u.unique_id as owner_unique_id,
                   ver.aadhar_card_url,
                   ver.driving_license_url
            FROM vehicles v
            LEFT JOIN users u ON v.user_id = u.id
            LEFT JOIN verifications ver ON v.user_id = ver.user_id
            WHERE v.status = "Approved"
            ORDER BY v.sort_order ASC, v.approved_at DESC
        `);
        const vehiclesWithMedia = await Promise.all(vehicles.map(async (v) => {
            const [media] = await db.query('SELECT * FROM vehicle_media WHERE vehicle_id = ? ORDER BY sort_order ASC, id ASC', [v.id]);
            return { ...v, media };
        }));
        res.json({ vehicles: vehiclesWithMedia });
    } catch(err) {
        res.status(500).json({ error: 'Server error' });
    }
});
// Approve or reject vehicle
router.post('/vehicles/:id/status', async (req, res) => {
    const { status, reason } = req.body; // status: Approved or Rejected
    try {
        if (status === 'Approved') {
            await db.query('UPDATE vehicles SET status = ?, approved_at = NOW() WHERE id = ?', [status, req.params.id]);
        } else {
            await db.query('UPDATE vehicles SET status = ?, rejection_reason = ?, approved_at = NULL WHERE id = ?', [status, reason || null, req.params.id]);
        }
        res.json({ message: `Vehicle ${status}` });
    } catch(err) {
        res.status(500).json({ error: 'Server error' });
    }
});

const upload = require('../utils/upload');

// Get all master vehicles
router.get('/vehicles/master', async (req, res) => {
    try {
        const [vehicles] = await db.query('SELECT * FROM vehicle_master ORDER BY sort_order ASC, id DESC');
        res.json({ vehicles });
    } catch(err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Add new master vehicle
router.post('/vehicles/master', upload.single('image'), async (req, res) => {
    const { name } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;
    try {
        await db.query('INSERT INTO vehicle_master (name, image_url) VALUES (?, ?)', [name, image_url]);
        res.json({ message: 'Vehicle added to master list' });
    } catch(err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update master vehicle
router.post('/vehicles/master/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    let query = 'UPDATE vehicle_master SET name = ?';
    let params = [name];
    
    if (req.file) {
        query += ', image_url = ?';
        params.push(`/uploads/${req.file.filename}`);
    }
    
    query += ' WHERE id = ?';
    params.push(id);

    try {
        await db.query(query, params);
        res.json({ message: 'Vehicle updated successfully' });
    } catch(err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update master vehicle order
router.post('/vehicles/master/:id/order', async (req, res) => {
    const { id } = req.params;
    const { sort_order } = req.body;
    try {
        await db.query('UPDATE vehicle_master SET sort_order = ? WHERE id = ?', [sort_order, id]);
        res.json({ message: 'Order updated' });
    } catch(err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update approved vehicle sort order
router.post('/vehicles/approved/:id/order', async (req, res) => {
    const { id } = req.params;
    const { sort_order } = req.body;
    try {
        await db.query('UPDATE vehicles SET sort_order = ? WHERE id = ?', [sort_order, id]);
        res.json({ message: 'Vehicle order updated' });
    } catch(err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all subscriptions
router.get('/subscriptions', async (req, res) => {
    try {
        const [subs] = await db.query(`
            SELECT s.*, u.full_name as user_name, u.mobile_number, u.email as user_email, u.unique_id as user_unique_id
            FROM subscriptions s
            LEFT JOIN users u ON s.user_id = u.id
            ORDER BY s.id DESC
        `);
        res.json({ subscriptions: subs });
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
