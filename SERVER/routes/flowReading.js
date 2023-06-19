const router = require('express').Router()
const flowController = require("../controllers/flowReading")

const userRoutes = (app) => {
    router.get("/change/:flow/:volume", flowController.saveNewFlow)
    router.post("/new", flowController.createFirstReading)
    router.get("/changeValve/:cmd", flowController.valveManipulation),
    router.get("/data", flowController.getData)
    return app.use("/flow", router)
}

module.exports = {
    userRoutes
}