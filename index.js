const express = require('express')
const cors = require('cors')
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;

//middlewire
app.use(express.json())
app.use(cors())


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.df1ioxo.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");


    const ToyCollection = client.db('ToyCollection').collection('ToyDb')

    app.get('/alltoy',async(req,res)=>{
        const toys =await ToyCollection.find({}).toArray();
        res.send(toys)
    })
    app.get('/alltoy/:text',async(req,res)=>{
        const category = req.params.text;
        const toys = await ToyCollection.find(
            { subcategory : category}
        ).toArray()
        res.send(toys)
    })
    app.get('/mytoys/:text',async(req,res)=>{
        const email = req.params.text;
        const toys = await ToyCollection.find(
            { email : email}
        ).toArray()
        res.send(toys)
    })

  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('Welcome Learn With Toys Server')
})
app.listen(port);