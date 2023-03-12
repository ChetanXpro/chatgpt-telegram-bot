// import mongoose = require("mongoose");
import mongoose from 'mongoose'


const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false)
        const { connection } = await mongoose.connect(process.env.URI || '');
        console.log('DB connected');

        // logger.log(`Database connected `);
    } catch (error) { }
};

module.exports = connectDB;
