import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');
      } catch (err) {
        console.error('Mongo Error:', err.message);
        process.exit(1);
      }
};

export default connectDB;
// module.exports = connectDB;