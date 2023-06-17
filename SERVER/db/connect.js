const mongoose = require("mongoose")

const connectDb = async () => {
   var connected = await mongoose.connect("mongodb://127.0.0.1:27017/flowM")
   if (connected) {
    console.log("sucessfully connected to db")
   } else {
    console.log("Failed to connect to database")
   }
}

module.exports = {
    connectDb
}