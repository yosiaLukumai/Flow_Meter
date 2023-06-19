const mongoose = require("mongoose")

const connectDb = async () => {
   var connected = await mongoose.connect("mongodb+srv://yosialukumai:SMhKENa5pvoPpVln@cluster0.ettmaxo.mongodb.net/?retryWrites=true&w=majority")
   if (connected) {
    console.log("sucessfully connected to db")
   } else {
    console.log("Failed to connect to database")
   }
}

module.exports = {
    connectDb
}