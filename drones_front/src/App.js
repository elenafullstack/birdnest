
import React, { useState, useEffect} from 'react'
import droneService from './services/drones'
import Drone from './components/Drone'
import ClosestDrone from './components/closestDrone'


const App = () => {
  const [drones, setDrones] = useState([])

  
  useEffect(() => {
   setInterval(()=>{ droneService.getAll().then(drones =>
      setDrones(drones)
    )  },500)
  
    }, [])


    function sortBy(field) {
      return function(a, b) {
        return (a[field] > b[field]) - (a[field] < b[field])
      };
    }

    const filteredDrones = drones.sort(sortBy('distance'));

  return (
  <div>
    
   <ClosestDrone drones={filteredDrones}/>
  
    
    <h2>All pilots in the NDZ zone information</h2>

    <table>
        <tr>
          <th>Pilot name</th>
          <th>Email</th>
          <th>Phone number</th>
          <th>Closest distance</th>
          <th>Last seen</th>
        </tr>
        {drones.map(x=> <Drone key= {x.serialNumber} drone = {x}/>)}
   
      </table>
  </div>
  
 
  )
  }

export default App
