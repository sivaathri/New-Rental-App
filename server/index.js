const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Setup tables
async function initializeDB() {
    try {
        await db.query(`CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            mobile_number VARCHAR(15) UNIQUE NOT NULL,
            unique_id VARCHAR(5) UNIQUE,
            otp VARCHAR(6),
            full_name VARCHAR(100),
            address TEXT,
            city VARCHAR(50) DEFAULT 'Pondicherry',
            profile_photo VARCHAR(255),
            is_verified BOOLEAN DEFAULT false,
            role ENUM('master', 'vehicle-owners', 'user') DEFAULT 'user'
        )`);

        // Migration: Add role if doesn't exist
        try {
            await db.query('ALTER TABLE users ADD COLUMN role ENUM(\'master\', \'vehicle-owners\', \'user\') DEFAULT \'user\'');
        } catch(e) {}

        try {
            await db.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS unique_id VARCHAR(5) UNIQUE`);
        } catch (e) {}

        await db.query(`CREATE TABLE IF NOT EXISTS verifications (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            aadhar_card_url VARCHAR(255),
            driving_license_url VARCHAR(255),
            status ENUM('Pending', 'Verified', 'Rejected') DEFAULT 'Pending',
            rejection_reason TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`);

        await db.query(`CREATE TABLE IF NOT EXISTS vehicles (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            type VARCHAR(50),
            name VARCHAR(100),
            model_year INT,
            registration_number VARCHAR(50),
            rc_book_url VARCHAR(255),
            seating_capacity INT,
            fuel_type VARCHAR(50),
            mileage DECIMAL(10,2),
            price_per_day DECIMAL(10,2),
            price_per_hour DECIMAL(10,2),
            price_per_km DECIMAL(10,2),
            max_km_per_day INT,
            pickup_location VARCHAR(255),
            landmark VARCHAR(255),
            transmission_type VARCHAR(50),
            status ENUM('Waiting for Approval', 'Approved', 'Rejected') DEFAULT 'Waiting for Approval',
            rejection_reason TEXT,
            approved_at DATETIME,
            latitude DECIMAL(10,8),
            longitude DECIMAL(11,8),
            is_best_car BOOLEAN DEFAULT false,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`);
        
        // Migration for existing tables
        try { await db.query(`ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS approved_at DATETIME`); } catch (e) {}
        try { await db.query(`ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS latitude DECIMAL(10,8)`); } catch (e) {}
        try { await db.query(`ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS longitude DECIMAL(11,8)`); } catch (e) {}
        try { await db.query(`ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS is_best_car BOOLEAN DEFAULT false`); } catch (e) {}
        try { await db.query(`ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0`); } catch (e) {}


        await db.query(`CREATE TABLE IF NOT EXISTS vehicle_media (
            id INT AUTO_INCREMENT PRIMARY KEY,
            vehicle_id INT,
            media_url VARCHAR(255),
            media_type ENUM('image', 'video'),
            sort_order INT DEFAULT 0,
            FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
        )`);

        await db.query(`CREATE TABLE IF NOT EXISTS subscriptions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            plan_name VARCHAR(50),
            duration_days INT,
            plan_price DECIMAL(10,2),
            status ENUM('Active', 'Expired', 'Stacked') DEFAULT 'Active',
            start_date DATETIME,
            end_date DATETIME,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`);

        await db.query(`CREATE TABLE IF NOT EXISTS vehicle_master (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            image_url VARCHAR(255),
            type VARCHAR(50),
            sort_order INT DEFAULT 0
        )`);

        try {
            await db.query(`ALTER TABLE vehicle_master ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0`);
        } catch (e) {}

        try {
            await db.query(`ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`);
        } catch (e) {}

        await db.query(`CREATE TABLE IF NOT EXISTS vehicle_calls (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            vehicle_id INT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
        )`);

        await db.query(`CREATE TABLE IF NOT EXISTS vehicle_reviews (
            id INT AUTO_INCREMENT PRIMARY KEY,
            vehicle_id INT,
            user_id INT,
            rating INT,
            comment TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY unique_user_vehicle (vehicle_id, user_id),
            FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`);

        await db.query(`CREATE TABLE IF NOT EXISTS services (
            id INT AUTO_INCREMENT PRIMARY KEY,
            type ENUM('Puncher', 'Mechanic', 'Acting Driver') NOT NULL,
            name VARCHAR(255) NOT NULL,
            mobile VARCHAR(15) NOT NULL,
            location TEXT,
            image_url VARCHAR(255),
            id_proof_url VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);

        try {
            await db.query(`ALTER TABLE services MODIFY COLUMN type ENUM('Puncher', 'Mechanic', 'Acting Driver') NOT NULL`);
        } catch (e) {}

        console.log("Database tables checked/created.");
    } catch (error) {
        console.error("Failed to initialize database (is MySQL running and DB created?): ", error.message);
    }
}
initializeDB();

// API Routes setup
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const vehicleRoutes = require('./routes/vehicles');
const adminRoutes = require('./routes/admin');
const subscriptionRoutes = require('./routes/subscriptions');
const favoriteRoutes = require('./routes/favorites');

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/favorites', favoriteRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
// Server restart trigger - force reload for enquiry unique_id fix
});
