const mongoose = require('mongoose')

const pilotSchema = new mongoose.Schema({
    pilotId: String,
    firstName: String,
    lastName: String,
    phoneNumber:String,
    email:String,
    drone: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Drone'
    }
  
})

pilotSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Pilot', pilotSchema)