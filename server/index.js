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
            otp VARCHAR(6),
            full_name VARCHAR(100),
            address TEXT,
            city VARCHAR(50) DEFAULT 'Pondicherry',
            profile_photo VARCHAR(255),
            is_verified BOOLEAN DEFAULT false
        )`);

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
            status ENUM('Waiting for Approval', 'Approved', 'Rejected') DEFAULT 'Waiting for Approval',
            rejection_reason TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`);

        await db.query(`CREATE TABLE IF NOT EXISTS vehicle_media (
            id INT AUTO_INCREMENT PRIMARY KEY,
            vehicle_id INT,
            media_url VARCHAR(255),
            media_type ENUM('image', 'video'),
            FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
        )`);

        await db.query(`CREATE TABLE IF NOT EXISTS subscriptions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            plan_duration INT,
            plan_price DECIMAL(10,2),
            status ENUM('Active', 'Expired') DEFAULT 'Active',
            start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`);

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

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
// Server restart trigger
});
