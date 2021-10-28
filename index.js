const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config()



const app = express();
const port = 5000;

// Middlewear
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tdvhb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        // console.log("Connected to database");
        const database = client.db("carMechanic");
        const servicesCollection = database.collection('services');

        // Get API
        app.get('/services', async (req, res) => {

            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })


        // Get single api
        app.get('/services/:id', async (req, res) => {

            const id = req.params.id;

            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);


        })

        // Delete Api
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })


        // Post ApI
        app.post('/services', async (req, res) => {

            const service = req.body;
            console.log("Hit the post api", service);

            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result);
        })

    }
    finally {
        // await client.close()
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Server Running");
});

app.listen(port, () => {
    console.log("Runnig Port", port);
})