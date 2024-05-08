import mongoose from 'mongoose';
import { exit } from 'process';

type connectionObject = {
    isConnected?: Number;
}

const connection: connectionObject = {};

async function dbconnect(): Promise<void> {
    if (connection.isConnected) {
        console.log('DB is alredy connected')
        return;
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "");
        connection.isConnected = db.connections[0].readyState;
        console.log('mongo db connected');
    } catch (error) {
        console.log('Error ', error);
        process.exit(1)
    }
}

export default dbconnect;