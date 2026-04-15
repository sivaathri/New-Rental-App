const mysql = require('mysql2/promise');

async function createDb() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: ''
    });
    await connection.query('CREATE DATABASE IF NOT EXISTS rental_db');
    console.log('Successfully created database rental_db!');
    process.exit(0);
  } catch (error) {
    console.error('Failed to create database', error);
    process.exit(1);
  }
}

createDb();
