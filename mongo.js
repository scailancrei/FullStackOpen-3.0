import mongoose from "mongoose"

if (process.argv.length < 3) {
  console.log("give password as argument")
  process.exit(1)
}
const password = process.argv[2]
const newName = process.argv[3]
const newNumber = process.argv[4]

const url = `mongodb+srv://juanantoniodev:${password}@fullstackopen-backend.7ws3szz.mongodb.net/backend?retryWrites=true&w=majority&appName=fullstackopen-backend`

mongoose.set("strictQuery", false)

mongoose.connect(url)

const phoneBookSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Phone = mongoose.model("Phone", phoneBookSchema)

const phone = new Phone({
  name: newName,
  number: newNumber,
})

if (process.argv.length === 3) {
  Phone.find({}).then((result) => {
    console.log(`PhoneBook: `)
    result.map((e) => {
      if (e === undefined) {
        return e
      } else {
        console.log(`${e.name} ${e.number}`)
      }
    })

    mongoose.connection.close()
  })
} else {
  phone.save().then((result) => {
    console.log(process.argv.length)
    console.log(`Added ${newName} number ${newNumber} to phonebook`)
    mongoose.connection.close()
  })
}

export default Phone
