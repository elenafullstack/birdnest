
import React, { useState, useEffect} from 'react'
import droneService from './services/drones'
import Drone from './components/Drone'
import ClosestDrone from './components/closestDrone'
import './App.css';


const App = () => {

  const [drones, setDrones] = useState([])
  const [closestDrone, setClosestDrone] = useState([])

  //get NDZ drones from the server
  useEffect(() => {

    setInterval(() => {droneService.getAll().then(drones =>
    setDrones(drones)
    )}, 500)

  }, [])

  useEffect(() => {

  setInterval(()=>{ droneService.getClosest().then(drone =>
  setClosestDrone(drone)
  )}, 500)

  }, [])

  function sortBy(field) {

    return function(a, b) {

      return (a[field] > b[field]) - (a[field] < b[field])
    
    }

  }


  return (

    <div class="container-fluid">

      <div class="container">
        
        <div class="my-2 sticky-top border-bottom bg-white">
          <h1 class="page-header text-primary text-center display-4">Birdnest</h1>
        </div>
        
        <p class="py-4 text-center">This application is an assignment for a developer trainee position. The instructions of the assignment can be found <a href="https://assignments.reaktor.com/birdnest">here</a>.The application lists all the pilots that have been flying their drone in the no drone zone (NDZ) during the last 10 minutes. If
        the pilot information of the drone was not found, it is not shown. The pilots are sorted so, that the pilots that were last seen on the zone are shown first. The closest distance of the pilot is measured since the moment the pilot was first detected.
        The pilot information is obtained 10 minutes since the moment the pilot was last detected on the zone. The closest distance confirmed to the nest is the closest distance that has been detected during the time the application has been running.</p>

        <div class="mb-5 text-center">

          <ClosestDrone closest={closestDrone}/>

        </div>

        <h1 class="text-center">All pilots in the NDZ zone during the last 10 minutes</h1>

        <div class="table-responsive">

          <table class="table table-bordered mt-4">

            <thead>

              <tr>
                <th class="p-3">Pilot name</th>
                <th class="p-3">Email</th>
                <th class="p-3">Phone number</th>
                <th class="p-3">Closest distance</th>
                <th class="p-3">First seen</th>
                <th class="p-3">Last seen</th>
              </tr>

            </thead>

            <tbody class="">

              {[...drones].sort(sortBy('timeLast')).reverse().map(x=> <Drone key= {x.serialNumber} drone = {x}/>)}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  )

}

export default App
