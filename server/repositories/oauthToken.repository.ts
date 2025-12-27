import { MongoClient, Db } from 'mongodb'
import { useRuntimeConfig } from '#imports'

let client: MongoClient | null = null
let db: Db | null = null

export async function saveRefreshToken(
  refreshToken: string
) {
  try {
    const config = useRuntimeConfig()

    if (!client) {
      const uri = process.env.MONGODB_URI || config.mongodbUri
      const dbName = process.env.MONGODB_DB || config.mongodbDb

      if (!uri || !dbName) {
        throw new Error('MongoDB URI or DB name is not defined')
      }

      client = new MongoClient(uri)
      await client.connect()
      console.log('✅ Connected to MongoDB')

      db = client.db(dbName)
    }

    const collection = db!.collection('oauth_tokens')

    await collection.updateOne(
      { provider: 'blogger' },
      {
        $set: {
          refresh_token: refreshToken,
          updatedAt: new Date()
        },
        $setOnInsert: {
          provider: 'blogger',
          createdAt: new Date()
        }
      },
      { upsert: true }
    )

    return refreshToken
  } catch (error) {
    console.error('❌ MongoDB saveRefreshToken error:', error)
    throw error
  }
}

export async function getRefreshToken() {
  try {
    const config = useRuntimeConfig()

    if (!client) {
      const uri = process.env.MONGODB_URI || config.mongodbUri
      const dbName = process.env.MONGODB_DB || config.mongodbDb

      if (!uri || !dbName) {
        throw new Error('MongoDB URI or DB name is not defined')
      }
      client = new MongoClient(uri)
      await client.connect()
      console.log('✅ Connected to MongoDB')

      db = client.db(dbName)
    }

    const collection = db!.collection('oauth_tokens')

    const tokenDoc = await collection.findOne({ provider: 'blogger' })

    if (!tokenDoc) {
      return null
    }

    return tokenDoc.refresh_token
  } catch (error) {
    console.error('❌ MongoDB getRefreshToken error:', error)
    throw error
  }
}
