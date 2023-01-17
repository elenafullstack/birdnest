
require('dotenv').config()
const express = require('express');
const app= express();
const cors= require('cors');
const fetch=require("node-fetch");
var xml2js = require('xml2js');
const { response } = require('express');

const parser = new xml2js.Parser()

//to be able to fetch de api
app.use(cors());

//build of frontend
app.use(express.static('build'))


//send the dronelist  to the server where they can be fetched from the frontend
app.use('/api/drones', async (req, res) => {

  res.send(drones)

})

app.use('/api/closestDrone', async (req, res) => {

  res.send(closestDrone)

})

function Drone (serialNumber,closestDistance,lastDistance,positionX, positionY,timeEnter,timeLast,pilot) {

  this.serialNumber = serialNumber;
  this.closestDistance=closestDistance;
  this.lastDistance=lastDistance
  this.positionX=positionX;
  this.positionY=positionY;
  this.timeEnter=timeEnter
  this.timeLast= timeLast,
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

//this array will include the closest confirmed drone since the application was started
let closestDrone = []

//function to calculate, if the drone is less than 100m close to the nest
function checkZone(x, y) {

  //formula to calculate de distance between two cordinates (center 250000)
  const formula = Math.sqrt(Math.pow((250000 - x), 2) + Math.pow((250000 - y),2))
  return formula

}

function sortBy(field) {

  return function(a, b) {
    return (a[field] > b[field]) - (a[field] < b[field])
  }

}

//function to update the closest updated drone
function updateClosestDrone() {

  const closestListDrone = [...drones].sort(sortBy('closestDistance'))[0]
  const distance = closestListDrone.closestDistance

  if (closestDrone[0].closestDistance > distance) {
    closestDrone = closestDrone.slice(1);
    closestDrone.push(closestListDrone);
  }

}


//function that fetches the data from the api and updates the drones array
async function fetchData (existingDrones) {

  try {

    const response = await fetch('https://assignments.reaktor.com/birdnest/drones')
    const content = await response.text()
    const data = await parser.parseStringPromise(content);

    //filter the drones based on the radius

    const filteredDrones = data.report.capture[0].drone.filter(drone=>checkZone(drone.positionX[0], drone.positionY[0])<=100000)

    //a for loop that finds the pilot information, creates the drone with the pilot object, an adds this to the drone list
    for (let i=0; i<filteredDrones.length; i++) {
      
      const body = filteredDrones[i]
      const pilotRequest= await fetch(`https://assignments.reaktor.com/birdnest/pilots/${filteredDrones[i].serialNumber}`)

      //if the pilot is not found because of 404 status code, it is not shown in the list
      if (pilotRequest.status != 404) {

        const pilot = await pilotRequest.json();
        const pilotObject = new Pilot(pilot.pilotId,pilot.firstName,pilot.lastName,pilot.phoneNumber,pilot.email);
        const distance= checkZone(body.positionX,body.positionY) / 1000;
        const roundedDistance = Math.round(distance * 100) / 100
        const drone = new Drone(body.serialNumber, roundedDistance, roundedDistance, body.positionX, body.positionY, new Date(data.report.capture[0]["$"].snapshotTimestamp), new Date(data.report.capture[0]["$"].snapshotTimestamp), pilotObject)

        //find out if the drone is already in the list of past 10minutes, if so compare if the previous distance of drones was closer
        // and update the distance so that it is the closest the drone had
        if (existingDrones.filter(x=>x.serialNumber[0] == drone.serialNumber[0]).length != 0) {

          const sameDrone = existingDrones.find(x=>x.serialNumber[0] == drone.serialNumber[0]);
          drone.timeEnter = sameDrone.timeEnter;
          sameDrone.closestDistance < drone.closestDistance ? drone.closestDistance = sameDrone.closestDistance : drone.closestDistance = drone.closestDistance

        }

        //delete drone with same serialnumber of the current drone if it exists
        existingDrones= existingDrones.filter(x=>x.serialNumber[0] != drone.serialNumber[0])  
        existingDrones.push(drone);

      }

    }

    //create constant that defines the time limit for the drones that have trespassed the NDZ zone
    const limitTime = new Date(new Date() - (10 * 60000))

    //delete all the drones that are older than 10 minutes
    existingDrones = existingDrones.filter(drone=>drone.timeLast > limitTime)

    //update the dronelist
    drones = existingDrones ;

    //update the closestDrone comparing the closest distance from the drones list
    if (drones.length != 0) {

      closestDrone.length != 0 ? updateClosestDrone() : closestDrone.push([...drones].sort(sortBy('closestDistance'))[0])

    }

  } catch (e) {

    console.log({e})

  }      

}

//call the function fetchData every 2 seconds to update the drone list
setInterval( async()=>{
  fetchData(drones)
}, 2000)

const PORT = process.env.PORT 

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
