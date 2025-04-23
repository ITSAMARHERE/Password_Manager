const express = require('express')
const dotenv = require('dotenv')
const { MongoClient } = require('mongodb')
const bodyparser = require('body-parser')
const cors = require('cors')

dotenv.config()

// Modified connection string with proper options
const url = process.env.MONGO_URI + '?retryWrites=true&w=majority&tls=true&tlsInsecure=false'
const dbName = process.env.DB_NAME

const port = process.env.PORT || Math.floor(Math.random() * (9000 - 8000) + 8000)

// Create MongoDB client with proper options
const client = new MongoClient(url, {
  maxPoolSize: 10,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
  socketTimeoutMS: 45000, // Socket timeout
})

// Better error handling in connection
async function connectToMongo() {
  try {
    await client.connect()
    console.log('Connected to MongoDB')
    return true
  } catch (err) {
    console.error('Error connecting to MongoDB:', err)
    // Don't exit process immediately, allow for retry or fallback
    return false
  }
}

// Initialize connection
connectToMongo()

const app = express()

const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000',
  'https://password-manager-r949.onrender.com'
]

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true)
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.'
      return callback(new Error(msg), false)
    }
    return callback(null, true)
  },
  credentials: true
}))

app.use(bodyparser.json())

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// Add connection check middleware
app.use(async (req, res, next) => {
  if (!client.topology || !client.topology.isConnected()) {
    // Try to reconnect if not connected
    const connected = await connectToMongo()
    if (!connected) {
      return res.status(500).json({ error: 'Database connection unavailable' })
    }
  }
  req.db = client.db(dbName)
  next()
})

app.get('/', async (req, res) => {
  try {
    const collection = req.db.collection('passwords')
    const findResult = await collection.find({}).toArray()
    res.json(findResult)
  } catch (error) {
    console.error('Error fetching passwords:', error)
    res.status(500).json({ error: 'Failed to fetch passwords' })
  }
})

app.post('/', async (req, res) => {
  try {
    const password = req.body
    const collection = req.db.collection('passwords')
    const findResult = await collection.insertOne(password)
    res.send({ success: true, result: findResult })
  } catch (error) {
    console.error('Error saving password:', error)
    res.status(500).json({ error: 'Failed to save password' })
  }
})

app.delete('/', async (req, res) => {
  try {
    const password = req.body
    const collection = req.db.collection('passwords')
    const findResult = await collection.deleteOne(password)
    res.send({ success: true, result: findResult })
  } catch (error) {
    console.error('Error deleting password:', error)
    res.status(500).json({ error: 'Failed to delete password' })
  }
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
  console.log(`API available at http://localhost:${port}`)

  if (process.env.NODE_ENV !== 'production') {
    console.log('Environment variables:')
    console.log('- NODE_ENV:', process.env.NODE_ENV || 'development')
    console.log('- FRONTEND_URL:', process.env.FRONTEND_URL || '(not set)')
  }
})

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await client.close()
    console.log('MongoDB connection closed')
    process.exit(0)
  } catch (err) {
    console.error('Error during shutdown:', err)
    process.exit(1)
  }
})