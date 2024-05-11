const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000


app.use(cors())
app.use(express.json())




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bls3tyg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // Send a ping to confirm a successful connection
        const database = client.db("queriesDB");
        const queriesCollection = database.collection("queries");

        app.post('/add-queries', async (req, res) => {
            const addQueries = req.body
            // console.log(addQueries);
            const result = await queriesCollection.insertOne(addQueries);
            res.send(result)
        })

        app.get('/my-queries', async (req, res) => {
            const cursor = queriesCollection.find()
            const result = await cursor.sort({ _id: -1 }).toArray()
            res.send(result)
        })
      
        app.get('/my-queries/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) };
            const result = await queriesCollection.findOne(query);
            res.send(result)
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Alternative Product Server Running..........')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})