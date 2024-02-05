import { MongoClient, ServerApiVersion } from 'mongodb';

// const uri = "mongodb+srv://mugwanezahakim:L8gjU0qTKdJn2mnt@cluster0.v9agvjt.mongodb.net/?retryWrites=true&w=majority";
const uri = 'mongodb+srv://mugwanezahakim:L8gjU0qTKdJn2mnt@cluster0.v9agvjt.mongodb.net/laracine?retryWrites=true&w=majority&ssl=true';

// Create a MongoClient with a MongoClientOptions object to set the Stable API versionexport
export const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export const db = client.db('laracine');
export const Users = db.collection('users');
       