
require('dotenv').config()
const express = require('express');
const app= express();
const cors= require('cors');
/*const axios = require('axios');*/
const fetch=require("node-fetch");
var parser = require('xml2json');
const { response } = require('express');


app.use(cors());
app.use(express.static('build'))


app.use('/api/drones', async (req, res) => {
  res.send(drones)
})


let drones = []

function checkZone(x, y) {
  //formula to calculate de distance between two cordinates (center 250000)
    const formula = Math.sqrt(Math.pow((250000-x), 2) + Math.pow((250000-y),2))
    console.log(formula)
    return formula
  }
  
  function Drone (serialNumber,distance,time,pilot) {
      this.serialNumber = serialNumber;
      this.distance=distance;
      this.time= time,
      this.pilot=pilot
  
  }
  
  function Pilot(pilotId,firstName, lastName, phoneNumber, email) {
      this.pilotId=pilotId;
      this.firstName=firstName;
      this.lastName=lastName;
      this.phoneNumber=phoneNumber;
      this.email=email
  }
  

 async function fetchData (existingDrones) {

 
    try {
		const response = await fetch('https://assignments.reaktor.com/birdnest/drones')
		const content = await response.text()
		const data = parser.toJson(content)
        var dataJson=JSON.parse(data)

       //filter the drones based on the radius
        const filteredDrones = dataJson.report.capture.drone.filter(drone=>checkZone(drone.positionX, drone.positionY)<=100000)

      if (filteredDrones.length > 0 ) {
       

        for (let i=0; i<filteredDrones.length; i++) {
                const body = filteredDrones[i]
                const pilotRequest= await fetch(`https://assignments.reaktor.com/birdnest/pilots/${filteredDrones[i].serialNumber}`)
                const pilot = await pilotRequest.json();
                const pilotObject = new Pilot(pilot.pilotId,pilot.firstName,pilot.lastName,pilot.phoneNumber,pilot.email);
                const distance= checkZone(body.positionX,body.positionY);
                const drone = new Drone(body.serialNumber, distance, new Date(), pilotObject)
 

               if (existingDrones.filter(x=>x.serialNumber == drone.serialNumber).length != 0) {
                  const sameDrone = existingDrones.find(x=>x.serialNumber == drone.serialNumber);
                   if (sameDrone.distance < drone.distance) {
                     drone.distance = sameDrone.distance
                   }
                }

                existingDrones= existingDrones.filter(x=>x.serialNumber != drone.serialNumber)  
                existingDrones.push(drone);
              
   
        }
                const tenMinutes = new Date(new Date() - (60000))
                existingDrones = existingDrones.filter(drone=>drone.time > tenMinutes)
                 drones = existingDrones ; 
                 console.log(drones);
      }         

	} catch (e) {
		console.log({e})
	}



}


setInterval( async()=>{
  fetchData(drones)
 }, 5000)
  

const PORT = process.env.PORT 



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
