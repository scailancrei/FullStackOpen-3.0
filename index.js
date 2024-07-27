import express from "express"
import morgan from "morgan"
import  data  from "./data.json" with {type: 'json'}

const app = express()
app.use(express.json())
app.use(morgan('tiny'))




const generateId =() => {
  const newId = data.persons.length > 0 ? Math.floor(Math.random() * 1000) : 0
  console.log(newId)
  return newId
}

app.get("/api/persons", (request, response) => {
  response.json(data.persons)
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
  return response.status(400).json({message: 'name already exists try another'})
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
  response.sendStatus(204).send('sorry')

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

const PORT = 3001
app.listen(PORT)

console.log(`Server running on port ${PORT}`)
