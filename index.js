const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000

// .env er jonno config
require('dotenv').config()
const app = express()

// middle ware
app.use(cors())
app.use(express.json())

app.get('/', ( req, res) => {
    res.send("Task App server is running")
})

app.listen(port, () => {
    console.log(`Server running at port ${port}`)
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.feigjta.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

console.log(uri)



async function run() {
    try{
        const allTasks = client.db("allTasks").collection("tasks");
        const completedtasks = client.db("allTasks").collection("completedtasks");
   

        app.post('/tasks', async(req, res) => {
            const query = req.body;
            const result = await allTasks.insertOne(query)
            res.send(result);
            console.log(result)
        })

        app.get('/tasks', async (req, res) => {
            const email = req.query.email;
            const query = {
               
                 Status: "Not Completed",
                 email: email, 
                };
                const result = await allTasks.find(query).toArray();
                res.send(result);
            })
            
            
        app.delete('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await allTasks.deleteOne(filter);
            res.send(result);
        })

        
        app.put('/tasks/:id', async (req,res)=> {          
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updated = {
                $set: {
                      Status: "Completed"
                }
            }
            const result = await allTasks.updateOne(filter, updated, options);
            res.send(result);
            console.log(result)
        });



        app.post('/completedtasks', async(req, res) => {
            const query = req.body;
            const result = await allTasks.insertOne(query)
            res.send(result);
            console.log(result)
        })



        app.get('/completedtasks', async (req, res) => {
            const email = req.query.email;
            const query = {
                email: email ,
                Status: "Completed"
            }
                const result = await allTasks.find(query).toArray();
                res.send(result);
        })
        
        

        app.delete('/completedtasks/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await allTasks.deleteOne(filter);
            res.send(result);
        })

        
         app.put('/completedtasks/:id', async (req,res)=> {          
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updated = {
                $set: {
                      Status: "Not Completed"
                }
            }
            const result = await allTasks.updateOne(filter, updated, options);
            res.send(result);
            console.log(result)
        });

    }

    finally{
    
       

    }
}

run().catch(console.log)



