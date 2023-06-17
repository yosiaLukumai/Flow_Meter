const flowReadingModel = require("../models/flowReading");
const createOutput = require("../utils").createOutput;
const io = require("../index")


const createFirstReading = async(req, res) => {
  try {
    const {flowValue, valve} = req.body;
    const created = await flowReadingModel.create({flowValue, valve})
    if(created) {
      return res.json(createOutput(true, "passed creation", false))
    }else {
      return res.json(createOutput(true, "failed creation", false))
    }
    
  } catch (error) {
    return res.json(createOutput(false, error.message, true))
  }
}


const saveNewFlow = async(req, res) => {
  try {
    const flowV = req.params.flow
    if(Number(flowV) && flowV <= 34 && flowV >= 5) {
      const updated = await flowReadingModel.updateOne({}, {flowValue: flowV})
      if(updated) {
        const data = await flowReadingModel.findOne()
        io.Socket.emit("dataSet", data)
        return res.json(createOutput(true, data, false))
      }else {
        return res.json(createOutput(true, "failed to update", false))
      }

    }else {
      return res.json(createOutput(false, "Pass number", true))
    }

  } catch (error) {
    return res.json(createOutput(false, error.message, true))
  }
}


const valveManipulation = async(req, res) => {
  try {
    const cmd = req.params.cmd
    console.log(cmd);
    if (typeof Boolean(cmd) === 'boolean') {
      const updated = await flowReadingModel.updateOne({}, {valve:cmd})
      if(updated) {
        const data = await flowReadingModel.findOne()
        io.Socket.emit("dataSet", data)
        return res.json(createOutput(true, data, false))
      }else {
        return res.json(createOutput(true, "failed to update", false))
      }
    }else {
      return res.json(createOutput(true, "Please pass Boolean", false))
    }

  } catch (error) {
    return res.json(createOutput(false, error.message, true))
  }
}


const getData = async (req, res) => {
  try {
    const one = await flowReadingModel.findOne()
    return res.json(createOutput(true, one, false))
  } catch (error) {
    return res.json(createOutput(false, error.message, true))
  }
}


module.exports = {
saveNewFlow,
valveManipulation,
getData,
createFirstReading
};
