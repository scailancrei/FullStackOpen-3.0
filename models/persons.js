import dotenv from "dotenv"
import mongoose from "mongoose"
dotenv.config({ path: "./.env.local" })

mongoose.set("strictQuery", false)
const url = process.env.MONGODB_URI

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB")
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message)
  })

const personsBookSchema = new mongoose.Schema({
  name: String,
  number: Number,
  id: Number,
})

personsBookSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

export default mongoose.model("Person", personsBookSchema)
