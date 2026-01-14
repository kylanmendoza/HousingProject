const mongoose = require('mongoose'); // Still need to import mongoose into file 

// Connect Mongoose(mongoDB)
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/housingproject');
        console.log('Connected to MongoDB');
    }   catch (err) {
            console.error('MongoDB connection error:', err);
            process.exit(1); // Exit process with failure
    }
};
module.exports = connectDB;