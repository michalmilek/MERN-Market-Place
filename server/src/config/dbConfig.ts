import mongoose from "mongoose";

mongoose.connect(process.env.MONGO_URL || "");

const connection = mongoose.connection;

connection.on('connected', () => {
    console.log('Mongo DB Connection succesful')
})

connection.on('error', (err) => {
    console.log(`MongoDB connection failed: ${err}`)
})

export default connection