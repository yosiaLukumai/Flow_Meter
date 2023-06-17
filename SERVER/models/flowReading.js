const mongoose = require("mongoose")
const flowReading = mongoose.Schema({
    flowValue: {
        type: Number
    },
    valve: {
        type: Boolean,
    },
}, {
    timestamps: true
})



module.exports = mongoose.model("flowReadings", flowReading)
