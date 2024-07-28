import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

const url = process.env.VITE_URL

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
