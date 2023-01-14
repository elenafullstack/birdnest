
require('dotenv').config()
const express = require('express');
const app= express();
const cors= require('cors');
const fetch=require("node-fetch");
var parser = require('xml2json');
const { response } = require('express');


//to be able to fetch de api
app.use(cors());

//build of frontend
app.use(express.static('build'))


//send the dronelist  to the server where they can be fetched from the frontend
app.use('/api/drones', async (req, res) => {
  res.send(drones)
})

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


//this array will be updated to have the correct information about the drones that violated the zone in the last 10 minutes
let drones = []


//function to calculate, if the drone is less than 100m close to the nest
function checkZone(x, y) {
  //formula to calculate de distance between two cordinates (center 250000)
    const formula = Math.sqrt(Math.pow((250000-x), 2) + Math.pow((250000-y),2))
    return formula
  }
  

//function that fetches the data from the api and updates the drones array
 async function fetchData (existingDrones) {

 
    try {
      const response = await fetch('https://assignments.reaktor.com/birdnest/drones')
      const content = await response.text()
      const data = parser.toJson(content)
      var dataJson=JSON.parse(data)

       //filter the drones based on the radius
        const filteredDrones = dataJson.report.capture.drone.filter(drone=>checkZone(drone.positionX, drone.positionY)<=100000)

      if (filteredDrones.length > 0 ) {
       
        //a for loop that finds the pilot information, creates the drone with the pilot object, an adds this to the drone list
        for (let i=0; i<filteredDrones.length; i++) {
                const body = filteredDrones[i]
                const pilotRequest= await fetch(`https://assignments.reaktor.com/birdnest/pilots/${filteredDrones[i].serialNumber}`)
              if (pilotRequest.status != 404) {
                const pilot = await pilotRequest.json();
                const pilotObject = new Pilot(pilot.pilotId,pilot.firstName,pilot.lastName,pilot.phoneNumber,pilot.email);
              
                const distance= checkZone(body.positionX,body.positionY) / 1000;
                const roundedDistance = Math.round(distance * 100) / 100
                const drone = new Drone(body.serialNumber, roundedDistance, new Date().toLocaleString(), pilotObject)
 

                //find out if the drone is already in the list of past 10minutes, if so compare if the previous distance of drones was closer
                // and update the distance so that it is the closest the drone had
                if (existingDrones.filter(x=>x.serialNumber == drone.serialNumber).length != 0) {
                  const sameDrone = existingDrones.find(x=>x.serialNumber == drone.serialNumber);
                    if (sameDrone.distance < drone.distance) {
                        drone.distance = sameDrone.distance
                    }
                }


                //delete drone with same serialnumber of the current drone if it exists
                existingDrones= existingDrones.filter(x=>x.serialNumber != drone.serialNumber)  
                existingDrones.push(drone);
     
   
              }

            const tenMinutes = new Date(new Date() - (60000))
            const tenMinutes2 = tenMinutes.toLocaleString()
            //delete all the drones that are older than 10 minutes
            existingDrones = existingDrones.filter(drone=>drone.time > tenMinutes2)
            //update the dronelist
            drones = existingDrones ; 
            console.log(drones);
        }
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
