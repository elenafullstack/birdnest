const mongoose = require('mongoose')

const droneSchema = new mongoose.Schema({
    serialNumber: String,

    pilot: {
        pilotId: String,
        firstName: String,
        lastName: String,
        phoneNumber:String,
        email:String,
    }
  
})

droneSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Drone', droneSchema)