import dotenv from 'dotenv'
import express from "express"
import cors from 'cors'
import morgan from "morgan"
import  data  from "./data.json" with {type: 'json'}
import mongoose from 'mongoose'


dotenv.config({path: './.env.local'})
const app = express()




const url = process.env.MONGODB_URI

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB")
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message)
  })

const phoneBookSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Phone = mongoose.model("Phone", phoneBookSchema)


app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('dist'))


process.on('uncaughtException', function (err) {
  console.log(err);
});

const generateId =() => {
  const newId = data.persons.length > 0 ? Math.floor(Math.random() * 1000) : 0
  console.log(newId)
  return newId
}

app.get("/api/persons", (request, response) => {
  if (!request) {
    response.sendStatus(404).send({message: 'impossible connect to server'})
  }
  Phone.find({}).then(result => {
    response.json(result)
    Phone.db.close()
  })
  
})

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id
  const list = data.persons.filter(person => person.id === Number(id))
  
  if (list.length !== 0) {
    response.send(list[0])
  } else {
    response.status(404).send({ error: 'not found' })
  }
})
morgan.token('req-body', function(req, res) {
  console.log(req.body)
  return JSON.stringify(req.body)
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))
app.post("/api/persons", (request, response) => {
  const body = request.body
  
  const newName = data.persons.filter(e => e.name === body.name)

  
  if (!body.name || !body.number) {
    return response.status(404).json({message: 'no number or name inside'})
  }

  if (newName.length > 0) {
    response.status(400).json({message: 'name already exists try another'})
    return
  }



  const newPerson = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  
  data.persons = data.persons.concat(newPerson)
  response.json(newPerson)
   
})



app.delete("/api/persons/:id", (request, response)=>{
    const id = request.params.id
  data.persons = data.persons.filter(person => person.id !== Number(id))
  response.status(204).send('sorry')

})



app.get("/api/info", (request, response) => {
    const date = new Date()
    
    response.send(`<div>
        <h1>Phonebook has info for ${data.persons.length} people</h1>
        <br></br>
        ${date}
    </div>`)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}



app.use(unknownEndpoint)

const PORT = process.env.VITE_PORT || 3001
app.listen(PORT)

console.log(`Server running on port ${PORT}`)
