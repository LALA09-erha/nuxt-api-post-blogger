import { MongoClient, Db } from 'mongodb'

let client: MongoClient | null = null
let db: Db | null = null

export async function connectToMongo() {
  try {
    const config = useRuntimeConfig()
    
    if (!client) {
      client = new MongoClient(process.env.MONGODB_URI || config.mongodbUri)
      await client.connect()
      console.log('✅ Connected to MongoDB')
      
      db = client.db(process.env.MONGODB_DB || config.mongodbDb)
      
      // Create indexes
      await createIndexes()
    }
    
    return db
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    throw error
  }
}

async function createIndexes() {
  if (!db) return
  
  try {
    // Index untuk articles collection
    await db.collection('articles').createIndex({ title: 1 }, { unique: true })
    await db.collection('articles').createIndex({ originalUrl: 1 }, { unique: true })
    await db.collection('articles').createIndex({ status: 1 })
    await db.collection('articles').createIndex({ publishedAt: -1 })
    await db.collection('articles').createIndex({ createdAt: -1 })
    
    // Index untuk metadata collection
    await db.collection('metadata').createIndex({ name: 1 }, { unique: true })
    
    console.log('✅ MongoDB indexes created')
  } catch (error) {
    console.error('❌ Error creating indexes:', error)
  }
}

export async function getMongoDb() {
  if (!db) {
    await connectToMongo()
  }
  return db!
}

export async function closeMongoConnection() {
  if (client) {
    await client.close()
    client = null
    db = null
    console.log('🔌 MongoDB connection closed')
  }
}