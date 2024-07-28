import dotenv from "dotenv"
import mongoose from "mongoose"

dotenv.config()

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

export default Phone
