const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../utils/authMiddleware');

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

// Get all enquiry (call clicks)
router.get('/enquiries', async (req, res) => {
    try {
        const [enquiries] = await db.query(`
            SELECT 
                vc.id,
                vc.created_at,
                u.full_name as user_name,
                u.mobile_number as user_mobile,
                v.name as vehicle_name,
                v.registration_number,
                owner.full_name as owner_name,
                owner.mobile_number as owner_mobile,
                COALESCE(owner.unique_id, 'NO_ID') as owner_unique_id
            FROM vehicle_calls vc
            JOIN users u ON vc.user_id = u.id
            JOIN vehicles v ON vc.vehicle_id = v.id
            JOIN users owner ON v.user_id = owner.id
            ORDER BY vc.id DESC
        `);
        console.log('Enquiries data:', enquiries);
        res.json({ enquiries });
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all reviews
router.get('/reviews', authMiddleware, async (req, res) => {
    try {
        const [reviews] = await db.query(`
            SELECT 
                r.*, 
                u.full_name as reviewer_name,
                v.name as vehicle_name,
                v.registration_number,
                o.full_name as owner_name
            FROM vehicle_reviews r
            JOIN users u ON r.user_id = u.id
            JOIN vehicles v ON r.vehicle_id = v.id
            JOIN users o ON v.user_id = o.id
            ORDER BY r.created_at DESC
        `);
        res.json({ reviews });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get services by type
router.get('/services', async (req, res) => {
    const { type } = req.query;
    try {
        const [services] = await db.query('SELECT * FROM services WHERE type = ? ORDER BY id DESC', [type]);
        res.json({ services });
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Add new service
router.post('/services', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'idProof', maxCount: 1 }]), async (req, res) => {
    const { type, name, mobile, location, latitude, longitude } = req.body;
    const image_url = req.files['image'] ? `/uploads/${req.files['image'][0].filename}` : null;
    const id_proof_url = req.files['idProof'] ? `/uploads/${req.files['idProof'][0].filename}` : null;
    
    try {
        await db.query(
            'INSERT INTO services (type, name, mobile, location, image_url, id_proof_url, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [type, name, mobile, location, image_url, id_proof_url, latitude || null, longitude || null]
        );
        res.json({ message: `${type} added successfully` });
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update service
router.put('/services/:id', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'idProof', maxCount: 1 }]), async (req, res) => {
    const { id } = req.params;
    const { type, name, mobile, location, latitude, longitude } = req.body;
    let image_url = req.body.image_url;
    let id_proof_url = req.body.id_proof_url;

    if (req.files['image']) {
        image_url = `/uploads/${req.files['image'][0].filename}`;
    }
    if (req.files['idProof']) {
        id_proof_url = `/uploads/${req.files['idProof'][0].filename}`;
    }

    try {
        await db.query(
            'UPDATE services SET type = ?, name = ?, mobile = ?, location = ?, image_url = ?, id_proof_url = ?, latitude = ?, longitude = ? WHERE id = ?',
            [type, name, mobile, location, image_url, id_proof_url, latitude || null, longitude || null, id]
        );
        res.json({ message: `${type} updated successfully` });
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete service
router.delete('/services/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM services WHERE id = ?', [req.params.id]);
        res.json({ message: 'Service deleted successfully' });
    } catch(err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Track service clicks (Public accessibility)
router.post('/services/:id/track', async (req, res) => {
    const { id } = req.params;
    const { action, user_id } = req.body; // 'call' or 'map'
    
    try {
        if (action === 'call') {
            await db.query('UPDATE services SET call_clicks = call_clicks + 1 WHERE id = ?', [id]);
        } else if (action === 'map') {
            await db.query('UPDATE services SET map_clicks = map_clicks + 1 WHERE id = ?', [id]);
        }

        if (user_id) {
            console.log(`Tracking Lead: Service ${id}, User ${user_id}, Action ${action}`);
            await db.query('INSERT INTO service_enquiries (service_id, user_id, action) VALUES (?, ?, ?)', [id, user_id, action]);
        }
        res.json({ success: true });
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get detailed enquiries for a service
router.get('/services/:id/enquiries', async (req, res) => {
    try {
        const [enquiries] = await db.query(`
            SELECT se.*, u.full_name as user_name, u.mobile_number as user_mobile
            FROM service_enquiries se
            JOIN users u ON se.user_id = u.id
            WHERE se.service_id = ?
            ORDER BY se.created_at DESC
        `, [req.params.id]);
        res.json({ enquiries });
    } catch(err) {
        console.error("Error fetching enquiries:", err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
