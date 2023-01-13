const dronesRouter = require('express').Router()
const fetch=require("node-fetch");
var parser = require('xml2json');
const drone = require('../models/drone');



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




let drones = []


dronesRouter.get('/', async (req, res) => {


    const returnedValue = await fetchData(drones); 
    if (returnedValue) drones = returnedValue; 
    res.send(returnedValue);   

 })


 /*async function fetchData (existingDrones) {

 
    try {
		const response = await fetch('https://assignments.reaktor.com/birdnest/drones')
		const content = await response.text()
		const data = parser.toJson(content)
        var dataJson=JSON.parse(data)

       //filter the drones based on the radius
        const filteredDrones = dataJson.report.capture.drone.filter(drone=>checkZone(drone.positionX, drone.positionY)<=100000)
       

        for (let i=0; i<filteredDrones.length; i++) {
                const body = filteredDrones[i]
                const pilotRequest= await fetch(`https://assignments.reaktor.com/birdnest/pilots/${filteredDrones[i].serialNumber}`)
                const pilot = await pilotRequest.json();

                const pilotObject = new Pilot(pilot.pilotId,pilot.firstName,pilot.lastName,pilot.phoneNumber,pilot.email);
                const distance= checkZone(filteredDrones[i].positionX,filteredDrones[i].positionY);
                const drone = new Drone(body.serialNumber, distance, new Date(), pilotObject)



                existingDrones= existingDrones.filter(x=>x.serialNumber != drone.serialNumber)  
                existingDrones.push(drone);
              
   
        }
                const tenMinutes = new Date(new Date() - (60000))
                existingDrones = existingDrones.filter(drone=>drone.time > tenMinutes)

                console.log(existingDrones);
                return existingDrones; 
               

	} catch (e) {
		console.log({e})
	}



}*/







  module.exports = dronesRouter