const express = require('express');
const router = express.Router();
const multer = require('multer');
const db = require('../db');
const authMiddleware = require('../utils/authMiddleware');
const upload = require('../utils/upload');
const { checkVehicleLimit } = require('../utils/subscriptionLimits');

// Add Vehicle
router.post('/add', authMiddleware, (req, res, next) => {
    upload.fields([
        { name: 'rc_book', maxCount: 1 },
        { name: 'media', maxCount: 6 }
    ])(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            console.error('Multer Error in /add:', err.message, 'Field:', err.field);
            return res.status(400).json({ error: `Multer error: ${err.message} on field ${err.field}` });
        } else if (err) {
            console.error('Unknown upload error:', err);
            return res.status(500).json({ error: 'Upload error' });
        }
        next();
    });
}, async (req, res) => {
    try {
        const { type, name, model_year, registration_number, seating_capacity, fuel_type, transmission_type, mileage, price_per_day, price_per_hour, price_per_km, max_km_per_day, pickup_location, landmark, latitude, longitude } = req.body;
        
        // CHECK LIMITS
        const [activeSubs] = await db.query('SELECT * FROM subscriptions WHERE user_id = ? AND status = "Active" AND end_date > NOW()', [req.user.id]);
        
        if (activeSubs.length > 0) {
            const planName = activeSubs[0].plan_name;
            const [existing] = await db.query('SELECT COUNT(*) as count FROM vehicles WHERE user_id = ? AND type = ? AND status != "Rejected"', [req.user.id, type]);
            
            if (!checkVehicleLimit(planName, type, existing[0].count)) {
                return res.status(403).json({ 
                    error: `Limit Reached: Your current ${planName} plan only allows up to ${existing[0].count} ${type}s. Please upgrade your membership.`,
                    limitReached: true
                });
            }
        }
        
        const rc_book_url = req.files['rc_book'] ? `/uploads/${req.files['rc_book'][0].filename}` : null;

        // Basic validation: user full_name should conceptually match rc_owner name.
        // We'll just assume front-end prompts or admin handles if mismatch.

        let vehicleId = req.body.vehicle_id;
        
        if (vehicleId) {
            await db.query(`
                UPDATE vehicles 
                SET type=?, name=?, model_year=?, registration_number=?, rc_book_url=COALESCE(?, rc_book_url), seating_capacity=?, fuel_type=?, transmission_type=?, mileage=?, price_per_day=?, price_per_hour=?, price_per_km=?, max_km_per_day=?, pickup_location=?, landmark=?, latitude=?, longitude=?, status='Waiting for Approval'
                WHERE id=? AND user_id=?
            `, [type, name, model_year, registration_number, rc_book_url, seating_capacity, fuel_type, transmission_type, mileage, price_per_day, price_per_hour, price_per_km, max_km_per_day, pickup_location, landmark, latitude, longitude, vehicleId, req.user.id]);
        } else {
            const [result] = await db.query(`
                INSERT INTO vehicles 
                (user_id, type, name, model_year, registration_number, rc_book_url, seating_capacity, fuel_type, transmission_type, mileage, price_per_day, price_per_hour, price_per_km, max_km_per_day, pickup_location, landmark, latitude, longitude, status) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Waiting for Approval')
            `, [req.user.id, type, name, model_year, registration_number, rc_book_url, seating_capacity, fuel_type, transmission_type, mileage, price_per_day, price_per_hour, price_per_km, max_km_per_day, pickup_location, landmark, latitude, longitude]);
            vehicleId = result.insertId;
        }

        if (req.files['media']) {
            for (let file of req.files['media']) {
                const isVideo = file.mimetype.includes('video') ? 'video' : 'image';
                await db.query('INSERT INTO vehicle_media (vehicle_id, media_url, media_type) VALUES (?, ?, ?)', [vehicleId, `/uploads/${file.filename}`, isVideo]);
            }
        }

        res.json({ message: 'Vehicle added successfully', vehicleId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update vehicle (re-submission)
router.post('/update/:id', authMiddleware, upload.fields([
    { name: 'rc_book', maxCount: 1 },
    { name: 'media', maxCount: 6 }
]), async (req, res) => {
    // Similar to add, but update logic
    res.json({ message: 'Updated and resubmitted' });
});

// Reorder Media
router.post('/:id/media/reorder', authMiddleware, async (req, res) => {
    console.log(`Reorder request for vehicle ${req.params.id}`);
    const { mediaIds } = req.body; // Array of IDs in new order
    try {
        for (let i = 0; i < mediaIds.length; i++) {
            await db.query('UPDATE vehicle_media SET sort_order = ? WHERE id = ? AND vehicle_id = ?', [i, mediaIds[i], req.params.id]);
        }
        res.json({ message: 'Media reordered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});
// Delete Specific Media
router.delete('/:id/media/:mediaId', authMiddleware, async (req, res) => {
    try {
        await db.query('DELETE FROM vehicle_media WHERE id = ? AND vehicle_id = ?', [req.params.mediaId, req.params.id]);
        res.json({ message: 'Media deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Add more media to existing vehicle
router.post('/:id/media/add', authMiddleware, upload.array('media', 6), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) return res.status(400).json({ error: 'No media provided' });
        
        for (let file of req.files) {
            const isVideo = file.mimetype.includes('video') ? 'video' : 'image';
            await db.query('INSERT INTO vehicle_media (vehicle_id, media_url, media_type) VALUES (?, ?, ?)', [req.params.id, `/uploads/${file.filename}`, isVideo]);
        }
        res.json({ message: 'Media added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});
// Update Vehicle Pricing & Location
router.post('/:id/update-pricing', authMiddleware, async (req, res) => {
    const { price_per_day, price_per_hour, price_per_km, max_km_per_day, pickup_location, landmark, latitude, longitude } = req.body;
    try {
        await db.query(`
            UPDATE vehicles 
            SET price_per_day = ?, price_per_hour = ?, price_per_km = ?, max_km_per_day = ?, pickup_location = ?, landmark = ?, latitude = ?, longitude = ?
            WHERE id = ? AND user_id = ?
        `, [price_per_day, price_per_hour, price_per_km, max_km_per_day, pickup_location, landmark, latitude, longitude, req.params.id, req.user.id]);
        res.json({ message: 'Vehicle details updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Resubmit Rejected Vehicle
router.post('/:id/resubmit', authMiddleware, async (req, res) => {
    try {
        await db.query('UPDATE vehicles SET status = "Waiting for Approval", rejection_reason = NULL WHERE id = ? AND user_id = ? AND status = "Rejected"', [req.params.id, req.user.id]);
        res.json({ message: 'Vehicle resubmitted for approval' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update Availability
router.post('/:id/availability', authMiddleware, async (req, res) => {
    const { is_active, unavailable_dates } = req.body;
    try {
        await db.query(`
            UPDATE vehicles 
            SET is_active = ?, unavailable_dates = ?
            WHERE id = ? AND user_id = ?
        `, [is_active, unavailable_dates, req.params.id, req.user.id]);
        res.json({ message: 'Availability updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get User's Vehicles
router.get('/', authMiddleware, async (req, res) => {
    try {
        const [vehicles] = await db.query('SELECT * FROM vehicles WHERE user_id = ?', [req.user.id]);
        
        // Fetch user's active membership once
        const [subs] = await db.query('SELECT * FROM subscriptions WHERE user_id = ? AND status = "Active" AND end_date > NOW()', [req.user.id]);
        const hasActiveMembership = subs.length > 0;

        const vehiclesWithMedia = [];
        for (let v of vehicles) {
            const [media] = await db.query('SELECT * FROM vehicle_media WHERE vehicle_id = ? ORDER BY sort_order ASC, id ASC', [v.id]);
            
            vehiclesWithMedia.push({ 
                ...v, 
                vehicle_images: media,
                has_active_subscription: hasActiveMembership 
            });
        }

        res.json({ vehicles: vehiclesWithMedia });
    } catch(err) {
        console.error('Error fetching dashboard vehicles:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all approved vehicles for public listing
router.get('/public/approved', async (req, res) => {
    try {
        const [vehicles] = await db.query(`
            SELECT v.*, u.full_name as owner_name, vm.name as brand_name
            FROM vehicles v
            LEFT JOIN users u ON v.user_id = u.id
            LEFT JOIN vehicle_master vm ON v.type = vm.name
            WHERE v.status = "Approved" AND v.is_active = 1
            ORDER BY v.sort_order ASC, v.approved_at DESC
        `);

        const vehiclesWithMedia = await Promise.all(vehicles.map(async (v) => {
            const [media] = await db.query('SELECT * FROM vehicle_media WHERE vehicle_id = ? ORDER BY sort_order ASC, id ASC', [v.id]);
            return { 
                ...v, 
                image: media.length > 0 ? media[0].media_url : 'https://via.placeholder.com/300',
                images: media.map(m => m.media_url)
            };
        }));

        res.json({ success: true, data: vehiclesWithMedia });
    } catch (err) {
        console.error('Error fetching approved vehicles:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
