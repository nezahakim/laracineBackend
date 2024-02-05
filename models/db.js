import { MongoClient } from "mongodb";

const connectionString = 'mongodb+srv://mugwanezahakim:L8gjU0qTKdJn2mnt@cluster0.v9agvjt.mongodb.net/';
const client = new MongoClient(connectionString);

client.connect(async (err) => {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
    return;
  }
});

export const db = client.db('laracine');
export const Users = db.collection('users');
       