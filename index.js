import dotenv from 'dotenv'
import express from "express"
import cors from 'cors'
import morgan from "morgan"
import  data  from "./data.json" with {type: 'json'}
import Person from './models/persons.js'


dotenv.config({path: './.env.local'})
const app = express()
const PORT = process.env.PORT

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())



process.on('uncaughtException', function (err) {
  console.log(err);
});

const generateId =() => {
  const newId = data.persons.length > 0 ? Math.floor(Math.random() * 1000) : 0
  console.log(newId)
  return newId
}

app.get("/api/persons", (request, response, next) => {
  if (!request) {
    response.sendStatus(404).send({message: 'impossible connect to server'})
  }
  
  Person.find({}).then(result => {
    
    if (result) {
      response.json(result)
    } else {
      response.status(404).send({message: 'no persons found'})
    }
  }).catch(error => {
    console.log(error)
    next(error)
  })

  
  
})

app.get("/api/persons/:id", (request, response, next) => {
  
  Person.findById(request.params.id).then(result => {
    if (result) {
      response.json(result)
    } else {
      response.status(404).end()
    }
      
  }).catch(error => {
    console.log(error)
    next(error)
  })
})


morgan.token('req-body', function(req, res) {
  console.log(req.body)
  return JSON.stringify(req.body)
});


app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))


app.post("/api/persons", (request, response, next) => {
  const body = request.body

  console.log(body)
  Person.findOne({ name: `${body.name}`}).then(result => {
    if (result === null) {
      const newPerson = new Person({
        name: body.name,
        number: body.number,
        id: generateId(),
      })
      newPerson.save().then(result => {
        console.log('Note saved')
        response.json(result)
    }).catch(error => {
      next(error)})
  } else {
    response.sendStatus(409)
  }
  }).catch(error => {
    
    next(error)
  })

})


app.put("/api/persons/:id", (request, response, next) => {
  if (!request.body.name || !request.body.number) {
    return response.status(404).end('Name or Number input cant be empty')
  }
  const person = {
    name: request.body.name,
    number: request.body.number
  }
  Person.findByIdAndUpdate(request.params.id, person, {new: true}).then(result => {
    if (result) {
      response.json(result)
    }
    
  }).catch(error => next(error))
  

})



app.delete("/api/persons/:id", (request, response, next)=>{ 
    Person.findByIdAndDelete(request.params.id).then(result => {
    if (result) {
      response.status(204).end()
    } else {
      response.status(404).send('That user doesnt exist')
    }
  }).catch(error => {
    console.log(error)
    next(error)
  })
})



app.get("/api/info", (request, response, next) => {
    const date = new Date()
    

    Person.find({}).then(result => {
      if (result) {
        response.send(`<div>
          <h1>Phonebook has info for ${result.length} people</h1>
          <br></br>
          ${date}
      </div>`)
      }
    }).catch(error => {
      console.log(error)
      next(error)
    })

    
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)



const errorHandler = (error, request, response, next) => {
  console.log(error)
  

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if(error.name === 'ValidationError'){
    
    return response.status(422).json({error: error.message})
  } 

  
  next(error)
}


app.use(errorHandler)

app.listen(PORT, () =>{
  console.log(`Server running on port ${PORT}`)
})


