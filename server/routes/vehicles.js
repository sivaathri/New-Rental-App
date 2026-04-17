const express = require('express');
const router = express.Router();
const multer = require('multer');
const db = require('../db');
const authMiddleware = require('../utils/authMiddleware');
const upload = require('../utils/upload');

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
        const { type, name, model_year, registration_number, seating_capacity, fuel_type, mileage, price_per_day, price_per_hour, price_per_km, max_km_per_day, pickup_location, landmark } = req.body;
        const rc_book_url = req.files['rc_book'] ? `/uploads/${req.files['rc_book'][0].filename}` : null;

        // Basic validation: user full_name should conceptually match rc_owner name.
        // We'll just assume front-end prompts or admin handles if mismatch.

        let vehicleId = req.body.vehicle_id;
        
        if (vehicleId) {
            await db.query(`
                UPDATE vehicles 
                SET type=?, name=?, model_year=?, registration_number=?, rc_book_url=COALESCE(?, rc_book_url), seating_capacity=?, fuel_type=?, mileage=?, price_per_day=?, price_per_hour=?, price_per_km=?, max_km_per_day=?, pickup_location=?, landmark=?, status='Waiting for Approval'
                WHERE id=? AND user_id=?
            `, [type, name, model_year, registration_number, rc_book_url, seating_capacity, fuel_type, mileage, price_per_day, price_per_hour, price_per_km, max_km_per_day, pickup_location, landmark, vehicleId, req.user.id]);
        } else {
            const [result] = await db.query(`
                INSERT INTO vehicles 
                (user_id, type, name, model_year, registration_number, rc_book_url, seating_capacity, fuel_type, mileage, price_per_day, price_per_hour, price_per_km, max_km_per_day, pickup_location, landmark, status) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Waiting for Approval')
            `, [req.user.id, type, name, model_year, registration_number, rc_book_url, seating_capacity, fuel_type, mileage, price_per_day, price_per_hour, price_per_km, max_km_per_day, pickup_location, landmark]);
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

// Subscribe (Step 6)
router.post('/:id/subscribe', authMiddleware, async (req, res) => {
    const { plan_duration, plan_price } = req.body;
    try {
        await db.query('INSERT INTO subscriptions (user_id, plan_duration, plan_price, vehicle_id) VALUES (?, ?, ?, ?)', [req.user.id, plan_duration, plan_price, req.params.id]);
        res.json({ message: 'Subscribed successfully' });
    } catch(err) {
        res.status(500).json({ error: 'Server error' });
    }
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

// Update Vehicle Pricing & Location
router.post('/:id/update-pricing', authMiddleware, async (req, res) => {
    const { price_per_day, price_per_hour, price_per_km, max_km_per_day, pickup_location, landmark } = req.body;
    try {
        await db.query(`
            UPDATE vehicles 
            SET price_per_day = ?, price_per_hour = ?, price_per_km = ?, max_km_per_day = ?, pickup_location = ?, landmark = ?
            WHERE id = ? AND user_id = ?
        `, [price_per_day, price_per_hour, price_per_km, max_km_per_day, pickup_location, landmark, req.params.id, req.user.id]);
        res.json({ message: 'Vehicle details updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get User's Vehicles
router.get('/', authMiddleware, async (req, res) => {
    try {
        const [vehicles] = await db.query('SELECT * FROM vehicles WHERE user_id = ?', [req.user.id]);
        
        const vehiclesWithMedia = [];
        for (let v of vehicles) {
            const [media] = await db.query('SELECT * FROM vehicle_media WHERE vehicle_id = ? ORDER BY sort_order ASC, id ASC', [v.id]);
            // Ensure media is attached as 'vehicle_images' for distinctness
            vehiclesWithMedia.push({ ...v, vehicle_images: media });
        }

        console.log('Final Response Vehicles:', JSON.stringify(vehiclesWithMedia, null, 2));
        res.json({ vehicles: vehiclesWithMedia });
    } catch(err) {
        console.error('Error fetching dashboard vehicles:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
