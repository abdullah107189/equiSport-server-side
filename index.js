require('dotenv').config()
const express = require('express');
const app = express()
const cors = require('cors')
const port = process.env.PORT || 4545

// middleWire
app.use(cors())
app.use(express.json())

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.fx40ttv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // await client.connect();
        const database = client.db("EquiSportsDB");
        const equipmentsCollection = database.collection("Equipments");

        app.get('/', async (req, res) => {
            res.send('hello world...')
        })

        app.post('/add-equipments', async (req, res) => {
            const body = req.body;
            const result = await equipmentsCollection.insertOne(body);
            res.send(result)
        })
        app.get('/all-equipments', async (req, res) => {
            const result = await equipmentsCollection.find().toArray()
            res.send(result)
        })

        app.get('/all-equipments/sortByPrice', async (req, res) => {
            const result = await equipmentsCollection.find().sort({ price: 1 }).toArray()
            res.send(result)
        })
        app.get('/all-equipments/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await equipmentsCollection.findOne(query)
            res.send(result)
        })
        app.post('/my-equipments', async (req, res) => {
            const email = req.body.email;
            const query = { authorUser: email }
            const result = await equipmentsCollection.find(query).toArray()
            res.send(result)
        })
        app.patch('/update-equipments/:id', async (req, res) => {
            const body = req.body;
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    image: body.image,
                    itemName: body.itemName,
                    category: body.category,
                    price: body.price,
                    rating: body.rating,
                    customization: body.customization,
                    processingTime: body.processingTime,
                    stockStatus: body.stockStatus,
                    description: body.description,
                },
            };
            const result = await equipmentsCollection.updateOne(query, updateDoc, options)
            res.send(result)
        })
        app.delete('/delete-equipment/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await equipmentsCollection.deleteOne(query)
            res.send(result)
        })



        // ---------------------------------------------------------------------
        app.get('/products', async (req, res) => {
            const result = await equipmentsCollection.find({ authorUser: "abdullah107189@gmail.com" }).limit(6).toArray()
            res.send(result)
        })

        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`sever is running this port : ${port}`);
})