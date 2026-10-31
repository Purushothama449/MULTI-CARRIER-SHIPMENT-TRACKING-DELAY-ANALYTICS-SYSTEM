import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/shiptrack_mongodb';
const options = {};

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect().catch((err) => {
      console.warn('MongoDB connection warning (falling back to memory tracking events):', err.message);
      return client as MongoClient;
    });
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect().catch((err) => {
    console.warn('MongoDB connection warning:', err.message);
    return client as MongoClient;
  });
}

export async function getMongoDb(): Promise<Db | null> {
  try {
    const client = await clientPromise;
    if (client) {
      return client.db('shiptrack_mongodb');
    }
  } catch (err) {
    console.warn('Failed to access MongoDB:', err);
  }
  return null;
}

export default clientPromise;
