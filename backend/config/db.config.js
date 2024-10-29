const mongoose = require('mongoose');

const { DB_URI } = require('./env.config');

const connectDB = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log('Connected to the database');
    } catch (error) {
        console.error('Error connecting to the database: ', error);
    }
}

module.exports = connectDB;