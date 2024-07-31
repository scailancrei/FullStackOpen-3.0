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
  name: {
    type: String,
    required: [true, "name is required"],
    minlength: [5, "name must be at least 5 characters."],
  },
  number: {
    type: String,
    validate: {
      validator: function (value) {
        return /\d{2,3}(\-)\d{8,}/.test(value)
      },
      message: (props) => `${props.value} is not a valid number`,
    },
    minlength: [8, "min values are 8"],
    required: [true, "number is required"],
  },
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
