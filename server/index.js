const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { pool, testConnection } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health & DB status
app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS solution, DATABASE() as db');
    res.json({
      status: 'OK',
      message: 'AOLO Backend Server Running',
      database: rows[0].db,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', error: error.message });
  }
});

// 1. Signup Route
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;
    if (!name || (!phone && !email)) {
      return res.status(400).json({ success: false, message: 'Name and either Phone or Email are required.' });
    }

    const uid = 'user_' + Math.random().toString(36).substring(2, 10);
    const [result] = await pool.query(
      'INSERT INTO users (uid, name, phone, email, password, wallet_balance) VALUES (?, ?, ?, ?, ?, ?)',
      [uid, name, phone || null, email || null, password || null, 250.00]
    );

    const [users] = await pool.query('SELECT id, uid, name, phone, email, role, wallet_balance, rating FROM users WHERE id = ?', [result.insertId]);
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: users[0]
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ success: false, message: 'Phone or Email already registered.' });
    }
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Login Route
app.post('/api/auth/login', async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;
    if (!emailOrPhone) {
      return res.status(400).json({ success: false, message: 'Phone or Email is required.' });
    }

    const [users] = await pool.query(
      'SELECT id, uid, name, phone, email, role, wallet_balance, rating FROM users WHERE (email = ? OR phone = ?) LIMIT 1',
      [emailOrPhone, emailOrPhone]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found. Please register.' });
    }

    return res.json({
      success: true,
      message: 'Logged in successfully',
      user: users[0]
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 3. User Profile
app.get('/api/users/:uid', async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, uid, name, phone, email, role, wallet_balance, rating FROM users WHERE uid = ?',
      [req.params.uid]
    );
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user: users[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. Create Ride
app.post('/api/rides/create', async (req, res) => {
  try {
    const {
      userId,
      rideType = 'ONEWAY',
      vehicleClass,
      pickupName,
      pickupAddress,
      pickupLat = 0,
      pickupLng = 0,
      dropoffName,
      dropoffAddress,
      dropoffLat = 0,
      dropoffLng = 0,
      fare,
      paymentMethod = 'Wallet'
    } = req.body;

    const rideId = 'ride_' + Math.random().toString(36).substring(2, 9);
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    const [result] = await pool.query(
      `INSERT INTO rides (
        ride_id, user_id, ride_type, vehicle_class,
        pickup_name, pickup_address, pickup_lat, pickup_lng,
        dropoff_name, dropoff_address, dropoff_lat, dropoff_lng,
        fare, payment_method, status, otp
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'SEARCHING', ?)`,
      [
        rideId, userId, rideType, vehicleClass,
        pickupName, pickupAddress, pickupLat, pickupLng,
        dropoffName, dropoffAddress, dropoffLat, dropoffLng,
        fare, paymentMethod, otp
      ]
    );

    res.status(201).json({
      success: true,
      ride: {
        id: result.insertId,
        rideId,
        status: 'SEARCHING',
        otp,
        fare
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start Server
app.listen(PORT, async () => {
  console.log(`🚀 [Server] AOLO Backend running at http://localhost:${PORT}`);
  await testConnection();
});
